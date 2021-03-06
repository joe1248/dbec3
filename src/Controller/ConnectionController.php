<?php

namespace App\Controller;

use App\Business\UserConnectionService;
use App\Entity\Connection;
use App\Repository\ConnectionsRepo;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;

class ConnectionController extends Controller
{
    /**
     * List all non deleted connections of current user
     *
     * @param UserInterface $user
     *
     * @return JsonResponse
     */
    public function getAll(UserInterface $user): JsonResponse
    {        
        /** @var ConnectionsRepo $connectionsRepo */
        $connectionsRepo = $this->getDoctrine()->getRepository(Connection::class);

        $connections = $connectionsRepo->getAllNonDeletedDatabaseConnectionsOfUser($user);

        return new JsonResponse($connections);
    }

    /**
     * Get 1 connection details
     *
     * @param string $id
     * @param UserConnectionService $UserConnectionService
     * @param UserInterface $user
     *
     * @return JsonResponse
     *
     * @throws \Doctrine\ORM\EntityNotFoundException
     */
    public function getOne(
        string $id,
        UserConnectionService $UserConnectionService,
        UserInterface $user
    ): JsonResponse
    {
        /** @var ConnectionsRepo $connectionsRepo */
        $connectionsRepo = $this->getDoctrine()->getRepository(Connection::class);

        $dbAndFtpDetails = $UserConnectionService->getConnectionDbAndFtpDetails($id, $connectionsRepo, $user);

        return new JsonResponse($dbAndFtpDetails);
    }

    /**
     * updateConnectionDbAndFtp
     *
     * @param Request $request
     * @param UserConnectionService $UserConnectionService
     * @param UserInterface|null $user
     *
     * @return JsonResponse
     *
     * @throws \Doctrine\ORM\EntityNotFoundException
     * @throws \App\Exception\UserInputException
     */
    public function patch(
        Request $request,
        UserConnectionService $UserConnectionService,
        UserInterface $user
    ): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $dbManager = $this->getDoctrine()->getManager();
        /** @var ConnectionsRepo $connectionsRepo */
        $connectionsRepo = $this->getDoctrine()->getRepository(Connection::class);
        /** @var array $input */
        $input = json_decode($request->getContent(), true);

        $userConnectionDb = $UserConnectionService->updateConnectionDbAndFtp($input, $user, $dbManager, $connectionsRepo);

        return new JsonResponse([
            'success' => true,
            'entity' => $userConnectionDb->getAttributes()
        ]);
    }

    /**
     * createConnectionDbAndFtp
     *
     * @param Request $request
     * @param UserConnectionService $UserConnectionService
     * @param UserInterface|null $user
     *
     * @return JsonResponse
     *
     * @throws \App\Exception\UserInputException
     */
    public function post(
        Request $request,
        UserConnectionService $UserConnectionService,
        UserInterface $user
    ): JsonResponse
    {
        $dbManager = $this->getDoctrine()->getManager();
        $input = json_decode($request->getContent(), true);

        $userConnectionDb = $UserConnectionService->createConnectionDbAndFtp($input, $user, $dbManager);

        return new JsonResponse([
            'success' => true,
            'entity' => $userConnectionDb->getAttributes()
        ]);
    }

    /**
     * Delete 1 DB connection (if exists, delete linked FTP connection too)
     *
     * @param string $id
     * @param UserConnectionService $UserConnectionService
     * @param UserInterface $user
     *
     * @return JsonResponse
     */
    public function delete(
        string $id,
        UserConnectionService $UserConnectionService,
        UserInterface $user
    ): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $dbManager = $this->getDoctrine()->getManager();
        /** @var ConnectionsRepo $connectionsRepo */
        $connectionsRepo = $this->getDoctrine()->getRepository(Connection::class);

        $success = $UserConnectionService->deleteDbAndFtpConnection((int) $id, $user, $dbManager, $connectionsRepo);

        /** @var Connection $connection */
        $connection = $connectionsRepo ->findOneBy(['id' => (int) $id]);

        return new JsonResponse([
            'success' => $success,
            'connection' => $connection->getAttributes(),
        ]);
    }
}

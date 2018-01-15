<?php
// src/Controller/ConnectionController.php

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
     * @param UserInterface|null $user
     *
     * @return JsonResponse
     */
    public function getAll(UserInterface $user = null)
    {        
        /** @var ConnectionsRepo $connectionsRepo */
        $connectionsRepo = $this->getDoctrine()->getRepository(Connection::class);

        $connections = $connectionsRepo->getAll($user);
    
        return new JsonResponse($connections);
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
    public function delete(string $id, UserConnectionService $UserConnectionService, UserInterface $user)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $dbManager = $this->getDoctrine()->getManager();
        /** @var ConnectionsRepo $connectionsRepo */
        $connectionsRepo = $this->getDoctrine()->getRepository(Connection::class);

        $success = $UserConnectionService->deleteDbAndFtpConnection($id, $user, $dbManager, $connectionsRepo);

        return new JsonResponse(['success' => $success]);
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
    public function getOne(string $id, UserConnectionService $UserConnectionService, UserInterface $user)
    {
        /** @var ConnectionsRepo $em */
        $em = $this->getDoctrine()->getRepository(Connection::class);

        $dbAndFtpDetails = $UserConnectionService->getConnectionDbAndFtpDetails($id, $em, $user);

        return new JsonResponse(
            array_merge(
                $dbAndFtpDetails,
                [
                    'form_id' => 'form_connection_',
                    'select_db_protocol' => empty($dbAndFtpDetails['db_selected_ftp_id']) ? '' : 'over_ssh'
                ]
            )
        );
    }

    /**
     * updateConnectionDbAndFtp
     *
     * @param Request $request
     * @param UserConnectionService $UserConnectionService
     * @param UserInterface|null $user
     *
     * @return JsonResponse
     */
    public function patch(Request $request, UserConnectionService $UserConnectionService, UserInterface $user)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $dbManager = $this->getDoctrine()->getManager();
        /** @var ConnectionsRepo $connectionsRepo */
        $connectionsRepo= $this->getDoctrine()->getRepository(Connection::class);
        $input = $request->request->all();

        $userConnectionDb = $UserConnectionService->updateConnectionDbAndFtp($input, $user, $dbManager, $connectionsRepo);

        return new JsonResponse([
            'connection_id' => $userConnectionDb->getId(),
            'message' => 'Success updating the DB server.'
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
     */
    public function post(Request $request, UserConnectionService $UserConnectionService, UserInterface $user = null)
    {
        $dbManager = $this->getDoctrine()->getManager();
        $input = $request->request->all();

        $ideaUserConnectionEntityDb = $UserConnectionService->createConnectionDbAndFtp($input, $user, $dbManager);

        return new JsonResponse([
            'connection_id' => $ideaUserConnectionEntityDb->getId(),
            'message' => 'Success creating the new DB server.'
        ]);
    }
}

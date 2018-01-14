<?php
// src/Controller/ConnectionController.php

namespace App\Controller;

use App\Entity\IdeaUserConnections;
use App\Entity\User;
use App\Repository\IdeaUserConnectionsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;

class ConnectionController extends Controller
{
    /**
     * List all  not deleted connections of current user
     *
     * @param UserInterface|null $user
     *
     * @return JsonResponse
     */
    public function getAll(UserInterface $user = null)
    {        
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        /** @var IdeaUserConnectionsRepository $em */
        $em = $this->getDoctrine()->getRepository(IdeaUserConnections::class);

        /** @var User $userEntity */
        $userEntity = $user;
        $connections = $em->getAll($userEntity->getId());
    
        return new JsonResponse($connections);
    }

    /**
     * Delete 1 DB connection (if exists, delete linked FTP connection too)
     *
     * @param string $id
     *
     * @return JsonResponse
     */
    public function delete(string $id)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $db = $this->getDoctrine()->getManager();
        /** @var IdeaUserConnectionsRepository $em */
        $em = $this->getDoctrine()->getRepository(IdeaUserConnections::class);

        /** @var IdeaUserConnections[] $connections */
        $connections = $em->findById($id);
        if (!$connections) {
            throw $this->createNotFoundException(
                'No connection1 found for id ' . $id
            );
        }

        /** @var IdeaUserConnections $connectionOne */
        $connectionOne = $connections[0];
        $connectionOne->delete();
        $db->persist($connectionOne);

        /** @var IdeaUserConnections $connectionTwo */
        $connectionTwo = $connectionOne->getSelectedFtp();
        if (!empty($connectionTwo)) {
            $connectionTwo->delete();
            $db->persist($connectionTwo);
        }

        $db->flush();

        return new JsonResponse(['success' => true]);
    }

    /**
     * Get 1 connection details
     *
     * @param string $id
     *
     * @return JsonResponse
     */
    public function getOne(string $id)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        /** @var IdeaUserConnectionsRepository $em */
        $em = $this->getDoctrine()->getRepository(IdeaUserConnections::class);

        /** @var IdeaUserConnections[] $connections */
        $connections = $em->findById($id);
        if (!$connections) {
            throw $this->createNotFoundException(
                'No connection1 found for id ' . $id
            );
        }
        $accessProtocol = '';

        /** @var IdeaUserConnections $connectionOne */
        $connectionOne = $connections[0];
        $connectionOneDetails = $connectionOne->readAsDbDetails();

        /** @var IdeaUserConnections $connectionTwo */
        $connectionTwo = $connectionOne->getSelectedFtp();
        $connectionTwoDetails = [];
        if (!empty($connectionTwo)) {
            $connectionTwoDetails = $connectionTwo->readAsFtpDetails();
            $accessProtocol = 'over_ssh';
        }

        return new JsonResponse(
            array_merge([
                'form_id' => 'form_connection_',
                'select_db_protocol' => $accessProtocol
            ],
                $connectionOneDetails,
                $connectionTwoDetails
            )
        );
    }

    /**
     * @param Request $request
     * @param UserInterface|null $userI
     *
     * @return JsonResponse
     */
    public function patch(Request $request, UserInterface $userI = null)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        /** User $user */
        $user = $userI;
        $db = $this->getDoctrine()->getManager();
        /** @var IdeaUserConnectionsRepository $em */
        $em = $this->getDoctrine()->getRepository(IdeaUserConnections::class);
        $input = $request->request->all();

        $inputConnectionDb = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input,'db_'),'db_');
        if ($input['select_db_protocol'] === 'over_ssh') {
            $inputConnectionFtp = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input,'ftp_'),'ftp_');
            $inputConnectionFtp['connection_genre'] = 'ftp';

            /** @var IdeaUserConnections $ideaUserConnectionEntityFtp */
            $ideaUserConnectionEntityFtp = $em->findOneBy([
                'id' => $inputConnectionDb['selected_ftp_id'],
                'user' => $user
            ]);
            $ideaUserConnectionEntityFtp->update($inputConnectionFtp);
            $db->persist($ideaUserConnectionEntityFtp);
        }
        $inputConnectionDb['connection_genre'] = 'db';

        /** @var IdeaUserConnections $ideaUserConnectionEntityFtp */
        $ideaUserConnectionEntityDb = $em->findOneBy([
            'id' => $inputConnectionDb['id'],
            'user' => $user
        ]);
        $ideaUserConnectionEntityDb->update($inputConnectionDb);
        $db->persist($ideaUserConnectionEntityDb);
        $db->flush();

        return new JsonResponse([
            'connection_id' => $ideaUserConnectionEntityDb->getId(),
            'message' => 'Success updating the DB server.'
        ]);
    }

    /**
     * @param Request $request
     * @param UserInterface|null $user
     *
     * @return JsonResponse
     */
    public function post(Request $request, UserInterface $user = null)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $db = $this->getDoctrine()->getManager();

        $input = $request->request->all();

        $inputConnectionDb = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input,'db_'),'db_');
    
        if ($input['select_db_protocol'] === 'over_ssh') {
            $inputConnectionFtp = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input,'ftp_'),'ftp_');
            $inputConnectionFtp['connection_genre'] = 'ftp';
            $ideaUserConnectionEntityFtp = new IdeaUserConnections($inputConnectionFtp, $user);
            $db->persist($ideaUserConnectionEntityFtp);
            $db->flush();
            $inputConnectionDb['selected_ftp_id'] = $ideaUserConnectionEntityFtp->getId();
        }
        $inputConnectionDb['connection_genre'] = 'db';
        $ideaUserConnectionEntityDb = new IdeaUserConnections($inputConnectionDb, $user);
        $db->persist($ideaUserConnectionEntityDb);
        $db->flush();

        return new JsonResponse([
            'connection_id' => $ideaUserConnectionEntityDb->getId(),
            'message' => 'Success creating the new DB server.'
        ]);
    }

    /**
     * @param array $toFilterByKeyPrefix
     * @param string $prefix
     *
     * @return array
     */
    private function filterArrayByKeyPrefix(array $toFilterByKeyPrefix, string $prefix)
    {
        return array_filter(
            $toFilterByKeyPrefix,
            function($key) use ($prefix) {
                return substr($key, 0, strlen($prefix)) == $prefix;
            },
            ARRAY_FILTER_USE_KEY
        );
    }

    /**
     * Remove a prefix from the keys of an array
     *
     * @param array $toRemoveKeyPrefix
     * @param string $prefix
     *
     * @return array
     */
    private function removeKeyPrefix(array $toRemoveKeyPrefix, string $prefix)
    {
        $withKeyRemoved = [];
        foreach ($toRemoveKeyPrefix as $key => $value)
        {
            $key = substr($key, 0, strlen($prefix)) == $prefix ? substr($key, strlen($prefix)) : $key;
            $withKeyRemoved[$key] = $value;
        }
        return $withKeyRemoved;
    }
}

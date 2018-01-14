<?php
// src/Controller/ConnectionController.php

namespace App\Controller;

use App\Entity\IdeaUserConnections;
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
        $em = $this->getDoctrine()->getRepository(IdeaUserConnections::class);

        $connections = $em->getAll($user->getId());
    
        return new JsonResponse($connections);
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
        $em = $this->getDoctrine()->getRepository(IdeaUserConnections::class);


        $connections = $em->findById($id);
        if (!$connections) {
            throw $this->createNotFoundException(
                'No connection1 found for id ' . $id
            );
        }
        $accessProtocol = '';
        /** @var IdeaUserConnections $connections */
        $connectionOne = $connections[0];
        $connectionOneDetails = $connectionOne->readAsDbDetails();
        
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
     * @param UserInterface|null $user
     *
     * @return JsonResponse
     */
    public function patch(Request $request, UserInterface $user = null)
    {
        return $this->post($request, $user);
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
        $em = $this->getDoctrine()->getManager();//->getRepository(IdeaUserConnections::class);

        $input = $request->request->all();
        
        $inputConnectionDb = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input,'db_'),'db_');
    
        if ($input['select_db_protocol'] === 'over_ssh') {
            $inputConnectionFtp = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input,'ftp_'),'ftp_');
            $inputConnectionFtp['connection_genre'] = 'ftp';
            $ideaUserConnectionEntityFtp = new IdeaUserConnections($inputConnectionFtp, $user);
            $em->persist($ideaUserConnectionEntityFtp);
            $em->flush();
            $inputConnectionDb['selected_ftp_id'] = $ideaUserConnectionEntityFtp->getId();
        }
        $inputConnectionDb['connection_genre'] = 'db';
        $ideaUserConnectionEntityDb = new IdeaUserConnections($inputConnectionDb, $user);
        $em->persist($ideaUserConnectionEntityDb);
        $em->flush();

        return new JsonResponse([
            'connection_id' => $ideaUserConnectionEntityDb->getId(),
            'message' => 'Success saving the new DB server.'
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

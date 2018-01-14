<?php
// src/Controller/ConnectionController.php

namespace App\Controller;

use App\Entity\IdeaUserConnections;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;

class ConnectionController extends Controller 
{
    private $ideaUserConnectionsManager;

    // List all connections    @todo of current user nad not deleted
    public function getAll(UserInterface $user = null)
    {        
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $em = $this->getDoctrine()->getRepository(IdeaUserConnections::class);

        $connections = $em->getAll($user->getId());
    
        return new JsonResponse($connections);
    }

    // Get empty connection details
    public function getNew()
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $connection = [
            'form_id' => 'form_connection_',
        ];

        return new JsonResponse($connection);
    }

    // Get 1 connection details
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
}

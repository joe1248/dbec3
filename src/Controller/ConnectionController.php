<?php
// src/Controller/ConnectionController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use App\Entity\IdeaUserConnections;

class ConnectionController extends Controller 
{
    private $ideaUserConnectionsManager;

    // List all connections    @todo of current user nad not deleted
    public function getAll()
    {        
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $em = $this->getDoctrine()->getRepository(IdeaUserConnections::class);

        $connections = $em->findAll();
    
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
        
        $ftpConnectionId  = $connectionOne->getSelectedFtpId();
        $connectionTwoDetails = [];
        if ($ftpConnectionId > 0) {
            $ftpConnections = $em->findById($ftpConnectionId);
            if (!$ftpConnections) {
                throw $this->createNotFoundException(
                    'No connection2 found for id ' . $ftpConnectionId
                );
            }
            $accessProtocol = 'over_ssh';
            $connectionTwo = $ftpConnections[0];
            $connectionTwoDetails = $connectionTwo->readAsFtpDetails();
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

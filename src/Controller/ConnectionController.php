<?php
// src/Controller/ConnectionController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use App\Entity\IdeaUserConnections;

class ConnectionController extends Controller 
{
    public function getAll()
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $em = $this->getDoctrine()->getManager();
        $connections = $em->getRepository(IdeaUserConnections::class)->findAll();
    
        return new JsonResponse($connections);
    }
}

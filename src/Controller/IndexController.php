<?php
// src/Controller/IndexController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
//use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

class IndexController extends Controller
{
    public function index(UserInterface $user = null)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $number = mt_rand(0, 100);
        return new Response(
            '<html><body>Index Lucky number: '.$number. 'Well hi there '.$user->getUsername() . '</body></html>'
        );
    }
}

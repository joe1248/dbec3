<?php
// src/Controller/LuckyController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\User\UserInterface;

class LuckyController  extends Controller 
{
    public function number(UserInterface $user = null)
    {
        $number = mt_rand(0, 100);

        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $number = mt_rand(0, 100);
        return new Response(
            '<html><body>BINGO Lucky number: '.$number. 'Well hi there '.$user->getUsername() . ' <a href="/logout">Logout</a></body></html>'
        );
    }
}

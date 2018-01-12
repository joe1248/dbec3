<?php
// src/Controller/LuckyController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\User\UserInterface;

class DashboardController  extends Controller 
{
    public function dashboard(UserInterface $user = null)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        return $this->render('Dashboard/dashboard.html.php', [
            'user' => $user
        ]);
    }
}

<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\User\UserInterface;

class DashboardController extends Controller 
{
    /**
     * @param UserInterface|null $user
     *
     * @return Response
     */
    public function dashboard(UserInterface $user = null): Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        return $this->render('Dashboard/dashboard.html.twig', [
            'user' => $user
        ]);
    }
}

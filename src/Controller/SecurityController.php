<?php
// src/Controller/SecurityController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends Controller
{
    private $authUtils;

    public function login()
    {
        $this->authUtils =  $this->get(AuthenticationUtils::class);

        // get the login error if there is one
        $error = $this->authUtils->getLastAuthenticationError();
    
        // last username entered by the user.
        $lastUsername = $this->authUtils->getLastUsername();
    
        return $this->render('Security/login.html.twig', [
            'last_username' => $lastUsername,
            'error'         => $error,
        ]);
    }
}

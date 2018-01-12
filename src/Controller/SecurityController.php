<?php
// src/Controller/SecurityController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends Controller
{
    private $authUtils;

    /**
     * @Route("/login", name="login")
     */
    public function login(Request $request)
    {
        $this->authUtils =  $this->get(AuthenticationUtils::class);//new ();
        // get the login error if there is one
        $error = $this->authUtils->getLastAuthenticationError();
    
        // last username entered by the user
        $lastUsername = $this->authUtils->getLastUsername();
    
        return $this->render('Security/login.html.php', [
            'last_username' => $lastUsername,
            'error'         => $error,
        ]);
    }
}

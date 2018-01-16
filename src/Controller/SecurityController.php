<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends Controller
{
    private $authUtils;

    /**
     * @return Response
     */
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

    public function register(UserPasswordEncoderInterface $encoder)
    {
        $user = new User();
        $plainPassword = 'autotest143RR';
        $encoded = $encoder->encodePassword($user, $plainPassword);
        return new Response($encoded);
        //$user->setPassword($encoded);
    }
}

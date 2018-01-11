<?php
// src/Controller/LuckyController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
//use Symfony\Component\Routing\Annotation\Route;

class LuckyController  extends Controller 
{
    /**
     * route("/lucky", name="LuckyNumber")
     */
    public function number()
    {
        $number = mt_rand(0, 100);

        return new Response(
            '<html><body>YES Lucky number: '.$number.'</body></html>'
        );
    }
}

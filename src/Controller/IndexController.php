<?php
// src/Controller/IndexController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class IndexController extends Controller
{
    public function index()
    {
        $number = mt_rand(0, 100);
        return new Response(
            '<html><body>Index Lucky number: '.$number. 'Well hi there NOBODY <a href="/login">Login</a></body></html>'
        );
    }
}

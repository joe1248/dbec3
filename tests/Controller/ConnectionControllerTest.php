<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ConnectionControllerTest extends WebTestCase
{
    public function t__estGetAll()
    {
        $client = static::createClient();

        $client->request('GET', '/connections');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }
}
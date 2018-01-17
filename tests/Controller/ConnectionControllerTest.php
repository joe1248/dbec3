<?php

namespace App\Tests\Controller;

use App\DataFixtures\UserFixtures;
use App\DataFixtures\ConnectionFixtures;
use Liip\FunctionalTestBundle\Test\WebTestCase;

class ConnectionControllerTest extends WebTestCase
{
    protected $kernelDir = '/app';

    public function testGetAll()
    {
        $this->loadFixtures([
            UserFixtures::class,
            ConnectionFixtures::class,
        ]);
        $client = $this->makeClient();
        $client->request('GET', '/connections', [], [], [
            'PHP_AUTH_USER' => 'autotest_fake',
            'PHP_AUTH_PW'   => 'autotest143RR',
        ]);

        $this->assertNotEquals(
            302,
            $client->getResponse()->getStatusCode(),
            "\n\n??? Issue with logging in. ???!!\n\n"
        );
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $connections = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(1, count($connections));
        //throw new \Exception($client->getResponse()->getContent());
    }

    public function testGetAllFailsIfWrongPassord()
    {
        $client = static::createClient();
        $client->request('GET', '/connections', [], [], [
            'PHP_AUTH_USER' => 'autotest',
            'PHP_AUTH_PW'   => 'abcdefgh',
        ]);

        $this->assertEquals(
            302,
            $client->getResponse()->getStatusCode(),
            "\n\n??? SHOULD NOT BE LOGGED IN!! \n\n"
        );
    }
}
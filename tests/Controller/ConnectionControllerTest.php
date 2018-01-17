<?php

namespace App\Tests\Controller;

use App\DataFixtures\UserFixtures;
use App\DataFixtures\ConnectionFixtures;
use App\Entity\Connection;
use Liip\FunctionalTestBundle\Test\WebTestCase;

class ConnectionControllerTest extends WebTestCase
{
    protected $kernelDir = '/app';

    public function testGetAll()
    {
        $this->loadFixtures(
            [
                UserFixtures::class,
                ConnectionFixtures::class,
            ],
            null,
            'doctrine',
            \Doctrine\Common\DataFixtures\Purger\ORMPurger::PURGE_MODE_DELETE //TRUNCATE
        );
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

        $expectedConnections = <<<JSON
[{
	"connection_name": "my_test_connection_db",
	"connection_genre": "db",
	"url_host": "aaa_host",
	"user_name": "aaa_user",
	"pass_word": "aaa_pass",
	"port_number": "1234",
	"connection_disabled": false,
	"deleted": false,
	"selected_ftp": {
        "connection_name": "my_test_connection_ssh",
        "connection_genre": "ssh",
        "url_host": "bbb_host",
        "user_name": "bbb_user",
        "pass_word": "bbb_pass",
        "port_number": "5678",
        "connection_disabled": false,
        "deleted": false,
        "selected_ftp": null
        
	}
}]
JSON;
        $expectedConnectionOne = json_decode($expectedConnections, true)[0];
        $connectionOne = $connections[0];
        unset($connectionOne['id']); // id always changing cos dynamically loaded at each test.
        unset($connectionOne['selected_ftp']['id']); // id always changing cos dynamically loaded at each test.
        $this->assertEquals(
            $expectedConnectionOne,
            $connectionOne,
            '1 connexion was expected in here ' . print_r($expectedConnectionOne, true)
        );
    }

    public function testGetAllFailsIfWrongPassword()
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

    public function testDeleteSuccess()
    {
        $fixtures = $this->loadFixtures(
            [
                UserFixtures::class,
                ConnectionFixtures::class,
            ]
        )->getReferenceRepository();
        $client = $this->makeClient();

        /** @var Connection $connection */
        $connection = $fixtures->getReference('test-db-connection');
        $client->request('DELETE', '/connection/' . $connection->getId(), [], [], [
            'PHP_AUTH_USER' => 'autotest_fake',
            'PHP_AUTH_PW'   => 'autotest143RR',
        ]);

        $this->assertEquals(
            200,
            $client->getResponse()->getStatusCode()
        );
        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(2, count($response));
        $this->assertEquals(true, $response['success']);
        $expectedResult = <<<JSON
{
	"connection_name": "my_test_connection_db",
	"connection_genre": "db",
	"url_host": "aaa_host",
	"user_name": "aaa_user",
	"pass_word": "aaa_pass",
	"port_number": "1234",
	"connection_disabled": false,
	"deleted": true,
	"selected_ftp": {
        "connection_name": "my_test_connection_ssh",
        "connection_genre": "ssh",
        "url_host": "bbb_host",
        "user_name": "bbb_user",
        "pass_word": "bbb_pass",
        "port_number": "5678",
        "connection_disabled": false,
        "deleted": true,
        "selected_ftp": null
        
	}
}
JSON;
        $connectionOne = $response['connection'];
        unset($connectionOne['id']); // id always changing cos dynamically loaded at each test.
        unset($connectionOne['selected_ftp']['id']); // id always changing cos dynamically loaded at each test.
        $this->assertEquals(json_decode($expectedResult, true), $connectionOne);

        // so they were deleted fine, now let's check they don't come back
        $client->request('GET', '/connections', [], [], [
            'PHP_AUTH_USER' => 'autotest_fake',
            'PHP_AUTH_PW'   => 'autotest143RR',
        ]);
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $connections = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(0, count($connections));

    }

    public function testPostWithoutParametersThrowUserInputException()
    {
        $this->loadFixtures(
            [
                UserFixtures::class,
                ConnectionFixtures::class,
            ]
        );
        $client = $this->makeClient();
        $client->request('POST', '/connection/new', [], [], [
            'PHP_AUTH_USER' => 'autotest_fake',
            'PHP_AUTH_PW'   => 'autotest143RR',
        ]);

        $this->assertEquals(
            400,
            $client->getResponse()->getStatusCode()
        );
        $this->assertEquals(
            '{"error":{"code":400,"message":"Several required parameters are missing: connectionName, urlHost, userName, passWord, portNumber"}}',
            $client->getResponse()->getContent()
        );
    }
}
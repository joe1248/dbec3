<?php

namespace App\Tests\Controller;

use App\DataFixtures\UserFixtures;
use App\DataFixtures\ConnectionFixtures;
use App\Entity\Connection;
use Doctrine\Common\DataFixtures\ReferenceRepository;
use Liip\FunctionalTestBundle\Test\WebTestCase;

class ConnectionControllerTest extends WebTestCase
{
    protected $kernelDir = '/app';

    /** @var ReferenceRepository */
    private $fixtures;

    public function setUp()
    {
        $this->fixtures = $this->loadFixtures(
            [
                UserFixtures::class,
                ConnectionFixtures::class,
            ]
        )->getReferenceRepository();
    }

    public function testGetAll()
    {
        $client = $this->makeClient(true);
        $client->request('GET', '/connections');

        $this->assertNotEquals(
            302,
            $client->getResponse()->getStatusCode(),
            "\n\n??? Issue with logging in. ???!!\n\n"
        );
        $this->assertStatusCode(200, $client);
        $connections = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(1, count($connections));

        $expectedConnections = <<<JSON
[{
    "select_db_protocol": "over_ssh",
	"db_connection_name": "my_test_connection_db",
	"db_url_host": "aaa_host",
	"db_user_name": "aaa_user",
	"db_pass_word": "aaa_pass",
	"db_port_number": "1234",
	"db_connection_disabled": false,
    "ftp_connection_name": "my_test_connection_ssh",
    "ftp_url_host": "bbb_host",
    "ftp_user_name": "bbb_user",
    "ftp_pass_word": "bbb_pass",
    "ftp_port_number": "5678"
}]
JSON;
        $expectedConnectionOne = json_decode($expectedConnections, true)[0];
        $connectionOne = $connections[0];
        unset($connectionOne['db_id']); // id always changing cos dynamically loaded at each test.
        unset($connectionOne['ftp_id']); // id always changing cos dynamically loaded at each test.
        $this->assertEquals(
            $expectedConnectionOne,
            $connectionOne,
            '1 connexion was expected in here ' . print_r($expectedConnectionOne, true)
        );
    }

    public function testGetAllFailsIfWrongPassword()
    {
        $client = $this->makeClient(false);
        $client->request('GET', '/connections', [], [], [
            'PHP_AUTH_USER' => 'auto_test',
            'PHP_AUTH_PW'   => 'bad_pass',
        ]);
        $this->assertStatusCode(302, $client);
    }

    public function testDeleteSuccess()
    {
        $client = $this->makeClient(true);

        /** @var Connection $connection */
        $connection = $this->fixtures->getReference('test-db-connection');
        $client->request('DELETE', '/connection/' . $connection->getId());

        $this->assertStatusCode(200, $client);

        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(2, count($response));
        $this->assertTrue($response['success']);
        $expectedResult = <<<JSON
{
    "select_db_protocol": "over_ssh",
	"db_connection_name": "my_test_connection_db",
	"db_url_host": "aaa_host",
	"db_user_name": "aaa_user",
	"db_pass_word": "aaa_pass",
	"db_port_number": "1234",
	"db_connection_disabled": false,
    "ftp_connection_name": "my_test_connection_ssh",
    "ftp_url_host": "bbb_host",
    "ftp_user_name": "bbb_user",
    "ftp_pass_word": "bbb_pass",
    "ftp_port_number": "5678"
}
JSON;
        $connectionOne = $response['connection'];
        unset($connectionOne['db_id']); // id always changing cos dynamically loaded at each test.
        unset($connectionOne['ftp_id']); // id always changing cos dynamically loaded at each test.
        $this->assertEquals(json_decode($expectedResult, true), $connectionOne);

        // so they were deleted fine, now let's check they don't come back
        $client->request('GET', '/connections');
        $this->assertStatusCode(200, $client);

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $connections = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(0, count($connections));

    }

    public function testPostSuccessfulOnlyDbAndAlsoTestGet()
    {
        $client = $this->makeClient(true);
        $parameters = [
            "db_connection_name" => "my_very_new_test_connection_db",
            "db_url_host" => "aaa_host1234",
            "db_user_name" => "aaa_user5678",
            "db_pass_word" => "aaa_pass9",
            "db_port_number" => "1248",
        ];
        $client->request(
            'POST',
            '/connection/new',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($parameters)
        );

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertTrue($response['success']);
        $newConnection = $response['entity'];
        $newConnectionId = $newConnection['db_id'];
        unset($newConnection['db_id']);
        $expectedResult = <<<JSON
{
    "select_db_protocol": "",
	"db_connection_name": "my_very_new_test_connection_db",
	"db_url_host": "aaa_host1234",
	"db_user_name": "aaa_user5678",
	"db_pass_word": "aaa_pass9",
	"db_port_number": "1248",
	"db_connection_disabled": false
}
JSON;
        $this->assertEquals(json_decode($expectedResult, true), $newConnection);

        // TEST GET ONE
        $client->request('GET', '/connection/' . $newConnectionId);

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $newConnection = json_decode($client->getResponse()->getContent(), true);
        $expectedResult = <<<JSON
{
    "db_id": #NEW_ID#,
	"db_connection_name": "my_very_new_test_connection_db",
	"db_url_host": "aaa_host1234",
	"db_user_name": "aaa_user5678",
	"db_pass_word": "aaa_pass9",
	"db_port_number": "1248",
	"db_connection_disabled": false,
	"select_db_protocol": ""
}
JSON;
        $expectedArray = json_decode(str_replace('#NEW_ID#', $newConnectionId, $expectedResult), true);
        $this->assertEquals($expectedArray, $newConnection);
    }

    public function testPostWithoutParametersThrowUserInputException()
    {
        $client = $this->makeClient(true);
        $client->request(
            'POST',
            '/connection/new',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([])
        );

        $this->assertEquals(
            '{"status":400,"message":"Several required parameters are missing: connectionName, urlHost, userName, passWord, portNumber"}',
            $client->getResponse()->getContent()
        );
        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    public function testPostFailsEvenIfOneParameterMissingThrowUserInputException()
    {
        $client = $this->makeClient(true);
        $parameters = [
            "db_connection_name" => "my_very_new_test_connection_db",
            "db_url_host" => "aaa_host1234",
            "db_user_name" => "aaa_user5678",
            //"db_pass_word" => "aaa_pass9",
            "db_port_number" => "1248",
        ];
        $client->request(
            'POST',
            '/connection/new',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($parameters)
        );

        $response = json_decode($client->getResponse()->getContent(), true);

        $this->assertEquals(
            '{"status":400,"message":"A required parameter is missing: passWord"}',
            $client->getResponse()->getContent()
        );
        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    public function testPostFailsIfCrazyProtocolParamThrowUserInputException()
    {
        $client = $this->makeClient(true);
        $parameters = [
            "db_connection_name" => "my_very_new_test_connection_db",
            "db_url_host" => "aaa_host1234",
            "db_user_name" => "aaa_user5678",
            "db_pass_word" => "aaa_pass9",
            "db_port_number" => "1248",
            "select_db_protocol" => "CRAZY+HERE"
        ];
        $client->request(
            'POST',
            '/connection/new',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($parameters)
        );

        $response = json_decode($client->getResponse()->getContent(), true);

        $this->assertEquals(
            '{"status":400,"message":"Invalid input select_db_protocol. ' .
            'it must be nothing or over_ssh, not: CRAZY+HERE"}',
            $client->getResponse()->getContent()
        );
        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    public function testGetAllThenPatchFirstOne()
    {
        $this->setUp();

        $client = $this->makeClient(true);
        $client->request('GET', '/connections');
        $this->assertStatusCode(200, $client);
        $connections = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(1, count($connections));

        $expectedConnections = <<<JSON
[{
    "select_db_protocol": "over_ssh",
	"db_connection_name": "my_test_connection_db",
	"db_url_host": "aaa_host",
	"db_user_name": "aaa_user",
	"db_pass_word": "aaa_pass",
	"db_port_number": "1234",
	"db_connection_disabled": false,
    "ftp_connection_name": "my_test_connection_ssh",
    "ftp_url_host": "bbb_host",
    "ftp_user_name": "bbb_user",
    "ftp_pass_word": "bbb_pass",
    "ftp_port_number": "5678"
}]
JSON;
        $expectedConnectionOne = json_decode($expectedConnections, true)[0];
        $connectionOne = $connections[0];
        $dbConnectionId = $connectionOne['db_id'];
        unset($connectionOne['db_id']); // id always changing cos dynamically loaded at each test.
        unset($connectionOne['ftp_id']); // id always changing cos dynamically loaded at each test.
        $this->assertEquals(
            $expectedConnectionOne,
            $connectionOne,
            '1 connexion was expected in here ' . print_r($expectedConnectionOne, true)
        );

        $parameters = [
            'db_id' => $dbConnectionId,
            'db_connection_name' => 'Test_connection_ONE.',
            'db_url_host' => 'localhost',
            'db_user_name' => 'db_user',
            'db_pass_word' => 'db_password',
            'db_port_number' => 3306,
            'select_db_protocol' => 'over_ssh',
            'ftp_connection_name' => 'Test_connection_TWO.',
            'ftp_url_host' => 'example_ssh.com',
            'ftp_user_name' => 'ssh_user',
            'ftp_pass_word' => 'ssh_password',
            'ftp_port_number' => 22,
            'db_connection_disabled' => false,
        ];
        // USE PATCH to change all the fields
        $client->request(
            'PATCH',
            '/connection/edit',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($parameters)
        );
        $this->assertStatusCode(200, $client);
        $response = json_decode($client->getResponse()->getContent(), true);
        //$this->assertEquals([], $response);
        $this->assertEquals(2, count($response));
        $this->assertTrue($response['success']);
        $patchedConnection = $response['entity'];
        $this->assertEquals(13, count($patchedConnection));

        unset($patchedConnection['db_id']); // id always changing cos dynamically loaded at each test.
        unset($patchedConnection['ftp_id']); // id always changing cos dynamically loaded at each test.
        $expectedConnection = <<<JSON
{
    "select_db_protocol": "over_ssh",
	"db_connection_name": "Test_connection_ONE.",
	"db_url_host": "localhost",
	"db_user_name": "db_user",
	"db_pass_word": "db_password",
	"db_port_number": 3306,
    "db_connection_disabled": false,
    "ftp_connection_name": "Test_connection_TWO.",
    "ftp_url_host": "example_ssh.com",
    "ftp_user_name": "ssh_user",
    "ftp_pass_word": "ssh_password",
    "ftp_port_number": 22
}
JSON;
        $this->assertEquals(json_decode($expectedConnection, true), $patchedConnection);
    }
}
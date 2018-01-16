<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ConnectionControllerTest extends WebTestCase
{
    public function testGetAll()
    {
        $client = static::createClient();
        $client->request('GET', '/connections', [], [], [
            'PHP_AUTH_USER' => 'autotest',
            'PHP_AUTH_PW'   => 'autotest143RR',
        ]);

        $this->assertNotEquals(
            302,
            $client->getResponse()->getStatusCode(),
            "\n\n??? Issue with logging in. ???!!\n\n"
        );
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertEquals(json_decode(<<<JSON
[{
	"id": 12,
	"deleted": false,
	"connectionDisabled": false,
	"connectionGenre": "db",
	"connectionName": "aaa1112223s55",
	"urlHost": "aaa",
	"userName": "aaa",
	"passWord": "aaa",
	"portNumber": "111",
	"method": "\u0027\u0027",
	"extra": "\u0027\u0027",
	"apiKey": "\u00270\u0027",
	"keyDate": null,
	"myKey": "NULL",
	"myFour": "NULL",
	"myPass": "NULL"
},
{
	"id": 2,
	"deleted": false,
	"connectionDisabled": false,
	"connectionGenre": "db",
	"connectionName": "ok1",
	"urlHost": "ok",
	"userName": "ok",
	"passWord": "ok",
	"portNumber": "ok",
	"method": "\u0027\u0027",
	"extra": "\u0027\u0027",
	"apiKey": "\u00270\u0027",
	"keyDate": null,
	"myKey": "NULL",
	"myFour": "NULL",
	"myPass": "NULL"
}]
JSON
            ),
            json_decode($client->getResponse()->getContent())
        );
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
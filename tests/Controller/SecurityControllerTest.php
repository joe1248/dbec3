<?php

namespace App\Tests\Controller;

use App\DataFixtures\UserFixtures;
use Liip\FunctionalTestBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityControllerTest extends WebTestCase
{
    protected $kernelDir = '/app';

    public function testRootRedirectToLogin()
    {
        //$client = static::createClient();
        //$client->request('GET', '/');
        $this->loadFixtures([
            UserFixtures::class
        ]);
        $client = $this->makeClient();
        $crawler = $client->request('GET', '/');
        $this->assertStatusCode(301, $client);

        /** @var Response $response */
        $response = $client->getResponse();
        $this->assertEquals(301, $client->getResponse()->getStatusCode());
        $targetUrl = str_replace('http://localhost', '', $response->getTargetUrl());
        $this->assertEquals('/login', $targetUrl);
    }

    public function testLoginGet()
    {
        $client = static::createClient();
        $client->request('GET', '/login');
		$this->assertContains('<meta name="author" content="Joseph Barban">', $client->getResponse()->getContent());
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testLoginPostFails()
    {
        $client = static::createClient();
        $client->request('GET', '/login');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        // Directly submit a form (but using the Crawler is easier!)
        $client->request(
            'POST',
            '/login',
            [
                '_username' => 'autotest',
                '_password' => 'autotest',
                '_target_path' => '/dashboard',
            ]
        );

        $this->assertEquals(302, $client->getResponse()->getStatusCode());
        $targetUrl = str_replace('http://localhost', '', $client->getResponse()->getTargetUrl());
        $this->assertEquals('/login', $targetUrl);
    }

    public function testLoginPostWorks()
    {
        $this->loadFixtures([
            UserFixtures::class
        ]);
        $client = $this->makeClient();
        $client->request(
            'POST',
            '/login',
            [
                '_username' => 'autotest_fake',
                '_password' => 'autotest143RR',
                '_target_path' => '/dashboard',
            ]
        );

        $this->assertEquals(302, $client->getResponse()->getStatusCode());
        $targetUrl = str_replace('http://localhost', '', $client->getResponse()->getTargetUrl());
        $this->assertEquals('/dashboard', $targetUrl);
    }

    public function testDashboardGetFailsAfterLogout()
    {
        $this->loadFixtures([
            UserFixtures::class
        ]);
        $client = $this->makeClient();
        $client->request(
            'POST',
            '/login',
            [
                '_username' => 'autotest_fake',
                '_password' => 'autotest143RR', // strange if fails if less letter in password, or if username don't exists...
                '_target_path' => '/dashboard',
            ]
        );

        $this->assertEquals(302, $client->getResponse()->getStatusCode());
        $targetUrl = str_replace('http://localhost', '', $client->getResponse()->getTargetUrl());
        $this->assertEquals('/dashboard', $targetUrl);

        // OK when logged in
        $client->request('GET', '/dashboard');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        // Logging out
        $client->request('GET', '/logout');
        $this->assertEquals(302, $client->getResponse()->getStatusCode());
        $targetUrl = str_replace('http://localhost', '', $client->getResponse()->getTargetUrl());
        $this->assertEquals('/', $targetUrl);

        // NOK when logged out
        $client->request('GET', '/dashboard');
        $this->assertEquals(302, $client->getResponse()->getStatusCode());
        $targetUrl = str_replace('http://localhost', '', $client->getResponse()->getTargetUrl());
        $this->assertEquals('/login', $targetUrl);
    }

    public function testLoginGetRedirectToDashboardWhenAlreadyLoggedIn()
    {
        $this->loadFixtures([
            UserFixtures::class
        ]);
        $client = $this->makeClient();

        $client->request(
            'POST',
            '/login',
            [
                '_username' => 'autotest_fake',
                '_password' => 'autotest143RR', // strange if fails if less letter in password, or if username don't exists...
                '_target_path' => '/dashboard',
            ]
        );

        $this->assertEquals(302, $client->getResponse()->getStatusCode());
        $targetUrl = str_replace('http://localhost', '', $client->getResponse()->getTargetUrl());
        $this->assertEquals('/dashboard', $targetUrl);

        // Attempt to go back to login screen
        $client->request('GET', '/login');
        $this->assertEquals(302, $client->getResponse()->getStatusCode());
        $targetUrl = str_replace('http://localhost', '', $client->getResponse()->getTargetUrl());
        $this->assertEquals('/dashboard', $targetUrl);
    }

    public function testGetLogException()
    {
        $client = $this->makeClient();
        $client->request('GET', '/log_exception');

        $this->assertStatusCode(500, $client);
    }
}
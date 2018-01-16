<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
//use PHPUnit\DbUnit\DataSet\YamlDataSet;

class SecurityControllerTest extends WebTestCase
{

    /**
     * Returns the test dataSet
     *
     * @return YamlDataSet
     */
    /*protected function getDataSet()
    {
        return new YamlDataSet(__DIR__ . '/SecurityController_data.yml');
    }*/
    // Note that login seems to work with the db defined in /phpunit.xml.dist,
    // but a fixture should be used :
    // so must be created first : https://symfony.com/doc/master/bundles/DoctrineFixturesBundle/index.html
    // because using DBUnit is not possible in functional test : https://phpunit.de/manual/current/en/database.html
    // or is it ? : https://symfony.com/doc/current/testing/doctrine.html

    public function testRootRedirectToLogin()
    {
        $client = static::createClient();
        $client->request('GET', '/');

        $this->assertEquals(301, $client->getResponse()->getStatusCode());
        $targetUrl = str_replace('http://localhost', '', $client->getResponse()->getTargetUrl());
        $this->assertEquals('/login', $targetUrl);
    }

    public function testLoginGet()
    {
        $client = static::createClient();
        $client->request('GET', '/login');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testLoginPostFails()
    {
        $client = static::createClient();
        // Directly submit a form (but using the Crawler is easier!)
        $client->request(
            'POST',
            '/login',
            [
                '_username' => 'autotest',
                '_password' => 'autotes', // strange if fails if less letter in password, or if username don't exists...
                '_target_path' => '/dashboard',
            ]
        );

        $this->assertEquals(302, $client->getResponse()->getStatusCode());
        $targetUrl = str_replace('http://localhost', '', $client->getResponse()->getTargetUrl());
        $this->assertEquals('/login', $targetUrl);
    }

    public function testLoginPostWorks()
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/login',
            [
                '_username' => 'autotest',
                '_password' => 'autotestokok',
                '_target_path' => '/dashboard',
            ]
        );

        $this->assertEquals(302, $client->getResponse()->getStatusCode());
        $targetUrl = str_replace('http://localhost', '', $client->getResponse()->getTargetUrl());
        $this->assertEquals('/dashboard', $targetUrl);
    }

    public function testDashboardGetFailsAfterLogout()
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/login',
            [
                '_username' => 'autotest',
                '_password' => 'autotestokok', // strange if fails if less letter in password, or if username don't exists...
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

}
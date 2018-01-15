<?php

namespace App\Tests\Business;

use App\Business\UserConnectionService;
use App\Entity\Connection;
use App\Repository\ConnectionsRepo;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\User\UserInterface;
use PHPUnit\Framework\TestCase;

class UserConnectionServiceTest extends TestCase
{
    /** @var ConnectionsRepo */
    private $connectionsRepo;
    /** @var UserInterface */
    private $user;

    /** UserConnectionService */
    private $userConnectionServiceToTest;

    /** @var array */
    private $dbConnectionParametersA;
    /** @var array */
    private $dbConnectionParametersB;

    protected function setUp()
    {
        parent::setUp();

        /** ConnectionsRepo */
        $this->connectionsRepo = $this->getMockBuilder(ConnectionsRepo::class)->disableOriginalConstructor()->getMock();
        /** UserInterface */
        $this->user = $this->getMockBuilder(UserInterface::class)->disableOriginalConstructor()->getMock();

        /** UserConnectionService */
        $this->userConnectionServiceToTest = new UserConnectionService();

        /** @var array */
        $ftpConnectionParameters = [
            'id' => 248,
            'connection_genre' => 'ftp',
            'connection_name' => 'Test_connection_TWO.',
            'url_host' => 'example_ssh.com',
            'user_name' => 'ssh_user',
            'pass_word' => 'ssh_password',
            'port_number' => 22,
        ];

        /** @var Connection $ftpConnectionEntity */
        $ftpConnectionEntity = new Connection($ftpConnectionParameters, $this->user);

        /** @var array */
        $this->dbConnectionParametersA = [
            'id' => 123,
            'connection_genre' => 'db',
            'connection_name' => 'Test_connection_ONE.',
            'url_host' => 'localhost',
            'user_name' => 'db_user',
            'pass_word' => 'db_password',
            'port_number' => 3306,
            'selected_ftp_id' => $ftpConnectionEntity,
        ];

        /** @var array */
        $this->dbConnectionParametersB = [
            'id' => 456,
            'connection_genre' => 'db',
            'connection_name' => 'Test_connection_THREE.',
            'url_host' => 'localhost333',
            'user_name' => 'db_user333',
            'pass_word' => 'db_password333',
            'port_number' => 3306,
        ];

    }

    public function testGetConnectionDbAndFtpDetailsSuccessA()
    {
        /** @var Connection $dbConnectionEntity */
        $dbConnectionEntity = new Connection($this->dbConnectionParametersA, $this->user);
        $this->connectionsRepo->expects($this->once())
            ->method('findBy')
            ->with($this->equalTo(['id' => 123, 'user' => $this->user]))
            ->willReturn([$dbConnectionEntity]);

        // Actual Test
        $result = $this->userConnectionServiceToTest->getConnectionDbAndFtpDetails('123', $this->connectionsRepo, $this->user);

        // assert that your calculator added the numbers correctly!
        $this->assertEquals(
            [
                'db_id' => 123,
                'db_connection_name' => 'Test_connection_ONE.',
                'db_url_host' => 'localhost',
                'db_user_name' => 'db_user',
                'db_pass_word' => 'db_password',
                'db_port_number' => 3306,
                'db_selected_ftp_id' => 248,
                'ftp_connection_name' => 'Test_connection_TWO.',
                'ftp_url_host' => 'example_ssh.com',
                'ftp_user_name' => 'ssh_user',
                'ftp_pass_word' => 'ssh_password',
                'ftp_port_number' => 22,
            ],
            $result
        );
    }

    public function testGetConnectionDbAndFtpDetailsSuccessB()
    {
        /** @var Connection $dbConnectionEntity */
        $dbConnectionEntity = new Connection($this->dbConnectionParametersB, $this->user);
        $this->connectionsRepo->expects($this->once())
            ->method('findBy')
            ->with($this->equalTo(['id' => 456, 'user' => $this->user]))
            ->willReturn([$dbConnectionEntity]);

        // Actual Test
        $result = $this->userConnectionServiceToTest->getConnectionDbAndFtpDetails('456', $this->connectionsRepo, $this->user);

        // assert that your calculator added the numbers correctly!
        $this->assertEquals(
            [
                'db_id' => 456,
                'db_connection_name' => 'Test_connection_THREE.',
                'db_url_host' => 'localhost333',
                'db_user_name' => 'db_user333',
                'db_pass_word' => 'db_password333',
                'db_port_number' => 3306,
                'db_selected_ftp_id' => 0,
            ],
            $result
        );
    }

    /**
     * @expectedException \Doctrine\ORM\EntityNotFoundException
     * @expectedExceptionMessage No connection found for id 123
     */
    public function testGetConnectionDbAndFtpDetailsThrowsEntityNotFoundException()
    {
        $this->connectionsRepo->expects($this->once())
            ->method('findBy')
            ->with($this->equalTo(['id' => 123, 'user' => $this->user]))
            ->willReturn([]);

        // Actual Test
        $this->userConnectionServiceToTest->getConnectionDbAndFtpDetails('123', $this->connectionsRepo, $this->user);
    }
}
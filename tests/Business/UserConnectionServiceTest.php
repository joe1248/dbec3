<?php

namespace App\Tests\Business;

use App\Business\UserConnectionService;
use App\Entity\Connection;
use App\Exception\UserInputException;
use App\Repository\ConnectionsRepo;
use App\Tests\MyMockObjectManager;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use PHPUnit\Framework\TestCase;

class UserConnectionServiceTest extends TestCase
{
    /** @var UserInterface */
    private $user;
    /** @var array */
    private $ftpConnectionParameters;
    /** @var array */
    private $dbConnectionParametersA;
    /** @var array */
    private $dbConnectionParametersB;

    protected function setUp()
    {
        parent::setUp();

        /** UserInterface */
        $this->user = $this->getMockBuilder(UserInterface::class)->disableOriginalConstructor()->getMock();
        
        /** @var array */
        $this->ftpConnectionParameters = [
            'id' => 248,
            'connection_genre' => 'ssh',
            'connection_name' => 'Test_connection_TWO.',
            'url_host' => 'example_ssh.com',
            'user_name' => 'ssh_user',
            'pass_word' => 'ssh_password',
            'port_number' => 22,
        ];

        /** @var Connection $ftpConnectionEntity */
        $ftpConnectionEntity = new Connection($this->ftpConnectionParameters , $this->user);

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

    /**
     * @expectedException \Doctrine\ORM\EntityNotFoundException
     * @expectedExceptionMessage No connection found for id 123
     */
    public function testGetConnectionDbAndFtpDetailsThrowsEntityNotFoundException()
    {
        /** ConnectionsRepo */
        $connectionsRepo = $this->getMockBuilder(ConnectionsRepo::class)->disableOriginalConstructor()->getMock();
        $connectionsRepo->expects($this->once())
            ->method('findOneBy')
            ->with($this->equalTo(['id' => 123, 'user' => $this->user]))
            ->willReturn(null);

        // Actual Test
        /** UserConnectionService $userConnectionServiceToTest */
        $userConnectionServiceToTest = new UserConnectionService();
        $userConnectionServiceToTest->getConnectionDbAndFtpDetails('123', $connectionsRepo, $this->user);
    }

    public function testGetConnectionDbAndFtpDetailsSuccessA()
    {
        /** @var Connection $dbConnectionEntity */
        $dbConnectionEntity = new Connection($this->dbConnectionParametersA, $this->user);
        /** ConnectionsRepo */
        $connectionsRepo = $this->getMockBuilder(ConnectionsRepo::class)->disableOriginalConstructor()->getMock();
        $connectionsRepo->expects($this->once())
            ->method('findOneBy')
            ->with($this->equalTo(['id' => 123, 'user' => $this->user]))
            ->willReturn($dbConnectionEntity);

        // Actual Test
        /** UserConnectionService $userConnectionServiceToTest */
        $userConnectionServiceToTest = new UserConnectionService();
        $result = [];
        try {
            $result = $userConnectionServiceToTest->getConnectionDbAndFtpDetails('123', $connectionsRepo, $this->user);
        } catch (EntityNotFoundException $e) {
            $this->fail('Unexpected exception:' . $e->getMessage());
        }

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
                'db_connection_disabled' => '0',
            ],
            $result
        );
    }

    public function testGetConnectionDbAndFtpDetailsSuccessB()
    {
        /** @var Connection $dbConnectionEntity */
        $dbConnectionEntity = new Connection($this->dbConnectionParametersB, $this->user);
        /** ConnectionsRepo */
        $connectionsRepo = $this->getMockBuilder(ConnectionsRepo::class)->disableOriginalConstructor()->getMock();
        $connectionsRepo->expects($this->once())
            ->method('findOneBy')
            ->with($this->equalTo(['id' => 456, 'user' => $this->user]))
            ->willReturn($dbConnectionEntity);

        // Actual Test
        /** UserConnectionService $userConnectionServiceToTest */
        $userConnectionServiceToTest = new UserConnectionService();
        $result = [];
        try {
            $result = $userConnectionServiceToTest->getConnectionDbAndFtpDetails('456', $connectionsRepo, $this->user);
        } catch (EntityNotFoundException $e) {
            $this->fail('Unexpected exception:' . $e->getMessage());
        }
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
                'db_connection_disabled' => '0',
            ],
            $result
        );
    }

    public function testDeleteDbAndFtpConnectionZeroDeleted()
    {
        /** ConnectionsRepo */
        $connectionsRepo = $this->getMockBuilder(ConnectionsRepo::class)->disableOriginalConstructor()->getMock();
        $connectionsRepo->expects($this->once())
            ->method('findOneBy')
            ->with($this->equalTo(['id' => 123, 'user' => $this->user]))
            ->willReturn(null);

        /** ObjectManager */
        $dbManager = $this->getMockBuilder(ObjectManager::class)->disableOriginalConstructor()->getMock();
        $dbManager->expects($this->never())
            ->method('persist');
        $dbManager->expects($this->never())
            ->method('flush');

        // Actual Test
        /** UserConnectionService $userConnectionServiceToTest */
        $userConnectionServiceToTest = new UserConnectionService();
        $success = $userConnectionServiceToTest->deleteDbAndFtpConnection(
            '123',
            $this->user,
            $dbManager,
            $connectionsRepo
        );
        $this->assertFalse($success);
    }

    public function testDeleteDbAndFtpConnectionOneDeleted()
    {
        /** @var Connection $dbConnectionEntity */
        $dbConnectionEntity = new Connection($this->dbConnectionParametersB, $this->user);
        $expectedDbConnectionEntity = new Connection($this->dbConnectionParametersB, $this->user);
        $expectedDbConnectionEntity->delete();

        /** ConnectionsRepo */
        $connectionsRepo = $this->getMockBuilder(ConnectionsRepo::class)->disableOriginalConstructor()->getMock();
        $connectionsRepo->expects($this->once())
            ->method('findOneBy')
            ->with($this->equalTo(['id' => 123, 'user' => $this->user]))
            ->willReturn($dbConnectionEntity);

        /** ObjectManager */
        $dbManager = $this->getMockBuilder(ObjectManager::class)->disableOriginalConstructor()->getMock();
        $dbManager->expects($this->at(0))
            ->method('persist')
            ->with($this->equalTo($expectedDbConnectionEntity));

        $dbManager->expects($this->at(1))
            ->method('flush');

        $this->assertFalse($dbConnectionEntity->isDeleted());

        // Actual Test
        /** UserConnectionService $userConnectionServiceToTest */
        $userConnectionServiceToTest = new UserConnectionService();
        $success = $userConnectionServiceToTest->deleteDbAndFtpConnection(
            '123',
            $this->user,
            $dbManager,
            $connectionsRepo
        );
        $this->assertTrue($dbConnectionEntity->isDeleted());
        $this->assertTrue($success);
    }

    public function testDeleteDbAndFtpConnectionTwoDeleted()
    {
        /** @var Connection $dbConnectionEntity */
        $dbConnectionEntity = new Connection($this->dbConnectionParametersA, $this->user);
        $expectedDbConnectionEntity = new Connection($this->dbConnectionParametersA, $this->user);
        $expectedDbConnectionEntity->delete();
        $expectedFtpConnectionEntity = new Connection($this->ftpConnectionParameters , $this->user);
        $expectedFtpConnectionEntity->delete();

        /** ConnectionsRepo */
        $connectionsRepo = $this->getMockBuilder(ConnectionsRepo::class)->disableOriginalConstructor()->getMock();
        $connectionsRepo->expects($this->once())
            ->method('findOneBy')
            ->with($this->equalTo(['id' => 123, 'user' => $this->user]))
            ->willReturn($dbConnectionEntity);

        /** ObjectManager */
        $dbManager = $this->getMockBuilder(ObjectManager::class)->disableOriginalConstructor()->getMock();
        $dbManager->expects($this->at(0))
            ->method('persist')
            ->with($this->equalTo($expectedFtpConnectionEntity));

        $dbManager->expects($this->at(1))
            ->method('persist')
            ->with($this->equalTo($expectedDbConnectionEntity));

        $dbManager->expects($this->at(2))
            ->method('flush');

        $this->assertFalse($dbConnectionEntity->isDeleted());
        $this->assertFalse($dbConnectionEntity->getSelectedFtp()->isDeleted());

        // Actual Test
        /** UserConnectionService $userConnectionServiceToTest */
        $userConnectionServiceToTest = new UserConnectionService();
        $success = $userConnectionServiceToTest->deleteDbAndFtpConnection(
            '123',
            $this->user,
            $dbManager,
            $connectionsRepo
        );
        $this->assertTrue($dbConnectionEntity->isDeleted());
        $this->assertTrue($dbConnectionEntity->getSelectedFtp()->isDeleted());
        $this->assertTrue($success);
    }

    public function testUpdateConnectionDbAndFtpUpdatesWillUpdateTwoConnections()
    {
        $input = [
            'select_db_protocol' => 'over_ssh',
            'db_id' => 123,
            'db_connection_name' => 'Test_connection_ONE.UPDATED_5',
            'db_url_host' => 'localhostUPDATED_6',
            'db_user_name' => 'db_userUPDATED_7',
            'db_pass_word' => 'db_passwordUPDATED_8',
            'db_port_number' => 3307,
            'db_selected_ftp_id' => 248,
            'ftp_connection_name' => 'Test_connection_TWO.UPDATED_1',
            'ftp_url_host' => 'example_ssh.comUPDATED_2',
            'ftp_user_name' => 'ssh_userUPDATED_3',
            'ftp_pass_word' => 'ssh_passwordUPDATED_4',
            'ftp_port_number' => 23,
        ];

        $ftpConnectionParametersAfterUpdate = [
            'id' => 248,
            'connection_genre' => 'ssh',
            'connection_name' => 'Test_connection_TWO.UPDATED_1',
            'url_host' => 'example_ssh.comUPDATED_2',
            'user_name' => 'ssh_userUPDATED_3',
            'pass_word' => 'ssh_passwordUPDATED_4',
            'port_number' => 23,
        ];

        /** @var Connection $ftpConnectionEntity */
        $expectedFtpConnectionEntity = new Connection($ftpConnectionParametersAfterUpdate, $this->user);

        /** @var array */
        $dbConnectionParametersAfterUpdate = [
            'id' => 123,
            'connection_genre' => 'db',
            'connection_name' => 'Test_connection_ONE.UPDATED_5',
            'url_host' => 'localhostUPDATED_6',
            'user_name' => 'db_userUPDATED_7',
            'pass_word' => 'db_passwordUPDATED_8',
            'port_number' => 3307,
            'selected_ftp_id' => $expectedFtpConnectionEntity,
        ];

        /** @var Connection */
        $expectedDbConnectionEntity = new Connection($dbConnectionParametersAfterUpdate, $this->user);
        $providedDbConnectionEntity = new Connection($this->dbConnectionParametersA, $this->user);

        /** ConnectionsRepo */
        $connectionsRepo = $this->getMockBuilder(ConnectionsRepo::class)->disableOriginalConstructor()->getMock();
        $connectionsRepo->expects($this->at(0))
            ->method('findOneBy')
            ->with($this->equalTo(['id' => 123, 'user' => $this->user]))
            ->willReturn($providedDbConnectionEntity);

        /** ObjectManager */
        $dbManager = $this->getMockBuilder(ObjectManager::class)->disableOriginalConstructor()->getMock();
        $dbManager->expects($this->at(0))
            ->method('persist')
            ->with($this->equalTo($expectedFtpConnectionEntity));

        $dbManager->expects($this->at(1))
            ->method('persist')
            ->with($this->equalTo($expectedDbConnectionEntity));

        $dbManager->expects($this->at(2))
            ->method('flush');

        // Actual Test
        /** UserConnectionService $userConnectionServiceToTest */
        $userConnectionServiceToTest = new UserConnectionService();
        $dbConnectionUpdated = 0;
        try {
            $dbConnectionUpdated = $userConnectionServiceToTest->updateConnectionDbAndFtp(
                $input,
                $this->user,
                $dbManager,
                $connectionsRepo
            );
        } catch (UserInputException $e) {
            $this->fail('Unexpected exception:' . $e->getMessage());
        } catch (EntityNotFoundException $e) {
            $this->fail('Unexpected exception:' . $e->getMessage());
        }
        $this->assertEquals($expectedDbConnectionEntity, $dbConnectionUpdated);
        $this->assertEquals($expectedFtpConnectionEntity , $dbConnectionUpdated->getSelectedFtp());
    }

    public function testUpdateConnectionDbAndFtpUpdatesWillUpdateOneConnectionAndCreateTheOther()
    {
        $input = [
            'select_db_protocol' => 'over_ssh',
            'db_id' => 456,
            'db_connection_name' => 'Test_connection_THREE_ok',
            'db_url_host' => 'localhostUPDATED_6',
            'db_user_name' => 'db_userUPDATED_7',
            'db_pass_word' => 'db_passwordUPDATED_8',
            'db_port_number' => 3307,
            'db_selected_ftp_id' => null,
            'ftp_connection_name' => 'Test_connection_TWO.',
            'ftp_url_host' => 'example_ssh.com',
            'ftp_user_name' => 'ssh_user',
            'ftp_pass_word' => 'ssh_password',
            'ftp_port_number' => 22,
        ];

        unset($this->ftpConnectionParameters['id']); // We expect a new creation, so no id before the flush
        /** @var Connection $ftpConnectionEntity */
        $expectedFtpConnectionEntity = new Connection($this->ftpConnectionParameters, $this->user);

        /** @var array */
        $dbConnectionParametersAfterUpdate = [
            'id' => 456,
            'connection_genre' => 'db',
            'connection_name' => 'Test_connection_THREE_ok',
            'url_host' => 'localhostUPDATED_6',
            'user_name' => 'db_userUPDATED_7',
            'pass_word' => 'db_passwordUPDATED_8',
            'port_number' => 3307,
            'selected_ftp_id' => $expectedFtpConnectionEntity,
        ];

        /** @var Connection */
        $expectedDbConnectionEntity = new Connection($dbConnectionParametersAfterUpdate, $this->user);
        $providedDbConnectionEntity = new Connection($this->dbConnectionParametersB, $this->user);

        /** ConnectionsRepo */
        $connectionsRepo = $this->getMockBuilder(ConnectionsRepo::class)->disableOriginalConstructor()->getMock();
        $connectionsRepo->expects($this->at(0))
            ->method('findOneBy')
            ->with($this->equalTo(['id' => 456, 'user' => $this->user]))
            ->willReturn($providedDbConnectionEntity);

        /** ObjectManager */
        $dbManager = $this->getMockBuilder(ObjectManager::class)->disableOriginalConstructor()->getMock();
        $dbManager->expects($this->at(0))
            ->method('persist')
            ->with($this->equalTo($expectedFtpConnectionEntity));

        $dbManager->expects($this->at(1))
            ->method('persist')
            ->with($this->equalTo($expectedDbConnectionEntity));

        $dbManager->expects($this->at(2))
            ->method('flush');

        // Actual Test
        /** UserConnectionService $userConnectionServiceToTest */
        $userConnectionServiceToTest = new UserConnectionService();
        $dbConnectionUpdated = 0;
        try {
            $dbConnectionUpdated = $userConnectionServiceToTest->updateConnectionDbAndFtp(
                $input,
                $this->user,
                $dbManager,
                $connectionsRepo
            );
        } catch (UserInputException $e) {
            $this->fail('Unexpected exception:' . $e->getMessage());
        } catch (EntityNotFoundException $e) {
            $this->fail('Unexpected exception:' . $e->getMessage());
        }

        $this->assertEquals($expectedDbConnectionEntity, $dbConnectionUpdated);
        $this->assertEquals($expectedFtpConnectionEntity , $dbConnectionUpdated->getSelectedFtp());
    }

    /**
     * @expectedException \Doctrine\ORM\EntityNotFoundException
     * @expectedExceptionMessage No connection found for id 456
     */
    public function testUpdateConnectionDbAndFtpWillThrowNotFoundException()
    {
        $input = [
            'db_id' => 456,
        ];

        /** ConnectionsRepo */
        $connectionsRepo = $this->getMockBuilder(ConnectionsRepo::class)->disableOriginalConstructor()->getMock();
        $connectionsRepo->expects($this->at(0))
            ->method('findOneBy')
            ->with($this->equalTo(['id' => 456, 'user' => $this->user]))
            ->willReturn(null);

        /** ObjectManager */
        $dbManager = $this->getMockBuilder(ObjectManager::class)->disableOriginalConstructor()->getMock();
        $dbManager->expects($this->never())
            ->method('persist');

        // Actual Test
        /** UserConnectionService $userConnectionServiceToTest */
        $userConnectionServiceToTest = new UserConnectionService();
        try {
            $userConnectionServiceToTest->updateConnectionDbAndFtp(
                $input,
                $this->user,
                $dbManager,
                $connectionsRepo
            );
        } catch (UserInputException $e) {
            $this->fail('Unexpected exception:' . $e->getMessage());
        }/* DO NOT UNCOMMENT , As that IS expected here  catch (EntityNotFoundException $e) {
            $this->fail('Unexpected exception:' . $e->getMessage());
        }*/
    }

    public function testCreateConnectionDbAndFtp()
    {
        $input = [
            'select_db_protocol' => 'over_ssh',
            'db_id' => null,
            'db_connection_name' => 'Test_connection_ONE. brand_new',
            'db_url_host' => 'localhost',
            'db_user_name' => 'db_user',
            'db_pass_word' => 'db_password',
            'db_port_number' => 3306,
            'db_selected_ftp_id' => null,
            'ftp_connection_name' => 'Test_connection_TWO. brand_new',
            'ftp_url_host' => 'example_ssh.com',
            'ftp_user_name' => 'ssh_user',
            'ftp_pass_word' => 'ssh_password',
            'ftp_port_number' => 22,
        ];


        /** ObjectManager */
        $dbManager = new MyMockObjectManager(555);

        // Actual Test
        /** UserConnectionService $userConnectionServiceToTest */
        $userConnectionServiceToTest = new UserConnectionService();
        $dbConnectionCreated = $userConnectionServiceToTest->createConnectionDbAndFtp(
            $input,
            $this->user,
            $dbManager
        );

        // Build expectations as they use objects
        $this->ftpConnectionParameters['id'] = 555; // SSH connection id : First one to be created
        $this->ftpConnectionParameters['connection_name'] .= ' brand_new';

        /** @var Connection $expectedFtpConnectionEntity */
        $expectedFtpConnectionEntity = new Connection($this->ftpConnectionParameters, $this->user);

        $this->dbConnectionParametersA['id'] = 556; // DB id : Second one to be created
        $this->dbConnectionParametersA['selected_ftp_id'] = $expectedFtpConnectionEntity;
        $this->dbConnectionParametersA['connection_name'] .= ' brand_new';

        /** @var Connection $expectedDbConnectionEntity1 */
        $expectedDbConnectionEntity = new Connection($this->dbConnectionParametersA, $this->user);

        $expectedFtpDetails = $expectedFtpConnectionEntity->readAsFtpDetails();
        $expectedDbDetails = $expectedDbConnectionEntity->readAsDbDetails();

        $this->assertEquals($expectedFtpDetails, $dbConnectionCreated->getSelectedFtp()->readAsFtpDetails());
        $this->assertEquals($expectedDbDetails, $dbConnectionCreated->readAsDbDetails());
    }
}
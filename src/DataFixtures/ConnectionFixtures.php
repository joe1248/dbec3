<?php

namespace App\DataFixtures;

use App\Entity\Connection;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class ConnectionFixtures extends Fixture implements FixtureInterface, DependentFixtureInterface
{
    /**
     * @return array
     */
    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }

    /**
     * @param ObjectManager $manager
     *
     * @throws \Doctrine\Common\DataFixtures\BadMethodCallException
     */
    public function load(ObjectManager $manager)
    {
        /** @var UserInterface $user */
        $user = $this->getReference('first-user');

        $inputDb = [
            "connection_genre" => "db",
            "connection_name" => "my_test_connection_db",
            "url_host" => "aaa_host",
            "user_name" => "aaa_user",
            "pass_word" => "aaa_pass",
            "port_number" => "1234",
            //"selected_ftp_id" => $this->getReference('dbConnection'),
        ];
        $dbConnection = new Connection($inputDb, $user);

        $inputSsh = [
            "connection_genre" => "ssh",
            "connection_name" => "my_test_connection_ssh",
            "url_host" => "bbb_host",
            "user_name" => "bbb_user",
            "pass_word" => "bbb_pass",
            "port_number" => "5678",
        ];
        $sshConnection = new Connection($inputSsh, $user);
        $manager->persist($dbConnection);
        $manager->persist($sshConnection);

        $dbConnection->setSelectedFtp($sshConnection);
        $manager->persist($dbConnection);

        $manager->flush();
        $this->addReference('test-db-connection', $dbConnection);
    }
}
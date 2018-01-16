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
    public function getDependencies()
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
        $input = [
            "connection_genre" => "db",
            "connection_name" => "my_test_connection",
            "url_host" => "aaa_host",
            "user_name" => "aaa_user",
            "pass_word" => "aaa_pass",
            "port_number" => "1234",
        ];

        /** @var UserInterface $user */
        $user = $this->getReference('first-user');
        $connection = new Connection($input, $user);

        $manager->persist($connection);
        $manager->flush();
    }
}
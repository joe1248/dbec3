<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class UserFixtures extends Fixture implements FixtureInterface, DependentFixtureInterface
{
    /**
     * @return array
     */
    public function getDependencies()
    {
        return [];
    }

    /**
     * @param ObjectManager $manager
     *
     * @throws \Doctrine\Common\DataFixtures\BadMethodCallException
     */
    public function load(ObjectManager $manager)
    {
        $input = [
            '_username' => 'autotest_fake',
            '_password' => '$2y$12$bY/iuoSC18RkQZsGgf/Hou9kgcw2dmlcdp/SZD4S86LTwlKS/D9tm',
            '_email' => 'josephbarban@gmail.com',
        ];

        $user = new User();
        $user->registerNewUserRetails($input);

        // other fixtures can get this object using the 'admin-user' name
        $this->addReference('first-user', $user);

        $manager->persist($user);
        $manager->flush();
    }
}
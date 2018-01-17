<?php
// src/Repository/ConnectionsRepo.php;

namespace App\Repository;

use Doctrine\ORM\EntityRepository;
use Symfony\Component\Security\Core\User\UserInterface;

class ConnectionsRepo extends EntityRepository
{
    /**
     * @param UserInterface $user
     *
     * @return array
     */
    public function getAllNonDeletedDatabaseConnectionsOfUser(UserInterface $user)
    {
        return $this->createQueryBuilder('u')
            ->where('u.user = :user')
            ->andWhere('u.deleted = 0')
            ->andWhere('u.connectionGenre = \'db\'')
            ->orderBy('u.connectionName')
            ->setParameter('user', $user)
            ->getQuery()
            ->getArrayResult();
    }
}

<?php
// src/Repository/IdeaUserConnectionsRepository.php
namespace App\Repository;

use Doctrine\ORM\EntityRepository;

class IdeaUserConnectionsRepository extends EntityRepository
{
    public function getAll(int $userId)
    {
        return $this->createQueryBuilder('u')
            ->where('u.user = :user_id')
            ->andWhere('u.deleted = 0')
            ->andWhere('u.connectionGenre = \'db\'')
            ->orderBy('u.connectionName')
            ->setParameter('user_id', $userId)
            ->getQuery()
            ->getArrayResult();
    }
}

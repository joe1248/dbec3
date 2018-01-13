<?php
// src/Repository/IdeaUserConnectionsRepository.php
namespace App\Repository;

use Doctrine\ORM\EntityRepository;

class IdeaUserConnectionsRepository extends EntityRepository
{
    public function getAll()
    {
        return $this->createQueryBuilder('u')
            //->where('u.user_id = :user_id')
            //->setParameter('user_id', $user_id)
            ->getQuery()
            ->getArrayResult();
    }
}

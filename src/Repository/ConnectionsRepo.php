<?php
// src/Repository/ConnectionsRepo.php;

namespace App\Repository;

use App\Entity\Connection;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\Security\Core\User\UserInterface;

class ConnectionsRepo extends EntityRepository
{
    /**
     * @param UserInterface $user
     *
     * @return array
     */
    public function getAllNonDeletedDatabaseConnectionsOfUser(UserInterface $user): array
    {
        /** @var Connection[] $connections */
        $connections = $this->createQueryBuilder('u')
            ->where('u.user = :user')
            ->andWhere('u.deleted = 0')
            ->andWhere('u.connectionGenre = \'db\'')
            ->orderBy('u.connectionName')
            ->setParameter('user', $user)
            ->getQuery()
            ->getResult(); // instead of getArrayResult

        return $this->sanitiseResults($connections);
    }

    /**
     * @param array $connections
     *
     * @return array
     */
    private function sanitiseResults(array $connections): array
    {
        $sanitised = [];
        foreach ($connections as $connection) {
            $sanitised[] = $connection->getAttributes();
        }

        return $sanitised;
    }
}

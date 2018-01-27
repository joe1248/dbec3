<?php

namespace App\Business;

use App\Entity\Connection;
use App\Exception\UserInputException;
use App\Repository\ConnectionsRepo;
use App\Tests\MyMockObjectManager;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityNotFoundException;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Component\Security\Core\User\UserInterface;

class UserConnectionService
{
    /**
     * @param int $id
     * @param ConnectionsRepo|MockObject $connectionsRepo
     * @param UserInterface $user
     *
     * @return array
     *
     * @throws EntityNotFoundException
     */
    public function getConnectionDbAndFtpDetails(
        int $id,
        ConnectionsRepo $connectionsRepo,
        UserInterface $user
    ): array {
        /** @var Connection $connectionOne */
        $connectionOne = $connectionsRepo->findOneBy(['id' => $id, 'user' => $user]);
        if (empty($connectionOne)) {
            throw new EntityNotFoundException(
                'No connection found for id ' . $id
            );
        }

        return $connectionOne->getAttributes();
    }

    /**
     * @param int $dbId
     * @param UserInterface $user
     * @param ObjectManager|MockObject $dbManager
     * @param ConnectionsRepo|MockObject $connectionsRepo
     *
     * @return bool
     */
    public function deleteDbAndFtpConnection(
        int $dbId,
        UserInterface $user,
        ObjectManager $dbManager,
        ConnectionsRepo $connectionsRepo
    ) : bool
    {
        /** @var Connection $connectionOne */
        $connectionOne = $connectionsRepo->findOneBy(['id' => $dbId, 'user' => $user]);
        if (empty($connectionOne)) {

            return false;
        }

        /** @var Connection $connectionTwo */
        $connectionTwo = $connectionOne->getSelectedFtp();

        // delete 2 = FTP connection
        if (!empty($connectionTwo)) {
            $connectionTwo->delete();
            $dbManager->persist($connectionTwo);
        }
        // delete 1 = DB connection
        $connectionOne->delete();
        $dbManager->persist($connectionOne);

        $dbManager->flush();

        return true;
    }

    /**
     * @param array $input
     * @param UserInterface $user
     * @param ObjectManager|MockObject $dbManager
     * @param ConnectionsRepo|MockObject $connectionsRepo
     *
     * @return Connection
     *
     * @throws EntityNotFoundException
     * @throws UserInputException
     */
    public function updateConnectionDbAndFtp(
        array $input,
        UserInterface $user,
        ObjectManager $dbManager,
        ConnectionsRepo $connectionsRepo
    ): Connection {
        $inputConnectionDb = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input, 'db_'), 'db_');

        $dbId = $inputConnectionDb['id'];
        /** @var Connection $connectionEntityDb */
        $connectionEntityDb = $connectionsRepo->findOneBy([
            'id' => $dbId,
            'user' => $user
        ]);
        if (empty($connectionEntityDb)) {
            throw new EntityNotFoundException(
                'No connection found for id ' . $dbId
            );
        }

        if ($this->hasFtpConnexion($input)) {
            $inputConnectionFtp = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input, 'ftp_'), 'ftp_');
            if (empty($connectionEntityDb ->getSelectedFtp())) {
                $inputConnectionFtp['connection_genre'] = Connection::CONNECTION_TYPE_SSH;
                /** @var Connection $connectionEntityFtp */
                $connectionEntityFtp = new Connection($inputConnectionFtp, $user);
            } else {
                /** @var Connection $connectionEntityFtp */
                $connectionEntityFtp = $connectionEntityDb ->getSelectedFtp();
                $connectionEntityFtp->update($inputConnectionFtp);
            }
            $dbManager->persist($connectionEntityFtp);
            $inputConnectionDb['selected_ftp_id'] = $connectionEntityFtp;
        }
        $connectionEntityDb->update($inputConnectionDb);
        $dbManager->persist($connectionEntityDb);
        $dbManager->flush();

        return $connectionEntityDb;
    }

    /**
     * @param array $input
     * @param UserInterface $user
     * @param ObjectManager|MyMockObjectManager $dbManager
     *
     * @return Connection
     *
     * @throws UserInputException
     */
    public function createConnectionDbAndFtp(
        array $input,
        UserInterface $user,
        ObjectManager $dbManager
    ): Connection {
        $inputConnectionDb = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input,'db_'),'db_');

        if ($this->hasFtpConnexion($input)) {
            $inputConnectionFtp = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input,'ftp_'),'ftp_');
            $inputConnectionFtp['connection_genre'] = Connection::CONNECTION_TYPE_SSH;
            $connectionEntityFtp = new Connection($inputConnectionFtp, $user);
            $dbManager->persist($connectionEntityFtp);
            $dbManager->flush();
            $inputConnectionDb['selected_ftp_id'] = $connectionEntityFtp;
        }
        $inputConnectionDb['connection_genre'] = Connection::CONNECTION_TYPE_DB;
        $connectionEntityDb = new Connection($inputConnectionDb, $user);
        $dbManager->persist($connectionEntityDb);
        $dbManager->flush();

        return $connectionEntityDb;
    }

    /**
     * @param array $toFilterByKeyPrefix
     * @param string $prefix
     *
     * @return array
     */
    private function filterArrayByKeyPrefix(array $toFilterByKeyPrefix, string $prefix): array
    {
        return array_filter(
            $toFilterByKeyPrefix,
            function($key) use ($prefix) {
                return substr($key, 0, strlen($prefix)) == $prefix;
            },
            ARRAY_FILTER_USE_KEY
        );
    }

    /**
     * Remove a prefix from the keys of an array
     *
     * @param array $toRemoveKeyPrefix
     * @param string $prefix
     *
     * @return array
     */
    private function removeKeyPrefix(array $toRemoveKeyPrefix, string $prefix): array
    {
        $withKeyRemoved = [];
        foreach ($toRemoveKeyPrefix as $key => $value)
        {
            $key = substr($key, 0, strlen($prefix)) == $prefix ? substr($key, strlen($prefix)) : $key;
            $withKeyRemoved[$key] = $value;
        }
        return $withKeyRemoved;
    }

    /**
     * @param $input
     *
     * @return bool
     *
     * @throws UserInputException
     */
    private function hasFtpConnexion(array $input): bool
    {
        $protocol = $input['select_db_protocol'] ?? '';

        if (!in_array($protocol, ['', 'over_ssh'])) {
            throw new UserInputException(
                'Invalid input select_db_protocol. it must be nothing or over_ssh, not: ' . $protocol
            );
        }

        return $protocol == 'over_ssh';
    }
}
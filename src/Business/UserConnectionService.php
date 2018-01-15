<?php

namespace App\Business;

use App\Entity\Connection;
use App\Repository\ConnectionsRepo;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;

class UserConnectionService
{
    /**
     * @param int $id
     * @param ConnectionsRepo $em
     * @param UserInterface $user
     *
     * @return array
     *
     * @throws EntityNotFoundException
     */
    public function getConnectionDbAndFtpDetails(int $id, ConnectionsRepo $em, UserInterface $user)
    {
        /** @var Connection $connectionOne */
        $connectionOne = $em->findOneBy(['id' => $id, 'user' => $user]);
        if (empty($connectionOne)) {
            throw new EntityNotFoundException(
                'No connection found for id ' . $id
            );
        }
        /** @var Connection $connectionTwo */
        $connectionTwo = $connectionOne->getSelectedFtp();

        /** @var [] $connectionTwoDetails */
        $connectionTwoDetails = empty($connectionTwo) ? [] : $connectionTwo->readAsFtpDetails();

        return array_merge($connectionOne->readAsDbDetails(), $connectionTwoDetails);
    }

    /**
     * @param int $dbId
     * @param UserInterface $user
     * @param ObjectManager $dbManager
     * @param ConnectionsRepo $connectionsRepository
     *
     * @return bool
     */
    public function deleteDbAndFtpConnection(
        int $dbId,
        UserInterface $user,
        ObjectManager $dbManager,
        ConnectionsRepo $connectionsRepository
    )
    {
        /** @var Connection $connectionOne */
        $connectionOne = $connectionsRepository->findOneBy(['id' => $dbId, 'user' => $user]);
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
     * @param ObjectManager $dbManager
     * @param ConnectionsRepo $connectionsRepository
     *
     * @return Connection
     *
     * @throws EntityNotFoundException
     */
    public function updateConnectionDbAndFtp(
        array $input,
        UserInterface $user,
        ObjectManager $dbManager,
        ConnectionsRepo $connectionsRepository
    ) {
        $inputConnectionDb = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input, 'db_'), 'db_');

        /** @var Connection $connectionEntityDb */
        $connectionEntityDb = $connectionsRepository->findOneBy([
            'id' => $inputConnectionDb['id'],
            'user' => $user
        ]);
        if (empty($connectionEntityDb)) {
            throw new EntityNotFoundException(
                'No connection found for id ' . $inputConnectionDb['id']
            );
        }

        if ($input['select_db_protocol'] === 'over_ssh') {
            $inputConnectionFtp = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input, 'ftp_'), 'ftp_');
            if (empty($connectionEntityDb ->getSelectedFtp())) {
                $inputConnectionFtp['connection_genre'] = 'ftp';
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
     * @param ObjectManager $dbManager
     *
     * @return Connection
     */
    public function createConnectionDbAndFtp(
        array $input,
        UserInterface $user,
        ObjectManager $dbManager
    ) {
        $inputConnectionDb = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input,'db_'),'db_');

        if ($input['select_db_protocol'] === 'over_ssh') {
            $inputConnectionFtp = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input,'ftp_'),'ftp_');
            $inputConnectionFtp['connection_genre'] = 'ftp';
            $connectionEntityFtp = new Connection($inputConnectionFtp, $user);
            $dbManager->persist($connectionEntityFtp);
            $dbManager->flush();
            $inputConnectionDb['selected_ftp_id'] = $connectionEntityFtp;
        }
        $inputConnectionDb['connection_genre'] = 'db';
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
    private function filterArrayByKeyPrefix(array $toFilterByKeyPrefix, string $prefix)
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
    private function removeKeyPrefix(array $toRemoveKeyPrefix, string $prefix)
    {
        $withKeyRemoved = [];
        foreach ($toRemoveKeyPrefix as $key => $value)
        {
            $key = substr($key, 0, strlen($prefix)) == $prefix ? substr($key, strlen($prefix)) : $key;
            $withKeyRemoved[$key] = $value;
        }
        return $withKeyRemoved;
    }
}
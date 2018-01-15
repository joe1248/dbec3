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
        /** @var Connection[] $connections */
        $connections = $em->findBy(['id' => $id, 'user' => $user]);
        if (!count($connections)) {
            throw new EntityNotFoundException(
                'No connection found for id ' . $id
            );
        }
        /** @var Connection $connectionOne */
        $connectionOne = $connections[0];
        /** @var [] $connectionOneDetails */
        $connectionOneDetails = $connectionOne->readAsDbDetails();

        /** @var Connection $connectionTwo */
        $connectionTwo = $connectionOne->getSelectedFtp();

        /** @var [] $connectionTwoDetails */
        $connectionTwoDetails = empty($connectionTwo) ? [] : $connectionTwo->readAsFtpDetails();

        return array_merge($connectionOneDetails, $connectionTwoDetails);
    }

    /**
     * @param int $dbId
     * @param UserInterface $user
     * @param ObjectManager $dbManager
     * @param ConnectionsRepo $ConnectionsRepository
     *
     * @return bool
     */
    public function deleteDbAndFtpConnection(
        int $dbId,
        UserInterface $user,
        ObjectManager $dbManager,
        ConnectionsRepo $ConnectionsRepository
    )
    {
        /** @var Connection[] $connections */
        $connections = $ConnectionsRepository->findBy(['id' => $dbId, 'user' => $user]);
        if (!count($connections)) {

            return false;
        }

        /** @var Connection $connectionOne */
        $connectionOne = $connections[0];
        $connectionOne->delete();
        $dbManager->persist($connectionOne);

        /** @var Connection $connectionTwo */
        $connectionTwo = $connectionOne->getSelectedFtp();
        if (!empty($connectionTwo)) {
            $connectionTwo->delete();
            $dbManager->persist($connectionTwo);
        }

        $dbManager->flush();

        return true;
    }

    /**
     * @param array $input
     * @param UserInterface $user
     * @param ObjectManager $dbManager
     * @param ConnectionsRepo $ConnectionsRepository
     *
     * @return Connection
     */
    public function updateConnectionDbAndFtp(
        array $input,
        UserInterface $user,
        ObjectManager $dbManager,
        ConnectionsRepo $ConnectionsRepository
    ) {
        $inputConnectionDb = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input, 'db_'), 'db_');
        if ($input['select_db_protocol'] === 'over_ssh') {
            $inputConnectionFtp = $this->removeKeyPrefix($this->filterArrayByKeyPrefix($input, 'ftp_'), 'ftp_');
            $inputConnectionFtp['connection_genre'] = 'ftp';

            /** @var Connection $ideaUserConnectionEntityFtp */
            $ideaUserConnectionEntityFtp = $ConnectionsRepository->findOneBy([
                'id' => $inputConnectionDb['selected_ftp_id'],
                'user' => $user
            ]);
            $ideaUserConnectionEntityFtp->update($inputConnectionFtp);
            $dbManager->persist($ideaUserConnectionEntityFtp);
        }
        $inputConnectionDb['connection_genre'] = 'db';

        /** @var Connection $ideaUserConnectionEntityDb */
        $ideaUserConnectionEntityDb = $ConnectionsRepository->findOneBy([
            'id' => $inputConnectionDb['id'],
            'user' => $user
        ]);
        $ideaUserConnectionEntityDb->update($inputConnectionDb);
        $dbManager->persist($ideaUserConnectionEntityDb);
        $dbManager->flush();

        return $ideaUserConnectionEntityDb;
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
            $ideaUserConnectionEntityFtp = new Connection($inputConnectionFtp, $user);
            $dbManager->persist($ideaUserConnectionEntityFtp);
            $dbManager->flush();
            $inputConnectionDb['selected_ftp_id'] = $ideaUserConnectionEntityFtp->getId();
        }
        $inputConnectionDb['connection_genre'] = 'db';
        $ideaUserConnectionEntityDb = new Connection($inputConnectionDb, $user);
        $dbManager->persist($ideaUserConnectionEntityDb);
        $dbManager->flush();

        return $ideaUserConnectionEntityDb;
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
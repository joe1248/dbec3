<?php

namespace App\Entity;

use App\Exception\UserInputException;
use Doctrine\ORM\Mapping as ORM; // Do NOT delete, it is need by symfony to read the annotations
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Connection
 *
 * @ORM\Table(name="connections", indexes={@ORM\Index(name="user_id", columns={"user_id"}), @ORM\Index(name="selected_ftp_id", columns={"selected_ftp_id"})})
 * @ORM\Entity(repositoryClass="App\Repository\ConnectionsRepo")
 */
class Connection
{
    const CONNECTION_TYPE_SSH = 'ssh';
    const CONNECTION_TYPE_DB = 'db';

    const VALID_CONNECTIONS_TYPES = [
        self::CONNECTION_TYPE_DB,
        self::CONNECTION_TYPE_SSH
    ];

    const REQUIRED_FIELDS = [
        'connectionGenre',
        'connectionName',
        'urlHost',
        'userName',
        'passWord',
        'portNumber',
    ];

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false, options={"unsigned"=true})
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="boolean", nullable=false)
     */
    private $deleted = false;

    /**
     * @var bool
     *
     * @ORM\Column(name="connection_disabled", type="boolean", nullable=false)
     */
    private $connectionDisabled = false;

    /**
     * @var string
     *
     * @ORM\Column(name="connection_genre", type="string", length=3, nullable=false, options={"comment"="enum: ftp, db, svn or git. Type of connection"})
     */
    private $connectionGenre;

    /**
     * @var string|null
     *
     * @ORM\Column(name="connection_name", type="string", length=55, nullable=true, options={"default"="''","comment"="Memorable name for user"})
     */
    private $connectionName = '';

    /**
     * @var string|null
     *
     * @ORM\Column(name="url_host", type="string", length=75, nullable=true, options={"default"="''","comment"="Host IP or URL"})
     */
    private $urlHost = '';

    /**
     * @var string|null
     *
     * @ORM\Column(name="user_name", type="string", length=55, nullable=true, options={"default"="''"})
     */
    private $userName = '';

    /**
     * @var string|null
     *
     * @ORM\Column(name="pass_word", type="string", length=55, nullable=true, options={"default"="''"})
     */
    private $passWord = '';

    /**
     * @var integer|null
     *
     * @ORM\Column(name="port_number", type="string", length=10, nullable=true, options={"default"="''"})
     */
    private $portNumber = 0;

    /**
     * @var string|null
     *
     * @ORM\Column(name="method", type="string", length=10, nullable=true, options={"default"="''","comment"="nothing means simple, or over_ssh, or pem_file, or pub_key"})
     */
    //private $method = '';

    /**
     * @var string|null
     *
     * @ORM\Column(name="extra", type="string", length=255, nullable=true, options={"default"="''","comment"="USED to store JSON data depending on connection type"})
     */
    //private $extra = '';

    /**
     * @var string|null
     *
     * @ORM\Column(name="api_key", type="string", length=65, nullable=true, options={"default"="'0'"})
     */
    //private $apiKey = '\'0\'';

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="key_date", type="date", nullable=true, options={"default"="NULL"})
     */
    //private $keyDate = null;

    /**
     * @var string|null
     *
     * @ORM\Column(name="my_key", type="string", length=512, nullable=true, options={"default"="NULL"})
     */
    //private $myKey = 'NULL';

    /**
     * @var string|null
     *
     * @ORM\Column(name="my_four", type="string", length=512, nullable=true, options={"default"="NULL"})
     */
    //private $myFour = 'NULL';

    /**
     * @var string|null
     *
     * @ORM\Column(name="my_pass", type="string", length=512, nullable=true, options={"default"="NULL"})
     */
    //private $myPass = 'NULL';

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */
    private $user;

    /**
     * @var Connection
     *
     * @ORM\ManyToOne(targetEntity="Connection")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="selected_ftp_id", referencedColumnName="id")
     * })
     */
    private $selectedFtp;

    /**
     * Connection constructor.
     *
     * @param array $input
     * @param UserInterface $user
     *
     * @throws UserInputException
     */
    public function __construct(array $input, UserInterface $user)
    {
        $this->user = $user;
        $this->id = $input['id'] ?? null;
        $this->connectionGenre = $input['connection_genre'] ?? null;
        $this->connectionName  = $input['connection_name'] ?? null;
        $this->urlHost = $input['url_host'] ?? null;
        $this->userName = $input['user_name'] ?? null;
        $this->passWord = $input['pass_word'] ?? null;
        $this->portNumber = $input['port_number'] ?? null;
        $this->selectedFtp = $input['selected_ftp_id'] ?? null;
        $this->validate();
    }

    /**
     * @param array $input
     *
     * @throws UserInputException
     */
    public function update(array $input)
    {
        // Genre not changeable
        $this->connectionName  = $input['connection_name'] ?? null;
        $this->urlHost = $input['url_host'] ?? null;
        $this->userName = $input['user_name'] ?? null;
        $this->passWord = $input['pass_word'] ?? null;
        $this->portNumber = $input['port_number'] ?? null;
        $this->selectedFtp = $input['selected_ftp_id'] ?? null;
        $this->validate();
    }

    /**
     *
     */
    public function delete()
    {
        $this->deleted = true;
    }

    /**
     * @return bool
     */
    public function isDeleted(): bool
    {
        return (bool) $this->deleted;
    }

    /*public function enable()
    {
        $this->connectionDisabled = false;
    }

    public function disable()
    {
        $this->connectionDisabled = true;
    }*/

    /**
     * @return bool
     */
    public function isDisabled(): bool
    {
        return (bool) $this->connectionDisabled;
    }

    /**
     * @return int|mixed|null
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return Connection|mixed|null
     */
    public function getSelectedFtp()
    {
        return $this->selectedFtp;
    }

    /**
     * @param Connection
     */
    public function setSelectedFtp(Connection $connection)
    {
        $this->selectedFtp = $connection;
    }

    /**
     * @return array
     */
    public function getAttributes(): array
    {
        $prefix = $this->connectionGenre == 'db' ? 'db_' : 'ftp_';
        $dbOnlyAttributes = $this->connectionGenre != 'db'
            ? []
            : array_merge(
                [
                    'select_db_protocol' => empty($this->selectedFtp) ? '' : 'over_ssh',
                    $prefix . 'id' => $this->id,
                    $prefix . 'connection_disabled' => $this->isDisabled(),
                ],
                empty($this->selectedFtp) ? [] : $this->selectedFtp->getAttributes()
            );

        return array_merge(
            $dbOnlyAttributes,
            [
                $prefix . 'connection_name' => $this->connectionName,
                $prefix . 'url_host' => $this->urlHost,
                $prefix . 'user_name' => $this->userName,
                $prefix . 'pass_word' => $this->passWord,
                $prefix . 'port_number' => $this->portNumber,
            ]
        );
    }

    /**
     * @throws UserInputException
     */
    private function validate()
    {
        $missingParameters = [];
        foreach (self::REQUIRED_FIELDS as $requiredField) {
            if (empty($this->$requiredField)) {
                $missingParameters[] = $requiredField;
            }
        }

        $nbErrors = count($missingParameters);
        if ($nbErrors) {
            throw new UserInputException(
                (
                    $nbErrors == 1
                    ? 'A required parameter is missing: '
                    : 'Several required parameters are missing: '
                ) .
                join(', ', $missingParameters)
            );
        }
    }
}

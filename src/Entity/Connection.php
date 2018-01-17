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
    private $deleted = '0';

    /**
     * @var bool
     *
     * @ORM\Column(name="connection_disabled", type="boolean", nullable=false)
     */
    private $connectionDisabled = '0';

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
    private $connectionName = '\'\'';

    /**
     * @var string|null
     *
     * @ORM\Column(name="url_host", type="string", length=75, nullable=true, options={"default"="''","comment"="Host IP or URL"})
     */
    private $urlHost = '\'\'';

    /**
     * @var string|null
     *
     * @ORM\Column(name="user_name", type="string", length=55, nullable=true, options={"default"="''"})
     */
    private $userName = '\'\'';

    /**
     * @var string|null
     *
     * @ORM\Column(name="pass_word", type="string", length=55, nullable=true, options={"default"="''"})
     */
    private $passWord = '\'\'';

    /**
     * @var string|null
     *
     * @ORM\Column(name="port_number", type="string", length=10, nullable=true, options={"default"="''"})
     */
    private $portNumber = '\'\'';

    /**
     * @var string|null
     *
     * @ORM\Column(name="method", type="string", length=10, nullable=true, options={"default"="''","comment"="nothing means simple, or over_ssh, or pem_file, or pub_key"})
     */
    private $method = '\'\'';

    /**
     * @var string|null
     *
     * @ORM\Column(name="extra", type="string", length=255, nullable=true, options={"default"="''","comment"="USED to store JSON data depending on connection type"})
     */
    private $extra = '\'\'';

    /**
     * @var string|null
     *
     * @ORM\Column(name="api_key", type="string", length=65, nullable=true, options={"default"="'0'"})
     */
    private $apiKey = '\'0\'';

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="key_date", type="date", nullable=true, options={"default"="NULL"})
     */
    private $keyDate = null;

    /**
     * @var string|null
     *
     * @ORM\Column(name="my_key", type="string", length=512, nullable=true, options={"default"="NULL"})
     */
    private $myKey = 'NULL';

    /**
     * @var string|null
     *
     * @ORM\Column(name="my_four", type="string", length=512, nullable=true, options={"default"="NULL"})
     */
    private $myFour = 'NULL';

    /**
     * @var string|null
     *
     * @ORM\Column(name="my_pass", type="string", length=512, nullable=true, options={"default"="NULL"})
     */
    private $myPass = 'NULL';

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
     * @throws UserInputException
     */
    private function validate()
    {
        $missingParameters = [];
        foreach (self::REQUIRED_FIELDS as $requiredField)
        {
            if (empty($this->$requiredField))
            {
                $missingParameters[] = $requiredField;
            }
        }

        $nbErrors = count($missingParameters);
        if ($nbErrors) {
            throw new UserInputException(
                $nbErrors == 1 ? 'A required parameter is missing: ' : 'Several required parameters are missing: '.
                join(', ', $missingParameters)
            );
        }

        if (!in_array($this->connectionGenre, ['db', 'ftp'])) {
            throw new UserInputException('Invalid connection genre: ' . $this->connectionGenre);
        }
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
     * @return array
     */
    public function readAsDbDetails(): array
    {
        return [
            'db_id' => $this->id,
            'db_connection_name' => $this->connectionName,
            'db_url_host' => $this->urlHost,
            'db_user_name' => $this->userName,
            'db_pass_word' => $this->passWord,
            'db_port_number' => $this->portNumber,
            'db_connection_disabled' => $this->connectionDisabled,
            'db_selected_ftp_id' => empty($this->selectedFtp) ? 0 : $this->selectedFtp->getId(),
        ];
    }

    /**
     * @return array
     */
    public function readAsFtpDetails(): array
    {
        return [
            'ftp_connection_name' => $this->connectionName,
            'ftp_url_host' => $this->urlHost,
            'ftp_user_name' => $this->userName,
            'ftp_pass_word' => $this->passWord,
            'ftp_port_number' => $this->portNumber,
        ];
    }

    /**
     * @return array
     */
    public function getAttributes(): array
    {
        return [
            'id' => $this->id,
            'connection_name' => $this->connectionName,
            'url_host' => $this->urlHost,
            'user_name' => $this->userName,
            'pass_word' => $this->passWord,
            'port_number' => $this->portNumber,
            'connection_disabled' => $this->connectionDisabled,
            'selected_ftp' => empty($this->selectedFtp) ? null : [
                'id' => $this->selectedFtp->id,
                'connection_name' => $this->selectedFtp->connectionName,
                'url_host' => $this->selectedFtp->urlHost,
                'user_name' => $this->selectedFtp->userName,
                'pass_word' => $this->selectedFtp->passWord,
                'port_number' => $this->selectedFtp->portNumber,
            ]
        ];
    }
}

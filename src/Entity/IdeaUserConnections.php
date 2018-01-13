<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * IdeaUserConnections
 *
 * @ORM\Table(name="idea_user_connections", indexes={@ORM\Index(name="user_id", columns={"user_id"}), @ORM\Index(name="selected_ftp_id", columns={"selected_ftp_id"})})
 * @ORM\Entity
 */
class IdeaUserConnections
{
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
    private $keyDate = 'NULL';

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
     * @var \Users
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */
    private $user;

    /**
     * @var \IdeaUserConnections
     *
     * @ORM\ManyToOne(targetEntity="IdeaUserConnections")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="selected_ftp_id", referencedColumnName="id")
     * })
     */
    private $selectedFtp;

    public function getSelectedFtpId()
    {
        return $this->selectedFtp;
    }

    public function readAsDbDetails()
    {
        return [
            'db_connection_name' => $this->connectionName,
            'db_url_host' => $this->urlHost,
            'db_user_name' => $this->userName,
            'db_pass_word' => $this->passWord,
            'db_port_number' => $this->portNumber,
            'db_selected_ftp' => $this->selectedFtp,
        ];
    }

    public function readAsFtpDetails()
    {
        return [
            'ftp_connection_name' => $this->connectionName,
            'ftp_url_host' => $this->urlHost,
            'ftp_user_name' => $this->userName,
            'ftp_pass_word' => $this->passWord,
            'ftp_port_number' => $this->portNumber,
        ];
    }
}

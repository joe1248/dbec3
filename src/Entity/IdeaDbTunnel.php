<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * IdeaDbTunnel
 *
 * @ORM\Table(name="idea_db_tunnel", indexes={@ORM\Index(name="user_id", columns={"user_id"}), @ORM\Index(name="connection_id_index", columns={"connection_id"}), @ORM\Index(name="distant_db_port_index", columns={"distant_db_port"}), @ORM\Index(name="deleted_idx", columns={"deleted"})})
 * @ORM\Entity
 */
class IdeaDbTunnel
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
     * @var int
     *
     * @ORM\Column(name="distant_db_port", type="integer", nullable=false, options={"unsigned"=true,"comment"="Distant database port, as one ssh may be linked to differents db user..."})
     */
    private $distantDbPort;

    /**
     * @var int
     *
     * @ORM\Column(name="local_port", type="integer", nullable=false, options={"unsigned"=true,"comment"="Local port uniquely used for that db tunnel"})
     */
    private $localPort;

    /**
     * @var string|null
     *
     * @ORM\Column(name="ssh_cmd", type="string", length=125, nullable=true, options={"default"="''","comment"="SSH comand used to setupp and kill that tunnel"})
     */
    private $sshCmd = '\'\'';

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="last_used", type="datetime", nullable=true, options={"default"="NULL"})
     */
    private $lastUsed = 'NULL';

    /**
     * @var \IdeaUser
     *
     * @ORM\ManyToOne(targetEntity="IdeaUser")
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
     *   @ORM\JoinColumn(name="connection_id", referencedColumnName="id")
     * })
     */
    private $connection;


}

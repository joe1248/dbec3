<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * Dbec5DestDatabase
 *
 * @ORM\Table(name="dbec_5_dest_database", indexes={@ORM\Index(name="database_name_idx", columns={"database_name"}), @ORM\Index(name="deleted_idx", columns={"deleted"}), @ORM\Index(name="dest_fave_id", columns={"dest_fave_id"}), @ORM\Index(name="svr_id", columns={"svr_id"})})
 * @ORM\Entity
 */
class Dbec5DestDatabase
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
     * @var string
     *
     * @ORM\Column(name="database_name", type="string", length=75, nullable=false, options={"comment"="Real database name"})
     */
    private $databaseName;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="boolean", nullable=false)
     */
    private $deleted = '0';

    /**
     * @var \Dbec4DestFave
     *
     * @ORM\ManyToOne(targetEntity="Dbec4DestFave")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="dest_fave_id", referencedColumnName="id")
     * })
     */
    private $destFave;

    /**
     * @var \IdeaUserConnections
     *
     * @ORM\ManyToOne(targetEntity="IdeaUserConnections")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="svr_id", referencedColumnName="id")
     * })
     */
    private $svr;


}

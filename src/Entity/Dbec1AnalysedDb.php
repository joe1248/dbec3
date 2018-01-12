<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * Dbec1AnalysedDb
 *
 * @ORM\Table(name="dbec_1_analysed_db", indexes={@ORM\Index(name="fk_dbec_1_analysed_db_user_id", columns={"user_id"}), @ORM\Index(name="fk_dbec_1_analysed_db_svr_id", columns={"svr_id"})})
 * @ORM\Entity
 */
class Dbec1AnalysedDb
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
     * @var string
     *
     * @ORM\Column(name="main_table_name", type="string", length=75, nullable=false, options={"comment"="Main table name"})
     */
    private $mainTableName;

    /**
     * @var string
     *
     * @ORM\Column(name="main_table_primary_key", type="string", length=75, nullable=false, options={"comment"="Main DB table PRIMARY KEY name"})
     */
    private $mainTablePrimaryKey;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="boolean", nullable=false)
     */
    private $deleted = '0';

    /**
     * @var string
     *
     * @ORM\Column(name="json_data", type="text", nullable=false, options={"comment"="JSON describing the differents DB entities"})
     */
    private $jsonData;

    /**
     * @var \IdeaUserConnections
     *
     * @ORM\ManyToOne(targetEntity="IdeaUserConnections")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="svr_id", referencedColumnName="id")
     * })
     */
    private $svr;

    /**
     * @var \IdeaUser
     *
     * @ORM\ManyToOne(targetEntity="IdeaUser")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */
    private $user;


}

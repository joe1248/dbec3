<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * Dbec7Transfer
 *
 * @ORM\Table(name="dbec_7_transfer", indexes={@ORM\Index(name="user_id", columns={"user_id"}), @ORM\Index(name="db_srv_id", columns={"db_srv_id"}), @ORM\Index(name="is_extraction_idx", columns={"is_extraction"}), @ORM\Index(name="is_success_idx", columns={"is_success"})})
 * @ORM\Entity
 */
class Dbec7Transfer
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
     * @ORM\Column(name="tab_counter", type="boolean", nullable=false, options={"comment"="JS tabs so js object known for sure"})
     */
    private $tabCounter = '0';

    /**
     * @var bool
     *
     * @ORM\Column(name="is_extraction", type="boolean", nullable=false, options={"comment"="1 if extraction 0 if paste"})
     */
    private $isExtraction = '0';

    /**
     * @var bool
     *
     * @ORM\Column(name="is_success", type="boolean", nullable=false, options={"comment"="0 when just started, 1 if ended in success, 2 if ended with errors, 3 not ended in 2 hours"})
     */
    private $isSuccess = '0';

    /**
     * @var bool
     *
     * @ORM\Column(name="dest_db_index", type="boolean", nullable=false, options={"comment"="ONLY PASTE - index of the destination Db for that transfer (when multi DB)"})
     */
    private $destDbIndex = '0';

    /**
     * @var int|null
     *
     * @ORM\Column(name="entity_ready_id", type="integer", nullable=true, options={"default"="NULL","unsigned"=true,"comment"="foreign key to dbec_2_entity_ready.id"})
     */
    private $entityReadyId = 'NULL';

    /**
     * @var string
     *
     * @ORM\Column(name="db_name", type="string", length=75, nullable=false)
     */
    private $dbName;

    /**
     * @var int|null
     *
     * @ORM\Column(name="nb_queries", type="integer", nullable=true, options={"default"="NULL","unsigned"=true,"comment"="- ONLY EXTRACTION : number of records"})
     */
    private $nbQueries = 'NULL';

    /**
     * @var int
     *
     * @ORM\Column(name="nb_bytes", type="integer", nullable=false, options={"unsigned"=true,"comment"="Number of bytes extracted or transfered"})
     */
    private $nbBytes;

    /**
     * @var string|null
     *
     * @ORM\Column(name="object_id", type="string", length=750, nullable=true, options={"default"="NULL","comment"="- ONLY EXTRACTION : ONE or many User Data Ids to be cloned"})
     */
    private $objectId = 'NULL';

    /**
     * @var string|null
     *
     * @ORM\Column(name="end_of_perso_query", type="string", length=750, nullable=true, options={"default"="NULL","comment"="- ONLY EXTRACTION : User QUERY"})
     */
    private $endOfPersoQuery = 'NULL';

    /**
     * @var string
     *
     * @ORM\Column(name="json_db_counters", type="string", length=10192, nullable=false, options={"comment"="JSON counters, nb of records by tables"})
     */
    private $jsonDbCounters;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="dt_start", type="datetime", nullable=true, options={"default"="NULL"})
     */
    private $dtStart = 'NULL';

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="dt_end", type="datetime", nullable=true, options={"default"="NULL"})
     */
    private $dtEnd = 'NULL';

    /**
     * @var string|null
     *
     * @ORM\Column(name="final_comment", type="string", length=2048, nullable=true, options={"default"="NULL","comment"="USED when dt_time NOT NULL to tell user about sql error or new ID inserted successfully !"})
     */
    private $finalComment = 'NULL';

    /**
     * @var int|null
     *
     * @ORM\Column(name="parent_transfer_id", type="integer", nullable=true, options={"default"="NULL","unsigned"=true,"comment"="USED for paste transfer only as extraction as no parent yet."})
     */
    private $parentTransferId = 'NULL';

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
     * @var \Connections
     *
     * @ORM\ManyToOne(targetEntity="Connections")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="db_srv_id", referencedColumnName="id")
     * })
     */
    private $dbSrv;


}

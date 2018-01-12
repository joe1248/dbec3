<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * Dbec6UserSqlFile
 *
 * @ORM\Table(name="dbec_6_user_sql_file", indexes={@ORM\Index(name="entity_ready_id", columns={"entity_ready_id"}), @ORM\Index(name="user_id", columns={"user_id"}), @ORM\Index(name="user_sql_file_label_idx", columns={"user_sql_file_label"})})
 * @ORM\Entity
 */
class Dbec6UserSqlFile
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
     * @ORM\Column(name="user_sql_file_label", type="string", length=75, nullable=false, options={"comment"="User chosen file name / label"})
     */
    private $userSqlFileLabel;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="boolean", nullable=false)
     */
    private $deleted = '0';

    /**
     * @var bool
     *
     * @ORM\Column(name="is_setting", type="boolean", nullable=false)
     */
    private $isSetting = '0';

    /**
     * @var string
     *
     * @ORM\Column(name="object_ids", type="string", length=1024, nullable=false, options={"comment"="Object ID or tables names if setting tables"})
     */
    private $objectIds;

    /**
     * @var string
     *
     * @ORM\Column(name="json_counters", type="string", length=2048, nullable=false, options={"comment"="JSON counters, nb of records by tables"})
     */
    private $jsonCounters;

    /**
     * @var \Dbec2EntityReady
     *
     * @ORM\ManyToOne(targetEntity="Dbec2EntityReady")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="entity_ready_id", referencedColumnName="id")
     * })
     */
    private $entityReady;

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

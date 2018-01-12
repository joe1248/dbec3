<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * Dbec2EntityReady
 *
 * @ORM\Table(name="dbec_2_entity_ready", uniqueConstraints={@ORM\UniqueConstraint(name="unique_label_per_user", columns={"user_id", "entity_ready_name"})}, indexes={@ORM\Index(name="analysed_db_id", columns={"analysed_db_id"}), @ORM\Index(name="IDX_6CD64C5EA76ED395", columns={"user_id"})})
 * @ORM\Entity
 */
class Dbec2EntityReady
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
     * @ORM\Column(name="entity_ready_name", type="string", length=75, nullable=false, options={"comment"="Real database name"})
     */
    private $entityReadyName;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="boolean", nullable=false)
     */
    private $deleted = '0';

    /**
     * @var string
     *
     * @ORM\Column(name="json_data", type="text", nullable=false, options={"comment"="JSON describing the choices of user"})
     */
    private $jsonData;

    /**
     * @var \Dbec1AnalysedDb
     *
     * @ORM\ManyToOne(targetEntity="Dbec1AnalysedDb")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="analysed_db_id", referencedColumnName="id")
     * })
     */
    private $analysedDb;

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

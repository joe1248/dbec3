<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * Dbec3SrcFave
 *
 * @ORM\Table(name="dbec_3_src_fave", indexes={@ORM\Index(name="svr_id", columns={"svr_id"}), @ORM\Index(name="user_id", columns={"user_id"})})
 * @ORM\Entity
 */
class Dbec3SrcFave
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
     * @ORM\Column(name="src_fave_label", type="string", length=75, nullable=false, options={"comment"="User chosen label"})
     */
    private $srcFaveLabel;

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
     * @var \Connections
     *
     * @ORM\ManyToOne(targetEntity="Connections")
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

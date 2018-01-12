<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * IdeaResetCode
 *
 * @ORM\Table(name="idea_reset_code", indexes={@ORM\Index(name="user_id", columns={"user_id"})})
 * @ORM\Entity
 */
class IdeaResetCode
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
     * @var string|null
     *
     * @ORM\Column(name="reset_code", type="string", length=30, nullable=true, options={"default"="NULL"})
     */
    private $resetCode = 'NULL';

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="request_time", type="datetime", nullable=true, options={"default"="NULL"})
     */
    private $requestTime = 'NULL';

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

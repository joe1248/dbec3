<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * IdeaUser
 *
 * @ORM\Table(name="idea_user")
 * @ORM\Entity
 */
class IdeaUser
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
     * @ORM\Column(name="name", type="string", length=30, nullable=true, options={"default"="NULL"})
     */
    private $name = 'NULL';

    /**
     * @var string|null
     *
     * @ORM\Column(name="mail", type="string", length=75, nullable=true, options={"default"="NULL"})
     */
    private $mail = 'NULL';

    /**
     * @var int|null
     *
     * @ORM\Column(name="timezone_offset", type="integer", nullable=true, options={"default"="NULL"})
     */
    private $timezoneOffset = 'NULL';

    /**
     * @var string|null
     *
     * @ORM\Column(name="password", type="string", length=125, nullable=true, options={"default"="NULL"})
     */
    private $password = 'NULL';

    /**
     * @var string|null
     *
     * @ORM\Column(name="status", type="string", length=10, nullable=true, options={"default"="NULL","comment"="emailValid or whatever"})
     */
    private $status = 'NULL';

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="signup_date", type="date", nullable=true, options={"default"="NULL"})
     */
    private $signupDate = 'NULL';

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="boolean", nullable=false)
     */
    private $deleted = '0';

    /**
     * @var string|null
     *
     * @ORM\Column(name="json_settings", type="string", length=254, nullable=true, options={"default"="NULL"})
     */
    private $jsonSettings = 'NULL';


}

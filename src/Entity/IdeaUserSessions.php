<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * IdeaUserSessions
 *
 * @ORM\Table(name="idea_user_sessions")
 * @ORM\Entity
 */
class IdeaUserSessions
{
    /**
     * @var string
     *
     * @ORM\Column(name="id", type="string", length=32, nullable=false, options={"default"="''"})
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id = '\'\'';

    /**
     * @var string|null
     *
     * @ORM\Column(name="fingerprint", type="string", length=100, nullable=true, options={"default"="NULL"})
     */
    private $fingerprint = 'NULL';

    /**
     * @var string|null
     *
     * @ORM\Column(name="data", type="text", length=65535, nullable=true, options={"default"="NULL"})
     */
    private $data = 'NULL';

    /**
     * @var int
     *
     * @ORM\Column(name="access", type="integer", nullable=false)
     */
    private $access = '0';

    /**
     * @var string|null
     *
     * @ORM\Column(name="date", type="string", length=20, nullable=true, options={"default"="NULL"})
     */
    private $date = 'NULL';


}

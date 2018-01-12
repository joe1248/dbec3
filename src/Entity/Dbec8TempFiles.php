<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * Dbec8TempFiles
 *
 * @ORM\Table(name="dbec_8_temp_files", indexes={@ORM\Index(name="transfer_id", columns={"transfer_id"}), @ORM\Index(name="user_sql_file_id", columns={"user_sql_file_id"}), @ORM\Index(name="temp_file_name_idx", columns={"temp_file_name"})})
 * @ORM\Entity
 */
class Dbec8TempFiles
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
     * @ORM\Column(name="temp_file_name", type="string", length=75, nullable=false, options={"comment"="Name of one temp file"})
     */
    private $tempFileName;

    /**
     * @var \Dbec7Transfer
     *
     * @ORM\ManyToOne(targetEntity="Dbec7Transfer")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="transfer_id", referencedColumnName="id")
     * })
     */
    private $transfer;

    /**
     * @var \Dbec6UserSqlFile
     *
     * @ORM\ManyToOne(targetEntity="Dbec6UserSqlFile")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_sql_file_id", referencedColumnName="id")
     * })
     */
    private $userSqlFile;


}

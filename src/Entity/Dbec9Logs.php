<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * Dbec9Logs
 *
 * @ORM\Table(name="dbec_9_logs", indexes={@ORM\Index(name="transfer_id", columns={"transfer_id"}), @ORM\Index(name="is_debug_idx", columns={"is_debug"}), @ORM\Index(name="is_error_idx", columns={"is_error"})})
 * @ORM\Entity
 */
class Dbec9Logs
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
     * @var \DateTime|null
     *
     * @ORM\Column(name="log_dt", type="datetime", nullable=true, options={"default"="NULL","comment"="Date Timelog entry was written"})
     */
    private $logDt = 'NULL';

    /**
     * @var bool
     *
     * @ORM\Column(name="is_error", type="boolean", nullable=false, options={"comment"="1 if an SQL error"})
     */
    private $isError = '0';

    /**
     * @var bool
     *
     * @ORM\Column(name="is_debug", type="boolean", nullable=false, options={"comment"="1 if debug message"})
     */
    private $isDebug = '0';

    /**
     * @var string
     *
     * @ORM\Column(name="log_entry", type="text", length=65535, nullable=false, options={"comment"="A query or a error message"})
     */
    private $logEntry;

    /**
     * @var \Dbec7Transfer
     *
     * @ORM\ManyToOne(targetEntity="Dbec7Transfer")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="transfer_id", referencedColumnName="id")
     * })
     */
    private $transfer;


}

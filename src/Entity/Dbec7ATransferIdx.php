<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * Dbec7ATransferIdx
 *
 * @ORM\Table(name="dbec_7_A_transfer_idx", indexes={@ORM\Index(name="transfer_id_index", columns={"transfer_id"}), @ORM\Index(name="old_id_index", columns={"old_id"}), @ORM\Index(name="table_name_index", columns={"table_name"}), @ORM\Index(name="all_index", columns={"transfer_id", "old_id", "table_name"})})
 * @ORM\Entity
 */
class Dbec7ATransferIdx
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
     * @var int|null
     *
     * @ORM\Column(name="transfer_id", type="integer", nullable=true, options={"default"="NULL","unsigned"=true})
     */
    private $transferId = 'NULL';

    /**
     * @var string|null
     *
     * @ORM\Column(name="table_name", type="string", length=75, nullable=true, options={"default"="NULL"})
     */
    private $tableName = 'NULL';

    /**
     * @var int
     *
     * @ORM\Column(name="old_id", type="integer", nullable=false, options={"unsigned"=true})
     */
    private $oldId;

    /**
     * @var int|null
     *
     * @ORM\Column(name="new_id", type="integer", nullable=true, options={"default"="NULL","unsigned"=true})
     */
    private $newId = 'NULL';


}

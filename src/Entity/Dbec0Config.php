<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * Dbec0Config
 *
 * @ORM\Table(name="dbec_0_config")
 * @ORM\Entity
 */
class Dbec0Config
{
    /**
     * @var string
     *
     * @ORM\Column(name="config_param", type="string", length=37, nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $configParam;

    /**
     * @var string|null
     *
     * @ORM\Column(name="param_value", type="string", length=75, nullable=true, options={"default"="'0'"})
     */
    private $paramValue = '\'0\'';


}

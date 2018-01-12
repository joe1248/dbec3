<?php



use Doctrine\ORM\Mapping as ORM;

/**
 * DbecCountryData
 *
 * @ORM\Table(name="dbec_country_data")
 * @ORM\Entity
 */
class DbecCountryData
{
    /**
     * @var int
     *
     * @ORM\Column(name="country_id", type="integer", nullable=false, options={"unsigned"=true})
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $countryId;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=37, nullable=false)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="iso_code", type="string", length=37, nullable=false)
     */
    private $isoCode;


}

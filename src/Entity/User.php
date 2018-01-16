<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Table(name="users")
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface, \Serializable
{
    /**
     * @ORM\Column(name="id", type="integer", nullable=false, options={"unsigned"=true})
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;
    /**
     * @ORM\Column(type="string", length=25, unique=true)
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=60, unique=true)
     */
    private $email;

    /**
     * @ORM\Column(name="is_active", type="boolean")
     */
    private $isActive;

    /**
     * @var int|null
     *
     * @ORM\Column(name="timezone_offset", type="integer", nullable=true, options={"default"="NULL"})
     */
    private $timezoneOffset = 'NULL';

    /**
-     * @var string|null
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

    public function __construct()
    {
        $this->isActive = true;
        // may not be needed, see section on salt below
        // $this->salt = md5(uniqid('', true));
    }

    public function registerNewUserRetails($input)
    {
        $this->id = null;
        $this->username = $input['_username'];
        $this->password = $input['_password'];
        $this->email = $input['_email'];
        $this->signupDate = null;//\DateTime::createFromFormat('Y-m-d', date('Y-m-d H:i:s'));

        return $this;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function getSalt()
    {
        // you *may* need a real salt depending on your encoder
        // see section on salt below
        return null;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function getRoles()
    {
        return array('ROLE_USER');
    }

    public function eraseCredentials()
    {
    }

    /** @see \Serializable::serialize() */
    public function serialize()
    {
        return serialize(array(
            $this->id,
            $this->username,
            $this->password,
            // see section on salt below
            // $this->salt,
        ));
    }

    /** @see \Serializable::unserialize() */
    public function unserialize($serialized)
    {
        list (
            $this->id,
            $this->username,
            $this->password,
            // see section on salt below
            // $this->salt
        ) = unserialize($serialized);
    }
}

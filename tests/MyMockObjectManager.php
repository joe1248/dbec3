<?php

namespace App\Tests;

use Doctrine\Common\Persistence\ObjectManager;
use ReflectionClass;

/**
 * Helps for unit-tests, in order to mock better the database by returning a new ID on each call to persist()
 *
 * Class MyMockObjectManager
 *
 * @package App\Tests
 */
class MyMockObjectManager implements ObjectManager
{
    /** @var int */
    private $currentPrimaryKeyId;

    /**
     * MyEntityManager constructor.
     *
     * @param int $currentPrimaryKeyId
     */
    public function __construct(int $currentPrimaryKeyId)
    {
        $this->currentPrimaryKeyId = $currentPrimaryKeyId;
    }

    /**
     * @param object $object
     */
    public function persist($object)
    {
        $reflectionClass = new ReflectionClass(get_class($object));
        $idProperty = $reflectionClass->getProperty('id');
        $idProperty->setAccessible(true);
        $idProperty->setValue($object, $this->currentPrimaryKeyId);
        $this->currentPrimaryKeyId++;
    }

    /**
     * @param string $className
     * @param string $id
     */
    public function find($className, $id){}

    /**
     * @param object $object The object instance to remove.
     */
    public function remove($object){}

    /**
     * @param object $object
     */
    public function merge($object){}

    /**
     * @param string|null $objectName if given, only objects of this type will get detached.
     */
    public function clear($objectName = null){}

    /**
     * @param object $object The object to detach.
     */
    public function detach($object){}

    /**
     * @param object $object The object to refresh.
     */
    public function refresh($object){}

    /**
     *
     */
    public function flush(){}

    /**
     * @param string $className
     */
    public function getRepository($className){}

    /**
     * @param string $className
     */
    public function getClassMetadata($className){}

    /**
     */
    public function getMetadataFactory(){}

    /**
     * @param object $obj
     */
    public function initializeObject($obj){}

    /**
     * @param object $object
     */
    public function contains($object){}
}
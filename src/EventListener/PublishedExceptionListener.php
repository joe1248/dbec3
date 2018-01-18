<?php

namespace App\EventListener;

use App\Exception\PublishedExceptionInterface;
//use App\Exception\UserInputException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;

class PublishedExceptionListener
{
    protected $logger;

    public function __construct(LoggerInterface $logger = null)
    {
        $this->logger = $logger;
    }

    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        $exception = $event->getException();

        if (!$exception instanceof PublishedExceptionInterface) {
            $this->logger->error('DEVELOPER ERROR URGENT: ', ['exception' => $exception]);
            return;
        }

        $code = 400;// $exception instanceof UserInputException ? 400 : 500;

        $responseData = [
            'error' => [
                'code' => $code,
                'message' => $exception->getMessage()
            ]
        ];

        $event->setResponse(new JsonResponse($responseData, $code));
    }
}
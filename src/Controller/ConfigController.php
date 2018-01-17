<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use App\Business\Cloning\ConfigObfuscationCatalog;

class ConfigController extends Controller 
{
    /**
     * @param ConfigObfuscationCatalog $configObfuscationCatalog
     *
     * @return JsonResponse
     */
    public function getConfig(ConfigObfuscationCatalog $configObfuscationCatalog): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        return new JsonResponse( [
            'dataTypes'          => $configObfuscationCatalog->Adatatypes,
            'optionsByDataTypes' => $configObfuscationCatalog->AoptionsByDatatypes,
            'lastVersion'         => 300,
            'currentVersion'      => 300,
        ]);
    }
}

<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use App\Business\Cloning\ConfigObfuscationCatalog;

class ConfigController extends Controller 
{
    public function getConfig(ConfigObfuscationCatalog $configObfuscationCatalog)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        return new JsonResponse( [
            'Adatatypes'          => $configObfuscationCatalog->Adatatypes,
            'AoptionsByDatatypes' => $configObfuscationCatalog->AoptionsByDatatypes,
            'lastVersion'         => 301,//$Oide->get_latest_code_version_number(),
            'currentVersion'      => 301,// $Oide->getCodeVersion(),
        ]);
    }
}

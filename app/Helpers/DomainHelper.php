<?php

namespace App\Helpers;

class DomainHelper
{
    /**
     * Get the application domain without the protocol.
     */
    public static function getAppDomainWithoutProtocol(): string
    {
        return str(env('APP_URL'))->after('://')->before('/')->toString();
    }
}

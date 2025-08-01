<?php

namespace App\Actions\Tenant\Settings;

use Inertia\Inertia;
use Inertia\Response;
use Lorisleiva\Actions\Concerns\AsAction;

class EditPassword
{
    use AsAction;

    public function asController(): Response
    {
        return Inertia::render('settings/password');
    }
}
<?php

namespace App\Actions\Tenant\Auth;

use Inertia\Inertia;
use Inertia\Response;
use Lorisleiva\Actions\Concerns\AsAction;

class ShowConfirmPassword
{
    use AsAction;

    public function asController(): Response
    {
        return Inertia::render('auth/confirm-password');
    }
}
<?php

namespace App\Actions\Tenant\Auth;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Lorisleiva\Actions\Concerns\AsAction;

class ShowResetPassword
{
    use AsAction;

    public function asController(Request $request): Response
    {
        return Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }
}
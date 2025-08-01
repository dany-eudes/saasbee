<?php

namespace App\Actions\Tenant\Auth;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Lorisleiva\Actions\Concerns\AsAction;

class ShowEmailVerificationPrompt
{
    use AsAction;

    public function asController(Request $request): Response|RedirectResponse
    {
        return $request->user()->hasVerifiedEmail()
                    ? redirect()->intended(route('dashboard', absolute: false))
                    : Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
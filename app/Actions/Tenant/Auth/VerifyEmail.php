<?php

namespace App\Actions\Tenant\Auth;

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Lorisleiva\Actions\Concerns\AsAction;

class VerifyEmail
{
    use AsAction;

    public function asController(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        $request->fulfill();

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
}
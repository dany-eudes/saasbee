<?php

namespace App\Actions\Tenant\Auth;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Lorisleiva\Actions\Concerns\AsAction;

class SendEmailVerificationNotification
{
    use AsAction;

    public function handle(Request $request): void
    {
        if (!$request->user()->hasVerifiedEmail()) {
            $request->user()->sendEmailVerificationNotification();
        }
    }

    public function asController(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        $this->handle($request);

        return back()->with('status', 'verification-link-sent');
    }
}
<?php

namespace App\Actions\Tenant\Auth;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;

class Logout
{
    use AsAction;

    public function handle(Request $request): void
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }

    public function asController(Request $request): RedirectResponse
    {
        $this->handle($request);

        return redirect('/');
    }
}
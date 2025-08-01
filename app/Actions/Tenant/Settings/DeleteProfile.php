<?php

namespace App\Actions\Tenant\Settings;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\ActionRequest;
use Lorisleiva\Actions\Concerns\AsAction;

class DeleteProfile
{
    use AsAction;

    public function rules(): array
    {
        return [
            'password' => ['required', 'current_password'],
        ];
    }

    public function handle(ActionRequest $request): void
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }

    public function asController(ActionRequest $request): RedirectResponse
    {
        $this->handle($request);

        return redirect('/');
    }
}
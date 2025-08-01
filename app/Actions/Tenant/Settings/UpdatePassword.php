<?php

namespace App\Actions\Tenant\Settings;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Lorisleiva\Actions\ActionRequest;
use Lorisleiva\Actions\Concerns\AsAction;

class UpdatePassword
{
    use AsAction;

    public function rules(): array
    {
        return [
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ];
    }

    public function handle(ActionRequest $request): void
    {
        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);
    }

    public function asController(ActionRequest $request): RedirectResponse
    {
        $this->handle($request);

        return back();
    }
}
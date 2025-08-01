<?php

namespace App\Actions\Tenant\Auth;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Password;
use Lorisleiva\Actions\ActionRequest;
use Lorisleiva\Actions\Concerns\AsAction;

class SendPasswordResetLink
{
    use AsAction;

    public function rules(): array
    {
        return [
            'email' => 'required|email',
        ];
    }

    public function handle(ActionRequest $request): void
    {
        Password::sendResetLink(
            $request->only('email')
        );
    }

    public function asController(ActionRequest $request): RedirectResponse
    {
        $this->handle($request);

        return back()->with('status', __('A reset link will be sent if the account exists.'));
    }
}
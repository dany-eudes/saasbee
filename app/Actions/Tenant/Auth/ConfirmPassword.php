<?php

namespace App\Actions\Tenant\Auth;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\ActionRequest;
use Lorisleiva\Actions\Concerns\AsAction;

class ConfirmPassword
{
    use AsAction;

    public function rules(): array
    {
        return [
            'password' => ['required'],
        ];
    }

    public function handle(ActionRequest $request): void
    {
        if (!Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $request->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        $request->session()->put('auth.password_confirmed_at', time());
    }

    public function asController(ActionRequest $request): RedirectResponse
    {
        $this->handle($request);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
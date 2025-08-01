<?php

namespace App\Actions\Tenant\Auth;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\ActionRequest;
use Lorisleiva\Actions\Concerns\AsAction;

class Login
{
    use AsAction;

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function handle(ActionRequest $request): void
    {
        $this->ensureIsNotRateLimited($request);

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey($request));
            
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey($request));
        $request->session()->regenerate();
    }

    public function asController(ActionRequest $request): RedirectResponse
    {
        $this->handle($request);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    protected function ensureIsNotRateLimited(ActionRequest $request): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey($request), 5)) {
            return;
        }

        $seconds = RateLimiter::availableIn($this->throttleKey($request));

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    protected function throttleKey(ActionRequest $request): string
    {
        return strtolower($request->input('email')).'|'.$request->ip();
    }
}
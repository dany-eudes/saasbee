<?php

namespace App\Actions\Tenant\Settings;

use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Lorisleiva\Actions\ActionRequest;
use Lorisleiva\Actions\Concerns\AsAction;

class UpdateProfile
{
    use AsAction;

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                \Illuminate\Validation\Rule::unique(\App\Models\User::class)->ignore(auth()->id()),
            ],
        ];
    }

    public function handle(ActionRequest $request): void
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();
    }

    public function asController(ActionRequest $request): RedirectResponse
    {
        $this->handle($request);

        return to_route('profile.edit');
    }
}
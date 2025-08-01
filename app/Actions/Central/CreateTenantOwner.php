<?php

namespace App\Actions\Central;

use App\Mail\TenantOwnerWelcome;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateTenantOwner
{
    use AsAction;

    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'name' => 'required|string|max:255',
            'domain' => 'required|string',
        ];
    }

    public function handle(array $data, string $randomPassword): User
    {
        unset($data['domain']); // Remove domain from data if not needed
        $data['password'] = Hash::make($randomPassword);

        $user = User::create($data);
        $user->assignRole('tenant_owner');

        return $user;
    }

    public function asJob(array $data): User
    {
        $randomPassword = Str::random(16);
        $plainPassword = $randomPassword; // Store the plain password for the email
        $user = $this->handle([
            'email' => $data['email'],
            'name' => $data['name'],
        ], $randomPassword);

        Mail::to($user->email)->send(new TenantOwnerWelcome(
            name: $user->name,
            email: $user->email,
            password: $plainPassword,
            domain: $data['domain']
        ));

        return $user;
    }
}

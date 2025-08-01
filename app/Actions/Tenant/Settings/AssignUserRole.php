<?php

namespace App\Actions\Tenant\Settings;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class AssignUserRole
{
    use AsAction;

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'roles' => ['array'],
            'roles.*' => ['string', 'exists:roles,name'],
        ];
    }

    public function handle(int $userId, array $roles = [])
    {
        // Check if user can manage roles (only tenant owner for now)
        if (!auth()->user()->hasRole('tenant_owner')) {
            throw ValidationException::withMessages([
                'role' => 'Only tenant owners can assign roles.',
            ]);
        }

        $user = User::findOrFail($userId);

        // Prevent removing tenant_owner role from current user
        $currentUser = auth()->user();
        if ($user->id === $currentUser->id && $user->hasRole('tenant_owner') && !in_array('tenant_owner', $roles)) {
            throw ValidationException::withMessages([
                'role' => 'You cannot remove the tenant owner role from yourself.',
            ]);
        }

        // Prevent assigning tenant_owner role to other users
        if ($user->id !== $currentUser->id && in_array('tenant_owner', $roles)) {
            throw ValidationException::withMessages([
                'role' => 'Only one user can have the tenant owner role.',
            ]);
        }

        $roleModels = Role::whereIn('name', $roles)->get();
        $user->syncRoles($roleModels);

        return $user->load('roles');
    }

    public function asController(Request $request)
    {
        $validated = $request->validate($this->rules());

        $user = $this->handle(
            $validated['user_id'],
            $validated['roles'] ?? []
        );

        return redirect()->back()->with('success', 'User roles updated successfully.');
    }
}

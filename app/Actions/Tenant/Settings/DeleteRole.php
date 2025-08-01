<?php

namespace App\Actions\Tenant\Settings;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class DeleteRole
{
    use AsAction;

    public function handle(Role $role)
    {
        // Check if user can manage roles (only tenant owner for now)
        if (!auth()->user()->hasRole('tenant_owner')) {
            throw ValidationException::withMessages([
                'role' => 'Only tenant owners can manage roles.',
            ]);
        }

        // Prevent deleting tenant_owner role
        if ($role->name === 'tenant_owner') {
            throw ValidationException::withMessages([
                'role' => 'The tenant owner role cannot be deleted.',
            ]);
        }

        // Check if role is assigned to any users
        if ($role->users()->exists()) {
            throw ValidationException::withMessages([
                'role' => 'Cannot delete role that is assigned to users.',
            ]);
        }

        $role->delete();

        return true;
    }

    public function asController(Request $request, Role $role)
    {
        $this->handle($role);

        return redirect()->back()->with('success', 'Role deleted successfully.');
    }
}

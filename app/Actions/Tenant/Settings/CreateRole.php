<?php

namespace App\Actions\Tenant\Settings;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateRole
{
    use AsAction;

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ];
    }

    public function handle(string $name, array $permissions = [])
    {
        // Check if user can manage roles (only tenant owner for now)
        if (!auth()->user()->hasRole('tenant_owner')) {
            throw ValidationException::withMessages([
                'role' => 'Only tenant owners can manage roles.',
            ]);
        }

        $role = Role::create(['name' => $name]);

        if (!empty($permissions)) {
            $permissionModels = Permission::whereIn('name', $permissions)->get();
            $role->syncPermissions($permissionModels);
        }

        return $role->load('permissions');
    }

    public function asController(Request $request)
    {
        $validated = $request->validate($this->rules());

        $role = $this->handle(
            $validated['name'],
            $validated['permissions'] ?? []
        );

        return redirect()->back()->with('success', 'Role created successfully.');
    }
}

<?php

namespace App\Actions\Tenant\Settings;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class UpdateRole
{
    use AsAction;

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ];
    }

    public function handle(Role $role, string $name, array $permissions = [])
    {
        // Check if user can manage roles (only tenant owner for now)
        if (!auth()->user()->hasRole('tenant_owner')) {
            throw ValidationException::withMessages([
                'role' => 'Only tenant owners can manage roles.',
            ]);
        }

        // Prevent editing tenant_owner role
        if ($role->name === 'tenant_owner') {
            throw ValidationException::withMessages([
                'role' => 'The tenant owner role cannot be modified.',
            ]);
        }

        $role->update(['name' => $name]);

        $permissionModels = Permission::whereIn('name', $permissions)->get();
        $role->syncPermissions($permissionModels);

        return $role->load('permissions');
    }

    public function asController(Request $request, Role $role)
    {
        $this->rules()['name'][] = Rule::unique('roles', 'name')->ignore($role->id);
        $validated = $request->validate($this->rules());

        $role = $this->handle(
            $role,
            $validated['name'],
            $validated['permissions'] ?? []
        );

        return redirect()->back()->with('success', 'Role updated successfully.');
    }
}

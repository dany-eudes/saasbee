<?php

namespace App\Actions\Tenant\Settings;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Lorisleiva\Actions\Concerns\AsAction;

class ManageRoles
{
    use AsAction;

    public function handle()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();
        $users = User::with('roles')->get();

        return [
            'roles' => $roles,
            'permissions' => $permissions,
            'users' => $users,
        ];
    }

    public function asController(Request $request)
    {
        $data = $this->handle();

        return Inertia::render('settings/roles', $data);
    }
}

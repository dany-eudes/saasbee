<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role = Role::create(['name' => 'tenant_owner']);
        $blogPermissions = [
            'edit articles',
            'delete articles',
            'publish articles',
            'unpublish articles',
        ];

        $memberPermissions = [
            'create members',
            'edit members',
            'delete members',
            'view members',
        ];

        $tenantOwnerPermissions = array_merge($blogPermissions, $memberPermissions);

        foreach ($tenantOwnerPermissions as $permissionName) {
            $permission = Permission::create(['name' => $permissionName]);
            $role->givePermissionTo($permission);
        }
    }
}

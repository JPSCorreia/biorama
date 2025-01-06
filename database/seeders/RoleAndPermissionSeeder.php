<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Conforme documentação: https://spatie.be/docs/laravel-permission/v5/advanced-usage/seeding
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $vendorRole = Role::create(['name' => 'vendor']);
        $userRole = Role::create(['name' => 'user']);

        // Create permissions
        $manageStores = Permission::create(['name' => 'manage stores']);

        // Assign permissions
        $vendorRole->givePermissionTo($manageStores);
    }
}

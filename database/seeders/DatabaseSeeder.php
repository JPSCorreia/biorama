<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        setlocale(LC_ALL, 'pt_PT.UTF-8');

        $this->call([
            RoleAndPermissionSeeder::class,
            GenderSeeder::class,
            UserSeeder::class,
            VendorSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            StoreSeeder::class,
            StatusSeeder::class,
            OrderSeeder::class,
            CategoryProductSeeder::class,
        ]);
    }
}

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
        $this->call([
            RoleAndPermissionSeeder::class,
            UserSeeder::class,
            VendorSeeder::class,
            HomeAddressSeeder::class,
            StoreSeeder::class,
            StoreGallerySeeder::class,
            StoreReviewSeeder::class,
            VendorReviewSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            StoreProductSeeder::class,
            StatusSeeder::class,
            OrderSeeder::class,
            OrderStoreProductSeeder::class,
            CategoryProductSeeder::class,
        ]);
    }
}

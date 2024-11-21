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
            OrderSeeder::class,
            OrderStoreProductSeeder::class,
            StatusSeeder::class,
            CategoryProductSeeder::class,
        ]);
    }
}

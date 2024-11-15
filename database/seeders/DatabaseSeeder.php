<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            HomeAddressSeeder::class,
            ProductCategorySeeder::class,
            VendorSeeder::class,
            VendorReviewSeeder::class,
            StoreSeeder::class,
            StoreReviewSeeder::class,
            ProductSeeder::class,
            StoreProductSeeder::class,
            OrderStatusSeeder::class,
            OrderSeeder::class,
            OrderStoreProductSeeder::class,
            CategorySeeder::class,
        ]);
    }
}

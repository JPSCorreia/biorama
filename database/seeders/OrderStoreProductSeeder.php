<?php

namespace Database\Seeders;

use App\Models\OrderStoreProduct;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderStoreProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        OrderStoreProduct::factory()->count(100)->create();
    }

}

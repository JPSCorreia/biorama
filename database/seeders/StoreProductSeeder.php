<?php

namespace Database\Seeders;

use App\Models\StoreProduct;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StoreProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        StoreProduct::factory()->count(200)->create();
    }

}

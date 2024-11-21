<?php

namespace Database\Seeders;

use App\Models\HomeAddress;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HomeAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        HomeAddress::factory()->count(100)->create();
    }

}

<?php

namespace Database\Seeders;

use App\Models\StoreGallery;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StoreGallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        StoreGallery::factory()->count(100)->create();
    }

}

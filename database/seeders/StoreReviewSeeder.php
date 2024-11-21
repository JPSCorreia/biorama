<?php

namespace Database\Seeders;

use App\Models\StoreReview;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StoreReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        StoreReview::factory()->count(50)->create();
    }

}

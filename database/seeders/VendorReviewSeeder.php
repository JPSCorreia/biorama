<?php

namespace Database\Seeders;

use App\Models\VendorReview;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VendorReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        VendorReview::factory()->count(50)->create();
    }

}

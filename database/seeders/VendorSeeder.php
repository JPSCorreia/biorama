<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Vendor;
use App\Models\VendorAddress;
use App\Models\VendorReview;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Vendor::factory()->count(20)->create();

        $vendors = Vendor::all();

        foreach ($vendors as $vendor) {
            if ($vendor->is_company) {
                Company::factory()->create([
                    'vendor_id' => $vendor->id,
                ]);
            }
            VendorReview::factory()->count(5)->create([
                'vendor_id' => $vendor->id,
            ]);
        }
    }

}

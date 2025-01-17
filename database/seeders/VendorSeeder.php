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
        Vendor::factory()
            ->count(10) // 10 Vendors
            ->has(
                Company::factory() // 1 Company por Vendor
                ->hasContacts(1) // 1 Contact por Company
                ->hasAddresses(1) // 1 Address por Company
            )
            ->has(
                VendorReview::factory()->count(5) // 5 Reviews por Vendor
            )
            ->create();

    }

}

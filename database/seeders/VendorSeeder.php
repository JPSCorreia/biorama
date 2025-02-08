<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyAddress;
use App\Models\CompanyContact;
use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorReview;
use Illuminate\Database\Seeder;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Criar um vendor associado ao User com id 1
        $user = User::find(1);

        if ($user && !$user->vendor) {
            $vendor = Vendor::create([
                'user_id' => $user->id,
                'first_name' => 'Vladimiro',
                'last_name' => 'Bonaparte',
                'email' => 'vladimiro@example.com',
                'nif' => '239502051',
                'phone' => '912345678',
                'date_of_birth' => '1990-01-01',
                'iban' => 'PT50000201231234567890154',
                'gender_id' => 1,
                'is_company' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            Company::create([
                'vendor_id' => $vendor->id,
                'name' => 'Gaspar Ramos',
                'nif' => '530475035',
                'founded_at' => '2011-01-23',
                'sector' => 'enim',
                'description' => 'Descrição personalizada ou fictícia',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            CompanyContact::create([
                'company_id' => $vendor->company->id,
                'phone' => '931883380',
                'email' => 'campos.matheus@example.org',
                'website' => 'http://martins.eu/eius-reprehenderit-voluptate',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            CompanyAddress::create([
                'company_id' => $vendor->company->id,
                'street' => 'Rua Principal',
                'number' => '123',
                'postal_code' => '2845-210',
                'district' => 'Seixal',
                'country' => 'Portugal',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Criar 10 Users e associar Vendors a cada um
        User::factory(10)->create()->each(function ($user) {
            $vendor = Vendor::factory()->create(['user_id' => $user->id]);

            Company::factory()->create(['vendor_id' => $vendor->id]);
            VendorReview::factory()->count(5)->create(['vendor_id' => $vendor->id]);
        });
    }
}

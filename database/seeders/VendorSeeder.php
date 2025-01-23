<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyAddress;
use App\Models\CompanyContact;
use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorAddress;
use App\Models\VendorReview;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
            // Criar um vendor associado ao User com id 1
            Vendor::create([
                'user_id' => 1, // ID do utilizador associado
                'first_name' => 'Vladimiro', // Nome personalizado ou podes usar fake data
                'last_name' => 'Bonaparte',
                'email' => 'vladimiro@example.com',
                'nif'=> '239502051',
                'phone' => '912345678',
                'date_of_birth' => '1990-01-01',
                'image_profile' => null, // Sem foto
                'iban' => 'PT50000201231234567890154',
                'gender_id' => 1, // ID do género
                'is_company' => true, // Pode ser alterado para `false` se quiseres simular individual
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        Company::create([
            'vendor_id' => 1, // Relacionado ao ID do vendedor
            'name' => 'Gaspar Ramos',
            'nif' => '530475035',
            'founded_at' => '2011-01-23',
            'sector' => 'enim',
            'description' => 'Descrição personalizada ou fictícia',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        CompanyContact::create([
            'company_id' => 1, // ID da empresa associada
            'phone' => '931883380',
            'email' => 'campos.matheus@example.org',
            'website' => 'http://martins.eu/eius-reprehenderit-voluptate',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        CompanyAddress::create([
            'company_id' => 1, // ID da empresa associada
            'street' => 'Rua Principal',
            'number' => '123',
            'postal_code' => '2845-210',
            'district' => 'Seixal',
            'country' => 'Portugal',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

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

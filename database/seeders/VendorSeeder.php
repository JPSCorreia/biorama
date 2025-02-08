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
        // Criar ou buscar o User com ID 1
        $user = User::where('id', 1)->first();

        // Criar um Vendor para esse User apenas se ainda não existir
        $vendor = Vendor::firstOrCreate(
            ['user_id' => $user->id], // Condição para evitar duplicação
            [
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
            ]
        );

        // Criar uma empresa associada ao Vendor apenas se não existir
        if (!$vendor->company) {
            $company = Company::create([
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
                'company_id' => $company->id,
                'phone' => '931883380',
                'email' => 'campos.matheus@example.org',
                'website' => 'http://martins.eu/eius-reprehenderit-voluptate',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            CompanyAddress::create([
                'company_id' => $company->id,
                'street' => 'Rua Principal',
                'number' => '123',
                'postal_code' => '2845-210',
                'district' => 'Seixal',
                'country' => 'Portugal',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $images = [
            'storage/mock_images/users/user_1.png',
            'storage/mock_images/users/user_2.png',
            'storage/mock_images/users/user_3.png'
        ];

        // Criar 10 novos Users e associar Vendors a cada um
        User::factory(10)->create()->each(function ($user) use ($images) {
            // Atualizar a image_profile para garantir que tem um valor
            $user->update([
                'image_profile' => url($images[array_rand($images)]), // Atribui uma imagem aleatória
            ]);

            // Criar o Vendor associado a este User
            $vendor = Vendor::factory()->create(['user_id' => $user->id]);

            // Criar a empresa associada ao Vendor
            Company::factory()->create(['vendor_id' => $vendor->id]);

            // Criar 5 reviews associadas ao Vendor
            VendorReview::factory()->count(5)->create(['vendor_id' => $vendor->id]);
        });
    }
}

<?php

namespace Database\Seeders;

use App\Models\Company;
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
        $user = User::find(1);

        if ($user) {
            // Criar um vendor associado ao User com id 1
            Vendor::create([
                'user_id' => $user->id, // ID do utilizador associado
                'first_name' => 'Vladimiro', // Nome personalizado ou podes usar fake data
                'last_name' => 'Bonaparte',
                'email' => 'vladimiro@example.com',
                'nif'=> '239502051',
                'phone' => '912345678',
                'date_of_birth' => '1990-01-01',
                'image_profile' => null, // Sem foto
                'iban' => 'PT50000201231234567890154',
                'gender_id' => 1, // ID do género
                'is_company' => false, // Pode ser alterado para `false` se quiseres simular individual
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->command->info('Vendor criado com sucesso para o user com id 1.');
        } else {
            $this->command->error('Nenhum utilizador com id 1 encontrado.');
        }

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

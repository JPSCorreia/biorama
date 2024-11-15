<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HomeAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('home_addresses')->insert([
            [
                'street_name' => 'Rua das Palmeiras',
                'number' => '1',
                'address_name' => 'Casa Principal',
                'city' => 'Lisboa',
                'zip_code' => '1000-001',
                'comment' => 'Residência principal com acesso ao jardim.',
                'user_id' => 1,
            ],
            [
                'street_name' => 'Avenida da Liberdade',
                'number' => '2',
                'address_name' => 'Apartamento 101',
                'city' => 'Porto',
                'zip_code' => '4000-002',
                'comment' => 'Apartamento com vista para o parque.',
                'user_id' => 2,
            ],
            [
                'street_name' => 'Travessa do Sol',
                'number' => '3',
                'address_name' => 'Casa de Férias',
                'city' => 'Faro',
                'zip_code' => '8000-003',
                'comment' => 'Casa de férias perto da praia.',
                'user_id' => 3,
            ],
            [
                'street_name' => 'Largo das Oliveiras',
                'number' => '4',
                'address_name' => 'Casa dos Pais',
                'city' => 'Coimbra',
                'zip_code' => '3000-004',
                'comment' => 'Residência dos pais, perto do centro.',
                'user_id' => 2,
            ],
            [
                'street_name' => 'Estrada da Serra',
                'number' => '5',
                'address_name' => 'Casa de Campo',
                'city' => 'Braga',
                'zip_code' => '4700-005',
                'comment' => 'Casa de campo com terreno grande.',
                'user_id' => 1,
            ],
        ]);
    }
}

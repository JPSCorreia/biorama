<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('stores')->insert([
            [
                'address' => 'Rua Verde 123',
                'city' => 'Lisboa',
                'coordinates' => DB::raw("ST_GeomFromText('POINT(-9.142685 38.736946)', 4326)"),
                'email' => 'lisboa@biofresh.pt',
                'name' => 'Loja BioFresh Lisboa',
                'phone_number' => '912345678',
                'vendor_id' => 1,
                'zip_code' => '1000-001',
            ],
            [
                'address' => 'Avenida das Árvores 456',
                'city' => 'Porto',
                'coordinates' => DB::raw("ST_GeomFromText('POINT(-8.611 41.1496)', 4326)"),
                'email' => 'porto@greenvalley.com',
                'name' => 'Green Valley Porto',
                'phone_number' => '923456789',
                'vendor_id' => 2,
                'zip_code' => '4000-002',
            ],
            [
                'address' => 'Estrada Ecológica 789',
                'city' => 'Faro',
                'coordinates' => DB::raw("ST_GeomFromText('POINT(-7.932229 37.017972)', 4326)"),
                'email' => 'faro@sustainablegoods.com',
                'name' => 'Sustainable Goods Faro',
                'phone_number' => '934567890',
                'vendor_id' => 3,
                'zip_code' => '8000-003',
            ],
        ]);
    }
}

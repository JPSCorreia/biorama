<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'Tomate Cherry Orgânico',
                'is_unit' => false,
            ],
            [
                'name' => 'Leite de Vaca Fresco',
                'is_unit' => true,
            ],
            [
                'name' => 'Feijão Preto Orgânico',
                'is_unit' => false,
            ],
            [
                'name' => 'Shampoo Biodegradável',
                'is_unit' => true,
            ],
            [
                'name' => 'Óleo de Coco Virgem',
                'is_unit' => true,
            ],
        ]);

    }
}

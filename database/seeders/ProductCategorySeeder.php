<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('product_categories')->insert([
            ['product_id' => 1, 'category_id' => 1], // Tomate Cherry Orgânico - Frutas e Vegetais
            ['product_id' => 2, 'category_id' => 2], // Leite de Vaca Fresco - Laticínios e Ovos
            ['product_id' => 3, 'category_id' => 3], // Feijão Preto Orgânico - Cereais e Leguminosas
            ['product_id' => 4, 'category_id' => 4], // Shampoo Biodegradável - Produtos de Higiene
            ['product_id' => 5, 'category_id' => 5], // Óleo de Coco Virgem - Óleos e Temperos
        ]);
    }
}

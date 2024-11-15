<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StoreProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('store_products')->insert([
            [
                'store_id' => 1, // Loja BioFresh Lisboa
                'product_id' => 1, // Tomate Cherry Orgânico
                'price' => 3.60,
                'stock' => 100,
                'description' => 'Tomates cereja frescos e suculentos, cultivados organicamente sem pesticidas.',
            ],
            [
                'store_id' => 1,
                'product_id' => 3, // Feijão Preto Orgânico
                'price' => 2.90,
                'stock' => 150,
                'description' => 'Feijão preto de alta qualidade, ideal para refeições saudáveis e nutritivas.',
            ],
            [
                'store_id' => 2, // Green Valley Porto
                'product_id' => 2, // Leite de Vaca Fresco
                'price' => 1.25,
                'stock' => 200,
                'description' => 'Leite fresco, proveniente de vacas de pastagem livre em quintas sustentáveis.',
            ],
            [
                'store_id' => 2,
                'product_id' => 5, // Óleo de Coco Virgem
                'price' => 8.50,
                'stock' => 80,
                'description' => 'Óleo de coco 100% natural, ideal para cozinhar e cuidados pessoais.',
            ],
            [
                'store_id' => 3, // Sustainable Goods Faro
                'product_id' => 4, // Shampoo Biodegradável
                'price' => 5.20,
                'stock' => 60,
                'description' => 'Shampoo ecológico feito com ingredientes biodegradáveis e sem químicos nocivos.',
            ],
            [
                'store_id' => 3,
                'product_id' => 1, // Tomate Cherry Orgânico
                'price' => 3.70,
                'stock' => 90,
                'description' => 'Tomates cereja frescos e suculentos, cultivados organicamente sem pesticidas.',
            ],
        ]);
    }
}

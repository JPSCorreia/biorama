<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderStoreProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('order_store_products')->insert([
            [
                'order_id' => 1, // Associado à primeira encomenda
                'store_product_id' => 1, // Exemplo: Tomate Cherry Orgânico
                'quantity' => 3,
                'price' => 3.50, // Preço unitário
            ],
            [
                'order_id' => 1,
                'store_product_id' => 3, // Exemplo: Feijão Preto Orgânico
                'quantity' => 2,
                'price' => 2.80,
            ],
            [
                'order_id' => 2,
                'store_product_id' => 2, // Exemplo: Leite de Vaca Fresco
                'quantity' => 10,
                'price' => 1.20,
            ],
            [
                'order_id' => 3,
                'store_product_id' => 5, // Exemplo: Óleo de Coco Virgem
                'quantity' => 1,
                'price' => 8.00,
            ],
            [
                'order_id' => 4,
                'store_product_id' => 4, // Exemplo: Shampoo Biodegradável
                'quantity' => 2,
                'price' => 5.00,
            ],
            [
                'order_id' => 4,
                'store_product_id' => 1, // Exemplo: Tomate Cherry Orgânico
                'quantity' => 5,
                'price' => 3.50,
            ],
            [
                'order_id' => 5,
                'store_product_id' => 2, // Exemplo: Leite de Vaca Fresco
                'quantity' => 3,
                'price' => 1.20,
            ],
        ]);
    }
}

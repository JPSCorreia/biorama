<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('orders')->insert([
            [
                'user_id' => 1, // ID do utilizador que fez a encomenda
                'store_id' => 1, // ID da loja onde a encomenda foi feita
                'home_address_id' => 1, // Associado a uma das moradas da tabela home_addresses
                'order_status_id' => 1, // Pendente
                'total_price' => 45.30,
            ],
            [
                'user_id' => 2,
                'store_id' => 2,
                'home_address_id' => 2,
                'order_status_id' => 2, // Confirmado
                'total_price' => 72.50,
            ],
            [
                'user_id' => 3,
                'store_id' => 3,
                'home_address_id' => 3,
                'order_status_id' => 3, // Enviado
                'total_price' => 30.00,
            ],
            [
                'user_id' => 2,
                'store_id' => 1,
                'home_address_id' => 4,
                'order_status_id' => 4, // Entregue
                'total_price' => 88.20,
            ],
            [
                'user_id' => 1,
                'store_id' => 2,
                'home_address_id' => 5,
                'order_status_id' => 5, // Cancelado
                'total_price' => 25.40,
            ],
        ]);
    }
}

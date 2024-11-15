<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StoreReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('store_reviews')->insert([
            [
                'store_id' => 1, // Loja BioFresh Lisboa
                'user_id' => 1, // ID do utilizador que fez a avaliação
                'rating' => 5,
                'comment' => 'Ótima variedade de produtos biológicos e preços acessíveis.',
            ],
            [
                'store_id' => 2, // Green Valley Porto
                'user_id' => 2,
                'rating' => 4,
                'comment' => 'Ambiente acolhedor e produtos de qualidade, mas o estacionamento é limitado.',
            ],
            [
                'store_id' => 3, // Sustainable Goods Faro
                'user_id' => 3,
                'rating' => 5,
                'comment' => 'A melhor loja de produtos sustentáveis da região!',
            ],
            [
                'store_id' => 1,
                'user_id' => 2,
                'rating' => 3,
                'comment' => 'Alguns produtos estavam fora de stock, mas o atendimento foi bom.',
            ],
        ]);
    }
}

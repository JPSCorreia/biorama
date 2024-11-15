<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VendorReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('vendor_reviews')->insert([
            [
                'user_id' => 1, // ID do utilizador que fez a avaliação
                'vendor_id' => 1,
                'rating' => 5,
                'comment' => 'Excelente fornecedor, produtos sempre frescos e de qualidade!',
            ],
            [
                'user_id' => 2,
                'vendor_id' => 2,
                'rating' => 4,
                'comment' => 'Produtos de ótima qualidade, mas o atendimento poderia melhorar.',
            ],
            [
                'user_id' => 3,
                'vendor_id' => 3,
                'rating' => 5,
                'comment' => 'Fornecimento impecável e compromisso com a sustentabilidade.',
            ],
            [
                'user_id' => 1,
                'vendor_id' => 1,
                'rating' => 3,
                'comment' => 'Algumas entregas atrasaram, mas os produtos são bons.',
            ],
        ]);
    }
}

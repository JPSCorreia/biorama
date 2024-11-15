<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            ['name' => 'Frutas e Vegetais'],
            ['name' => 'Laticínios e Ovos'],
            ['name' => 'Cereais e Leguminosas'],
            ['name' => 'Produtos de Higiene'],
            ['name' => 'Óleos e Temperos'],
        ]);
    }
}

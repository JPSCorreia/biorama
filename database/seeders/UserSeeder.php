<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            ['name' => 'Lucas',
            'last_name' => 'Silvestre',
            'email' => 'lucas@biorama.pt',
            'password' => ('123456789'),
            ],

            ['name' => 'Vladimiro',
            'last_name' => 'Bonaparte',
            'email' => 'vladimiro@biorama.pt',
            'password' => ('123456789'),
            ],

            ['name' => 'João',
            'last_name' => 'Correia',
            'email' => 'joao@biorama.pt',
            'password' => ('123456789')
            ],
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('vendors')->insert([
            [
                'user_id' => 1,
                'nif' => '123456789', // NIF único do fornecedor
            ],
            [
                'user_id' => 2,
                'nif' => '987654321',
            ],
            [
                'user_id' => 3,
                'nif' => '192837465',
            ],
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        User::all()->each(function ($user) {
            // Para cada utilizador, cria 5 ordens
            Order::factory(5)->create([
                'user_id' => $user->id,
            ]);
        });
    }

}

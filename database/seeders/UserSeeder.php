<?php

namespace Database\Seeders;

use App\Models\HomeAddress;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        User::create([
            'id' => 1, // ID manualmente atribuído
            'first_name' => 'Vladimiro', // Nome personalizado ou podes usar fake data
            'last_name' => 'Bonaparte',
            'email' => 'vladimiro@example.com',
            'password' => Hash::make('123456789'), // Cria uma hash segura
            'phone' => '912345678',
            'date_of_birth' => '1990-01-01',
            'photo' => null, // Sem foto
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        User::factory()->count(25)->create();


        foreach (User::all() as $user) {
            if($user->id = 1)
            {
                $user->assignRole('vendor');
            }
            $user->assignRole('user');
            HomeAddress::factory()->create([
                'user_id' => $user->id,
            ]);
        }
    }

}

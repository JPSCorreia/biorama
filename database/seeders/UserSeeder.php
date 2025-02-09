<?php

namespace Database\Seeders;

use App\Models\HomeAddress;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();
        $createdAt = $faker->dateTimeBetween('-6 years', 'now');
        $images = [
            'storage/mock_images/users/user_1.png',
            'storage/mock_images/users/user_2.png',
            'storage/mock_images/users/user_3.png'
        ];

        User::create([
            'id' => 1, // ID manualmente atribuído
            'first_name' => 'Vladimiro', // Nome personalizado
            'last_name' => 'Bonaparte',
            'email' => 'vladimiro@example.com',
            'email_verified_at' => $createdAt,
            'nif'=> '239502051',
            'phone' => '912345678',
            'date_of_birth' => '1990-01-01',
            'image_profile' => url('storage/mock_images/users/user_1.png'),
            'remember_token' => Str::random(10),
            'iban' => 'PT50000201231234567890154',
            'gender_id' => 1, // ID do género
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
            'password' => Hash::make('123456789'), // Cria uma hash segura
        ]);

        User::create([
            'id' => 2, // ID manualmente atribuído
            'first_name' => 'Lucas', // Nome personalizado
            'last_name' => 'Silvestre',
            'email' => 'lucassilvestre4@gmail.com',
            'email_verified_at' => $createdAt,
            'nif'=> '239502051',
            'phone' => '912345678',
            'date_of_birth' => '1990-01-01',
            'image_profile' => url('storage/mock_images/users/user_1.png'),
            'remember_token' => Str::random(10),
            'iban' => 'PT50000201231234567890154',
            'gender_id' => 1, // ID do género
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
            'password' => Hash::make('123456789'), // Cria uma hash segura
        ]);

        // Utilizador personalizado João Correia
        User::create([
            'id' => 3, // ID manualmente atribuído
            'first_name' => 'João',
            'last_name' => 'Correia',
            'email' => 'jpscorreia@example.com',
            'email_verified_at' => $createdAt,
            'nif'=> '239502052',
            'phone' => '912345679',
            'date_of_birth' => '1987-05-20',
            'image_profile' => url('storage/mock_images/users/user_2.png'),
            'remember_token' => Str::random(10),
            'iban' => 'PT50000201231234567890155',
            'gender_id' => 1, // ID do género
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
            'password' => Hash::make('password123'), // Cria uma hash segura
        ]);

        // Criar utilizadores com datas entre 2019 e 2025
        $users = User::factory(25)->create()->each(function ($user) use ($createdAt, $faker, $images) {

            $user->update([
                'image_profile' => url($images[array_rand($images)]),
                'created_at'    => $createdAt,
                'updated_at'    => $createdAt
            ]);

            HomeAddress::factory()->create([
                'user_id'   => $user->id,
                'is_primary'=> true,
                'created_at'=> $createdAt,
                'updated_at'=> $createdAt
            ]);
        });

        // Atribuir roles aos utilizadores
        foreach ($users as $user) {
            if ($user->id % 2 ==! 0) {
                $user->assignRole('vendor');
            }
            $user->assignRole('user');
        }

        foreach (User::all() as $user) {
            if ($user->id === 1) {
                $user->assignRole('vendor');
            }
            $user->assignRole('user');

            HomeAddress::factory()->create([
                'user_id' => $user->id,
                'is_primary' => true, // Garante que o endereço principal seja sempre true (1)
            ]);
        }
    }
}

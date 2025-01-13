<?php

namespace Database\Seeders;

use App\Models\HomeAddress;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        User::factory()->count(25)->create();

        foreach (User::all() as $user) {
            $user->assignRole('user');
            HomeAddress::factory()->create([
                'user_id' => $user->id,
            ]);
        }
    }

}

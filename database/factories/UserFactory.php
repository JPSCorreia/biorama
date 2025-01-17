<?php

namespace Database\Factories;

use App\Models\Gender;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'nif' => $this->faker->unique()->numerify('#########'),
            'gender_id' => Gender::all()->random()->id,
            'password' => Hash::make('password'), // Usar Hash::make
            'phone' => $this->faker->phoneNumber(),
            'date_of_birth' => $this->faker->date(),
            'image_profile' => null,
            'iban' => $this->faker->iban('PT'),
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

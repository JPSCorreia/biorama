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
            'email_verified_at' => now(),
            'nif' => $this->faker->unique()->numerify('#########'),
            'phone' => $this->faker->phoneNumber(),
            'date_of_birth' => $this->faker->date(),
            'image_profile' => null,
            'iban' => $this->faker->iban('PT'),
            'password' => Hash::make('password'),
            'gender_id' => Gender::all()->random()->id,
            'remember_token' => Str::random(10),
            'created_at' => $this->faker->dateTimeBetween('2023-01-01', '2025-02-09'),
            'updated_at' => $this->faker->dateTimeBetween('2023-01-01', '2025-02-09'),
        ];
    }
}

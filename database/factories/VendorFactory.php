<?php

namespace Database\Factories;

use App\Models\Gender;
use App\Models\Vendor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendorFactory extends Factory
{
    protected $model = Vendor::class;

    public function definition()
    {
        $user_id = User::all()->random()->id;
        $is_company = $this->faker->boolean;
        return [
            'user_id' => $user_id,
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'nif' => $this->faker->unique()->numerify('#########'),
            'gender_id' => Gender::all()->random()->id,
            'phone' => $this->faker->phoneNumber(),
            'date_of_birth' => $this->faker->date(),
            'image_profile' => null,
            'is_company' => $is_company,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

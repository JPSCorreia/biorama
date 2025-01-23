<?php

namespace Database\Factories;

use App\Models\HomeAddress;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class HomeAddressFactory extends Factory
{
    protected $model = HomeAddress::class;

    public function definition()
    {
        return [
            'address_name' => $this->faker->word(),
            'phone_number' => $this->faker->numerify('#########'),
            'street_address' => $this->faker->streetAddress(),
            'postal_code' => $this->faker->postcode(),
            'number' => $this->faker->buildingNumber(),
            'city' => $this->faker->city(),
            'is_primary' => $this->faker->boolean(),
            'comment' => $this->faker->sentence(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

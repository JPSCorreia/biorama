<?php

namespace Database\Factories;

use App\Models\Vendor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendorFactory extends Factory
{
    protected $model = Vendor::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'nif' => $this->faker->numerify('#########'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

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
        $user_id = User::all()->random()->id;
        $is_company = $this->faker->boolean;
        return [
            'user_id' => $user_id,
            'is_company' => $is_company,

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

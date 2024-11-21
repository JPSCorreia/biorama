<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use App\Models\Store;
use App\Models\HomeAddress;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'store_id' => Store::factory(),
            'home_address_id' => HomeAddress::factory(),
            'total_price' => $this->faker->randomFloat(2, 10, 500),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

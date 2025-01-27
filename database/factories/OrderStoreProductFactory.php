<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\StoreProduct;
use App\Models\OrderStoreProduct;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderStoreProductFactory extends Factory
{
    protected $model = OrderStoreProduct::class;

    public function definition()
    {
        return [
            'order_id' => Order::inRandomOrder()->first()->id,
            'store_id' => Store::inRandomOrder()->first()->id,
            'product_id' => Product::inRandomOrder()->first()->id,
            'price' => $this->faker->randomFloat(2, 1, 100),
            'discount' => $this->faker->randomFloat(2, 0, 0.5),
            'final_price' => $this->faker->randomFloat(2, 1, 100),
            'original_price' => $this->faker->randomFloat(2, 1, 100),
            'discount_value' => $this->faker->randomFloat(2, 0, 0.5),
            'quantity' => $this->faker->numberBetween(1, 10),
            'created_at' => now(),
            'updated_at' => now(),

        ];
    }
}

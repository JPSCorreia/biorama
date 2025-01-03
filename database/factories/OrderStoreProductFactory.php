<?php

namespace Database\Factories;

use App\Models\OrderStoreProduct;
use App\Models\Order;
use App\Models\StoreProduct;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderStoreProductFactory extends Factory
{
    protected $model = OrderStoreProduct::class;

    public function definition()
    {
        $order_id = Order::all()->random()->id; // Random Order ID
        $store_product_id = StoreProduct::all()->random()->id; // Random StoreProduct ID

        return [
            'order_id' => $order_id, // Random Order ID
            'store_product_id' => $store_product_id, // Creates a new StoreProduct and assigns its ID

            'price' => $this->faker->randomFloat(2, 1, 100), // Random price between 1.00 and 100.00
            'discount' => $this->faker->randomFloat(2, 0, 0.5), // Random discount between 0.00 and 0.50
            'quantity' => $this->faker->numberBetween(1, 10), // Random quantity between 1 and 10

            'created_at' => now(), // Current timestamp
            'updated_at' => now(), // Current timestamp
        ];
    }
}

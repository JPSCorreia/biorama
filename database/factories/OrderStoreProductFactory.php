<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\StoreProduct;
use App\Models\OrderStoreProduct;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderStoreProductFactory extends Factory
{
    protected $model = OrderStoreProduct::class;

    public function definition()
    {
        $storeProduct = StoreProduct::inRandomOrder()->first();

        return [
            'order_id' => Order::inRandomOrder()->first()->id,
            'store_id' => $storeProduct->store_id,
            'product_id' => $storeProduct->product_id,
            'price' => $this->faker->randomFloat(2, 1, 100),
            'discount' => $this->faker->randomFloat(2, 0, 0.5),
            'quantity' => $this->faker->numberBetween(1, 10),
        ];
    }
}

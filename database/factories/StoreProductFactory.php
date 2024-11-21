<?php

namespace Database\Factories;

use App\Models\StoreProduct;
use App\Models\Store;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class StoreProductFactory extends Factory
{
    protected $model = StoreProduct::class;

    public function definition()
    {
        $store_id = Store::all()->random()->id;
        $product_id = Product::all()->random()->id;
        return [
            'store_id' => $store_id,
            'product_id' => $product_id,
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 1, 100),
            'discount' => $this->faker->randomFloat(2, 0, 0.5),
            'stock' => $this->faker->numberBetween(0, 100),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

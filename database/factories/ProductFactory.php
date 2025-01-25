<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word(),
            'sold_at_unit' => $this->faker->boolean(),
            'description' => $this->faker->sentence(),
            'stock' => $this->faker->numberBetween(0, 100),
            'price' => $this->faker->randomFloat(2, 1, 1000),
            'discount' => $this->faker->randomFloat(2, 0, 100),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

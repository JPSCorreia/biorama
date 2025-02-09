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
            'name' => null, // O nome será preenchido no Seeder
            'description' => null, // A descrição será preenchida no Seeder
            'price' => 0.00, // Definido no Seeder
            'discount' => 0.00,
            'stock' => 50,
            'created_at' => $this->faker->dateTimeBetween('2023-01-01', '2025-02-09'),
            'updated_at' => $this->faker->dateTimeBetween('2023-01-01', '2025-02-09'),
        ];
    }
}

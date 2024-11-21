<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;
use App\Models\Product;

class CategoryProductFactory extends Factory
{
    public function definition()
    {
        return [
            'category_id' => Category::factory(), // Creates a new Category and assigns its ID
            'product_id' => Product::factory(),  // Creates a new Product and assigns its ID
        ];
    }
}

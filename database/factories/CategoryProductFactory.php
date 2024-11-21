<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;
use App\Models\Product;

class CategoryProductFactory extends Factory
{
    public function definition()
    {
        $category_id = Category::all()->random()->id;
        $product_id = Product::all()->random()->id;
        return [
            'category_id' => $category_id,
            'product_id' => $product_id,
        ];
    }
}

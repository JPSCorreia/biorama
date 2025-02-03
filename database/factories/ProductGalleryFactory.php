<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ProductGallery;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductGallery>
 */
class ProductGalleryFactory extends Factory
{

    protected $model = ProductGallery::class;

    public function definition()
    {
        return [
            'product_id' => Product::factory(),
            'image_link' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

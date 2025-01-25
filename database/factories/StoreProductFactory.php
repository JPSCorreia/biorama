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
        $product_id = Product::all()->random()->id;
        $store_id = Store::all()->random()->id;
        return [
            'store_id' => $store_id,
            'product_id' => $product_id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

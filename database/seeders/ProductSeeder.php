<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductGallery;
use App\Models\Store;
use App\Models\StoreProduct;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Product::factory()->count(100)->create();

        // Associar 10 produtos a cada loja
        $stores = Store::all();
        foreach ($stores as $store) {
            $products = Product::inRandomOrder()->limit(10)->get(); // 10 produtos aleatórios

            foreach ($products as $product) {
                StoreProduct::create([
                    'store_id' => $store->id,
                    'product_id' => $product->id,
                    'stock' => rand(1, 100),
                ]);
                ProductGallery::factory(3)->create([
                    'product_id' => $product->id,
                ]);
            }
        }
    }
}

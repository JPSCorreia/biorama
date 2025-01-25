<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\StoreAddress;
use App\Models\StoreGallery;
use App\Models\StoreProduct;
use App\Models\StoreReview;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Cria 20 lojas
        $stores = Store::factory()->count(20)->create();
        $products = StoreProduct::all();

        foreach ($stores as $store) {
            // Cria 2 endereços para cada loja
            StoreAddress::factory()->count(2)->create([
                'store_id' => $store->id,
            ]);

            // Cria 2 galerias de imagens para cada loja
            StoreGallery::factory()->count(10)->create([
                'store_id' => $store->id,
            ]);

            // Cria 5 reviews para cada loja
            StoreReview::factory()->count(5)->create([
                'store_id' => $store->id,
            ]);
        }

        foreach ($products as $product) {
            StoreProduct::factory()->create([
                'store_id' => $store->id,
                'product_id' => $product->id,
            ]);
        }
    }
}


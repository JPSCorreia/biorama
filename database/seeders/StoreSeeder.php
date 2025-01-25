<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\StoreAddress;
use App\Models\StoreGallery;
use App\Models\StoreProduct;
use App\Models\StoreReview;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {

        $mockImagePath = asset('storage/mock_images/stores/store-1.png'); // Caminho da imagem de teste

        // Cria 20 lojas
        $stores = Store::factory()->count(20)->create();
        $products = StoreProduct::all();

        foreach ($stores as $store) {
            StoreAddress::factory()->create([
                'store_id' => $store->id,
            ]);
            StoreGallery::factory()->count(5)->create([
                'store_id' => $store->id,
                'image_link' => $mockImagePath,
            ]);
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

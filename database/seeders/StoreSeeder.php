<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\StoreAddress;
use App\Models\StoreGallery;
use App\Models\StoreProduct;
use App\Models\StoreReview;
use Illuminate\Database\Seeder;
use App\Models\Product;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $mockImages = [
            'store-1.png',
            'store-2.jpg',
            'store-3.webp',
            'store-4.webp',
            'store-5.jpg',
        ];

        // Cria 20 lojas
        $stores = Store::factory()->count(20)->create();

        $products = Product::all();

        foreach ($stores as $store) {
            StoreAddress::factory()->create([
                'store_id' => $store->id,
            ]);

            // Shuffle the mock images
            $shuffledImages = $mockImages;
            shuffle($shuffledImages);

            // Create 5 gallery images
            foreach (array_slice($shuffledImages, 0, 5) as $image) {
                StoreGallery::factory()->create([
                    'store_id' => $store->id,
                    'image_link' => asset('storage/mock_images/stores/' . $image),
                ]);
            }

            StoreReview::factory()->count(5)->create([
                'store_id' => $store->id,
            ]);

            foreach ($products as $product) {
                StoreProduct::factory()->count(5)->create([
                    'store_id' => $store->id,
                    'product_id' => $product->id,
                ]);
            }
        }


    }
}

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

        $storeNames = [
            'EcoVida Market',
            'Verde Natural',
            'SustentaShop',
            'BioRaiz',
            'EcoEssência',
            'Planeta Verde',
            'Natureza Pura',
            'Raízes Sustentáveis',
            'GreenChoice',
            'EcoSabores',
            'Sementes do Futuro',
            'Terra Viva',
            'BioHarmonia',
            'Verde & Puro',
            'EcoAlternativa',
            'Sustentável.pt',
            'Natureza Essencial',
            'Vida Verde',
            'Orgânico & Local',
            'EcoConsciente',
        ];


        // Cria 20 lojas com os nomes sustentáveis
        $stores = Store::factory()->count(20)->create()->each(function ($store, $index) use ($storeNames) {
            if (isset($storeNames[$index])) {
                $store->update(['name' => $storeNames[$index]]);
            }
        });

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
                StoreProduct::firstOrCreate([
                    'store_id' => $store->id,
                    'product_id' => $product->id,
                ]);
            }

        }


    }
}

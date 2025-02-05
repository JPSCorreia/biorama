<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\StoreAddress;
use App\Models\StoreGallery;
use App\Models\StoreProduct;
use App\Models\StoreReview;
use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

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
            'EcoVida Market', 'Verde Natural', 'SustentaShop', 'BioRaiz', 'EcoEssência',
            'Planeta Verde', 'Natureza Pura', 'Raízes Sustentáveis', 'GreenChoice', 'EcoSabores',
            'Sementes do Futuro', 'Terra Viva', 'BioHarmonia', 'Verde & Puro', 'EcoAlternativa',
            'Sustentável.pt', 'Natureza Essencial', 'Vida Verde', 'Orgânico & Local', 'EcoConsciente',
        ];

        // Lista de endereços nos distritos de Lisboa e Setúbal
        $locations = [
            // Distrito de Lisboa
            ['street' => 'Avenida da Liberdade', 'postal_code' => '1250-140', 'city' => 'Lisboa', 'lat' => 38.7169, 'lng' => -9.1427],
            ['street' => 'Rua Frederico Arouca', 'postal_code' => '2750-355', 'city' => 'Cascais', 'lat' => 38.6979, 'lng' => -9.4221],
            ['street' => 'Avenida dos Descobrimentos', 'postal_code' => '2670-457', 'city' => 'Loures', 'lat' => 38.8307, 'lng' => -9.1689],
            ['street' => 'Rua do Castelo', 'postal_code' => '2710-569', 'city' => 'Sintra', 'lat' => 38.7973, 'lng' => -9.3901],
            ['street' => 'Rua José Elias Garcia', 'postal_code' => '2745-144', 'city' => 'Queluz', 'lat' => 38.7558, 'lng' => -9.2617],
            ['street' => 'Avenida 25 de Abril', 'postal_code' => '2665-206', 'city' => 'Mafra', 'lat' => 38.9387, 'lng' => -9.3273],
            ['street' => 'Rua Dom João V', 'postal_code' => '2735-003', 'city' => 'Agualva-Cacém', 'lat' => 38.7673, 'lng' => -9.2965],
            ['street' => 'Rua da Quinta do Conventinho', 'postal_code' => '2680-164', 'city' => 'Odivelas', 'lat' => 38.7903, 'lng' => -9.1847],
            ['street' => 'Avenida das Acácias', 'postal_code' => '2780-171', 'city' => 'Oeiras', 'lat' => 38.6937, 'lng' => -9.3089],
            ['street' => 'Rua de Porto Salvo', 'postal_code' => '2740-025', 'city' => 'Amadora', 'lat' => 38.7599, 'lng' => -9.2301],

            // Distrito de Setúbal
            ['street' => 'Avenida Luísa Todi', 'postal_code' => '2900-459', 'city' => 'Setúbal', 'lat' => 38.5247, 'lng' => -8.8878],
            ['street' => 'Rua dos Pescadores', 'postal_code' => '2825-887', 'city' => 'Costa da Caparica', 'lat' => 38.6469, 'lng' => -9.2408],
            ['street' => 'Rua Dom Manuel I', 'postal_code' => '2800-205', 'city' => 'Almada', 'lat' => 38.6795, 'lng' => -9.1583],
            ['street' => 'Avenida General Humberto Delgado', 'postal_code' => '2830-145', 'city' => 'Barreiro', 'lat' => 38.6601, 'lng' => -9.0725],
            ['street' => 'Rua das Fontainhas', 'postal_code' => '2855-134', 'city' => 'Seixal', 'lat' => 38.6409, 'lng' => -9.1035],
            ['street' => 'Rua dos Trabalhadores', 'postal_code' => '2970-712', 'city' => 'Sesimbra', 'lat' => 38.4441, 'lng' => -9.1019],
            ['street' => 'Rua dos Bombeiros Voluntários', 'postal_code' => '2955-117', 'city' => 'Pinhal Novo', 'lat' => 38.6344, 'lng' => -8.9136],
            ['street' => 'Avenida da República', 'postal_code' => '2925-101', 'city' => 'Azeitão', 'lat' => 38.5297, 'lng' => -8.9824],
            ['street' => 'Estrada Nacional 379', 'postal_code' => '2890-192', 'city' => 'Montijo', 'lat' => 38.7071, 'lng' => -8.9709],
            ['street' => 'Rua do Moinho Velho', 'postal_code' => '2890-032', 'city' => 'Palmela', 'lat' => 38.5683, 'lng' => -8.9017],
        ];

        // Cria 20 lojas com nomes e endereços
        $stores = Store::factory()->count(20)->create()->each(function ($store, $index) use ($storeNames, $locations) {
            if (isset($storeNames[$index])) {
                $store->update(['name' => $storeNames[$index]]);
            }

            $location = $locations[$index % count($locations)];

            // Criar morada diretamente sem factory
            StoreAddress::create([
                'store_id' => $store->id,
                'street_address' => $location['street'],
                'postal_code' => $location['postal_code'],
                'city' => $location['city'],
                'coordinates' => DB::raw("POINT({$location['lng']}, {$location['lat']})"),
            ]);
        });

        $products = Product::all();

        foreach ($stores as $store) {

            $shuffledImages = $mockImages;
            shuffle($shuffledImages);

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

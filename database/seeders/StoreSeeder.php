<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\StoreAddress;
use App\Models\StoreGallery;
use App\Models\StoreProduct;
use App\Models\StoreReview;
use App\Models\Vendor;
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


        $locations = [
            ['street' => 'Rua Paiva Coelho', 'postal_code' => '2840-499', 'city' => 'Seixal', 'lat' => 38.6401, 'lng' => -9.1014],
            ['street' => 'Avenida 25 de Abril', 'postal_code' => '2845-393', 'city' => 'Amora', 'lat' => 38.6205, 'lng' => -9.1157],
            ['street' => 'Rua da Alembrança', 'postal_code' => '2840-728', 'city' => 'Corroios', 'lat' => 38.6302, 'lng' => -9.1498],
            ['street' => 'Rua Quinta da Lobateira', 'postal_code' => '2840-575', 'city' => 'Fernão Ferro', 'lat' => 38.5632, 'lng' => -9.1267],

            // Almada
            ['street' => 'Avenida Dom Nuno Álvares Pereira', 'postal_code' => '2800-174', 'city' => 'Almada', 'lat' => 38.6802, 'lng' => -9.1585],
            ['street' => 'Rua Capitão Leitão', 'postal_code' => '2800-135', 'city' => 'Almada', 'lat' => 38.6789, 'lng' => -9.1567],
            ['street' => 'Avenida 1º de Maio', 'postal_code' => '2810-079', 'city' => 'Cova da Piedade', 'lat' => 38.6703, 'lng' => -9.1492],
            ['street' => 'Rua de Alvalade', 'postal_code' => '2825-450', 'city' => 'Costa da Caparica', 'lat' => 38.6457, 'lng' => -9.2354],

            // Barreiro
            ['street' => 'Rua Miguel Bombarda', 'postal_code' => '2830-356', 'city' => 'Barreiro', 'lat' => 38.6631, 'lng' => -9.0724],
            ['street' => 'Avenida Alfredo da Silva', 'postal_code' => '2830-302', 'city' => 'Barreiro', 'lat' => 38.6639, 'lng' => -9.0698],
            ['street' => 'Rua Stara Zagora', 'postal_code' => '2830-500', 'city' => 'Lavradio', 'lat' => 38.6765, 'lng' => -9.0562],
            ['street' => 'Rua da Amizade', 'postal_code' => '2835-115', 'city' => 'Baixa da Banheira', 'lat' => 38.6667, 'lng' => -9.0403],

            // Montijo
            ['street' => 'Avenida dos Pescadores', 'postal_code' => '2870-114', 'city' => 'Montijo', 'lat' => 38.7054, 'lng' => -8.9732],
            ['street' => 'Rua Joaquim de Almeida', 'postal_code' => '2870-156', 'city' => 'Montijo', 'lat' => 38.7078, 'lng' => -8.9739],
            ['street' => 'Rua da Bela Vista', 'postal_code' => '2870-500', 'city' => 'Atalaia', 'lat' => 38.7162, 'lng' => -8.9651],
            ['street' => 'Rua da Liberdade', 'postal_code' => '2870-632', 'city' => 'Sarilhos Grandes', 'lat' => 38.7145, 'lng' => -8.9537],

            // Pinhal Novo
            ['street' => 'Avenida da Liberdade', 'postal_code' => '2955-114', 'city' => 'Pinhal Novo', 'lat' => 38.6312, 'lng' => -8.9135],
            ['street' => 'Rua Infante Dom Henrique', 'postal_code' => '2955-212', 'city' => 'Pinhal Novo', 'lat' => 38.6338, 'lng' => -8.9087],
            ['street' => 'Rua do Forno da Cal', 'postal_code' => '2955-028', 'city' => 'Pinhal Novo', 'lat' => 38.6351, 'lng' => -8.9202],

            // Setúbal
            ['street' => 'Avenida Luísa Todi', 'postal_code' => '2900-461', 'city' => 'Setúbal', 'lat' => 38.5247, 'lng' => -8.8890],
            ['street' => 'Praça do Bocage', 'postal_code' => '2900-276', 'city' => 'Setúbal', 'lat' => 38.5244, 'lng' => -8.8901],
            ['street' => 'Rua Álvaro Castelões', 'postal_code' => '2900-229', 'city' => 'Setúbal', 'lat' => 38.5239, 'lng' => -8.8912],
            ['street' => 'Largo da Misericórdia', 'postal_code' => '2900-388', 'city' => 'Setúbal', 'lat' => 38.5235, 'lng' => -8.8905],

            // Lisboa
            ['street' => 'Avenida da Liberdade', 'postal_code' => '1250-140', 'city' => 'Lisboa', 'lat' => 38.7169, 'lng' => -9.1427],
            ['street' => 'Rua Augusta', 'postal_code' => '1100-048', 'city' => 'Lisboa', 'lat' => 38.7103, 'lng' => -9.1356],
            ['street' => 'Rua do Carmo', 'postal_code' => '1200-093', 'city' => 'Lisboa', 'lat' => 38.7115, 'lng' => -9.1395],
            ['street' => 'Praça do Comércio', 'postal_code' => '1100-148', 'city' => 'Lisboa', 'lat' => 38.7077, 'lng' => -9.1366],
            ['street' => 'Rua de Campolide', 'postal_code' => '1070-038', 'city' => 'Lisboa', 'lat' => 38.7289, 'lng' => -9.1638],
            ['street' => 'Avenida Marechal Craveiro Lopes', 'postal_code' => '1700-284', 'city' => 'Lisboa', 'lat' => 38.7662, 'lng' => -9.1251],

            // Oeiras
            ['street' => 'Avenida Marginal', 'postal_code' => '2780-267', 'city' => 'Oeiras', 'lat' => 38.6915, 'lng' => -9.3125],
            ['street' => 'Rua do Espargal', 'postal_code' => '2780-218', 'city' => 'Oeiras', 'lat' => 38.6941, 'lng' => -9.3092],
            ['street' => 'Rua dos Lagares da Quinta', 'postal_code' => '2780-204', 'city' => 'Oeiras', 'lat' => 38.7012, 'lng' => -9.3037],

            // Cascais
            ['street' => 'Avenida 25 de Abril', 'postal_code' => '2750-512', 'city' => 'Cascais', 'lat' => 38.7004, 'lng' => -9.4215],
            ['street' => 'Rua Frederico Arouca', 'postal_code' => '2750-632', 'city' => 'Cascais', 'lat' => 38.6972, 'lng' => -9.4197],
            ['street' => 'Avenida de Sintra', 'postal_code' => '2750-494', 'city' => 'Cascais', 'lat' => 38.7051, 'lng' => -9.4152],

            // Sintra
            ['street' => 'Rua Consiglieri Pedroso', 'postal_code' => '2710-550', 'city' => 'Sintra', 'lat' => 38.7971, 'lng' => -9.3907],
            ['street' => 'Rua das Padarias', 'postal_code' => '2710-602', 'city' => 'Sintra', 'lat' => 38.7962, 'lng' => -9.3918],
            ['street' => 'Estrada Chão de Meninos', 'postal_code' => '2710-196', 'city' => 'Sintra', 'lat' => 38.7910, 'lng' => -9.3865],

            // Loures
            ['street' => 'Rua da República', 'postal_code' => '2670-469', 'city' => 'Loures', 'lat' => 38.8311, 'lng' => -9.1684],
            ['street' => 'Avenida da Liberdade', 'postal_code' => '2670-367', 'city' => 'Loures', 'lat' => 38.8325, 'lng' => -9.1651],
            ['street' => 'Rua de Santo António', 'postal_code' => '2670-387', 'city' => 'Loures', 'lat' => 38.8287, 'lng' => -9.1703],

            // Odivelas
            ['street' => 'Avenida D. Dinis', 'postal_code' => '2675-326', 'city' => 'Odivelas', 'lat' => 38.7956, 'lng' => -9.1827],
            ['street' => 'Rua Pulido Valente', 'postal_code' => '2675-317', 'city' => 'Odivelas', 'lat' => 38.7912, 'lng' => -9.1769],
            ['street' => 'Rua Guilherme Gomes Fernandes', 'postal_code' => '2675-357', 'city' => 'Odivelas', 'lat' => 38.7991, 'lng' => -9.1843],

            // Almada
            ['street' => 'Rua Capitão Leitão', 'postal_code' => '2800-135', 'city' => 'Almada', 'lat' => 38.6789, 'lng' => -9.1567],
            ['street' => 'Avenida Dom Nuno Álvares Pereira', 'postal_code' => '2800-174', 'city' => 'Almada', 'lat' => 38.6802, 'lng' => -9.1585],
            ['street' => 'Avenida 1º de Maio', 'postal_code' => '2810-079', 'city' => 'Cova da Piedade', 'lat' => 38.6703, 'lng' => -9.1492],
            ['street' => 'Rua de Alvalade', 'postal_code' => '2825-450', 'city' => 'Costa da Caparica', 'lat' => 38.6457, 'lng' => -9.2354]
        ];

        $vendors = Vendor::all();
        $storesCreatedPerVendor = [];

// Limitar o número total de lojas a 3 por vendor existente
        $totalStoresToCreate = min(62, $vendors->count() * 3); // Máximo possível de lojas sem ultrapassar o limite de 3 por vendor

// Cria as lojas respeitando o limite de 3 por vendor
        $stores = Store::factory()->count($totalStoresToCreate)->create()->each(function ($store, $index) use ($storeNames, $locations, &$storesCreatedPerVendor, $vendors) {
            // Seleciona um vendor com menos de 3 lojas associadas
            $vendor = $vendors->filter(function ($vendor) use (&$storesCreatedPerVendor) {
                return ($storesCreatedPerVendor[$vendor->id] ?? 0) < 3;
            })->random();

            // Incrementa a contagem de lojas para o vendor selecionado
            $storesCreatedPerVendor[$vendor->id] = ($storesCreatedPerVendor[$vendor->id] ?? 0) + 1;

            // Atribui o vendor_id à loja
            $store->update(['vendor_id' => $vendor->id]);

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

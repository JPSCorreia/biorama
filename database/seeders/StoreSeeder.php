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
            // Distrito de Braga
            ['street' => 'Rua do Souto', 'postal_code' => '4700-329', 'city' => 'Braga', 'lat' => 41.5503, 'lng' => -8.4201],
            ['street' => 'Avenida Central', 'postal_code' => '4710-229', 'city' => 'Braga', 'lat' => 41.5459, 'lng' => -8.4265],
            ['street' => 'Rua de São Marcos', 'postal_code' => '4700-328', 'city' => 'Braga', 'lat' => 41.5507, 'lng' => -8.4213],
            ['street' => 'Largo do Paço', 'postal_code' => '4704-553', 'city' => 'Braga', 'lat' => 41.5502, 'lng' => -8.4271],

            // Distrito do Porto
            ['street' => 'Rua de Santa Catarina', 'postal_code' => '4000-447', 'city' => 'Porto', 'lat' => 41.1496, 'lng' => -8.6109],
            ['street' => 'Avenida dos Aliados', 'postal_code' => '4000-065', 'city' => 'Porto', 'lat' => 41.1489, 'lng' => -8.6102],
            ['street' => 'Rua das Flores', 'postal_code' => '4050-262', 'city' => 'Porto', 'lat' => 41.1446, 'lng' => -8.6147],
            ['street' => 'Praça da Ribeira', 'postal_code' => '4050-513', 'city' => 'Porto', 'lat' => 41.1406, 'lng' => -8.6110],

            // Distrito de Coimbra
            ['street' => 'Rua Ferreira Borges', 'postal_code' => '3000-179', 'city' => 'Coimbra', 'lat' => 40.2109, 'lng' => -8.4295],
            ['street' => 'Praça do Comércio', 'postal_code' => '3000-116', 'city' => 'Coimbra', 'lat' => 40.2101, 'lng' => -8.4287],
            ['street' => 'Largo da Portagem', 'postal_code' => '3000-337', 'city' => 'Coimbra', 'lat' => 40.2086, 'lng' => -8.4281],
            ['street' => 'Rua Visconde da Luz', 'postal_code' => '3000-414', 'city' => 'Coimbra', 'lat' => 40.2105, 'lng' => -8.4290],

            // Distrito de Faro
            ['street' => 'Rua de Santo António', 'postal_code' => '8000-283', 'city' => 'Faro', 'lat' => 37.0194, 'lng' => -7.9304],
            ['street' => 'Praça Dom Francisco Gomes', 'postal_code' => '8000-168', 'city' => 'Faro', 'lat' => 37.0166, 'lng' => -7.9332],
            ['street' => 'Rua Conselheiro Bivar', 'postal_code' => '8000-255', 'city' => 'Faro', 'lat' => 37.0178, 'lng' => -7.9291],
            ['street' => 'Largo da Sé', 'postal_code' => '8000-138', 'city' => 'Faro', 'lat' => 37.0156, 'lng' => -7.9338],

            // Distrito de Évora
            ['street' => 'Praça do Giraldo', 'postal_code' => '7000-508', 'city' => 'Évora', 'lat' => 38.5711, 'lng' => -7.9097],
            ['street' => 'Rua 5 de Outubro', 'postal_code' => '7000-854', 'city' => 'Évora', 'lat' => 38.5705, 'lng' => -7.9089],
            ['street' => 'Largo da Porta de Moura', 'postal_code' => '7000-647', 'city' => 'Évora', 'lat' => 38.5692, 'lng' => -7.9103],
            ['street' => 'Rua de Serpa Pinto', 'postal_code' => '7000-537', 'city' => 'Évora', 'lat' => 38.5714, 'lng' => -7.9085],

            // Distrito de Leiria
            ['street' => 'Rua Direita', 'postal_code' => '2400-174', 'city' => 'Leiria', 'lat' => 39.7436, 'lng' => -8.8070],
            ['street' => 'Largo 5 de Outubro', 'postal_code' => '2400-134', 'city' => 'Leiria', 'lat' => 39.7430, 'lng' => -8.8065],
            ['street' => 'Rua Barão de Viamonte', 'postal_code' => '2400-137', 'city' => 'Leiria', 'lat' => 39.7432, 'lng' => -8.8073],
            ['street' => 'Praça Rodrigues Lobo', 'postal_code' => '2400-217', 'city' => 'Leiria', 'lat' => 39.7435, 'lng' => -8.8068],

            // Distrito de Aveiro
            ['street' => 'Rua João Mendonça', 'postal_code' => '3800-200', 'city' => 'Aveiro', 'lat' => 40.6405, 'lng' => -8.6538],
            ['street' => 'Avenida Dr. Lourenço Peixinho', 'postal_code' => '3800-162', 'city' => 'Aveiro', 'lat' => 40.6412, 'lng' => -8.6536],
            ['street' => 'Rua dos Mercadores', 'postal_code' => '3800-225', 'city' => 'Aveiro', 'lat' => 40.6409, 'lng' => -8.6543],
            ['street' => 'Praça Marquês de Pombal', 'postal_code' => '3800-243', 'city' => 'Aveiro', 'lat' => 40.6415, 'lng' => -8.6530],

            // Distrito de Beja
            ['street' => 'Rua da Liberdade', 'postal_code' => '7800-462', 'city' => 'Beja', 'lat' => 38.0151, 'lng' => -7.8632],
            ['street' => 'Largo do Lidador', 'postal_code' => '7800-427', 'city' => 'Beja', 'lat' => 38.0147, 'lng' => -7.8638],
            ['street' => 'Rua Capitão João Francisco de Sousa', 'postal_code' => '7800-451', 'city' => 'Beja', 'lat' => 38.0154, 'lng' => -7.8641],
            ['street' => 'Praça da República', 'postal_code' => '7800-427', 'city' => 'Beja', 'lat' => 38.0149, 'lng' => -7.8635],

            // Distrito de Guarda
            ['street' => 'Rua do Comércio', 'postal_code' => '6300-659', 'city' => 'Guarda', 'lat' => 40.5373, 'lng' => -7.2683],
            ['street' => 'Praça Luís de Camões', 'postal_code' => '6300-725', 'city' => 'Guarda', 'lat' => 40.5378, 'lng' => -7.2679],
            ['street' => 'Rua Augusto Gil', 'postal_code' => '6300-516', 'city' => 'Guarda', 'lat' => 40.5375, 'lng' => -7.2685],
            ['street' => 'Largo João de Almeida', 'postal_code' => '6300-754', 'city' => 'Guarda', 'lat' => 40.5380, 'lng' => -7.2675],

            // Distrito de Portalegre
            ['street' => 'Rua 19 de Junho', 'postal_code' => '7300-155', 'city' => 'Portalegre', 'lat' => 39.2939, 'lng' => -7.4312],
            ['street' => 'Praça da República', 'postal_code' => '7300-126', 'city' => 'Portalegre', 'lat' => 39.2945, 'lng' => -7.4298],
            ['street' => 'Rua do Comércio', 'postal_code' => '7300-130', 'city' => 'Portalegre', 'lat' => 39.2942, 'lng' => -7.4305],
            ['street' => 'Largo Serpa Pinto', 'postal_code' => '7300-101', 'city' => 'Portalegre', 'lat' => 39.2948, 'lng' => -7.4292],

            // Distrito de Viana do Castelo
            ['street' => 'Rua Manuel Espregueira', 'postal_code' => '4900-318', 'city' => 'Viana do Castelo', 'lat' => 41.6932, 'lng' => -8.8329],
            ['street' => 'Praça da República', 'postal_code' => '4900-520', 'city' => 'Viana do Castelo', 'lat' => 41.6938, 'lng' => -8.8325],
            ['street' => 'Rua Grande', 'postal_code' => '4900-542', 'city' => 'Viana do Castelo', 'lat' => 41.6935, 'lng' => -8.8332],
            ['street' => 'Largo de São Domingos', 'postal_code' => '4900-330', 'city' => 'Viana do Castelo', 'lat' => 41.6940, 'lng' => -8.8320],

            // Distrito de Vila Real
            ['street' => 'Avenida Carvalho Araújo', 'postal_code' => '5000-657', 'city' => 'Vila Real', 'lat' => 41.3006, 'lng' => -7.7441],
            ['street' => 'Rua Direita', 'postal_code' => '5000-634', 'city' => 'Vila Real', 'lat' => 41.3009, 'lng' => -7.7447],
            ['street' => 'Praça Luís de Camões', 'postal_code' => '5000-651', 'city' => 'Vila Real', 'lat' => 41.3012, 'lng' => -7.7443],
            ['street' => 'Rua António de Azevedo', 'postal_code' => '5000-670', 'city' => 'Vila Real', 'lat' => 41.3003, 'lng' => -7.7439],

            // Distrito de Lisboa
            ['street' => 'Avenida da Liberdade', 'postal_code' => '1250-140', 'city' => 'Lisboa', 'lat' => 38.7169, 'lng' => -9.1427],
            ['street' => 'Rua Augusta', 'postal_code' => '1100-048', 'city' => 'Lisboa', 'lat' => 38.7103, 'lng' => -9.1356],
            ['street' => 'Rua do Carmo', 'postal_code' => '1200-093', 'city' => 'Lisboa', 'lat' => 38.7115, 'lng' => -9.1395],
            ['street' => 'Praça do Comércio', 'postal_code' => '1100-148', 'city' => 'Lisboa', 'lat' => 38.7077, 'lng' => -9.1366],

            // Distrito de Castelo Branco
            ['street' => 'Avenida Nuno Álvares', 'postal_code' => '6000-083', 'city' => 'Castelo Branco', 'lat' => 39.8197, 'lng' => -7.4928],
            ['street' => 'Rua de São Sebastião', 'postal_code' => '6000-153', 'city' => 'Castelo Branco', 'lat' => 39.8202, 'lng' => -7.4939],
            ['street' => 'Rua Bartolomeu da Costa', 'postal_code' => '6000-080', 'city' => 'Castelo Branco', 'lat' => 39.8215, 'lng' => -7.4915],
            ['street' => 'Praça Camões', 'postal_code' => '6000-156', 'city' => 'Castelo Branco', 'lat' => 39.8211, 'lng' => -7.4942],

            // Distrito de Santarém
            ['street' => 'Rua Serpa Pinto', 'postal_code' => '2000-046', 'city' => 'Santarém', 'lat' => 39.2362, 'lng' => -8.6867],
            ['street' => 'Largo do Seminário', 'postal_code' => '2000-063', 'city' => 'Santarém', 'lat' => 39.2368, 'lng' => -8.6859],
            ['street' => 'Rua Capelo e Ivens', 'postal_code' => '2000-094', 'city' => 'Santarém', 'lat' => 39.2357, 'lng' => -8.6873],
            ['street' => 'Praça Sá da Bandeira', 'postal_code' => '2000-135', 'city' => 'Santarém', 'lat' => 39.2351, 'lng' => -8.6861],

            // Distrito de Setúbal
            ['street' => 'Avenida Luísa Todi', 'postal_code' => '2900-461', 'city' => 'Setúbal', 'lat' => 38.5247, 'lng' => -8.8890],
            ['street' => 'Praça do Bocage', 'postal_code' => '2900-276', 'city' => 'Setúbal', 'lat' => 38.5244, 'lng' => -8.8901],
            ['street' => 'Rua Álvaro Castelões', 'postal_code' => '2900-229', 'city' => 'Setúbal', 'lat' => 38.5239, 'lng' => -8.8912],
            ['street' => 'Largo da Misericórdia', 'postal_code' => '2900-388', 'city' => 'Setúbal', 'lat' => 38.5235, 'lng' => -8.8905],
        ];

        // Cria 20 lojas com nomes e endereços
        $stores = Store::factory()->count(62)->create()->each(function ($store, $index) use ($storeNames, $locations) {
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

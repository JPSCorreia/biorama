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
        // Lista de 20 produtos fixos
        $products = [
            ['name' => 'Maçã Royal Gala', 'price' => 2.49, 'sold_at_unit' => false],
            ['name' => 'Laranja do Algarve', 'price' => 1.99, 'sold_at_unit' => false],
            ['name' => 'Abacate Hass', 'price' => 2.29, 'sold_at_unit' => true],
            ['name' => 'Cenoura biológica', 'price' => 1.79, 'sold_at_unit' => false],
            ['name' => 'Batata-doce roxa', 'price' => 2.29, 'sold_at_unit' => false],
            ['name' => 'Cogumelos Shiitake frescos', 'price' => 3.99, 'sold_at_unit' => false],
            ['name' => 'Espinafres frescos', 'price' => 1.49, 'sold_at_unit' => true],
            ['name' => 'Cebola roxa', 'price' => 1.69, 'sold_at_unit' => false],
            ['name' => 'Alho biológico', 'price' => 0.89, 'sold_at_unit' => true],
            ['name' => 'Amêndoa com casca', 'price' => 9.99, 'sold_at_unit' => false],
            ['name' => 'Noz portuguesa', 'price' => 12.49, 'sold_at_unit' => false],
            ['name' => 'Caju natural', 'price' => 16.99, 'sold_at_unit' => false],
            ['name' => 'Grão-de-bico seco', 'price' => 2.99, 'sold_at_unit' => false],
            ['name' => 'Arroz basmati biológico', 'price' => 4.99, 'sold_at_unit' => false],
            ['name' => 'Azeite extra virgem biológico 500ml', 'price' => 6.99, 'sold_at_unit' => true],
            ['name' => 'Óleo de coco virgem 250ml', 'price' => 5.99, 'sold_at_unit' => true],
            ['name' => 'Mel biológico de rosmaninho 500g', 'price' => 7.99, 'sold_at_unit' => true],
            ['name' => 'Leite de amêndoa sem açúcar 1L', 'price' => 2.49, 'sold_at_unit' => true],
            ['name' => 'Chocolate negro 85% cacau 100g', 'price' => 2.99, 'sold_at_unit' => true],
            ['name' => 'Café moído biológico 250g', 'price' => 5.99, 'sold_at_unit' => true],
        ];

        // Opções de desconto possíveis (0 é mais comum)
        $discountOptions = [
            0, 0, 0, 0, 0, 10, 20, 30, 40, 50, 60, 70
        ];

        // Criar os produtos na base de dados
        foreach ($products as $productData) {
            Product::create([
                'name' => $productData['name'],
                'description' => 'Produto sustentável e biológico.',
                'sold_at_unit' => $productData['sold_at_unit'],
                'price' => $productData['price'],
                'discount' => collect($discountOptions)->random(), // Escolhe um desconto aleatório
                'stock' => 50,
            ]);
        }

        // Associar produtos às lojas
        $stores = Store::all();
        foreach ($stores as $store) {
            $products = Product::all(); // Todos os 20 produtos fixos

            foreach ($products as $product) {
                StoreProduct::create([
                    'store_id' => $store->id,
                    'product_id' => $product->id,
                ]);

                // Criar 3 imagens para cada produto
                ProductGallery::factory(3)->create([
                    'product_id' => $product->id,
                ]);
            }
        }
    }
}

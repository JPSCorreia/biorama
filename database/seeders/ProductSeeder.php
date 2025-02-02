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
            ['name' => 'Maçã Royal Gala', 'price' => 2.49],
            ['name' => 'Laranja do Algarve', 'price' => 1.99],
            ['name' => 'Abacate Hass', 'price' => 2.29],
            ['name' => 'Cenoura biológica', 'price' => 1.79],
            ['name' => 'Batata-doce roxa', 'price' => 2.29],
            ['name' => 'Cogumelos Shiitake', 'price' => 3.99],
            ['name' => 'Espinafres', 'price' => 1.49],
            ['name' => 'Cebola roxa', 'price' => 1.69],
            ['name' => 'Alho biológico', 'price' => 0.89],
            ['name' => 'Amêndoa com casca', 'price' => 9.99],
            ['name' => 'Noz portuguesa', 'price' => 12.49],
            ['name' => 'Caju natural', 'price' => 16.99],
            ['name' => 'Grão-de-bico', 'price' => 2.99],
            ['name' => 'Arroz basmati', 'price' => 4.99],
            ['name' => 'Azeite de oliva', 'price' => 6.99],
            ['name' => 'Óleo de coco', 'price' => 5.99],
            ['name' => 'Mel biológico', 'price' => 7.99],
            ['name' => 'Leite de amêndoa', 'price' => 2.49],
            ['name' => 'Chocolate negro', 'price' => 2.99],
            ['name' => 'Café moído biológico', 'price' => 5.99],
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

<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductGallery;
use App\Models\Store;
use App\Models\StoreProduct;
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

            ['name' => 'Cenoura biológica', 'price' => 1.79, 'description' => "**1kg por unidade**\n\nCenouras crocantes e naturalmente doces, ótimas para sopas e acompanhamentos."],
            ['name' => 'Cogumelos Shiitake', 'price' => 3.99, 'description' => "**250g por unidade**\n\nSabor intenso e textura carnuda, ideais para refogados e pratos asiáticos."],
            ['name' => 'Espinafres', 'price' => 1.49, 'description' => "**200g por unidade**\n\nFolhas frescas e ricas em ferro, ótimas para saladas ou salteados."],
            ['name' => 'Alho biológico', 'price' => 0.89, 'description' => "**100g por unidade**\n\nAromático e essencial para temperos naturais e pratos tradicionais."],
            ['name' => 'Amêndoa com casca', 'price' => 9.99, 'description' => "**500g por unidade**\n\nRica em proteínas e gorduras saudáveis, perfeita para snacks ou confeitaria."],
            ['name' => 'Noz portuguesa', 'price' => 12.49, 'description' => "**500g por unidade**\n\nFonte de ómega-3 e antioxidantes, excelente para snacks e saladas."],
            ['name' => 'Caju natural', 'price' => 16.99, 'description' => "**500g por unidade**\n\nTextura crocante e sabor amanteigado, ideal para petiscos e culinária asiática."],
            ['name' => 'Grão-de-bico', 'price' => 2.99, 'description' => "**1kg por unidade**\n\nVersátil e nutritivo, perfeito para hummus, saladas e guisados."],
            ['name' => 'Arroz basmati', 'price' => 4.99, 'description' => "**1kg por unidade**\n\nAromático e de grãos soltos, ideal para pratos indianos e asiáticos."],
            ['name' => 'Azeite de oliva', 'price' => 6.99, 'description' => "**500ml por unidade**\n\nAzeite virgem extra prensado a frio, ideal para temperos e cozinhar."],
            ['name' => 'Óleo de coco', 'price' => 5.99, 'description' => "**250ml por unidade**\n\nPuro e versátil, ótimo para culinária saudável e cuidados de pele."],
            ['name' => 'Mel biológico', 'price' => 7.99, 'description' => "**500g por unidade**\n\nPuro e sem aditivos, perfeito para adoçar infusões e receitas."],
            ['name' => 'Leite de amêndoa', 'price' => 2.49, 'description' => "**1L por unidade**\n\nSem açúcares adicionados, uma alternativa vegetal ao leite tradicional."],
            ['name' => 'Chocolate negro', 'price' => 2.99, 'description' => "**100g por unidade**\n\n85% cacau, intenso e sem açúcar refinado, ideal para apreciadores de chocolate puro."],
            ['name' => 'Café moído biológico', 'price' => 5.99, 'description' => "**250g por unidade**\n\nCafé de torrefação artesanal, com aroma encorpado e sabor equilibrado."],
            ['name' => 'Maçã Royal Gala', 'price' => 2.49, 'description' => "**1kg por unidade**\n\nMaçãs doces e crocantes, ideais para snacks ou sumos naturais."],
            ['name' => 'Laranja do Algarve', 'price' => 1.99, 'description' => "**1kg por unidade**\n\nLaranjas sumarentas e ricas em vitamina C, perfeitas para sumos frescos."],
            ['name' => 'Abacate Hass', 'price' => 2.29, 'description' => "**250g por unidade**\n\nAbacate cremoso e nutritivo, ideal para saladas, tostas ou guacamole."],
            ['name' => 'Batata-doce roxa', 'price' => 2.29, 'description' => "**1kg por unidade**\n\nRica em antioxidantes e de sabor adocicado, excelente para purés e assados."],
            ['name' => 'Cebola roxa', 'price' => 1.69, 'description' => "**1kg por unidade**\n\nDoce e ligeiramente picante, ideal para saladas e pratos grelhados."],
        ];


        // Lista dos nomes das imagens, garantindo correspondência com os produtos
        $imageFiles = [
            'product-1.webp',
            'product-2.jpg',
            'product-3.jpg',
            'product-4.webp',
            'product-5.jpg',
            'product-6.jpg',
            'product-7.png',
            'product-8.jpg',
            'product-9.jpg',
            'product-10.webp',
            'product-11.webp',
            'product-12.jpg',
            'product-13.jpg',
            'product-14.webp',
            'product-15.avif',
            'product-16.png',
            'product-17.jpg',
            'product-18.webp',
            'product-19.jpg',
            'product-20.jpg',
        ];

        // Opções de desconto possíveis (0 é mais comum)
        $discountOptions = [
            0, 0, 0, 0, 0, 10, 20, 30, 40, 50, 60, 70
        ];

        // Criar os produtos na base de dados e associar imagens
        foreach ($products as $index => $productData) {
            $product = Product::create([
                'name' => $productData['name'],
                'description' => $productData['description'],
                'price' => $productData['price'],
                'discount' => collect($discountOptions)->random(), // Escolhe um desconto aleatório
                'stock' => 50,
            ]);

            // Associar imagem correta ao produto
            if (isset($imageFiles[$index])) {
                ProductGallery::create([
                    'product_id' => $product->id,
                    'image_link' => asset('storage/mock_images/products/' . $imageFiles[$index]),
                ]);
            }
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
            }
        }
    }
}

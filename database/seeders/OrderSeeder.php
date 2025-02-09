<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Vendor;
use App\Models\Store;
use App\Models\OrderStoreProduct;
use App\Models\Product;
use Faker\Factory as Faker;

class OrderSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();
        $vendors = Vendor::with('stores.products')->get(); // Carrega Vendors com lojas e produtos

        foreach ($vendors as $vendor) {
            for ($i = 0; $i < 25; $i++) { // Criar 10 encomendas por Vendor

                // Garantir que o Vendor tem lojas
                if ($vendor->stores->isEmpty()) {
                    continue;
                }

                // Selecionar uma loja aleatória do Vendor
                $stores = $vendor->stores->all();

                foreach ($stores as $store) {
                    // Garantir que a loja tem produtos
                    if ($store->products->isEmpty()) {
                        continue;
                    }

                    // Criar a encomenda usando o Factory para garantir consistência
                    $order = Order::factory()->create();

                    // Selecionar entre 5 e 10 produtos de lojas do Vendor
                    $products = $store->products->random(rand(5, 10));

                    foreach ($products as $product) {
                        $quantity = rand(30, 40); // Quantidade aleatória

                        // Cálculo dos preços
                        $originalPrice = $product->price * $quantity;
                        $discountValue = $originalPrice * ($product->discount / 100);
                        $finalPrice = $originalPrice - $discountValue;

                        // Criar o registo na tabela `order_store_products`
                        OrderStoreProduct::create([
                            'order_id'      => $order->id,
                            'store_id'      => $store->id, // Loja do Vendor
                            'product_id'    => $product->id,
                            'price'         => $product->price,
                            'discount'      => $product->discount,
                            'discount_value'=> $discountValue,
                            'quantity'      => $quantity,
                            'final_price'   => $finalPrice,
                            'original_price'=> $originalPrice,
                            'created_at'    => $order->created_at, // Mantém a coerência de datas
                            'updated_at'    => $order->updated_at,
                        ]);
                    }
                }

            }
        }
    }
}

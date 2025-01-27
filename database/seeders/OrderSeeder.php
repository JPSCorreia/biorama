<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderStoreProduct;
use App\Models\Status;
use App\Models\Store;
use App\Models\StoreProduct;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Criar 30 encomendas
        Order::factory(30)->create();

        $orders = Order::all();
        $stores = Store::with('products')->get(); // Carrega as lojas com os seus produtos

        foreach ($orders as $order) {
            $store = $stores->random(); // Seleciona uma loja aleatória
            $products = $store->products->random(rand(1, 5)); // Seleciona entre 1 e 5 produtos da loja

            foreach ($products as $product) {
                $quantity = rand(1, 10); // Quantidade aleatória

                // Calcula o desconto e o preço final
                $originalPrice = $product->price * $quantity;
                $discountValue = $originalPrice * ($product->discount / 100);
                $finalPrice = $originalPrice - $discountValue;

                // Cria o registo na tabela pivot
                OrderStoreProduct::create([
                    'order_id' => $order->id,
                    'store_id' => $store->id,
                    'product_id' => $product->id,
                    'price' => $product->price,
                    'discount' => $product->discount,
                    'discount_value' => $discountValue,
                    'quantity' => $quantity,
                    'final_price' => $finalPrice,
                    'original_price' => $originalPrice,
                ]);
            }
        }
    }


}

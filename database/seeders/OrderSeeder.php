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
        // 3. Criar 30 ordens
        $orders = Order::factory(30)->create();

        $stores = Store::all();


        // 4. Associar 5 produtos a cada ordem usando store_products
        foreach ($orders as $order) {
            $store = $stores->random(); // Selecionar uma loja aleatória para a ordem
            $storeProducts = StoreProduct::where('store_id', $store->id)
                ->inRandomOrder()
                ->limit(5)
                ->get(); // Selecionar 5 produtos aleatórios da loja

            // Associar os produtos à ordem de modo a utilizar a tabela pivot
            foreach ($storeProducts as $storeProduct) {
                OrderStoreProduct::factory()->create([
                    'order_id' => $order->id,
                    'store_id' => $storeProduct->id,
                    'product_id' => $storeProduct->product_id,
                ]);
            }
        }

    }

}

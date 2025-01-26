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
        // Create 30 orders
        Order::factory(1)->create();
        //dd('Orders created', Order::all());
        //OrderStoreProduct::factory(30)->create();


    }

}

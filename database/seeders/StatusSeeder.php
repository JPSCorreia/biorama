<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

        foreach ($statuses as $status) {
            \App\Models\Status::create(['name' => $status]);
        }
    }

}

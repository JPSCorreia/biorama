<?php

namespace Database\Seeders;

use App\Models\Status;
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
            Status::create(['name' => $status]);
        }
    }

}

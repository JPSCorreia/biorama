<?php

namespace Database\Factories;

use App\Models\StoreGallery;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

class StoreGalleryFactory extends Factory
{
    protected $model = StoreGallery::class;

    public function definition()
    {
        return [
            'store_id' => Store::factory(),
            'image_link' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

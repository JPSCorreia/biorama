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
        $store_id = Store::all()->random()->id;
        return [
            'store_id' => $store_id,
            'image_link' => $this->faker->imageUrl(640, 480, 'gallery'),
            'image_name' => $this->faker->word(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

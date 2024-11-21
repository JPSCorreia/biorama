<?php

namespace Database\Factories;

use App\Models\Store;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

class StoreFactory extends Factory
{
    protected $model = Store::class;

    public function definition()
    {
        return [
            'vendor_id' => Vendor::factory(),
            'name' => $this->faker->unique()->company(),
            'phone_number' => $this->faker->numerify('#########'),
            'email' => $this->faker->unique()->safeEmail(),
            'description' => $this->faker->text(),
            'image_link' => $this->faker->imageUrl(640, 480, 'store'),
            'street_address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'postal_code' => $this->faker->postcode(),
            'rating' => $this->faker->randomFloat(2, 0, 5),
            'coordinates' => DB::raw("POINT({$this->faker->latitude}, {$this->faker->longitude})"),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

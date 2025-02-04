<?php

namespace Database\Factories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VendorAddress>
 */
class StoreAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'store_id' => Store::factory(), // Utiliza uma store existente ou cria um novo.
            'street_address' => $this->faker->streetAddress(),
            'postal_code' => $this->faker->postcode(),
            'city' => $this->faker->city(),
            'comment' => $this->faker->sentence(),
            'coordinates' => DB::raw("POINT({$this->faker->longitude(-8.9236, -8.8957)}, {$this->faker->latitude(38.5244, 38.5417)})"),
        ];
    }
}

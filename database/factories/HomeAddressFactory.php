<?php

namespace Database\Factories;

use App\Models\HomeAddress;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class HomeAddressFactory extends Factory
{
    protected $model = HomeAddress::class;

    public function definition()
    {
        // Lista de cidades perto de Lisboa e Setúbal com coordenadas reais
        $cities = [
            ['city' => 'Lisboa', 'latitude' => 38.7169, 'longitude' => -9.1399],
            ['city' => 'Almada', 'latitude' => 38.6762, 'longitude' => -9.1651],
            ['city' => 'Setúbal', 'latitude' => 38.5244, 'longitude' => -8.8882],
            ['city' => 'Montijo', 'latitude' => 38.7069, 'longitude' => -8.9733],
            ['city' => 'Sesimbra', 'latitude' => 38.4444, 'longitude' => -9.1015],
            ['city' => 'Oeiras', 'latitude' => 38.6979, 'longitude' => -9.3053],
            ['city' => 'Barreiro', 'latitude' => 38.6633, 'longitude' => -9.0724],
            ['city' => 'Cascais', 'latitude' => 38.6969, 'longitude' => -9.4215],
            ['city' => 'Amadora', 'latitude' => 38.7597, 'longitude' => -9.2392],
            ['city' => 'Loures', 'latitude' => 38.8309, 'longitude' => -9.1685]
        ];

        // Escolhe uma cidade aleatória da lista
        $selectedCity = $cities[array_rand($cities)];

        return [
            'address_name' => $this->faker->word(),
            'phone_number' => $this->faker->numerify('#########'),
            'street_address' => $this->faker->streetAddress(),
            'postal_code' => $this->faker->postcode(),
            'number' => $this->faker->buildingNumber(),
            'city' => $selectedCity['city'], // Cidade real
            'is_primary' => $this->faker->boolean(),
            'comment' => $this->faker->sentence(),
            'longitude' => $selectedCity['longitude'], // Longitude real
            'latitude' => $selectedCity['latitude'], // Latitude real
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

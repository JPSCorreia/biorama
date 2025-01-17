<?php

namespace Database\Factories;

use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company,
            'nif' => $this->faker->unique()->numerify('#########'),
            'founded_at' => $this->faker->date(),
            'sector' => $this->faker->word,
            'description' => $this->faker->paragraph,
        ];

    }
}

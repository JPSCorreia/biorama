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
            'company_name' => $this->faker->company,
            'company_nif' => $this->faker->numerify('#########'),
            'company_address' => $this->faker->address,
            'company_city' => $this->faker->city,
            'company_postal_code' => $this->faker->postcode,
            'company_phone' => $this->faker->phoneNumber,
            'company_email' => $this->faker->companyEmail,
        ];

    }
}

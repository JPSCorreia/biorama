<?php

namespace Database\Factories;

use App\Models\Vendor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendorFactory extends Factory
{
    protected $model = Vendor::class;

    public function definition()
    {
        $user_id = User::all()->random()->id;
        return [
            'user_id' => $user_id,
            'nif' => $this->faker->numerify('#########'),
            'phone' => $this->faker->phoneNumber,
            'address' => $this->faker->address,
            'city' => $this->faker->city,
            'postal_code' => $this->faker->postcode,
            'date_of_birth' => $this->faker->date(),
            'iban' => $this->faker->iban('PT'),
            'is_company' => $this->faker->boolean,
            'vendor_photo' => null,

            'company_name' => 'is_company' ? $this->faker->company: null,
            'company_nif' => 'is_company' ? $this->faker->numerify('#########'): null,
            'company_address' => 'is_company' ? $this->faker->address: null,
            'company_city' => 'is_company' ? $this->faker->city: null,
            'company_postal_code' => 'is_company' ? $this->faker->postcode: null,
            'company_phone' => 'is_company' ? $this->faker->phoneNumber: null,
            'company_email' => 'is_company' ? $this->faker->companyEmail: null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

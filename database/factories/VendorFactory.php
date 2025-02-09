<?php

namespace Database\Factories;

use App\Models\Gender;
use App\Models\Vendor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

class VendorFactory extends Factory
{
    protected $model = Vendor::class;

    public function definition()
    {
        // Buscar um User que ainda não tenha Vendor
        $user = DB::transaction(function () {
            return User::whereDoesntHave('vendor') // Só Users sem Vendor
                ->lockForUpdate()
                ->inRandomOrder()
                ->first()
                ?? User::factory()->create(); // Se não houver, cria um novo
        });

        return [
            'user_id' => $user->id, // Garante que cada Vendor tem um User único
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'nif' => $this->faker->unique()->numerify('#########'),
            'gender_id' => Gender::all()->random()->id,
            'phone' => $this->faker->phoneNumber(),
            'date_of_birth' => $this->faker->date(),
            'iban' => $this->faker->iban(),
            'is_company' => $this->faker->boolean(),
            'created_at' => $this->faker->dateTimeBetween('2023-01-01', '2025-02-09'),
            'updated_at' => $this->faker->dateTimeBetween('2023-01-01', '2025-02-09'),
        ];
    }
}

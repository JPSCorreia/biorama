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
        $vendor_id = Vendor::all()->random()->id;

        return [
            'vendor_id' => $vendor_id,
            'name' => $this->faker->unique()->company(),
            'phone_number' => $this->faker->numerify('#########'),
            'email' => $this->faker->unique()->safeEmail(),
            'description' => $this->faker->text(),
            'rating' => $this->faker->randomFloat(2, 0, 5),
            'coordinates' => DB::raw("POINT({$this->faker->longitude(-8.9236, -8.8957)}, {$this->faker->latitude(38.5244, 38.5417)})"),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

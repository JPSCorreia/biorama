<?php

namespace Database\Factories;

use App\Models\Status;
use Illuminate\Database\Eloquent\Factories\Factory;

class StatusFactory extends Factory
{
    protected $model = Status::class;

    public function definition()
    {
        return [
            'name' => $this->faker->randomElement(['Pending', 'Completed', 'Cancelled', 'In Progress']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

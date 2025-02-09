<?php

namespace Database\Factories;

use App\Models\StoreReview;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StoreReviewFactory extends Factory
{
    protected $model = StoreReview::class;

    public function definition()
    {
        $user_id = User::all()->random()->id;

        return [
            'store_id' => Store::factory(),
            'user_id' => $user_id,
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->sentence(),
            'created_at' => $this->faker->dateTimeBetween('-6 years', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-6 years', 'now'),
        ];
    }
}

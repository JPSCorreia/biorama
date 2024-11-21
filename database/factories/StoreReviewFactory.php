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
        $store_id = Store::all()->random()->id;
        $user_id = User::all()->random()->id;

        return [
            'store_id' => $store_id,
            'user_id' => $user_id,
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->sentence(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

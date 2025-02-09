<?php

namespace Database\Factories;

use App\Models\VendorReview;
use App\Models\Vendor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendorReviewFactory extends Factory
{
    protected $model = VendorReview::class;

    public function definition()
    {
        $vendor_id = Vendor::all()->random()->id;
        $user_id = User::all()->random()->id;

        return [
            'vendor_id' => $vendor_id,
            'user_id' => $user_id,
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->sentence(),
            'created_at' => $this->faker->dateTimeBetween('-3 years', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-3 years', 'now'),
        ];
    }
}

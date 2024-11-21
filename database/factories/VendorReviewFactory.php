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
        return [
            'vendor_id' => Vendor::factory(),
            'user_id' => User::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->sentence(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

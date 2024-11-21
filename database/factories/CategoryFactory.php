<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word(),
            'image_link' => $this->faker->imageUrl(640, 480, 'categories'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

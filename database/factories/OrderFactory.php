<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Status;
use App\Models\User;
use App\Models\Store;
use App\Models\HomeAddress;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition()
    {
        $user_id = User::inRandomOrder()->first()->id;
        $store_id = Store::inRandomOrder()->first()->id;
        $status_id = Status::inRandomOrder()->first()->id;

        $address = HomeAddress::where('user_id', $user_id)->inRandomOrder()->first();

        return [
            'user_id' => $user_id,
            'store_id' => $store_id,
            'statuses_id' => $status_id,

            'street_name' => isset($address) && !empty($address->street_name)
                ? $address->street_name
                : $this->faker->streetAddress,

            'postal_code' => isset($address) && !empty($address->postal_code)
                ? $address->postal_code
                : $this->faker->postcode,

            'city' => isset($address) && !empty($address->city)
                ? $address->city
                : $this->faker->city,

            'phone_number' => isset($address) && !empty($address->number)
                ? $address->number
                : $this->faker->buildingNumber,

            'address_name' => isset($address) && !empty($address->address_name)
                ? $address->address_name
                : $this->faker->word() . ' Home',

            'comment' => isset($address) && !empty($address->comment)
                ? $address->comment
                : $this->faker->sentence,
            
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

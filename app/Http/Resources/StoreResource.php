<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'rating' => $this->rating,
            'phone_number' => $this->phone_number,
            'email' => $this->email,
            'addresses' => $this->addresses->map(function ($address) {
                return [
                    'street_address' => $address->street_address,
                    'city' => $address->city,
                    'postal_code' => $address->postal_code,
                    'latitude' => $address->latitude,
                    'longitude' => $address->longitude,
                ];
            }),
            'galleries' => $this->galleries->map(function ($gallery) {
                return [
                    'id' => $gallery->id,
                    'image_link' => $gallery->image_link,
                ];
            }),

        ];
    }
}

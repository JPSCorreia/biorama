<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeAddressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'address_name' => $this->address_name,
            'street_address' => $this->street_address,
            'city' => $this->city,
            'postal_code' => $this->postal_code,
            'phone_number' => $this->phone_number,
            'is_primary' => $this->is_primary,
            'comment' => $this->comment,
        ];
    }
}

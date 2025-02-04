<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StoreAddress extends Model
{
    /** @use HasFactory<\Database\Factories\VendorAddressFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'store_id',
        'phone_number',
        'street_address',
        'postal_code',
        'city',
        'comment',
        'coordinates',
    ];

    protected $casts = [
        'coordinates' => 'string', // Mantém como string para trabalhar com POINT
    ];

    public function store()
    {
        return $this->belongsTo(Vendor::class);
    }
}

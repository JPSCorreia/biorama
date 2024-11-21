<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Store extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'vendor_id',
        'name',
        'phone_number',
        'email',
        'description',
        'image_link',
        'street_address',
        'city',
        'postal_code',
        'rating',
        'coordinates',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function products()
    {
        return $this->hasMany(StoreProduct::class);
    }

    public function reviews()
    {
        return $this->hasMany(StoreReview::class);
    }

    public function galleries()
    {
        return $this->hasMany(StoreGallery::class);
    }
}

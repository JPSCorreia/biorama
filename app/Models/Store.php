<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Store extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'store_id',
        'name',
        'phone_number',
        'email',
        'description',
        'rating',
        'coordinates',
    ];

    protected $casts = [
        'coordinates' => 'string', // Mantém como string para trabalhar com POINT
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'store_products', 'store_id', 'product_id')
            ->withTimestamps();
    }

    public function addresses()
    {
        return $this->hasMany(StoreAddress::class);
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

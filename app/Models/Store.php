<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Store extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'store_id',
        'vendor_id',
        'name',
        'phone_number',
        'email',
        'description',
        'rating',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_store_products')
            ->withPivot(['product_id', 'price', 'quantity', 'discount'])
            ->withTimestamps();
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'store_products')
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
        return $this->hasMany(StoreGallery::class, 'store_id');
    }


}

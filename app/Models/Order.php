<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'statuses_id',
        'street_name',
        'city',
        'postal_code',
        'phone_number',
        'comment',
        'total',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function status()
    {
        return $this->belongsTo(HomeAddress::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_store_products')
            ->withTrashed()
            ->withPivot(['product_id','price', 'quantity', 'discount'])
            ->using(OrderStoreProduct::class);
    }
    public function stores()
    {
        return $this->belongsToMany(Store::class, 'order_store_products')
            ->withTrashed()
            ->withPivot(['store_id','price', 'quantity', 'discount'])
            ->using(OrderStoreProduct::class);
    }
}

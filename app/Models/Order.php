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
        return $this->belongsTo(Status::class, 'statuses_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_store_products', 'order_id', 'product_id')
            ->withPivot(['product_id','price', 'quantity', 'discount', 'final_price'])
            ->withTimestamps();
    }

    public function stores()
    {
        return $this->belongsToMany(Store::class, 'order_store_products', 'order_id', 'store_id')
            ->withPivot(['price', 'quantity', 'discount', 'final_price'])
            ->withTrashed();  // Aqui também ajuda no caso de soft deletes
    }

}

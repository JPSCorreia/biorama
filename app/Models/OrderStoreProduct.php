<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStoreProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'store_product_id',
        'price',
        'discount',
        'quantity',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function storeProduct()
    {
        return $this->belongsTo(StoreProduct::class);
    }
}

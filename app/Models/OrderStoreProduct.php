<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class OrderStoreProduct extends Pivot
{
    use HasFactory;

    protected $table = 'order_store_products';

    protected $fillable = [
        'order_id',
        'store_id',
        'product_id',
        'price',
        'quantity',
        'discount',
        'final_price'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class OrderStoreProduct extends Pivot
{
    use HasFactory;
    use SoftDeletes;
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

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStoreProduct extends Model
{
    use HasFactory;

    protected $primaryKey = ['order_id', 'store_id', 'product_id']; // Chave primária composta


    protected $fillable = [
        'order_id',
        'product_id',
        'order_id',
        'price',
        'discount',
        'quantity',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Relacionamento com StoreProduct
    public function storeProduct()
    {
        return $this->hasOne(StoreProduct::class, ['store_id', 'product_id'], ['store_id', 'product_id']);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStoreProduct extends Model
{
    use HasFactory;

    protected $table = 'order_store_products'; // Nome da tabela
    protected $fillable = ['order_id', 'store_id', 'product_id', 'price', 'original_price','discount', 'quantity', 'discount_value', 'final_price']; // Campos preenchíveis

}

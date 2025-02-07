<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductGallery;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'discount',
        'stock',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }

    public function stores()
    {
        return $this->belongsToMany(Store::class, 'store_products')
            ->withTimestamps();
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_store_products', 'product_id', 'order_id')
            ->withPivot(['store_id', 'price', 'quantity', 'discount'])
            ->withTimestamps();
    }

    public function gallery()
    {
        return $this->hasMany(ProductGallery::class, 'product_id');
    }
}

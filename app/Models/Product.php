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
        'sold_at_unit',
        'price',
        'discount',
        'stock'
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }

    public function stores()
    {
        return $this->belongsToMany(Store::class, 'store_products', 'product_id', 'store_id')
            ->withPivot('stock')
            ->withTimestamps();
    }

    public function photos()
    {
        return $this->hasMany(ProductGallery::class);
    }
}

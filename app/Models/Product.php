<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image_link',
        'sold_at_unit',
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
        return $this->hasMany(ProductPhoto::class);
    }
}

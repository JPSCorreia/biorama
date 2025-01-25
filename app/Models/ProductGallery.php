<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductGallery extends Model
{
    /** @use HasFactory<\Database\Factories\ProductGalleryFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['product_id', 'image_link'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

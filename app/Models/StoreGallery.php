<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreGallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'image_link',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'statuses_id',
        'street_name',
        'city',
        'postal_code',
        'phone_number',
        'comment',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function status()
    {
        return $this->belongsTo(HomeAddress::class);
    }

    public function storeProducts()
    {
        return $this->hasMany(OrderStoreProduct::class, 'order_id', 'id');
    }
}

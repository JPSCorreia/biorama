<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HomeAddress extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'address_name',
        'phone_number',
        'street_address',
        'postal_code',
        'number',
        'city',
        'is_primary',
        'comment',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

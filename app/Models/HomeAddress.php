<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HomeAddress extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'address_name',
        'phone_number',
        'street_address',
        'postal_code',
        'city',
        'is_primary',
        'comment',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

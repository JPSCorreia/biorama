<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vendor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'iban',
        'is_company',
    ];

    public static function create(array $array)
    {
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function company()
    {
        return $this->hasOne(Company::class);
    }

    public function stores()
    {
        return $this->hasMany(Store::class);
    }

    public function vendorReviews()
    {
        return $this->hasMany(VendorReview::class);
    }
}

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
        'nif',
        'phone',
        'address',
        'city',
        'postal_code',
        'date_of_birth',
        'iban',
        'vendor_photo',
        'is_company',
        'company_name',
        'company_nif',
        'company_address',
        'company_city',
        'company_postal_code',
        'company_phone',
        'company_email',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;

class Vendor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'nif',
        'phone',
        'date_of_birth',
        'iban',
        'is_company',
        'gender_id',
        'user_id',
        ];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class);
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

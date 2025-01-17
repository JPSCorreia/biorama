<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyAddress extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyAddressFactory> */
    use HasFactory;

    protected $fillable = ['company_id', 'street', 'number', 'postal_code', 'city', 'district', 'country'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}

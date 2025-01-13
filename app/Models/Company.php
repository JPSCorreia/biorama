<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyFactory> */
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'company_name',
        'company_nif',
        'company_address',
        'company_city',
        'company_postal_code',
        'company_phone',
        'company_email',
    ];

    // Relação com Vendor
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}

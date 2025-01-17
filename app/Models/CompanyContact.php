<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyContact extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyContactFactory> */
    use HasFactory;

    protected $fillable = ['company_id', 'phone', 'email', 'website'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'vendor_id',
        'name',
        'nif',
        'type',
        'founded_at',
        'sector',
        'description'
    ];

    // Relação com Vendor
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function contacts()
    {
        return $this->hasOne(CompanyContact::class);
    }

    public function addresses()
    {
        return $this->hasOne(CompanyAddress::class);
    }
}

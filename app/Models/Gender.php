<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gender extends Model
{
    protected $fillable = ['name'];

    public function users()
    {
        return $this->hasOne(User::class);
    }

    public function vendor()
    {
        return $this->hasOne(Vendor::class);
    }
}

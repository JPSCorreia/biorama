<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements CanResetPasswordContract
{
    use HasFactory, HasRoles, Notifiable, SoftDeletes, CanResetPassword;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'gender',
        'nif',
        'phone',
        'date_of_birth',
        'photo',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function vendor()
    {
        return $this->hasOne(Vendor::class);
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class);
    }

    public function home_addresses()
    {
        return $this->hasMany(HomeAddress::class);
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}

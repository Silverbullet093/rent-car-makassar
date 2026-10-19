<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_code',
        'brand',
        'model',
        'year',
        'category',
        'seats',
        'transmission',
        'fuel',
        'luggage',
        'price_normal',
        'price_holiday',
        'driver_fee',
        'status',
        'image',
        'description',
    ];

    protected $casts = [
        'seats' => 'integer',
        'price_normal' => 'float',
        'price_holiday' => 'float',
        'driver_fee' => 'float',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}

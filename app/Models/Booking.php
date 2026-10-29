<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code',
        'car_id',
        'customer_name',
        'customer_phone',
        'event_type',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'with_driver',
        'total_price',
        'status',
        'notes',
        'ktp_image',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'with_driver' => 'boolean',
        'total_price' => 'float',
    ];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OwnerConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_name',
        'tagline',
        'description',
        'whatsapp_number',
        'phone',
        'email',
        'address',
        'maps_url',
        'operating_hours',
        'instagram',
        'facebook',
        'tiktok',
        'is_holiday_pricing_active',
        'holiday_notes',
    ];

    protected $casts = [
        'is_holiday_pricing_active' => 'boolean',
    ];
}

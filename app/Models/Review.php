<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'rating',
        'car_name',
        'comment',
        'avatar',
        'user_type',
        'stories',
        'media',
        'media_type',
        'status',
    ];

    protected $casts = [
        'rating' => 'integer',
        'stories' => 'array',
    ];
}

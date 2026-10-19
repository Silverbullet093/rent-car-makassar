<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\OwnerConfigController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ReviewController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Armada Mobil (Cars)
Route::apiResource('cars', CarController::class);
Route::patch('cars/{id}/status', [CarController::class, 'updateStatus']);

// Owner Config / Settings
Route::get('owner-config', [OwnerConfigController::class, 'show']);
Route::put('owner-config', [OwnerConfigController::class, 'update']);
Route::patch('owner-config', [OwnerConfigController::class, 'update']);

// Pemesanan / Bookings
Route::apiResource('bookings', BookingController::class);
Route::patch('bookings/{id}/status', [BookingController::class, 'updateStatus']);

// Reviews / Testimoni Pelanggan
Route::apiResource('reviews', ReviewController::class);
Route::patch('reviews/{id}/status', [ReviewController::class, 'updateStatus']);


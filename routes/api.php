<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\OwnerConfigController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ReviewController;

/*
|--------------------------------------------------------------------------
| API Routes (Jalur Pertukaran Data REST API JSON)
|--------------------------------------------------------------------------
| File ini menjadi jembatan pertukaran data antara antarmuka JavaScript
| (public/js/app.js & public/js/admin.js) dengan Controller Backend Laravel.
| Format komunikasi: Request HTTP (GET, POST, PUT, PATCH, DELETE) dengan respon JSON.
*/

// =========================================================================
// 1. ENDPOINT ARMADA MOBIL (CARS)
// =========================================================================
// Fungsi: Mengelola seluruh data unit armada mobil (CRUD)
// Dipanggil oleh: 
//   - GET /api/cars -> app.js:fetchCarsApi() & admin.js:fetchAdminCars()
//   - POST /api/cars -> admin.js:handleSaveCar() (Tambah mobil baru)
//   - PUT /api/cars/{id} -> admin.js:handleSaveCar() (Edit data mobil)
//   - DELETE /api/cars/{id} -> admin.js:handleDeleteCar() (Hapus mobil)
// Larinya kemana: Diproses oleh App\Http\Controllers\Api\CarController -> Tabel 'cars' di MySQL
Route::apiResource('cars', CarController::class);

// Fungsi: Mengubah status unit secara instan (ready, in_use, maintenance)
// Dipanggil oleh: admin.js:handleCarStatusChange()
// Larinya kemana: CarController@updateStatus -> Mengupdate kolom 'status' pada tabel 'cars'
Route::patch('cars/{id}/status', [CarController::class, 'updateStatus']);


// =========================================================================
// 2. ENDPOINT PENGATURAN OWNER (SETTINGS)
// =========================================================================
// Fungsi: Mengambil dan memperbarui informasi kontak bisnis, no WA, rekening bank, dan tarif libur
// Dipanggil oleh:
//   - GET /api/owner-config -> app.js:fetchConfigApi() & admin.js:fetchAdminOwnerConfig()
//   - PUT /api/owner-config -> admin.js:handleSaveConfig() (Simpan perubahan no WA/rekening)
// Larinya kemana: Diproses oleh App\Http\Controllers\Api\OwnerConfigController -> Tabel 'owner_configs' di MySQL
Route::get('owner-config', [OwnerConfigController::class, 'show']);
Route::put('owner-config', [OwnerConfigController::class, 'update']);
Route::patch('owner-config', [OwnerConfigController::class, 'update']);


// =========================================================================
// 3. ENDPOINT TRANSAKSI PEMESANAN (BOOKINGS)
// =========================================================================
// Fungsi: Mengelola transaksi sewa mobil, validasi KTP, upload bukti bayar, dan denda
// Dipanggil oleh:
//   - GET /api/bookings -> admin.js:fetchAdminBookings() (Tabel Pesanan Masuk di Dashboard)
//   - POST /api/bookings -> app.js:handleBookingSubmit() (Pelanggan submit formulir sewa)
//   - PUT /api/bookings/{id} -> admin.js:handleSavePenalty() (Admin input denda lecet/terlambat)
// Larinya kemana: Diproses oleh App\Http\Controllers\Api\BookingController -> Tabel 'bookings' di MySQL
Route::apiResource('bookings', BookingController::class);

// Fungsi: Mengubah status transaksi sewa (pending, confirmed, completed, cancelled)
// Dipanggil oleh: admin.js:handleBookingStatusChange()
// Larinya kemana: BookingController@updateStatus -> Memperbarui status booking & status ketersediaan unit mobil
Route::patch('bookings/{id}/status', [BookingController::class, 'updateStatus']);


// =========================================================================
// 4. ENDPOINT TESTIMONI / ULASAN PELANGGAN (REVIEWS)
// =========================================================================
// Fungsi: Menampilkan ulasan publik dan menerima ulasan baru dari pelanggan/admin
// Dipanggil oleh:
//   - GET /api/reviews -> app.js:fetchReviewsApi() (Hanya status approved) & admin.js:fetchAdminReviews() (Semua status)
//   - POST /api/reviews -> app.js:submitReview() (Status default pending) atau admin.js (Status approved)
//   - DELETE /api/reviews/{id} -> admin.js:handleDeleteReview()
// Larinya kemana: Diproses oleh App\Http\Controllers\Api\ReviewController -> Tabel 'reviews' di MySQL
Route::apiResource('reviews', ReviewController::class);

// Fungsi: Moderasi persetujuan testimoni (mengubah status 'pending' menjadi 'approved' atau 'rejected')
// Dipanggil oleh: admin.js:handleApproveReview() / handleRejectReview()
// Larinya kemana: ReviewController@updateStatus -> Mengupdate kolom 'status' pada tabel 'reviews'
Route::patch('reviews/{id}/status', [ReviewController::class, 'updateStatus']);

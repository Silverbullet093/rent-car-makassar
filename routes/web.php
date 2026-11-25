<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes (Rute Halaman Web Browser)
|--------------------------------------------------------------------------
| File ini mengatur alamat URL yang diketikkan pengguna di browser.
| Larinya kemana:
| 1. '/' & '/rcm-makassar' -> Membuka view 'index.blade.php' (Halaman Pelanggan Publik)
| 2. '/admin' & '/adminrcm' -> Membuka view 'admin.blade.php' (Portal Dashboard Owner/Admin)
*/

// =========================================================================
// 1. RUTE HALAMAN PELANGGAN PUBLIK
// =========================================================================
// Fungsi: Menampilkan antarmuka katalog mobil, formulir booking, kalkulasi tarif sewa, dan testimoni
// Input: Permintaan GET dari browser pengunjung (misal: http://localhost:8000/)
// Proses: Memanggil engine templating Blade Laravel
// Larinya kemana: Merender resources/views/index.blade.php yang ditenagai oleh public/js/app.js
Route::get('/', function () {
    return view('index');
});

// Alias rute alternatif halaman utama
Route::get('/rcm-makassar', function () {
    return view('index');
});

// =========================================================================
// 2. RUTE PORTAL OWNER / ADMINISTRATOR
// =========================================================================
// Fungsi: Menampilkan portal masuk admin & dashboard manajemen rental mobil
// Input: Permintaan GET dari browser pengelola (misal: http://localhost:8000/admin)
// Proses: Memanggil engine templating Blade Laravel untuk halaman admin
// Larinya kemana: Merender resources/views/admin.blade.php yang ditenagai oleh public/js/admin.js
Route::get('/adminrcm', function () {
    return view('admin');
});

Route::get('/admin', function () {
    return view('admin');
});

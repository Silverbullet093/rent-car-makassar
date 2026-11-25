<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model Car (Armada Mobil)
 * --------------------------------------------------------------------------
 * Fungsi:
 * - Mewakili tabel 'cars' di database MySQL ke dalam objek PHP.
 * - Berperan sebagai Single Source of Truth untuk seluruh data mobil yang disewakan.
 * 
 * Larinya kemana:
 * - Digunakan oleh App\Http\Controllers\Api\CarController untuk operasi CRUD armada.
 * - Digunakan oleh App\Http\Controllers\Api\BookingController untuk memverifikasi ketersediaan unit sewa.
 * - Berelasi 'hasMany' ke Model Booking (Satu mobil dapat memiliki banyak riwayat transaksi booking).
 */
class Car extends Model
{
    use HasFactory;

    // Kolom-kolom yang diizinkan untuk diisi secara massal (Mass Assignment)
    // Berasal dari form input tambah/edit mobil di admin dashboard (admin.js:handleSaveCar)
    protected $fillable = [
        'car_code',      // Kode unit unik (contoh: car-01, car-02)
        'brand',         // Merek mobil (contoh: Toyota, Honda, Mitsubishi)
        'model',         // Model mobil (contoh: Innova Reborn, Fortuner VRZ, Avanza)
        'year',          // Tahun pembuatan unit (contoh: 2023, 2024)
        'category',      // Kategori armada (MPV, SUV, City Car, Luxury)
        'seats',         // Jumlah kapasitas tempat duduk (contoh: 7 seats)
        'transmission',  // Tipe transmisi (Manual / Matic)
        'fuel',          // Jenis bahan bakar (Bensin / Solar)
        'luggage',       // Kapasitas bagasi (contoh: 3 Koper Besar)
        'price_normal',  // Tarif sewa per hari pada hari biasa/normal (IDR)
        'price_holiday', // Tarif sewa per hari pada musim libur/peak season (IDR)
        'driver_fee',    // Biaya tambahan jasa supir per hari (IDR)
        'rental_option', // Opsi penyewaan: 'both' (bisa lepas kunci / supir) atau 'driver_only' (wajib supir)
        'status',        // Status operasional unit: 'ready' (tersedia), 'in_use' (sedang disewa), 'maintenance' (bengkel)
        'image',         // URL path foto mobil yang disimpan di storage (/storage/cars/...)
        'description',   // Keterangan tambahan atau fasilitas fasilitas mobil
    ];

    // Konversi tipe data otomatis (Type Casting) agar nilai numerik konsisten saat dikirim ke JSON
    protected $casts = [
        'seats' => 'integer',
        'price_normal' => 'float',
        'price_holiday' => 'float',
        'driver_fee' => 'float',
    ];

    /**
     * Relasi: Satu Mobil (Car) memiliki banyak data Pesanan (Bookings).
     * Larinya kemana: Digunakan untuk melacak histori penyewaan unit mobil terkait.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}

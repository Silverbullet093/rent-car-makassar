<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model Booking (Transaksi Pemesanan Sewa)
 * --------------------------------------------------------------------------
 * Fungsi:
 * - Mewakili tabel 'bookings' di database MySQL ke dalam objek PHP.
 * - Mencatat seluruh informasi pemesanan dari pelanggan (data diri, unit yang dipilih,
 *   durasi tanggal sewa, biaya, bukti identitas KTP, bukti transfer, dan status pemesanan).
 * 
 * Larinya kemana:
 * - Diisi oleh App\Http\Controllers\Api\BookingController@store saat pelanggan memesan via form web.
 * - Dibaca oleh admin dashboard (admin.js:fetchAdminBookings) untuk verifikasi KTP dan bukti pembayaran.
 * - Berelasi 'belongsTo' ke Model Car (Setiap pesanan merujuk ke satu unit mobil spesifik).
 */
class Booking extends Model
{
    use HasFactory;

    // Kolom-kolom yang diisi saat pemesanan dibuat atau diperbarui statusnya
    protected $fillable = [
        'booking_code',             // Kode unik pemesanan yang dibuat otomatis (contoh: RCM-A8B9C0)
        'car_id',                   // ID mobil yang disewa (foreign key merujuk ke tabel 'cars')
        'customer_name',            // Nama lengkap penyewa
        'customer_phone',           // Nomor HP / WhatsApp penyewa
        'event_type',               // Keperluan penyewaan (Wisata, Bisnis, Acara Keluarga, Wedding, dll.)
        'start_date',               // Tanggal mulai sewa (YYYY-MM-DD)
        'end_date',                 // Tanggal selesai sewa (YYYY-MM-DD)
        'start_time',               // Jam mulai serah terima mobil (HH:MM)
        'end_time',                 // Jam pengembalian mobil (HH:MM)
        'with_driver',              // Boolean: true jika sewa dengan supir, false jika lepas kunci
        'total_price',              // Total tarif sewa yang dihitung otomatis oleh sistem
        'payment_type',             // Jenis pembayaran: 'dp' (Uang Muka), 'lunas_awal', atau 'bayar_akhir'
        'payment_method',           // Metode pembayaran: 'whatsapp', 'transfer_bank', dll.
        'dp_amount',                // Nominal uang muka (DP) yang dibayarkan pelanggan (IDR)
        'status',                   // Status: 'pending' (menunggu verifikasi), 'confirmed' (disetujui),
                                    //         'confirmed_pending' (dp diverifikasi), 'completed' (selesai), 'cancelled' (batal)
        'notes',                    // Catatan khusus dari pelanggan (lokasi penjemputan, dll.)
        'ktp_image',                // Berkas foto KTP penyewa (disimpan di storage/app/public/bookings/...)
        'payment_proof',            // Berkas bukti transfer pembayaran uang muka (DP)
        'payment_proof_settlement', // Berkas bukti transfer pelunasan sisa sewa saat mobil diserahkan
        'penalty_amount',           // Biaya denda (keterlambatan pengembalian atau kerusakan unit)
        'penalty_proof',            // Bukti foto lecet/kerusakan atau bukti pembayaran denda
    ];

    // Konversi tipe data otomatis saat diolah oleh Laravel Eloquent
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'with_driver' => 'boolean',
        'total_price' => 'float',
        'dp_amount' => 'float',
        'penalty_amount' => 'float',
    ];

    /**
     * Relasi: Setiap Booking (Pesanan) merujuk ke satu Mobil (Car).
     * Larinya kemana: Mengambil detail mobil (brand, model, no plat, foto) saat admin melihat tabel booking.
     */
    public function car()
    {
        return $this->belongsTo(Car::class);
    }
}

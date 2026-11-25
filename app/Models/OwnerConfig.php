<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model OwnerConfig (Konfigurasi Profil Bisnis Rental)
 * --------------------------------------------------------------------------
 * Fungsi:
 * - Mewakili tabel 'owner_configs' di database MySQL ke dalam objek PHP.
 * - Menyimpan satu baris data pengaturan utama bisnis RPM Rent Car Makassar.
 * 
 * Larinya kemana:
 * - Dibaca oleh app.js:fetchConfigApi() untuk menampilkan kontak, no WA order, dan cek tarif libur.
 * - Dibaca dan diperbarui oleh admin.js:handleSaveConfig() dari tab 'Pengaturan' di dashboard admin.
 * - Dikelola oleh App\Http\Controllers\Api\OwnerConfigController.
 */
class OwnerConfig extends Model
{
    use HasFactory;

    // Kolom konfigurasi profil bisnis dan pengaturan operasional
    protected $fillable = [
        'business_name',             // Nama resmi rental (RPM Rent Car Makassar)
        'tagline',                   // Slogan bisnis yang tampil di header
        'description',               // Deskripsi singkat profil perusahaan
        'whatsapp_number',           // Nomor WhatsApp tujuan penerima pesan pemesanan (format: 628xxx)
        'phone',                     // Nomor telepon hotline kantor
        'email',                     // Email resmi perusahaan
        'address',                   // Alamat fisik kantor / pool rental mobil
        'maps_url',                  // Link Google Maps lokasi kantor
        'operating_hours',           // Jam kerja operasional (contoh: 24 Jam Setiap Hari)
        'instagram',                 // Akun media sosial Instagram
        'facebook',                  // Akun Facebook
        'tiktok',                    // Akun TikTok
        'is_holiday_pricing_active', // Saklar boolean: true = mengaktifkan tarif musim libur (Peak Season)
        'holiday_notes',             // Catatan pengumuman tarif libur (contoh: Libur Hari Raya Idul Fitri)
        'bank_name',                 // Nama bank untuk transfer DP (contoh: BCA, Mandiri, BRI)
        'bank_account_number',       // Nomor rekening bank penerima DP
        'bank_account_holder',       // Nama pemilik rekening bank
        'qris_image',                // Gambar barcode QRIS jika pembayaran via e-wallet
    ];

    // Konversi tipe data otomatis
    protected $casts = [
        'is_holiday_pricing_active' => 'boolean',
    ];
}

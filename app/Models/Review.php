<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model Review (Testimoni & Ulasan Pengguna)
 * --------------------------------------------------------------------------
 * Fungsi:
 * - Mewakili tabel 'reviews' di database MySQL ke dalam objek PHP.
 * - Menyimpan testimoni pelanggan umum serta dokumentasi foto/video sewa artis & tokoh penting.
 * 
 * Larinya kemana:
 * - Disimpan melalui App\Http\Controllers\Api\ReviewController@store saat pelanggan submit review di web.
 * - Disaring oleh ReviewController@index (hanya status 'approved' yang tampil ke publik di landing page).
 * - Dimoderasi oleh admin di dashboard (admin.js:handleApproveReview) untuk disetujui atau dihapus.
 */
class Review extends Model
{
    use HasFactory;

    // Kolom-kolom testimoni dan media ulasan
    protected $fillable = [
        'name',        // Nama pelanggan atau nama tokoh yang memberikan review
        'rating',      // Penilaian bintang (1 sampai 5)
        'car_name',    // Nama mobil yang disewa saat memberikan review
        'comment',     // Isi pesan testimoni kepuasan layanan rental
        'avatar',      // URL foto profil pelanggan (disimpan di storage/app/public/reviews/...)
        'user_type',   // Tipe reviewer: 'pelanggan' (biasa), 'artis', atau 'pejabat'
        'stories',     // Format array foto/video story interaktif (mirip Instagram story)
        'media',       // URL file foto atau video dokumentasi saat sewa
        'media_type',  // Tipe media: 'image' atau 'video'
        'status',      // Status moderasi: 'pending' (menunggu verifikasi admin), 'approved' (tayang), 'rejected'
    ];

    // Konversi tipe data otomatis
    protected $casts = [
        'rating' => 'integer',
        'stories' => 'array',
    ];
}

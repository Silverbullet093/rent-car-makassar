<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migrasi Database: Tabel 'bookings'
 * --------------------------------------------------------------------------
 * Fungsi: Membuat tabel skema transaksi sewa mobil di database MySQL.
 * Larinya kemana:
 * - Menjadi tabel dasar untuk Model App\Models\Booking
 * - Menerima input dari formulir pemesanan pelanggan (POST /api/bookings)
 * - Dibaca dan diverifikasi oleh Admin di dashboard (GET /api/bookings)
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();                                                                 // Primary Key ID Transaksi
            $table->string('booking_code')->unique();                                     // Kode unik pemesanan (RCM-XXXXXX)
            $table->foreignId('car_id')->constrained('cars')->onDelete('cascade');        // Relasi ke tabel 'cars'
            $table->string('customer_name');                                              // Nama lengkap penyewa
            $table->string('customer_phone');                                             // Nomor WhatsApp penyewa
            $table->string('event_type')->nullable();                                     // Keperluan (Wisata, Dinas, dll)
            $table->date('start_date')->nullable();                                       // Tanggal mulai sewa
            $table->date('end_date')->nullable();                                         // Tanggal selesai sewa
            $table->boolean('with_driver')->default(false);                               // Pakai supir (true/false)
            $table->decimal('total_price', 12, 2)->default(0);                            // Total biaya sewa
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending'); // Status pesanan
            $table->text('notes')->nullable();                                            // Catatan jemputan / permintaan khusus
            $table->timestamps();                                                         // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};

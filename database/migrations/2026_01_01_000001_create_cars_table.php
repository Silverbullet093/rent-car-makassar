<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migrasi Database: Tabel 'cars'
 * --------------------------------------------------------------------------
 * Fungsi: Membuat tabel skema penyimpanan inventaris unit mobil rental di MySQL.
 * Larinya kemana:
 * - Menjadi tabel dasar untuk Model App\Models\Car
 * - Diisi oleh Admin (POST /api/cars) dan dibaca oleh Pelanggan (GET /api/cars)
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();                                                   // Primary Key Auto Increment
            $table->string('car_code')->nullable()->unique();               // Kode unik unit (contoh: car-01)
            $table->string('brand');                                        // Merek pabrikan (Toyota, Honda, dll.)
            $table->string('model');                                        // Nama model (Innova Zenix, Fortuner, Avanza)
            $table->string('year', 4)->nullable();                          // Tahun pembuatan unit
            $table->string('category')->default('MPV');                     // Kategori: MPV, SUV, Mewah, City Car
            $table->integer('seats')->default(7);                           // Jumlah kursi penumpang
            $table->string('transmission')->default('Otomatis (AT)');       // Manual atau Otomatis
            $table->string('fuel')->default('Bensin');                      // Bensin / Solar
            $table->string('luggage')->default('3 Koper');                  // Muatan bagasi barang
            $table->decimal('price_normal', 12, 2)->default(0);             // Tarif sewa per hari (Hari Biasa)
            $table->decimal('price_holiday', 12, 2)->default(0);            // Tarif sewa per hari (Musim Libur)
            $table->decimal('driver_fee', 12, 2)->default(0);               // Biaya tambahan jasa supir per hari
            $table->enum('status', ['ready', 'in_use', 'maintenance'])->default('ready'); // Status ketersediaan
            $table->longText('image')->nullable();                          // URL path gambar mobil di storage
            $table->text('description')->nullable();                        // Deskripsi fasilitas unit
            $table->timestamps();                                           // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            if (!Schema::hasColumn('cars', 'rental_option')) {
                // both: Keduanya (Bisa Lepas Kunci & Pakai Supir), driver_only: Hanya dengan Supir
                $table->string('rental_option', 30)->default('both')->after('driver_fee');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            if (Schema::hasColumn('cars', 'rental_option')) {
                $table->dropColumn('rental_option');
            }
        });
    }
};

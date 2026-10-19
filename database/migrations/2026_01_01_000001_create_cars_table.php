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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('car_code')->nullable()->unique();
            $table->string('brand');
            $table->string('model');
            $table->string('year', 4)->nullable();
            $table->string('category')->default('MPV'); // MPV, SUV, Mewah, City Car, dll
            $table->integer('seats')->default(7);
            $table->string('transmission')->default('Otomatis (AT)');
            $table->string('fuel')->default('Bensin');
            $table->string('luggage')->default('3 Koper');
            $table->decimal('price_normal', 12, 2)->default(0);
            $table->decimal('price_holiday', 12, 2)->default(0);
            $table->decimal('driver_fee', 12, 2)->default(0);
            $table->enum('status', ['ready', 'in_use', 'maintenance'])->default('ready');
            $table->longText('image')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
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

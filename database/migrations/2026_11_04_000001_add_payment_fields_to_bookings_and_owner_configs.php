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
        Schema::table('owner_configs', function (Blueprint $table) {
            if (!Schema::hasColumn('owner_configs', 'bank_name')) {
                $table->string('bank_name')->nullable()->after('holiday_notes');
            }
            if (!Schema::hasColumn('owner_configs', 'bank_account_number')) {
                $table->string('bank_account_number')->nullable()->after('bank_name');
            }
            if (!Schema::hasColumn('owner_configs', 'bank_account_holder')) {
                $table->string('bank_account_holder')->nullable()->after('bank_account_number');
            }
            if (!Schema::hasColumn('owner_configs', 'qris_image')) {
                $table->longText('qris_image')->nullable()->after('bank_account_holder');
            }
        });

        Schema::table('bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('bookings', 'payment_type')) {
                $table->string('payment_type')->nullable()->default('lunas_awal')->after('total_price');
            }
            if (!Schema::hasColumn('bookings', 'payment_method')) {
                $table->string('payment_method')->nullable()->after('payment_type');
            }
            if (!Schema::hasColumn('bookings', 'dp_amount')) {
                $table->decimal('dp_amount', 12, 2)->nullable()->default(0)->after('payment_method');
            }
            if (!Schema::hasColumn('bookings', 'payment_proof')) {
                $table->longText('payment_proof')->nullable()->after('ktp_image');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('owner_configs', function (Blueprint $table) {
            $table->dropColumn(['bank_name', 'bank_account_number', 'bank_account_holder', 'qris_image']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['payment_type', 'payment_method', 'dp_amount', 'payment_proof']);
        });
    }
};

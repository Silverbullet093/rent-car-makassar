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
        Schema::table('reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('reviews', 'user_type')) {
                $table->string('user_type', 30)->default('regular')->after('avatar');
            }
            if (!Schema::hasColumn('reviews', 'stories')) {
                $table->longText('stories')->nullable()->after('user_type');
            }
            if (!Schema::hasColumn('reviews', 'media')) {
                $table->longText('media')->nullable()->after('stories');
            }
            if (!Schema::hasColumn('reviews', 'media_type')) {
                $table->string('media_type', 50)->nullable()->after('media');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $cols = [];
            foreach (['user_type', 'stories', 'media', 'media_type'] as $col) {
                if (Schema::hasColumn('reviews', $col)) {
                    $cols[] = $col;
                }
            }
            if (!empty($cols)) {
                $table->dropColumn($cols);
            }
        });
    }
};

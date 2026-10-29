<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin Default
        User::updateOrCreate(
            ['email' => 'admin@rentcarmakassar.com'],
            [
                'name' => 'Owner Admin',
                'password' => Hash::make('admin123'),
            ]
        );

        $this->call([
            CarSeeder::class,
            OwnerConfigSeeder::class,
            ReviewSeeder::class,
            BookingSeeder::class,
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\OwnerConfig;
use Illuminate\Database\Seeder;

class OwnerConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OwnerConfig::updateOrCreate(
            ['id' => 1],
            [
                'business_name' => 'RPM Rent Car Makassar',
                'tagline' => 'Sewa Mobil Nyaman & Terpercaya di Makassar',
                'description' => 'RPM Rent Car Makassar menyediakan armada prima dengan layanan supir berpengalaman & opsi lepas kunci untuk keperluan wisata, dinas bisnis, pernikahan, dan perjalanan keluarga Anda.',
                'whatsapp_number' => '6281234567890',
                'phone' => '0812-3456-7890',
                'email' => 'reservasi@rpmrentcarmakassar.com',
                'address' => 'Jl. Perintis Kemerdekaan No. 10, Makassar, Sulawesi Selatan',
                'operating_hours' => 'Buka 24 Jam Setiap Hari',
                'instagram' => '@garudarentcar_id',
                'facebook' => 'Garuda Rent Car Official',
                'tiktok' => '@garudarentcar',
                'is_holiday_pricing_active' => false,
                'holiday_notes' => 'Tarif Musim Libur & Hari Besar Nasional (Peak Season)',
            ]
        );
    }
}

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
                'business_name' => 'Rent Car Makassar',
                'tagline' => 'Sewa Mobil Terpercaya, Nyaman & Harga Transparan',
                'description' => 'Penyedia jasa rental mobil profesional melayani sewa lepas kunci (berkendara sendiri) maupun dengan supir berpengalaman untuk keperluan wisata, dinas bisnis, pernikahan, mudik, dan perjalanan keluarga.',
                'whatsapp_number' => '6281234567890',
                'phone' => '0812-3456-7890',
                'email' => 'kontak@garudarentcar.com',
                'address' => 'Jl. Urip Sumoharjo No. 88, Kota Makassar, Sulawesi Selatan',
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

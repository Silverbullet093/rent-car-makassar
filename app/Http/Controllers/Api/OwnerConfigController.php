<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OwnerConfig;
use Illuminate\Http\Request;

class OwnerConfigController extends Controller
{
    /**
     * Display the owner configuration.
     */
    public function show()
    {
        try {
            $config = OwnerConfig::first();

            if (!$config) {
                $config = OwnerConfig::create([
                    'business_name' => 'RPM Rent Car',
                    'tagline' => 'Sewa Mobil Terpercaya, Nyaman & Harga Transparan',
                    'description' => 'Penyedia jasa rental mobil profesional melayani sewa lepas kunci maupun dengan supir.',
                    'whatsapp_number' => '6281234567890',
                    'phone' => '0812-3456-7890',
                    'email' => 'kontak@rentcarmakassar.com',
                    'address' => 'Makassar & Sekitarnya',
                    'operating_hours' => 'Buka 24 Jam Setiap Hari',
                    'instagram' => '@rentcarmakassar_id',
                    'facebook' => 'Rent Car Makassar Official',
                    'tiktok' => '@rentcarmakassar',
                    'is_holiday_pricing_active' => false,
                    'holiday_notes' => 'Tarif Musim Libur & Hari Besar Nasional (Peak Season)',
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $config,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => true,
                'data' => [
                    'business_name' => 'RPM Rent Car',
                    'tagline' => 'Sewa Mobil Terpercaya, Nyaman & Harga Transparan',
                    'description' => 'Penyedia jasa rental mobil profesional melayani sewa lepas kunci maupun dengan supir.',
                    'whatsapp_number' => '6281234567890',
                    'phone' => '0812-3456-7890',
                    'email' => 'kontak@rentcarmakassar.com',
                    'address' => 'Makassar & Sekitarnya',
                    'operating_hours' => 'Buka 24 Jam Setiap Hari',
                    'is_holiday_pricing_active' => false,
                    'holiday_notes' => 'Tarif Musim Libur & Hari Besar Nasional (Peak Season)',
                ],
            ]);
        }
    }

    /**
     * Update the owner configuration.
     */
    public function update(Request $request)
    {
        $config = OwnerConfig::firstOrCreate(['id' => 1]);

        $validated = $request->validate([
            'business_name' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'whatsapp_number' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'maps_url' => 'nullable|string',
            'operating_hours' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:100',
            'facebook' => 'nullable|string|max:100',
            'tiktok' => 'nullable|string|max:100',
            'is_holiday_pricing_active' => 'nullable|boolean',
            'holiday_notes' => 'nullable|string',
        ]);

        $config->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Konfigurasi owner berhasil diperbarui',
            'data' => $config,
        ]);
    }
}

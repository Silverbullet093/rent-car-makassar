<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OwnerConfig;
use Illuminate\Http\Request;

/**
 * Controller API OwnerConfigController
 * --------------------------------------------------------------------------
 * Fungsi Utama:
 * Mengelola data profil bisnis RPM Rent Car Makassar, seperti nomor WhatsApp
 * penerima pemesanan, informasi rekening bank untuk transfer DP, alamat Google Maps,
 * serta saklar pengaktifan tarif musim libur (Peak Season).
 * 
 * Alur Data (Larinya kemana):
 * - Input:
 *   1. Permintaan GET saat browser memuat halaman (app.js & admin.js)
 *   2. Form pengaturan bisnis di dashboard admin (admin.js: handleSaveConfig)
 * - Output:
 *   1. Disimpan di tabel 'owner_configs' di database MySQL
 *   2. Dikirim kembali sebagai respon JSON ke app.js (untuk no WA order) dan admin.js
 */
class OwnerConfigController extends Controller
{
    /**
     * METHOD: show()
     * ----------------------------------------------------------------------
     * Fungsi: 
     * Mengambil satu baris konfigurasi bisnis. Jika tabel masih kosong, secara 
     * otomatis membuat data bawaan (default) agar aplikasi tidak pernah error.
     * 
     * Larinya kemana:
     * - Frontend Pelanggan -> app.js: fetchConfigApi()
     *   * Digunakan untuk menentukan nomor tujuan WhatsApp saat tombol order diklik.
     *   * Digunakan untuk mengecek apakah tarif libur (is_holiday_pricing_active) sedang aktif.
     *   * Digunakan untuk menampilkan nomor rekening bank tujuan transfer DP.
     * - Frontend Admin -> admin.js: fetchAdminOwnerConfig()
     *   * Mengisi nilai default pada form tab "Pengaturan" di dashboard.
     */
    public function show()
    {
        try {
            $config = OwnerConfig::first();

            // Fallback: Buat konfigurasi default jika belum ada di database
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
                    'bank_name' => 'BCA',
                    'bank_account_number' => '7890123456',
                    'bank_account_holder' => 'RPM Rent Car Makassar',
                    'qris_image' => null,
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
                    'bank_name' => 'BCA',
                    'bank_account_number' => '7890123456',
                    'bank_account_holder' => 'RPM Rent Car Makassar',
                    'qris_image' => null,
                ],
            ]);
        }
    }

    /**
     * METHOD: update()
     * ----------------------------------------------------------------------
     * Fungsi: 
     * Menyimpan perubahan pengaturan bisnis yang diubah oleh Owner dari dashboard.
     * 
     * Input dari: 
     * Form pengaturan admin -> admin.js: handleSaveConfig(e) melalui HTTP PUT /api/owner-config
     * 
     * Larinya kemana:
     * Mengupdate record pada tabel 'owner_configs' di database MySQL.
     * Perubahan nomor WA atau tarif libur langsung seketika berdampak pada seluruh kalkulasi di halaman pelanggan!
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
            'bank_name' => 'nullable|string|max:100',
            'bank_account_number' => 'nullable|string|max:100',
            'bank_account_holder' => 'nullable|string|max:150',
            'qris_image' => 'nullable|string',
        ]);

        $config->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Konfigurasi owner berhasil diperbarui',
            'data' => $config,
        ]);
    }
}

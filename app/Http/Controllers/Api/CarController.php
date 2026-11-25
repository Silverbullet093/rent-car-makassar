<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;

/**
 * Controller API CarController
 * --------------------------------------------------------------------------
 * Fungsi Utama:
 * Mengelola seluruh operasi data armada mobil rental (CRUD), kalkulasi status 
 * ketersediaan secara otomatis dan real-time, serta penanganan upload gambar unit.
 * 
 * Alur Data (Larinya kemana):
 * - Input berasal dari:
 *   1. Permintaan browser pengunjung (public/js/app.js: fetchCarsApi)
 *   2. Form tambah/edit mobil dari admin (public/js/admin.js: handleSaveCar)
 * - Berkomunikasi dengan:
 *   Model App\Models\Car dan App\Models\Booking -> Tabel 'cars' & 'bookings' di database MySQL
 * - Mengembalikan respon:
 *   Format JSON (status success, pesan, dan data array objek mobil)
 */
class CarController extends Controller
{
    /**
     * METHOD: index()
     * ----------------------------------------------------------------------
     * Fungsi: 
     * Mengambil seluruh daftar armada mobil untuk ditampilkan ke katalog pelanggan 
     * maupun tabel inventaris admin. Dilengkapi fitur filter kategori & pencarian.
     * 
     * Logika Khusus (Real-Time Availability):
     * Memeriksa tabel 'bookings' untuk melihat apakah ada pesanan berstatus 'confirmed' 
     * yang tanggal pemakaiannya aktif hari ini. Jika ada, status mobil otomatis diset
     * 'in_use' (sedang dipakai) di memori response tanpa perlu diubah manual oleh admin.
     * 
     * Larinya kemana:
     * - Frontend Pelanggan -> app.js: fetchCarsApi() -> memicu renderCarsCatalog()
     * - Frontend Admin -> admin.js: fetchAdminCars() -> memicu renderCarsTable()
     */
    public function index(Request $request)
    {
        try {
            $query = Car::query();

            // 1. Filter Pencarian Teks (Berdasarkan merek, model, atau kategori mobil)
            if ($request->has('search') && $request->search != '') {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('brand', 'like', "%{$search}%")
                      ->orWhere('model', 'like', "%{$search}%")
                      ->orWhere('category', 'like', "%{$search}%");
                });
            }

            // 2. Filter Berdasarkan Kategori (SUV, MPV, City Car, Luxury)
            if ($request->has('category') && $request->category != 'semua' && $request->category != '') {
                $query->where('category', $request->category);
            }

            // 3. Filter Berdasarkan Status (ready, in_use, maintenance)
            if ($request->has('status') && $request->status != '') {
                $query->where('status', $request->status);
            }

            $cars = $query->orderBy('id', 'asc')->get();

            // 4. Kalkulasi Ketersediaan Otomatis Hari Ini:
            // Ambil ID mobil yang saat ini sedang aktif disewa (status booking confirmed)
            $today = now('Asia/Makassar')->toDateString();
            $inUseCarIds = \App\Models\Booking::whereIn('status', ['confirmed', 'confirmed_pending'])
                ->whereDate('start_date', '<=', $today)
                ->whereDate('end_date', '>=', $today)
                ->pluck('car_id')
                ->unique()
                ->toArray();

            // Terapkan status real-time pada respon JSON (jika tidak sedang di bengkel/maintenance)
            foreach ($cars as $car) {
                if ($car->status !== 'maintenance') {
                    $car->status = in_array($car->id, $inUseCarIds) ? 'in_use' : 'ready';
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Daftar armada mobil berhasil diambil',
                'data' => $cars,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database offline atau belum terkonfigurasi',
                'data' => [],
            ], 200);
        }
    }

    /**
     * METHOD: store()
     * ----------------------------------------------------------------------
     * Fungsi: 
     * Menyimpan data unit armada baru yang diinputkan oleh Admin dari dashboard.
     * 
     * Alur Eksekusi:
     * 1. Validasi input formulir (nama mobil, tarif normal, tarif libur, foto, transmisi, dll).
     * 2. Menghandle unggahan file gambar -> disimpan fisik ke storage/app/public/cars/.
     * 3. Membuat kode mobil otomatis jika kosong (contoh: car-01, car-02).
     * 4. Menjalankan Car::create() untuk menulis record baru ke tabel 'cars' di MySQL.
     * 
     * Larinya kemana:
     * Data tersimpan permanen di database, lalu dikembalikan sebagai JSON HTTP 201 
     * ke admin.js: handleSaveCar(), yang kemudian menyegarkan tabel admin & katalog publik.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'car_code' => 'nullable|string|unique:cars,car_code',
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'year' => 'nullable|string|max:4',
            'category' => 'required|string',
            'seats' => 'required|integer',
            'transmission' => 'required|string',
            'fuel' => 'required|string',
            'luggage' => 'nullable|string',
            'price_normal' => 'required|numeric',
            'price_holiday' => 'required|numeric',
            'driver_fee' => 'required|numeric',
            'rental_option' => 'nullable|string|in:both,driver_only',
            'status' => 'required|in:ready,in_use,maintenance',
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'description' => 'nullable|string',
        ]);

        // Simpan file gambar fisik ke disk publik jika diunggah via form file input
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('cars', 'public');
            $validated['image'] = asset('storage/' . $path);
        }

        // Generate kode mobil otomatis jika belum diisi
        if (empty($validated['car_code'])) {
            $validated['car_code'] = 'car-' . str_pad(Car::max('id') + 1, 2, '0', STR_PAD_LEFT);
        }

        if (empty($validated['rental_option'])) {
            $validated['rental_option'] = 'both';
        }

        // Simpan ke database MySQL
        $car = Car::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Armada mobil berhasil ditambahkan',
            'data' => $car,
        ], 201);
    }

    /**
     * METHOD: show()
     * ----------------------------------------------------------------------
     * Fungsi: Mengambil data detail 1 unit mobil spesifik berdasarkan ID.
     * Larinya kemana: Digunakan untuk modal preview mobil atau form edit.
     */
    public function show(string $id)
    {
        $car = Car::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $car,
        ]);
    }

    /**
     * METHOD: update()
     * ----------------------------------------------------------------------
     * Fungsi: Memperbarui informasi unit mobil yang sudah ada (edit harga, ganti foto, dll).
     * Input dari: admin.js: handleSaveCar() (mode edit)
     * Larinya kemana: Mengupdate baris data pada tabel 'cars' di MySQL.
     */
    public function update(Request $request, string $id)
    {
        $car = Car::findOrFail($id);

        $validated = $request->validate([
            'brand' => 'sometimes|required|string|max:100',
            'model' => 'sometimes|required|string|max:100',
            'year' => 'nullable|string|max:4',
            'category' => 'sometimes|required|string',
            'seats' => 'sometimes|required|integer',
            'transmission' => 'sometimes|required|string',
            'fuel' => 'sometimes|required|string',
            'luggage' => 'nullable|string',
            'price_normal' => 'sometimes|required|numeric',
            'price_holiday' => 'sometimes|required|numeric',
            'driver_fee' => 'sometimes|required|numeric',
            'rental_option' => 'nullable|string|in:both,driver_only',
            'status' => 'sometimes|required|in:ready,in_use,maintenance',
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('cars', 'public');
            $validated['image'] = asset('storage/' . $path);
        }

        $car->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data mobil berhasil diperbarui',
            'data' => $car,
        ]);
    }

    /**
     * METHOD: destroy()
     * ----------------------------------------------------------------------
     * Fungsi: Menghapus data mobil dari database.
     * Input dari: admin.js: handleDeleteCar() saat admin menekan tombol tong sampah.
     * Larinya kemana: Mengeksekusi DELETE FROM cars WHERE id = :id di MySQL.
     */
    public function destroy(string $id)
    {
        $car = Car::findOrFail($id);
        $car->delete();

        return response()->json([
            'success' => true,
            'message' => 'Armada mobil berhasil dihapus',
        ]);
    }

    /**
     * METHOD: updateStatus()
     * ----------------------------------------------------------------------
     * Fungsi: Mengubah status mobil secara cepat ('ready', 'in_use', 'maintenance').
     * Input dari: admin.js: handleCarStatusChange() dari dropdown status di tabel admin.
     * Larinya kemana: Mengupdate kolom status pada tabel 'cars' dan merender badge status baru.
     */
    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:ready,in_use,maintenance',
        ]);

        $car = Car::findOrFail($id);
        $car->status = $request->status;
        $car->save();

        return response()->json([
            'success' => true,
            'message' => 'Status mobil berhasil diubah',
            'data' => $car,
        ]);
    }
}

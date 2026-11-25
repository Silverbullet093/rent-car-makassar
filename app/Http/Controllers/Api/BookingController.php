<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Controller API BookingController
 * --------------------------------------------------------------------------
 * Fungsi Utama:
 * Mengelola seluruh siklus pemesanan sewa mobil (Booking Lifecycle), mulai dari:
 * 1. Pelanggan submit pesanan dari website utama.
 * 2. Pencegahan tanggal sewa bentrok (Conflict Prevention) agar 1 mobil tidak bisa disewa 2 orang di tanggal sama.
 * 3. Penerimaan berkas KTP dan bukti pembayaran DP.
 * 4. Verifikasi dan pengubahan status (pending -> confirmed -> completed).
 * 5. Pencatatan denda (keterlambatan/kerusakan unit).
 * 
 * Alur Data (Larinya kemana):
 * - Input:
 *   1. Form booking pelanggan (public/js/app.js: handleBookingSubmit)
 *   2. Kontrol dashboard admin (public/js/admin.js: handleBookingStatusChange, handleSavePenalty)
 * - Output:
 *   1. Tabel 'bookings' di database MySQL
 *   2. Respon JSON dikirim kembali ke JavaScript untuk update tampilan UI
 */
class BookingController extends Controller
{
    /**
     * METHOD: index()
     * ----------------------------------------------------------------------
     * Fungsi: 
     * Mengambil daftar seluruh transaksi pemesanan beserta data relasi mobilnya (with('car')).
     * Mendukung filter berdasarkan car_id, status pesanan, dan mode active_only.
     * 
     * Larinya kemana:
     * - Frontend Admin -> admin.js: fetchAdminBookings() -> merender tabel "Daftar Booking" di dashboard
     * - Digunakan admin untuk memantau pesanan masuk yang perlu diverifikasi
     */
    public function index(Request $request)
    {
        try {
            $query = Booking::with('car');

            // Filter berdasarkan mobil tertentu
            if ($request->has('car_id') && $request->car_id != '') {
                $query->where('car_id', $request->car_id);
            }

            // Filter berdasarkan status (pending, confirmed, completed, cancelled)
            if ($request->has('status') && $request->status != '') {
                $query->where('status', $request->status);
            }

            // Opsi hanya menampilkan pesanan yang belum selesai
            if ($request->boolean('active_only')) {
                $query->where('status', '!=', 'completed');
            }

            $bookings = $query->latest()->get();

            return response()->json([
                'success' => true,
                'data' => $bookings,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database tidak tersedia, menggunakan data lokal.',
                'data' => [],
            ], 200);
        }
    }

    /**
     * METHOD: store()
     * ----------------------------------------------------------------------
     * Fungsi: 
     * Memproses pesanan baru saat pelanggan menekan tombol 'Pesan Sekarang' di web.
     * 
     * Logika Kritis yang Berjalan:
     * 1. Validasi Input: Memastikan nama, no hp, tanggal, total harga, dan file KTP ada.
     * 2. Pencegahan Bentrok Tanggal (Conflict Check):
     *    Mengecek apakah mobil yang dipilih sudah memiliki pesanan berstatus 'confirmed'
     *    pada rentang tanggal yang bersinggungan. Jika bentrok, request DITOLAK (HTTP 422).
     * 3. Pembuatan Kode Booking Otomatis (RCM-XXXXXX).
     * 4. Penyimpanan ke Database MySQL melalui Booking::create().
     * 
     * Larinya kemana:
     * - Tersimpan di tabel 'bookings'.
     * - Respon JSON dikirim ke app.js: handleBookingSubmit().
     * - Di app.js, data ini juga langsung dirangkai menjadi pesan WhatsApp ke nomor Owner.
     * - Admin yang sedang membuka dashboard langsung melihat pesanan ini muncul di baris teratas!
     */
    public function store(Request $request)
    {
        // Validasi dan fallback car_id jika diperlukan
        $carId = $request->input('car_id');
        if (!$carId || !\App\Models\Car::where('id', $carId)->exists()) {
            $firstCar = \App\Models\Car::first();
            if ($firstCar) {
                $request->merge(['car_id' => $firstCar->id]);
            }
        }

        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:50',
            'event_type' => 'nullable|string|max:100',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_time' => 'nullable|string|max:50',
            'end_time' => 'nullable|string|max:50',
            'with_driver' => 'nullable|boolean',
            'driver_option' => 'nullable|string',
            'total_price' => 'required|numeric',
            'payment_type' => 'nullable|string|max:50',
            'payment_method' => 'nullable|string|max:50',
            'dp_amount' => 'nullable|numeric',
            'status' => 'nullable|in:pending,confirmed,confirmed_pending,completed,cancelled',
            'notes' => 'nullable|string',
            'ktp_image' => 'nullable|string',
            'payment_proof' => 'nullable|string',
            'payment_proof_settlement' => 'nullable|string',
            'penalty_amount' => 'nullable|numeric',
            'penalty_proof' => 'nullable|string',
        ]);

        $startDate = \Carbon\Carbon::parse($validated['start_date'])->toDateString();
        $endDate = \Carbon\Carbon::parse($validated['end_date'])->toDateString();

        // CEK BENTROK TANGGAL: Cegah booking jika armada sudah dikonfirmasi pada rentang tanggal yang sama
        $todayMakassar = now('Asia/Makassar')->toDateString();
        $conflict = Booking::where('car_id', $validated['car_id'])
            ->whereIn('status', ['confirmed', 'confirmed_pending'])
            ->whereDate('end_date', '>=', $todayMakassar)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('start_date', '<=', $endDate)
                      ->where('end_date', '>=', $startDate);
            })
            ->first();

        if ($conflict) {
            $conflictStart = \Carbon\Carbon::parse($conflict->start_date)->format('d M Y');
            $conflictEnd = \Carbon\Carbon::parse($conflict->end_date)->format('d M Y');
            return response()->json([
                'success' => false,
                'message' => "Maaf, armada mobil ini sudah dikonfirmasi dipesan untuk tanggal {$conflictStart} s/d {$conflictEnd}. Silakan pilih tanggal atau armada mobil lainnya.",
            ], 422);
        }

        // Generate kode transaksi unik format: RCM-XXXXXX
        $validated['booking_code'] = 'RCM-' . strtoupper(Str::random(6));
        
        // Atur status supir
        if ($request->has('with_driver')) {
            $validated['with_driver'] = (bool)$request->with_driver;
        } elseif ($request->has('driver_option')) {
            $validated['with_driver'] = ($request->driver_option === 'with_driver' || $request->driver_option === 'driver' || $request->driver_option === 'luar_kota');
        } else {
            $validated['with_driver'] = false;
        }

        // Status awal transaksi adalah 'pending' (menunggu verifikasi owner)
        $validated['status'] = $request->input('status', 'pending');

        if (empty($validated['start_time'])) {
            $validated['start_time'] = now('Asia/Makassar')->format('H:i');
        }
        if (empty($validated['end_time'])) {
            $validated['end_time'] = $validated['start_time'];
        }

        // Simpan data lampiran KTP dan bukti pembayaran
        if ($request->filled('ktp_image')) {
            $validated['ktp_image'] = $request->ktp_image;
        }
        if ($request->filled('payment_proof')) {
            $validated['payment_proof'] = $request->payment_proof;
        }
        if ($request->filled('payment_proof_settlement')) {
            $validated['payment_proof_settlement'] = $request->payment_proof_settlement;
        }
        if ($request->filled('penalty_amount')) {
            $validated['penalty_amount'] = $request->penalty_amount;
        }
        if ($request->filled('penalty_proof')) {
            $validated['penalty_proof'] = $request->penalty_proof;
        }
        if (empty($validated['payment_type'])) {
            $validated['payment_type'] = 'lunas_awal';
        }
        if ($validated['payment_type'] === 'bayar_akhir') {
            $validated['payment_method'] = null;
            $validated['dp_amount'] = 0;
        }

        // Satukan catatan tambahan (kota & titik penjemputan)
        $extraNotes = [];
        if ($request->filled('customer_city')) {
            $extraNotes[] = 'Kota: ' . $request->customer_city;
        }
        if ($request->filled('pickup_location')) {
            $extraNotes[] = 'Lokasi Jemput: ' . $request->pickup_location;
        }
        if (!empty($validated['notes'])) {
            $extraNotes[] = $validated['notes'];
        }
        if (!empty($extraNotes)) {
            $validated['notes'] = implode(' | ', $extraNotes);
        }

        // Simpan baris transaksi ke tabel 'bookings' di database MySQL
        $booking = Booking::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pemesanan berhasil dibuat',
            'data' => $booking->load('car'),
        ], 201);
    }

    /**
     * METHOD: show()
     * ----------------------------------------------------------------------
     * Fungsi: Mengambil detail satu pesanan spesifik beserta data unit mobilnya.
     * Larinya kemana: Modal preview pesanan di dashboard admin untuk melihat foto KTP & bukti bayar.
     */
    public function show(string $id)
    {
        $booking = Booking::with('car')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $booking,
        ]);
    }

    /**
     * METHOD: update()
     * ----------------------------------------------------------------------
     * Fungsi: Memperbarui data pesanan (contoh: admin menginput nominal denda keterlambatan).
     * Input dari: admin.js: handleSavePenalty()
     * Larinya kemana: Mengupdate kolom penalty_amount dan status pada tabel 'bookings'.
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);

        $validated = $request->validate([
            'car_id' => 'nullable|exists:cars,id',
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'event_type' => 'nullable|string|max:100',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'start_time' => 'nullable|string|max:50',
            'end_time' => 'nullable|string|max:50',
            'with_driver' => 'nullable|boolean',
            'driver_option' => 'nullable|string',
            'total_price' => 'nullable|numeric',
            'payment_type' => 'nullable|string|max:50',
            'payment_method' => 'nullable|string|max:50',
            'dp_amount' => 'nullable|numeric',
            'status' => 'nullable|in:pending,confirmed,confirmed_pending,completed,cancelled',
            'notes' => 'nullable|string',
            'ktp_image' => 'nullable|string',
            'payment_proof' => 'nullable|string',
            'payment_proof_settlement' => 'nullable|string',
            'penalty_amount' => 'nullable|numeric',
            'penalty_proof' => 'nullable|string',
        ]);

        if ($request->has('driver_option')) {
            $validated['with_driver'] = ($request->driver_option === 'with_driver' || $request->driver_option === 'driver' || $request->driver_option === 'luar_kota');
        }

        $updatePayload = [];
        foreach ($validated as $key => $val) {
            if ($request->exists($key) || $key === 'with_driver') {
                $updatePayload[$key] = $val;
            }
        }

        if (($updatePayload['payment_type'] ?? $booking->payment_type) === 'bayar_akhir') {
            $updatePayload['payment_method'] = null;
            $updatePayload['dp_amount'] = 0;
        }

        // Kunci integritas: Jika pesanan sudah disetujui (confirmed), hanya boleh ditutup menjadi selesai (completed)
        if ($booking->status === 'confirmed' && isset($updatePayload['status']) && !in_array($updatePayload['status'], ['confirmed', 'completed'])) {
            $updatePayload['status'] = 'confirmed';
        }

        $booking->update($updatePayload);

        return response()->json([
            'success' => true,
            'message' => 'Data pemesanan berhasil diperbarui',
            'data' => $booking->load('car'),
        ]);
    }

    /**
     * METHOD: updateStatus()
     * ----------------------------------------------------------------------
     * Fungsi: 
     * Mengubah status pesanan secara instan dari tabel admin:
     * - 'confirmed' (Disetujui/Terverifikasi) -> Mobil otomatis menjadi 'in_use' pada tanggal sewa.
     * - 'completed' (Selesai/Mobil Dikembalikan) -> Sewa ditutup, mobil kembali 'ready'.
     * - 'cancelled' (Dibatalkan) -> Jadwal sewa dilepaskan.
     * 
     * Input dari: admin.js: handleBookingStatusChange()
     * Larinya kemana: Memperbarui kolom 'status' pada tabel 'bookings' di database MySQL.
     */
    public function updateStatus(Request $request, string $id)
    {
        $status = strtolower($request->input('status', ''));
        if ($status === 'verifikasi' || $status === 'terverifikasi' || $status === 'dikonfirmasi') {
            $status = 'confirmed';
        } elseif ($status === 'confirmed_pending' || $status === 'verifikasi_menunggu' || str_contains($status, 'verifikasi + menunggu') || str_contains($status, 'verifikasi+menunggu')) {
            $status = 'confirmed_pending';
        } elseif ($status === 'selesai' || $status === 'completed') {
            $status = 'completed';
        } elseif ($status === 'menunggu pembayaran' || $status === 'menunggu' || $status === 'pending') {
            $status = 'pending';
        } elseif ($status === 'dibatalkan' || $status === 'dibatalakn' || $status === 'batal' || $status === 'cancelled') {
            $status = 'cancelled';
        }

        $request->merge(['status' => $status]);

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,confirmed_pending,completed,cancelled',
        ]);

        $booking = Booking::findOrFail($id);

        if ($booking->status === 'confirmed' && !in_array($validated['status'], ['confirmed', 'completed'])) {
            return response()->json([
                'success' => false,
                'message' => 'Status pemesanan yang telah Terverifikasi hanya dapat diubah menjadi Selesai.',
            ], 422);
        }

        $booking->status = $validated['status'];
        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Status pemesanan berhasil diperbarui',
            'data' => $booking,
        ]);
    }

    /**
     * METHOD: destroy()
     * ----------------------------------------------------------------------
     * Fungsi: Menghapus data transaksi pemesanan dari database.
     * Input dari: admin.js saat admin menghapus pesanan yang dibatalkan.
     * Larinya kemana: Mengeksekusi DELETE FROM bookings WHERE id = :id di MySQL.
     */
    public function destroy(string $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pemesanan berhasil dihapus',
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    /**
     * Display a listing of bookings.
     */
    public function index(Request $request)
    {
        $query = Booking::with('car');

        if ($request->has('car_id') && $request->car_id != '') {
            $query->where('car_id', $request->car_id);
        }

        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        $bookings = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $bookings,
        ]);
    }

    /**
     * Store a newly created booking in storage.
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
            'with_driver' => 'nullable|boolean',
            'driver_option' => 'nullable|string',
            'total_price' => 'required|numeric',
            'status' => 'nullable|in:pending,confirmed,completed,cancelled',
            'notes' => 'nullable|string',
            'ktp_image' => 'nullable|string',
        ]);

        $startDate = \Carbon\Carbon::parse($validated['start_date'])->toDateString();
        $endDate = \Carbon\Carbon::parse($validated['end_date'])->toDateString();

        // Cegah booking mobil jika sudah berstatus 'confirmed' pada tanggal yang sama / bentrok
        $conflict = Booking::where('car_id', $validated['car_id'])
            ->where('status', 'confirmed')
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

        $validated['booking_code'] = 'RCM-' . strtoupper(Str::random(6));
        
        if ($request->has('with_driver')) {
            $validated['with_driver'] = (bool)$request->with_driver;
        } elseif ($request->has('driver_option')) {
            $validated['with_driver'] = ($request->driver_option === 'with_driver' || $request->driver_option === 'driver' || $request->driver_option === 'luar_kota');
        } else {
            $validated['with_driver'] = false;
        }

        $validated['status'] = $request->input('status', 'pending');

        if ($request->filled('ktp_image')) {
            $validated['ktp_image'] = $request->ktp_image;
        }

        // Satukan catatan tambahan jika ada lokasi jemput atau kota pengorder
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

        $booking = Booking::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pemesanan berhasil dibuat',
            'data' => $booking->load('car'),
        ], 201);
    }

    /**
     * Display the specified booking.
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
     * Update the specified booking in storage.
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
            'with_driver' => 'nullable|boolean',
            'driver_option' => 'nullable|string',
            'total_price' => 'nullable|numeric',
            'status' => 'nullable|in:pending,confirmed,completed,cancelled',
            'notes' => 'nullable|string',
            'ktp_image' => 'nullable|string',
        ]);

        if ($request->has('driver_option')) {
            $validated['with_driver'] = ($request->driver_option === 'with_driver' || $request->driver_option === 'driver' || $request->driver_option === 'luar_kota');
        }

        $booking->update(array_filter($validated, fn($val) => $val !== null));

        return response()->json([
            'success' => true,
            'message' => 'Data pemesanan berhasil diperbarui',
            'data' => $booking->load('car'),
        ]);
    }

    /**
     * Update booking status.
     */
    public function updateStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->status = $validated['status'];
        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Status pemesanan berhasil diperbarui',
            'data' => $booking,
        ]);
    }

    /**
     * Remove the specified booking.
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

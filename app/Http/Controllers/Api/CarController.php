<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;

class CarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Car::query();

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($request->has('category') && $request->category != 'semua' && $request->category != '') {
            $query->where('category', $request->category);
        }

        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        $cars = $query->orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar armada mobil berhasil diambil',
            'data' => $cars,
        ]);
    }

    /**
     * Store a newly created resource in storage.
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
            'status' => 'required|in:ready,in_use,maintenance',
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('cars', 'public');
            $validated['image'] = asset('storage/' . $path);
        }

        if (empty($validated['car_code'])) {
            $validated['car_code'] = 'car-' . str_pad(Car::max('id') + 1, 2, '0', STR_PAD_LEFT);
        }

        $car = Car::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Armada mobil berhasil ditambahkan',
            'data' => $car,
        ], 201);
    }

    /**
     * Display the specified resource.
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
     * Update the specified resource in storage.
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
     * Remove the specified resource from storage.
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
     * Update status of car
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

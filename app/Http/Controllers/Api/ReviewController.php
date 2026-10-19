<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews.
     */
    public function index(Request $request)
    {
        $query = Review::query();

        // If status filter is passed (e.g. status=all for admin), otherwise default to 'approved' for public view
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        } elseif (!$request->has('status')) {
            $query->where('status', 'approved');
        }

        $reviews = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar review berhasil diambil',
            'data' => $reviews,
        ]);
    }

    /**
     * Store a newly created review (Public customer submission or Admin addition).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'car_name' => 'nullable|string|max:100',
            'comment' => 'required|string',
            'avatar' => 'nullable|string',
            'avatar_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'status' => 'nullable|in:pending,approved,rejected',
        ]);

        if ($request->hasFile('avatar_file')) {
            $path = $request->file('avatar_file')->store('avatars', 'public');
            $validated['avatar'] = asset('storage/' . $path);
        }

        // Default status is pending unless specified (e.g., admin manual entry)
        if (empty($validated['status'])) {
            $validated['status'] = 'pending';
        }

        $review = Review::create($validated);

        return response()->json([
            'success' => true,
            'message' => $review->status === 'approved' 
                ? 'Review berhasil ditambahkan dan langsung dipublikasikan.' 
                : 'Review berhasil dikirim! Menunggu verifikasi dari Admin.',
            'data' => $review,
        ], 201);
    }

    /**
     * Update full review details (Admin update or photo upload).
     */
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'car_name' => 'nullable|string|max:100',
            'comment' => 'sometimes|required|string',
            'avatar' => 'nullable|string',
            'avatar_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'status' => 'sometimes|required|in:pending,approved,rejected',
        ]);

        if ($request->hasFile('avatar_file')) {
            $path = $request->file('avatar_file')->store('avatars', 'public');
            $validated['avatar'] = asset('storage/' . $path);
        }

        $review->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Review berhasil diperbarui',
            'data' => $review,
        ]);
    }

    /**
     * Update review status (Admin moderation).
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $review = Review::findOrFail($id);
        $review->status = $validated['status'];
        $review->save();

        return response()->json([
            'success' => true,
            'message' => 'Status review berhasil diperbarui',
            'data' => $review,
        ]);
    }

    /**
     * Display the specified review.
     */
    public function show($id)
    {
        $review = Review::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $review,
        ]);
    }

    /**
     * Remove the specified review from storage.
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review berhasil dihapus',
        ]);
    }
}

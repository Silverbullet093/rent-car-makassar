<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

/**
 * Controller API ReviewController
 * --------------------------------------------------------------------------
 * Fungsi Utama:
 * Mengelola sistem testimoni & ulasan pelanggan, moderasi konten (approval system),
 * serta penanganan upload foto avatar dan media story dokumentasi rental (artis/pejabat).
 * 
 * Alur Data (Larinya kemana):
 * - Input:
 *   1. Form ulasan pelanggan di halaman utama (public/js/app.js: submitReview)
 *   2. Kontrol moderasi & tambah ulasan artis dari dashboard admin (public/js/admin.js)
 * - Output:
 *   1. Disimpan di tabel 'reviews' di database MySQL
 *   2. Ulasan yang disetujui (status='approved') dikirim ke app.js untuk ditampilkan di slider testimoni
 */
class ReviewController extends Controller
{
    /**
     * METHOD: index()
     * ----------------------------------------------------------------------
     * Fungsi: 
     * Mengambil daftar ulasan dari tabel 'reviews'.
     * 
     * Logika Moderasi:
     * - Jika dipanggil oleh Pelanggan (tanpa parameter status):
     *   HANYA mengambil ulasan berstatus 'approved' (disetujui) demi mencegah spam atau kata kotor tayang langsung.
     * - Jika dipanggil oleh Admin (status=all):
     *   Mengambil seluruh ulasan termasuk yang berstatus 'pending' agar bisa diverifikasi.
     * 
     * Larinya kemana:
     * - Frontend Pelanggan -> app.js: fetchReviewsApi() -> memicu renderReviews()
     * - Frontend Admin -> admin.js: fetchAdminReviews() -> memicu renderReviewsTable()
     */
    public function index(Request $request)
    {
        try {
            $query = Review::query();

            // Filter status: jika ada parameter status bukan 'all', filter sesuai parameter
            // Jika tidak ada parameter (publik), default HANYA mengambil status 'approved'
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
     * Menerima ulasan baru dari formulir testimoni di website utama atau input manual dari admin.
     * 
     * Alur Eksekusi:
     * 1. Validasi rating bintang (1-5), nama, dan komentar testimoni.
     * 2. Menghandle upload foto profil avatar atau video story (jika ada).
     * 3. Jika dikirim dari pelanggan umum, status otomatis diatur menjadi 'pending'.
     *    Jika diinput oleh admin, status bisa langsung 'approved'.
     * 4. Menjalankan Review::create() untuk menulis baris baru ke tabel 'reviews' di MySQL.
     * 
     * Larinya kemana:
     * - Tersimpan di tabel 'reviews'.
     * - Muncul di dashboard admin pada tab "Moderasi Review" dengan label kuning (Pending).
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
            'user_type' => 'nullable|string|max:30',
            'stories' => 'nullable',
            'story_files' => 'nullable|array',
            'story_files.*' => 'file|mimes:jpeg,png,jpg,webp,gif,mp4,webm,mov,avi,mkv,m4v|max:51200',
            'media' => 'nullable|string',
            'media_type' => 'nullable|string|max:50',
            'media_file' => 'nullable|file|mimes:jpeg,png,jpg,webp,gif,mp4,webm,mov|max:51200',
            'status' => 'nullable|in:pending,approved,rejected',
        ]);

        $payload = $this->prepareReviewPayload($request, $validated, false);

        // Jika pengirim tidak menentukan status (pelanggan umum), beri status 'pending'
        if (empty($payload['status'])) {
            $payload['status'] = 'pending';
        }

        $review = Review::create($payload);

        return response()->json([
            'success' => true,
            'message' => $review->status === 'approved'
                ? 'Review berhasil ditambahkan dan langsung dipublikasikan.'
                : 'Review berhasil dikirim! Menunggu verifikasi dari Admin.',
            'data' => $review,
        ], 201);
    }

    /**
     * METHOD: update()
     * ----------------------------------------------------------------------
     * Fungsi: Memperbarui isi ulasan, rating, atau mengganti media foto/video testimoni.
     * Input dari: admin.js saat admin mengedit review.
     * Larinya kemana: Mengupdate baris data pada tabel 'reviews' di database MySQL.
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
            'user_type' => 'nullable|string|max:30',
            'stories' => 'nullable',
            'story_files' => 'nullable|array',
            'story_files.*' => 'file|mimes:jpeg,png,jpg,webp,gif,mp4,webm,mov,avi,mkv,m4v|max:51200',
            'media' => 'nullable|string',
            'media_type' => 'nullable|string|max:50',
            'media_file' => 'nullable|file|mimes:jpeg,png,jpg,webp,gif,mp4,webm,mov|max:51200',
            'status' => 'sometimes|required|in:pending,approved,rejected',
        ]);

        $payload = $this->prepareReviewPayload($request, $validated, true);
        $review->update($payload);

        return response()->json([
            'success' => true,
            'message' => 'Review berhasil diperbarui',
            'data' => $review->fresh(),
        ]);
    }

    /**
     * METHOD: updateStatus()
     * ----------------------------------------------------------------------
     * Fungsi: 
     * Memproses moderasi persetujuan testimoni (Approve / Reject).
     * 
     * Input dari: 
     * Tombol 'Setujui' atau 'Tolak' di admin dashboard -> admin.js: handleApproveReview()
     * 
     * Larinya kemana:
     * Mengupdate kolom 'status' pada tabel 'reviews'. 
     * Begitu status berubah menjadi 'approved', ulasan tersebut langsung resmi tayang di landing page publik!
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $review = Review::findOrFail($id);
        $review->status = $request->status;
        $review->save();

        return response()->json([
            'success' => true,
            'message' => 'Status review berhasil diubah menjadi ' . $request->status,
            'data' => $review,
        ]);
    }

    /**
     * METHOD: destroy()
     * ----------------------------------------------------------------------
     * Fungsi: Menghapus ulasan tidak layak dari database.
     * Input dari: admin.js saat admin mengklik ikon hapus pada ulasan.
     * Larinya kemana: Mengeksekusi DELETE FROM reviews WHERE id = :id di MySQL.
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

    /**
     * Helper privat untuk menyiapkan payload ulasan & upload file media
     */
    private function prepareReviewPayload(Request $request, array $validated, bool $isUpdate = false): array
    {
        $payload = $validated;

        // Simpan upload avatar jika ada
        if ($request->hasFile('avatar_file')) {
            $avatarPath = $request->file('avatar_file')->store('reviews/avatars', 'public');
            $payload['avatar'] = asset('storage/' . $avatarPath);
        }

        // Simpan upload single media utama (foto/video) jika ada
        if ($request->hasFile('media_file')) {
            $file = $request->file('media_file');
            $mime = $file->getMimeType();
            $folder = str_starts_with($mime, 'video/') ? 'reviews/videos' : 'reviews/images';
            $mediaPath = $file->store($folder, 'public');
            $payload['media'] = asset('storage/' . $mediaPath);
            $payload['media_type'] = str_starts_with($mime, 'video/') ? 'video' : 'image';
        }

        return $payload;
    }
}

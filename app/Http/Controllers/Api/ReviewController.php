<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews.
     */
    public function index(Request $request)
    {
        try {
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
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database tidak tersedia, menggunakan data lokal.',
                'data' => [],
            ], 200);
        }
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
     * Update full review details (Admin update, category toggle, or media upload).
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

    /**
     * Normalize user_type, avatar upload, and multi-media stories array.
     */
    private function prepareReviewPayload(Request $request, array $validated, bool $isUpdate): array
    {
        unset($validated['avatar_file'], $validated['story_files'], $validated['media_file']);

        if (array_key_exists('user_type', $validated) || !$isUpdate) {
            $rawType = strtolower(trim((string) ($validated['user_type'] ?? 'regular')));
            $validated['user_type'] = in_array($rawType, ['artis', 'artist', 'vip'], true) ? 'artis' : 'regular';
        }

        if ($request->hasFile('avatar_file')) {
            $validated['avatar'] = $this->persistUploadedMedia($request->file('avatar_file'), 'reviews/avatars');
        }

        $hasStoryInput = $request->exists('stories') || $request->hasFile('story_files') || $request->hasFile('media_file') || $request->filled('media');

        if ($hasStoryInput) {
            $storiesList = [];

            if ($request->filled('stories')) {
                $rawStories = $request->input('stories');
                $decoded = is_array($rawStories) ? $rawStories : json_decode((string) $rawStories, true);

                if (is_array($decoded)) {
                    foreach ($decoded as $item) {
                        if (is_array($item) && !empty($item['url'])) {
                            $url = (string) $item['url'];
                            $type = !empty($item['type']) ? (string) $item['type'] : $this->inferMediaType($url);
                            $storiesList[] = [
                                'url' => $url,
                                'type' => $type === 'video' ? 'video' : 'image',
                            ];
                        }
                    }
                }
            }

            if ($request->hasFile('story_files')) {
                foreach ($request->file('story_files') as $file) {
                    if ($file instanceof UploadedFile && $file->isValid()) {
                        $type = str_starts_with((string) $file->getMimeType(), 'video/') ? 'video' : 'image';
                        $storiesList[] = [
                            'url' => $this->persistUploadedMedia($file, 'reviews/stories'),
                            'type' => $type,
                        ];
                    }
                }
            }

            if ($request->hasFile('media_file')) {
                $file = $request->file('media_file');
                if ($file instanceof UploadedFile && $file->isValid()) {
                    $type = str_starts_with((string) $file->getMimeType(), 'video/') ? 'video' : 'image';
                    $storiesList[] = [
                        'url' => $this->persistUploadedMedia($file, 'reviews/stories'),
                        'type' => $type,
                    ];
                }
            } elseif (empty($storiesList) && $request->filled('media')) {
                $mediaUrl = (string) $request->input('media');
                $mediaType = (string) ($request->input('media_type') ?: $this->inferMediaType($mediaUrl));
                $storiesList[] = [
                    'url' => $mediaUrl,
                    'type' => $mediaType === 'video' ? 'video' : 'image',
                ];
            }

            $validated['stories'] = $storiesList;
            if (!empty($storiesList)) {
                $validated['media'] = $storiesList[0]['url'];
                $validated['media_type'] = $storiesList[0]['type'];
            } else {
                $validated['media'] = null;
                $validated['media_type'] = null;
            }
        }

        return $validated;
    }

    /**
     * Store uploaded image/video in public storage (or inline base64 on ephemeral Vercel runtime when small).
     */
    private function persistUploadedMedia(UploadedFile $file, string $directory): string
    {
        if (env('VERCEL') && $file->getSize() <= 3 * 1024 * 1024) {
            $mime = $file->getMimeType() ?: 'application/octet-stream';
            return 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($file->getRealPath()));
        }

        $path = $file->store($directory, 'public');
        return '/storage/' . $path;
    }

    private function inferMediaType(string $url): string
    {
        $lower = strtolower($url);
        if (str_starts_with($lower, 'data:video/') || preg_match('/\.(mp4|webm|mov|avi|mkv|m4v)(\?|$)/', $lower)) {
            return 'video';
        }
        return 'image';
    }
}

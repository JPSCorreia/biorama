<?php

namespace App\Http\Controllers;

use App\Models\StoreReview;
use Illuminate\Http\Request;

class StoreReviewController extends Controller
{
    public function index()
    {
        return response()->json(StoreReview::with('store', 'user')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'user_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $storeReview = StoreReview::create($validated);
        return redirect()->back()->with([
            'message' => 'Review enviada com sucesso!',
            'type'    => 'success'
        ]);

    }

    public function show(StoreReview $storeReview)
    {
        return response()->json($storeReview->load('store', 'user'));
    }

    public function update(Request $request, StoreReview $storeReview)
    {
        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $storeReview->update($validated);
        return response()->json($storeReview);
    }

    public function destroy(StoreReview $storeReview)
    {
        $storeReview->delete();
        return response()->json(null, 204);
    }
}

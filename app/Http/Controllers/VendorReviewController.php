<?php

namespace App\Http\Controllers;

use App\Models\VendorReview;
use Illuminate\Http\Request;

class VendorReviewController extends Controller
{
    public function index()
    {
        return response()->json(VendorReview::with('vendor', 'user')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'user_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $vendorReview = VendorReview::create($validated);
        return response()->json($vendorReview, 201);
    }

    public function show(VendorReview $vendorReview)
    {
        return response()->json($vendorReview->load('vendor', 'user'));
    }

    public function update(Request $request, VendorReview $vendorReview)
    {
        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $vendorReview->update($validated);
        return response()->json($vendorReview);
    }

    public function destroy(VendorReview $vendorReview)
    {
        $vendorReview->delete();
        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\StoreGallery;
use Illuminate\Http\Request;

class StoreGalleryController extends Controller
{
    public function index()
    {
        return response()->json(StoreGallery::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'image_link' => 'required|url',
        ]);

        $storeGallery = StoreGallery::create($validated);
        return response()->json($storeGallery, 201);
    }

    public function show(StoreGallery $storeGallery)
    {
        return response()->json($storeGallery);
    }

    public function update(Request $request, StoreGallery $storeGallery)
    {
        $validated = $request->validate([
            'image_link' => 'sometimes|url',
        ]);

        $storeGallery->update($validated);
        return response()->json($storeGallery);
    }

    public function destroy(StoreGallery $storeGallery)
    {
        $storeGallery->delete();
        return response()->json(null, 204);
    }
}

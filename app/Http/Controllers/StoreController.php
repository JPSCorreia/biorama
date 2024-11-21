<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function index()
    {
        return response()->json(Store::with('vendor', 'products')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'name' => 'required|string|max:100|unique:stores',
            'phone_number' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:255|unique:stores',
            'description' => 'nullable|string',
            'image_link' => 'nullable|url',
            'street_address' => 'required|string|max:255',
            'city' => 'required|string|max:50',
            'postal_code' => 'required|string|max:10',
            'rating' => 'nullable|numeric|min:0|max:5',
            'coordinates' => 'nullable|string',
        ]);

        $store = Store::create($validated);
        return response()->json($store, 201);
    }

    public function show(Store $store)
    {
        return response()->json($store->load('vendor', 'products'));
    }

    public function update(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100|unique:stores,name,' . $store->id,
            'email' => 'nullable|email|max:255|unique:stores,email,' . $store->id,
            'phone_number' => 'nullable|string|max:15',
            'description' => 'nullable|string',
            'street_address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:50',
            'postal_code' => 'sometimes|string|max:10',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $store->update($validated);
        return response()->json($store);
    }

    public function destroy(Store $store)
    {
        $store->delete();
        return response()->json(null, 204);
    }
}

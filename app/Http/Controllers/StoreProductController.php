<?php

namespace App\Http\Controllers;

use App\Models\StoreProduct;
use Illuminate\Http\Request;

class StoreProductController extends Controller
{
    public function index()
    {
        return response()->json(StoreProduct::with('store', 'product')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'product_id' => 'required|exists:products,id',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:1',
            'stock' => 'required|integer|min:0',
        ]);

        $storeProduct = StoreProduct::create($validated);
        return response()->json($storeProduct, 201);
    }

    public function show(StoreProduct $storeProduct)
    {
        return response()->json($storeProduct->load('store', 'product'));
    }

    public function update(Request $request, StoreProduct $storeProduct)
    {
        $validated = $request->validate([
            'description' => 'nullable|string|max:1000',
            'price' => 'sometimes|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:1',
            'stock' => 'sometimes|integer|min:0',
        ]);

        $storeProduct->update($validated);
        return response()->json($storeProduct);
    }

    public function destroy(StoreProduct $storeProduct)
    {
        $storeProduct->delete();
        return response()->json(null, 204);
    }
}

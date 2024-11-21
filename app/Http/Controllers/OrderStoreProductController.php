<?php

namespace App\Http\Controllers;

use App\Models\OrderStoreProduct;
use Illuminate\Http\Request;

class OrderStoreProductController extends Controller
{
    public function index()
    {
        return response()->json(OrderStoreProduct::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'store_product_id' => 'required|exists:store_products,id',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:1',
            'quantity' => 'required|integer|min:1',
        ]);

        $orderStoreProduct = OrderStoreProduct::create($validated);
        return response()->json($orderStoreProduct, 201);
    }

    public function show(OrderStoreProduct $orderStoreProduct)
    {
        return response()->json($orderStoreProduct);
    }

    public function update(Request $request, OrderStoreProduct $orderStoreProduct)
    {
        $validated = $request->validate([
            'price' => 'sometimes|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:1',
            'quantity' => 'sometimes|integer|min:1',
        ]);

        $orderStoreProduct->update($validated);
        return response()->json($orderStoreProduct);
    }

    public function destroy(OrderStoreProduct $orderStoreProduct)
    {
        $orderStoreProduct->delete();
        return response()->json(null, 204);
    }
}

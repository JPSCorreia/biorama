<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with('user', 'store', 'homeAddress')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'store_id' => 'required|exists:stores,id',
            'home_address_id' => 'required|exists:home_addresses,id',
            'total_price' => 'required|numeric|min:0',
        ]);

        $order = Order::create($validated);
        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        return response()->json($order->load('user', 'store', 'homeAddress'));
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'total_price' => 'sometimes|numeric|min:0',
        ]);

        $order->update($validated);
        return response()->json($order);
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(null, 204);
    }
}


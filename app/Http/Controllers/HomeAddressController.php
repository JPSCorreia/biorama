<?php

namespace App\Http\Controllers;

use App\Models\HomeAddress;
use Illuminate\Http\Request;

class HomeAddressController extends Controller
{
    public function index()
    {
        return response()->json(HomeAddress::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'address_name' => 'required|string|max:100',
            'phone_number' => 'nullable|string|max:15',
            'street_address' => 'required|string|max:255',
            'postal_code' => 'required|string|max:10',
            'city' => 'required|string|max:50',
            'is_primary' => 'nullable|boolean',
            'comment' => 'nullable|string',
        ]);

        $homeAddress = HomeAddress::create($validated);
        return response()->json($homeAddress, 201);
    }

    public function show(HomeAddress $homeAddress)
    {
        return response()->json($homeAddress);
    }

    public function update(Request $request, HomeAddress $homeAddress)
    {
        $validated = $request->validate([
            'address_name' => 'sometimes|string|max:100',
            'phone_number' => 'nullable|string|max:15',
            'street_address' => 'sometimes|string|max:255',
            'postal_code' => 'sometimes|string|max:10',
            'city' => 'sometimes|string|max:50',
            'is_primary' => 'nullable|boolean',
            'comment' => 'nullable|string',
        ]);

        $homeAddress->update($validated);
        return response()->json($homeAddress);
    }

    public function destroy(HomeAddress $homeAddress)
    {
        $homeAddress->delete();
        return response()->json(null, 204);
    }
}

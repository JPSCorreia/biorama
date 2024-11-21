<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index()
    {
        return response()->json(Vendor::with('user')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'nif' => 'required|digits:9|unique:vendors',
        ]);

        $vendor = Vendor::create($validated);
        return response()->json($vendor, 201);
    }

    public function show(Vendor $vendor)
    {
        return response()->json($vendor->load('user'));
    }

    public function update(Request $request, Vendor $vendor)
    {
        $validated = $request->validate([
            'nif' => 'sometimes|digits:9|unique:vendors,nif,' . $vendor->id,
        ]);

        $vendor->update($validated);
        return response()->json($vendor);
    }

    public function destroy(Vendor $vendor)
    {
        $vendor->delete();
        return response()->json(null, 204);
    }
}

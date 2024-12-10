<?php

namespace App\Http\Controllers;

use App\Http\Requests\VendorRequest;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VendorController extends Controller
{

    public function index()
    {
        return response()->json(Vendor::with('user')->get());
    }

    public function create()
    {
        $user = Auth::user();
        return inertia('RegisterVendor', [
            'user' => $user
        ]);
    }

    public function store(VendorRequest $request)
    {

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

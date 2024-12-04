<?php

namespace App\Http\Controllers;

use App\Http\Requests\VendorRequest;
use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{

    public function index()
    {
        return response()->json(Vendor::with('user')->get());
    }

    public function create()
    {
        return inertia('RegisterVendor');
    }

    public function store(VendorRequest $request)
    {

        dd($request->validated());

        $validatedData = $request->validated();

        if ($validatedData->hasFile('vendor_photo')) {
            $image = $validatedData->file('vendor_photo');
            $imageName = 'vendor_' . $validatedData->id . '.' . $image->getClientOriginalExtension();
            $image_path = $image->storeAs('vendor_photos', $imageName, 'public');
            $validatedData['vendor_photo'] = 'storage/' . $image_path;
        }

        try {
            $vendor = Vendor::create($validatedData);
            return response()->json($vendor, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao criar o vendedor'], 500);
        }
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

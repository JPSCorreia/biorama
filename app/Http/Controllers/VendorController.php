<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Requests\VendorRequest;
use App\Models\Gender;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VendorController extends Controller
{


    public function index()
    {
        $user = Auth::user();

        // Renderiza a página Vendors
        return Inertia::render('Vendors', [
            'user' => $user,
        ]);
    }

    public function create()
    {
        $user = Auth::user();

        $genders = Gender::all();

        return inertia('RegisterVendor', [
            'user' => $user,
            'genders' => $genders,
        ]);
    }

    public function store(VendorRequest $vendorRequest)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Utilizador não autenticado'], 403);
            }

            $validatedVendorData = $vendorRequest->validated();
            $validatedVendorData['date_of_birth'] = date('Y-m-d', strtotime($validatedVendorData['date_of_birth']));

            $vendor = $user->vendor()->create($validatedVendorData);
            $user->assignRole('vendor');
            $user->load(['roles', 'vendor']);

            // Se for um pedido Inertia, envia JSON corretamente
            return response()->json([
                'message' => 'Vendedor registado com sucesso.',
                'user' => $user,
                'vendor' => $vendor,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao registar o vendedor.',
                'details' => $e->getMessage(),
            ], 500);
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

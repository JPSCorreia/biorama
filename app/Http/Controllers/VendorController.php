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

    public function store(UserRequest $userRequest, VendorRequest $vendorRequest)
    {
        try {
            // Obter o utilizador autenticado
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Utilizador não autenticado'], 403);
            }

            // Validar os dados do utilizador
            $validatedUserData = $userRequest->validated();

            // Converta a data para o formato correto
            $validatedUserData['date_of_birth'] = date('Y-m-d', strtotime($validatedUserData->date_of_birth));

            // Atualizar os dados do utilizador na tabela `users`
            $user->update($validatedUserData);
            $user->save();

            // Validar os dados do vendor
            $validatedVendorData = $vendorRequest->validated();

            // Criar o registo do vendedor na tabela `vendors`
            $vendor = Vendor::create($validatedVendorData);

            $user->assignRole('vendor');

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

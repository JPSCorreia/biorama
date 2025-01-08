<?php

namespace App\Http\Controllers;

use App\Models\HomeAddress;
use App\Models\User;
use Illuminate\Http\Request;

class HomeAddressController extends Controller
{
    public function index()
    {
        return response()->json(HomeAddress::all());
    }

    public function store(Request $request)
    {
        // Valida os dados recebidos
        $validated = $request->validate([
            'address_name' => 'required|string|max:100',
            'phone_number' => 'nullable|string|max:15',
            'street_address' => 'required|string|max:255',
            'postal_code' => 'required|string|max:10',
            'city' => 'required|string|max:50',
            'is_primary' => 'boolean',
            'comment' => 'nullable|string',
        ]);

        // Adiciona o `user_id` automaticamente
        $validated['user_id'] = auth()->id();

        // Cria a morada
        HomeAddress::create($validated);
        $user = User::with('home_addresses')->find(auth()->id());

        return response()->json(['message' => 'Morada criada com sucesso!', 'data' => $user], 201);
    }

    public function show(HomeAddress $homeAddress)
    {
        return response()->json($homeAddress);
    }

    public function update(Request $request, HomeAddress $homeAddress)
    {
        // Validação dos dados recebidos
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
        // Se 'is_primary' for true, garantir que outras moradas do mesmo utilizador sejam desmarcadas
        if (!empty($validated['is_primary'])) {
            HomeAddress::where('user_id', $homeAddress->user_id)
                ->where('id', '!=', $homeAddress->id)
                ->update(['is_primary' => false]);
        }

        // Atualizar a morada
        $homeAddress->update($validated);
        $homeAddress->save();

        // Retornar a morada atualizada como resposta JSON
        return response()->json($homeAddress, 200);
    }



    public function destroy(HomeAddress $homeAddress)
    {
        $homeAddress->delete();
        return response()->json(null, 204);
    }

    public function setPrimary($id)
    {
        $userId = auth()->id();

        $address = HomeAddress::findOrFail($id);
        if ($address->is_primary) {
            $address->update(['is_primary' => false]);
            $address->save();
            return response()->json(200);
        }
        // Desmarca todas as moradas como favoritas
        HomeAddress::where('user_id', $userId)->update(['is_primary' => false]);

        $address->update(['is_primary' => true]);
        $address->save();
        $user = User::with('home_addresses')->find($userId);

        return response()->json([$user, 'message' => 'Morada marcada como favorita com sucesso.'], 200);
    }

}

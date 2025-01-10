<?php

namespace App\Http\Controllers;

use App\Http\Requests\HomeAddressRequest;
use App\Http\Resources\HomeAddressResource;
use App\Models\HomeAddress;
use App\Models\User;
use Illuminate\Http\Request;

class HomeAddressController extends Controller
{
    public function index()
    {
        $user = User::with('home_addresses')->find(auth()->id());
        $addresses = $user->home_addresses;
        return response()->json($addresses);
    }

    public function store(HomeAddressRequest $request)
    {
        // Validação dos dados recebidos
        $validated = $request->validated();

        $address = HomeAddress::create($validated);

        return response()->json([
            'message' => 'Morada criada com sucesso!',
            'data' => new HomeAddressResource($address),
        ], 201);
    }

    public function show(HomeAddress $homeAddress)
    {
        return response()->json($homeAddress);
    }

    public function update(HomeAddressRequest $request, $id)
    {
        $homeAddress = HomeAddress::findOrFail($id);
        // Validação dos dados recebidos
        $validated = $request->validated();

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
        return response()->json([
            'message' => 'Morada atualizada com sucesso',
            'data' => new HomeAddressResource($homeAddress),
        ], 200);
    }

    public function destroy($id)
    {
        $homeAddress = HomeAddress::findOrFail($id);
        $homeAddress->delete();
        $homeAddress->save();
        return response()->json(null, 200);
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

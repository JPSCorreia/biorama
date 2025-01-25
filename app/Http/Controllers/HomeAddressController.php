<?php

namespace App\Http\Controllers;

use App\Http\Requests\HomeAddressRequest;
use App\Http\Resources\HomeAddressResource;
use App\Models\HomeAddress;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            // Se a nova morada for marcada como favorita, desmarcar outras favoritas
            if ($validated['is_primary']) {
                HomeAddress::where('user_id', $request->user()->id)
                    ->where('is_primary', true)
                    ->update(['is_primary' => false]);
            }

            // Verifica se há uma morada "apagada" com o mesmo código postal e número
            $deletedAddress = HomeAddress::onlyTrashed()
                ->where('postal_code', $validated['postal_code'])
                ->where('number', $validated['number'])
                ->first();

            if ($deletedAddress) {
                // Restaura a morada apagada e atualiza com os novos dados
                $deletedAddress->restore();
                $deletedAddress->update($validated);
                $deletedAddress->save();
                $newAddress = $deletedAddress;
            }
            else {
                // Criar a nova morada
                $newAddress = HomeAddress::create($validated);
            }
            DB::commit();

            return response()->json([
                'message' => 'Morada criada com sucesso!',
                'data' => $newAddress,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Erro ao criar a morada.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function show(HomeAddress $homeAddress)
    {
        return response()->json($homeAddress);
    }

    public function update(HomeAddressRequest $request, $id)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            // Se a morada editada for marcada como favorita, desmarcar outras favoritas
            if ($validated['is_primary']) {
                HomeAddress::where('user_id', $request->user()->id)
                    ->where('is_primary', true)
                    ->where('id', '!=', $id) // Excluir a própria morada
                    ->update(['is_primary' => false]);
            }

            // Verifica se há uma morada "apagada" com o mesmo código postal e número
            $deletedAddress = HomeAddress::onlyTrashed()
                ->where('postal_code', $validated['postal_code'])
                ->where('number', $validated['number'])
                ->first();

            if ($deletedAddress) {
                // Restaura a morada apagada e atualiza com os novos dados
                $deletedAddress->restore();
                $deletedAddress->update($validated);
                $deletedAddress->save();
            }
            else {
                // Atualizar a morada existente
                $address = HomeAddress::findOrFail($id);
                $address->update($validated);
            }

            DB::commit();

            return response()->json([
                'message' => 'Morada atualizada com sucesso!',
                'data' => $address,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Erro ao atualizar a morada.',
                'error' => $e->getMessage(),
            ], 500);
        }
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

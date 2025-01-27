<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\StoreGallery;
use App\Models\Vendor;
use App\Models\User;

class StoreController extends Controller
{
    public function index()
    {
        return response()->json(Store::with('vendor', 'products')->get());
    }

    public function store(Request $request)
    {
        try {
            // Validação dos dados
            $validated = $request->validate([
                // Dados da loja
                'name' => 'required|string|max:100|unique:stores',
                'phone_number' => 'nullable|string|max:15',
                'email' => 'nullable|email|max:255|unique:stores',
                'description' => 'nullable|string',
                'rating' => 'nullable|numeric|min:0|max:5',
                'latitude' => 'required|numeric|min:-90|max:90',
                'longitude' => 'required|numeric|min:-180|max:180',

                // Dados do endereço
                'address_name' => 'required|string|max:255',
                'postal_code' => 'required|string|max:10',
                'city' => 'required|string|max:50',
                'comment' => 'nullable|string',
            ]);

            // Usa transações para garantir consistência
            DB::beginTransaction();

            // 1. Criar a loja
            $store = new Store();
            $store->name = $validated['name'];
            $store->phone_number = $validated['phone_number'] ?? null;
            $store->email = $validated['email'] ?? null;
            $store->description = $validated['description'] ?? null;
            $store->rating = $validated['rating'] ?? null;

            // Define as coordenadas como POINT
            $store->coordinates = DB::raw("POINT({$validated['longitude']}, {$validated['latitude']})");

            $store->save();

            // 2. Criar o endereço associado
            $storeAddress = new StoreAddress();
            $storeAddress->store_id = $store->id;
            $storeAddress->address_name = $validated['address_name'];
            $storeAddress->postal_code = $validated['postal_code'];
            $storeAddress->city = $validated['city'];
            $storeAddress->comment = $validated['comment'] ?? null;

            $storeAddress->save();

            // Confirma a transação
            DB::commit();

            // Retorna a loja criada com o endereço associado
            return response()->json([
                'store' => $store,
                'address' => $storeAddress,
            ], 201);
        } catch (\Exception $e) {
            // Reverte a transação no caso de erro
            DB::rollBack();

            return response()->json([
                'error' => 'Erro ao criar a loja e o endereço: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function show(Store $store)
    {
        return response()->json($store->load('vendor', 'products'));
    }

    public function update(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100|unique:stores,name,' . $store->id,
            'email' => 'nullable|email|max:255|unique:stores,email,' . $store->id,
            'phone_number' => 'nullable|string|max:15',
            'description' => 'nullable|string',
            'street_address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:50',
            'postal_code' => 'sometimes|string|max:10',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $store->update($validated);
        return response()->json($store);
    }

    public function destroy(Store $store)
    {
        $store->delete();
        return response()->json(null, 204);
    }

    /**
     * Retorna as lojas próximas com base na localização do utilizador.
     */
    public function getNearbyStores(Request $request)
    {

        $longitude = $request->input('longitude');
        $latitude = $request->input('latitude');
        $radius = $request->input('radius', 10000);
        $stores = Store::selectRaw("
            id,
            name,
            description,
            ST_X(coordinates) AS longitude,
            ST_Y(coordinates) AS latitude,
            ST_Distance_Sphere(
                coordinates,
                POINT(?, ?)
            ) AS distance
        ", [$longitude, $latitude])
            ->whereRaw("ST_Distance_Sphere(coordinates, POINT(?, ?)) <= ?", [$longitude, $latitude, $radius])
            ->orderBy('distance')
            ->get();

        // Opcionalmente transforma os dados em um formato JSON-friendly
        $stores = $stores->map(function ($store) {
            return [
                'id' => $store->id,
                'name' => $store->name,
                'description' => mb_convert_encoding($store->description, 'UTF-8', 'ISO-8859-1'),
                'longitude' => $store->longitude,
                'latitude' => $store->latitude,
                'distance' => $store->distance,
            ];
        });

        return response()->json($stores);


    }


    public function showStore($id)
    {
        $store = Store::selectRaw("
                id,
                vendor_id,
                name,
                phone_number,
                email,
                description,
                rating,
                created_at,
                updated_at,
                ST_X(coordinates) AS longitude,
                ST_Y(coordinates) AS latitude
            ")
            ->where('id', $id)
            ->first();

        if (!$store) {
            abort(404, 'Loja não encontrada');
        }

        // Get the store image
        $storeImage = StoreGallery::where('store_id', $id)->first();

        // Get the vendor
        $vendor = Vendor::where('id', $store->vendor_id)->first();

        // Get the user
        $user = User::where('id', $vendor->user_id)->first();

        // $products = StoreProduct::where('store_id', $id)->get();

        $products = $store->load('products');

        // Format for JSON compatibility
        $formattedStore = [
            'id' => $store->id,
            'vendor_id' => $store->vendor_id,
            'name' => $store->name,
            'phone_number' => $store->phone_number,
            'email' => $store->email,
            'description' => mb_convert_encoding($store->description, 'UTF-8', 'ISO-8859-1'),
            'rating' => $store->rating,
            'created_at' => $store->created_at,
            'updated_at' => $store->updated_at,
            'longitude' => $store->longitude,
            'latitude' => $store->latitude,
            'image_link' => $storeImage ? $storeImage->image_link : null,
        ];

        return Inertia::render('Store', [
            'store' => $formattedStore,
            'vendor' => $vendor,
            'products' => $products,
            'user' => $user
        ]);
    }


}

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Store;
use App\Models\StoreAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\StoreGallery;
use App\Models\Vendor;
use App\Models\StoreProduct;

class StoreController extends Controller
{
    public function index()
    {
        return response()->json(Store::with('vendor', 'products')->get());
    }

    public function store(Request $request)
    {
        Log::info($request->all());
        // Validação dos dados recebidos
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
            'coordinates' => 'required|string|',
            'street_address' => 'required|string|max:255',
            'city' => 'required|string|max:50',
            'postal_code' => 'required|string|max:10',
            'comment' => 'nullable|string',
            'image_link' => 'nullable|array', // Aceita um array
            'image_link.*' => 'nullable|string', // Cada item do array deve ser uma string
        ]);

        try {
            // Obter o vendor autenticado
            $vendor = Auth::user()->vendor;

            // Separar latitude e longitude
            [$latitude, $longitude] = explode(',', $validated['coordinates']);

            // Criar a loja
            $store = $vendor->stores()->create([
                'name' => $validated['name'],
                'phone_number' => $validated['phone_number'],
                'email' => $validated['email'],
                'description' => $validated['description'],
                'coordinates' => DB::raw("POINT({$longitude}, {$latitude})"),
            ]);

            // Criar o endereço associado
            $store->addresses()->create([
                'street_address' => $validated['street_address'],
                'postal_code' => $validated['postal_code'],
                'city' => $validated['city'],
                'comment' => $validated['comment'],
            ]);

            // Processar o campo image_link (array de imagens)
            $imageLinks = []; // Array para armazenar os caminhos das imagens
            if (!empty($validated['image_link'])) {
                foreach ($validated['image_link'] as $index => $base64Image) {
                    // Decodifica a string base64 para conteúdo binário
                    $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));

                    // Gera o nome do ficheiro
                    $imageName = 'store_' . $store->id . '_img' . ($index + 1) . '.jpg';

                    // Salva a imagem no diretório "storage/app/public/store"
                    $imagePath = 'store/' . $imageName;
                    file_put_contents(storage_path('app/public/' . $imagePath), $imageData);

                    // Adiciona o caminho ao array
                    $imageLinks[] = 'storage/' . $imagePath;

                    // Cria o registro na galeria
                    $store->galleries()->create([
                        'image_link' => 'storage/' . $imagePath,
                    ]);
                }
            }

            // Retornar as lojas atualizadas do vendor
            $stores = Store::where('vendor_id', $vendor->id)
                ->select(
                    'id',
                    'name',
                    'description',
                    'phone_number',
                    'email',
                    'rating',
                    DB::raw('ST_X(coordinates) as longitude'),
                    DB::raw('ST_Y(coordinates) as latitude')
                )
                ->with(['addresses', 'products', 'reviews', 'galleries'])
                ->take(3)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Loja criada com sucesso!',
                'images' => $imageLinks,
                'stores' => $stores,
            ], 201);
        } catch (\Exception $e) {
            // Retorna uma resposta JSON de erro
            return response()->json([
                'success' => false,
                'error' => 'Erro ao criar a loja: ' . $e->getMessage(),
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
            'products' => $products
        ]);
    }


}

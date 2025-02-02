<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Store;
use App\Models\StoreAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\StoreGallery;
use App\Models\Vendor;
use App\Models\User;
use App\Models\StoreReview;
use App\Models\OrderStoreProduct;


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
            'image_link' => 'nullable|array', // Array de imagens
            'image_link.*' => 'nullable|string', // Cada imagem deve ser uma string Base64
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

            // Processar imagens
            $imageLinks = [];

            if (!empty($validated['image_link'])) {
                foreach ($validated['image_link'] as $index => $base64Image) {
                    if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $matches)) {
                        $imageType = $matches[1]; // Obtém a extensão do ficheiro
                        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));

                        if ($imageData === false) {
                            throw new \Exception("Erro ao decodificar imagem base64.");
                        }

                        // Gera um nome de ficheiro único
                        $imageName = 'store_' . $store->id . '_img' . ($index + 1) . '.' . $imageType;

                        // Caminho para armazenar a imagem
                        $imagePath = "store/{$imageName}";

                        // Salva o ficheiro na pasta pública do storage
                        Storage::disk('public')->put($imagePath, $imageData);

                        // Guarda o caminho no array
                        $imageLinks[] = "storage/{$imagePath}";

                        // Guarda na galeria da loja
                        $store->galleries()->create([
                            'image_link' => "storage/{$imagePath}",
                        ]);
                    }
                }
            }

            // Formatar a loja para JSON
            $formattedStore = Store::select(
                'id',
                'name',
                'description',
                'phone_number',
                'email',
                'rating',
                DB::raw('ST_X(coordinates) as longitude'),
                DB::raw('ST_Y(coordinates) as latitude')
            )
                ->where('id', $store->id) // 🔥 Pega apenas a loja recém-criada
                ->with(['addresses', 'products', 'reviews', 'galleries'])
                ->first(); // 🔥 Como só há uma, usa `first()` ao invés de `get()`

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
                'store' => $formattedStore,
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
            ->with('galleries')
            ->whereRaw("ST_Distance_Sphere(coordinates, POINT(?, ?)) <= ?", [$longitude, $latitude, $radius])
            ->orderBy('distance')
            ->get();

        // Opcionalmente transforma os dados em um formato JSON-friendly
        $stores = $stores->map(function ($store) {
            $firstImage = $store->galleries->first();

            return [
                'id' => $store->id,
                'name' => $store->name,
                'description' => mb_convert_encoding($store->description, 'UTF-8', 'auto'),
                'longitude' => $store->longitude,
                'latitude' => $store->latitude,
                'distance' => $store->distance,
                'image_link' => $firstImage ? $firstImage->image_link : '',
            ];
        });

        return response()->json($stores);


    }

    public function showStore($id)
    {
        // Get the store
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

        // Get all products
        $products = $store->load('products')->products;

        // Get all store images
        $storeGallery = StoreGallery::where('store_id', $id)->get();

        // Get store addresses
        $storeAddress = StoreAddress::where('store_id', $id)->get();

        // Calculate vendor rating (average rating of all vendor stores)
        $vendorRating = Store::where('vendor_id', $store->vendor_id)->avg('rating');

        // Get number of reviews
        $reviewCount = StoreReview::whereIn('store_id', Store::where('vendor_id', $store->vendor_id)->pluck('id'))->count();

        // Get number of sold orders
        $orderCount = OrderStoreProduct::where('store_id', $id)->count();

        // Format for JSON compatibility
        $formattedStore = [
            'id' => $store->id,
            'vendor_id' => $store->vendor_id,
            'name' => $store->name,
            'phone_number' => $store->phone_number,
            'email' => $store->email,
            'description' => mb_convert_encoding($store->description, 'UTF-8', 'auto'),
            'rating' => $store->rating,
            'created_at' => $store->created_at,
            'updated_at' => $store->updated_at,
            'longitude' => $store->longitude,
            'latitude' => $store->latitude,
            'image_link' => $storeImage ? $storeImage->image_link : null,
        ];

        // Other section with additional information
        $other = [
            'vendor_rating' => $vendorRating,
            'review_count' => $reviewCount,
            'order_count' => $orderCount,
        ];

        return Inertia::render('Store', [
            'store' => $formattedStore,
            'vendor' => $vendor,
            'products' => $products,
            'user' => $user,
            'gallery' => $storeGallery,
            'address' => $storeAddress[0],
            'other' => $other
        ]);
    }

}

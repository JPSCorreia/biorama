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
                        $imageName = 'store_' . $store->id . '_' . uniqid() . '.' . $imageType;


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
                ->where('id', $store->id)
                ->with(['addresses', 'products', 'reviews', 'galleries'])
                ->first();

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
        //dd($request);
        // Validação dos dados recebidos
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
            'street_address' => 'required|string|max:255',
            'city' => 'required|string|max:50',
            'postal_code' => 'required|string|max:10',
            'coordinates' => 'required|string',
            'new_images' => 'nullable|array',
            'new_images.*' => 'nullable|string',
            'delete_images' => 'nullable|array', // IDs das imagens a serem apagadas

        ]);

        try {
            // Separa latitude e longitude
            [$latitude, $longitude] = explode(',', $validated['coordinates']);

            // Atualiza a loja com os novos dados
            DB::table('stores')->where('id', $store->id)->update([
                'name' => $validated['name'],
                'phone_number' => $validated['phone_number'],
                'email' => $validated['email'],
                'description' => $validated['description'],
                'coordinates' => DB::raw("ST_GeomFromText('POINT({$longitude} {$latitude})')")
            ]);

            // Atualiza a morada da loja
            $store->addresses()->update([
                'street_address' => $validated['street_address'],
                'city' => $validated['city'],
                'postal_code' => $validated['postal_code'],
            ]);

            // Apaga imagens marcadas para exclusão (soft delete)
            if (!empty($validated['delete_images'])) {
                $store->galleries()->whereIn('id', $validated['delete_images'])->delete();
            }

            // processa as novas imagens em base64, se houver
            if (!empty($validated['new_images'])) {
                $imageLinks = []; // Array para armazenar os caminhos das novas imagens

                foreach ($validated['new_images'] as $index => $base64Image) {
                    // Verifica e extrai o tipo da imagem base64
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

                        // Registra no banco de dados
                        $store->galleries()->create([
                            'image_link' => "storage/{$imagePath}",
                        ]);
                    } else {
                        throw new \Exception("Formato de imagem inválido.");
                    }
                }
            }


            // Formata a store para enviar as coordinadas separadas
            $updatedStore = Store::select(
                'id',
                'name',
                'description',
                'phone_number',
                'email',
                'rating',
                DB::raw('ST_X(coordinates) as longitude'),
                DB::raw('ST_Y(coordinates) as latitude')
            )
                ->where('id', $store->id)
                ->with(['addresses', 'galleries', 'reviews', 'products'])
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'Loja atualizada com sucesso!',
                'store' => $updatedStore,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar a loja: ' . $e->getMessage(),
            ], 500);
        }
    }



    public function destroy(Store $store)
    {
        $store->delete();
        return response()->json(null, 204);
    }


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


        // Get all products and load the product images
        $products = $store->load('products.gallery')->products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'discount' => $product->discount,
                'stock' => $product->stock,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
                'image_link' => $product->gallery->first()?->image_link, // Pega a primeira imagem associada ao produto
            ];
        });

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

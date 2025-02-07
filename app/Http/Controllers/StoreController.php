<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Support\Facades\Auth;
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
use Illuminate\Support\Facades\Cache;
use App\Http\Resources\StoreResource;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        // Obtém os filtros da query string
        $search = $request->input('search');
        $radius = $request->input('radius', 30); // Raio predefinido: 30km
        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');

        // Cache key para evitar consultas repetidas
        $cacheKey = "stores:{$search}:{$latitude}:{$longitude}:{$radius}";

        $stores = Cache::remember($cacheKey, 60, function () use ($search, $latitude, $longitude, $radius) {
            // Query base para buscar lojas otimizadas
            $query = Store::select('id', 'name', 'description', 'rating', 'phone_number', 'email', 'created_at', 'updated_at')
                ->with([
                    'addresses' => function ($query) {
                        $query->select(
                            'id',
                            'store_id',
                            'street_address',
                            'city',
                            'postal_code',
                            DB::raw('ST_X(coordinates) as longitude'),
                            DB::raw('ST_Y(coordinates) as latitude')
                        );
                    },
                    'galleries'
                ]);

            // Filtro por cidade
            if ($search) {
                $query->whereHas('addresses', function ($q) use ($search) {
                    $q->where('city', 'LIKE', "%{$search}%");
                });

                // Otimizar a consulta para média das coordenadas
                $center = DB::table('store_addresses')
                    ->selectRaw("AVG(ST_X(coordinates)) as avg_longitude, AVG(ST_Y(coordinates)) as avg_latitude")
                    ->where('city', 'LIKE', "%{$search}%")
                    ->first();

                if (!empty($center->avg_latitude) && !empty($center->avg_longitude)) {
                    $query->orWhereHas('addresses', function ($q) use ($center, $radius) {
                        $q->whereRaw("ST_Distance_Sphere(coordinates, POINT(?, ?)) <= ?", [
                            $center->avg_longitude, $center->avg_latitude, $radius * 1000
                        ]);
                    });
                }
            }

            // Filtrar por localização e raio se latitude e longitude forem fornecidos
            if ($latitude && $longitude) {
                $query->whereHas('addresses', function ($q) use ($latitude, $longitude, $radius) {
                    $q->whereRaw("ST_Distance_Sphere(coordinates, POINT(?, ?)) < ?", [
                        $longitude, $latitude, $radius * 1000
                    ]);
                });
            }

            // Paginação para reduzir carga na BD
            return $query->paginate(10);
        });

        // Retornar os dados como Resource Collection para evitar sobrecarga
        return Inertia::render('Stores', [
            'stores' => StoreResource::collection($stores),
            'search' => $search,
            'radius' => $radius
        ]);
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
            ]);

            // Criar o endereço associado
            $store->addresses()->create([
                'street_address' => $validated['street_address'],
                'postal_code' => $validated['postal_code'],
                'city' => $validated['city'],
                'coordinates' => DB::raw("POINT({$longitude}, {$latitude})"),
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
                'rating'
            )
                ->where('id', $store->id)
                ->with([
                    'addresses' => function ($query) {
                        $query->select(
                            'id',
                            'store_id',
                            'street_address',
                            'city',
                            'postal_code',
                            DB::raw('ST_X(coordinates) as longitude'),
                            DB::raw('ST_Y(coordinates) as latitude')
                        );
                    },
                    'products',
                    'reviews',
                    'galleries'
                ])
                ->first();

            // Retornar as lojas atualizadas do vendor
            $stores = Store::where('vendor_id', $vendor->id)
                ->select(
                'id',
                'name',
                'description',
                'phone_number',
                'email',
                'rating'
            )
                ->where('id', $store->id)
                ->with([
                    'addresses' => function ($query) {
                        $query->select(
                            'id',
                            'store_id',
                            'street_address',
                            'city',
                            'postal_code',
                            DB::raw('ST_X(coordinates) as longitude'),
                            DB::raw('ST_Y(coordinates) as latitude')
                        );
                    },
                    'products',
                    'reviews',
                    'galleries'
                ])
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
            ]);

            // Atualiza a morada da loja
            $store->addresses()->update([
                'street_address' => $validated['street_address'],
                'city' => $validated['city'],
                'postal_code' => $validated['postal_code'],
                'coordinates' => DB::raw("ST_GeomFromText('POINT({$longitude} {$latitude})')")
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
                        $imageName = 'store_' . $store->id . '_' . uniqid() . '.' . $imageType;

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

            $updatedStore = Store::select(
                'id',
                'name',
                'description',
                'phone_number',
                'email',
                'rating'
            )
                ->where('id', $store->id)
                ->with([
                    'addresses' => function ($query) {
                        $query->select(
                            'id',
                            'store_id',
                            'street_address',
                            'city',
                            'postal_code',
                            DB::raw('ST_X(coordinates) as longitude'),
                            DB::raw('ST_Y(coordinates) as latitude')
                        );
                    },
                    'products',
                    'reviews',
                    'galleries'
                ])
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

        // Buscar todas as lojas
        $allStores = Store::select(
            'stores.id',
            'stores.name',
            'stores.description',
            'stores.phone_number',
            'stores.email',
            'stores.rating'
        )
            ->with([
                'addresses' => function ($query) {
                    $query->select(
                        'id',
                        'store_id',
                        'street_address',
                        'city',
                        'postal_code',
                        DB::raw('ST_X(coordinates) as longitude'),
                        DB::raw('ST_Y(coordinates) as latitude')
                    );
                },
                'reviews',
                'galleries'
            ])
            ->join('store_addresses', 'stores.id', '=', 'store_addresses.store_id')
            ->get();

        // Buscar lojas próximas
        $nearbyStores = Store::select(
            'stores.id',
            'stores.name',
            'stores.description',
            'stores.phone_number',
            'stores.email',
            'stores.rating'
        )
            ->with([
                'addresses' => function ($query) {
                    $query->select(
                        'id',
                        'store_id',
                        'street_address',
                        'city',
                        'postal_code',
                        DB::raw('ST_X(coordinates) as longitude'),
                        DB::raw('ST_Y(coordinates) as latitude')
                    );
                },
                'reviews',
                'galleries'
            ])
            ->join('store_addresses', 'stores.id', '=', 'store_addresses.store_id')
            ->selectRaw("
            ST_Distance_Sphere(store_addresses.coordinates, POINT(?, ?)) AS distance
        ", [$longitude, $latitude])
            ->whereRaw("
            ST_Distance_Sphere(store_addresses.coordinates, POINT(?, ?)) <= ?
        ", [$longitude, $latitude, $radius])
            ->orderBy('distance')
            ->get();

        // Associar produtos filtrados a cada loja
        $nearbyStores->each(function ($store) {
            // Produtos com maior desconto (usando a relação correta com store_product)
            $highestDiscountProducts = Product::select(
                'products.id',
                'products.name',
                'products.description',
                'products.price',
                'products.discount',
                'products.stock',
                DB::raw('(products.price - (products.price * (products.discount / 100))) AS final_price')
            )
                ->join('store_products', 'store_products.product_id', '=', 'products.id')
                ->where('store_products.store_id', $store->id)
                ->where('products.discount', '>', 0) // Apenas produtos com desconto
                ->orderByDesc('products.discount')
                ->limit(2) // Apenas os 2 produtos com maior desconto
                ->get();

            // Produtos mais comprados (baseados na tabela order_store_product)
            $mostOrderedProducts = Product::select(
                'products.id',
                'products.name',
                'products.description',
                'products.price',
                'products.discount',
                'products.stock',
                DB::raw('(SELECT COUNT(*) FROM order_store_products WHERE order_store_products.product_id = products.id) AS order_count')
            )
                ->join('store_products', 'store_products.product_id', '=', 'products.id')
                ->where('store_products.store_id', $store->id)
                ->orderByDesc('order_count')
                ->limit(2) // Apenas os 2 produtos mais comprados
                ->get();

            // Adicionar os produtos à loja
            $store->highestDiscountProducts = $highestDiscountProducts;
            $store->mostOrderedProducts = $mostOrderedProducts;
        });

        return response()->json([
            'allStores' => $allStores,
            'nearbyStores' => $nearbyStores
        ]);
    }


    public function showStore($id)
    {
        // Recupera a loja sem o campo de coordenadas
        $store = Store::select(
            'id',
            'vendor_id',
            'name',
            'phone_number',
            'email',
            'description',
            'rating',
            'created_at',
            'updated_at'
        )
            ->where('id', $id)
            ->first();

        if (!$store) {
            abort(404, 'Loja não encontrada');
        }

        // Recupera a imagem da loja
        $storeImage = StoreGallery::where('store_id', $id)->first();

        // Recupera o vendor
        $vendor = Vendor::where('id', $store->vendor_id)->first();

        // Recupera o usuário associado ao vendor
        $user = User::where('id', $vendor->user_id)->first();

        // Carrega todos os produtos e suas respectivas galerias
        $products = $store->load('products.gallery')->products->map(function ($product) {
            return [
                'id'           => $product->id,
                'name'         => $product->name,
                'description'  => $product->description,
                'price'        => $product->price,
                'discount'     => $product->discount,
                'stock'        => $product->stock,
                'created_at'   => $product->created_at,
                'updated_at'   => $product->updated_at,
                'image_link'   => $product->gallery->first()?->image_link,
            ];
        });

        // Recupera todas as imagens da loja
        $storeGallery = StoreGallery::where('store_id', $id)->get();

        $storeAddress = StoreAddress::selectRaw("
            id,
            store_id,
            street_address,
            city,
            postal_code,
            CAST(ST_X(coordinates) AS CHAR) as longitude,
            CAST(ST_Y(coordinates) AS CHAR) as latitude
        ")
            ->where('store_id', $id)
            ->first();

        // Calcula a nota média do vendor (média de rating de todas as lojas do vendor)
        $vendorRating = Store::where('vendor_id', $store->vendor_id)->avg('rating');

        // Recupera a quantidade de reviews
        $reviewCount = StoreReview::whereIn('store_id', Store::where('vendor_id', $store->vendor_id)->pluck('id'))->count();

        // Recupera a quantidade de pedidos vendidos
        $orderCount = OrderStoreProduct::where('store_id', $id)->count();

        // Formata os dados para compatibilidade com JSON (sem as coordenadas na store)
        $formattedStore = [
            'id'           => $store->id,
            'vendor_id'    => $store->vendor_id,
            'name'         => $store->name,
            'phone_number' => $store->phone_number,
            'email'        => $store->email,
            'description'  => $store->description,
            'rating'       => $store->rating,
            'created_at'   => $store->created_at,
            'updated_at'   => $store->updated_at,
            'image_link'   => $storeImage ? $storeImage->image_link : null,
            'longitude'    => $storeAddress->longitude,
            'latitude'     => $storeAddress->latitude,
        ];

        // Outras informações adicionais
        $other = [
            'vendor_rating' => $vendorRating,
            'review_count'  => $reviewCount,
            'order_count'   => $orderCount,
        ];

        return Inertia::render('Store', [
            'store'   => $formattedStore,
            'vendor'  => $vendor,
            'products'=> $products,
            'user'    => $user,
            'gallery' => $storeGallery,
            'address' => $storeAddress, // O endereço agora possui "longitude" e "latitude" separadamente
            'other'   => $other,
        ]);
    }



}

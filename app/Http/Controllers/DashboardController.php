<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Order;
use App\Models\Gender;
use App\Models\OrderStoreProduct;
use App\Models\Status;
use App\Models\Store;
use App\Models\Vendor;
use App\Models\StoreGallery;
use App\Models\StoreAddress;
use App\Notifications\OrderCreated;
use App\Notifications\OrderStatusUpdated;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    // Show vendor information
    public function showVendorInfo()
    {
        $user = Auth::user();
        // Check if the user has the 'vendor' role
        if ($user && $user->hasRole('vendor')) {

            $user->load([
                'vendor',
                'vendor.company',
                'vendor.Gender',
                'vendor.company.addresses',
                'vendor.company.contacts',
            ]);
            $genders = Gender::all();

            // Fetch vendor stores (maximum of 3 stores)
            $stores = Store::where('vendor_id', $user->vendor->id)
                ->select(
                    'id',
                    'name',
                    'description',
                    'phone_number',
                    'email',
                    'rating'
                )
                ->with([
                    'addresses' => function ($query) {
                        $query->select(
                            'id',
                            'store_id',
                            'street_address',
                            'city',
                            'postal_code',
                            DB::raw('CAST(ST_X(coordinates) AS CHAR) as longitude'),
                            DB::raw('CAST(ST_Y(coordinates) AS CHAR) as latitude')
                        );
                    },
                    'products',
                    'reviews',
                    'galleries'
                ])
                ->take(3)
                ->get();

            // Render the page with vendor information
            return Inertia::render('Dashboard/Home', [
                'user' => $user,
                'genders' => $genders,
                'stores' => $stores
            ]);
        }
        // Redirect to login if the user is not a vendor with an error message
        return redirect()->route('login')->withErrors(['message' => 'Unauthorized access.']);
    }

    // Update the vendor's name
    public function updateVendorName(Request $request, Vendor $vendor)
    {
        // Validate the incoming data
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|min:1|max:100',
            'last_name' => 'sometimes|required|string|min:1|max:100',
        ]);

        // Update the vendor's name
        $vendor->update($validated);

        return response()->json([
            'message' => 'Nome de Vendedor actualizado com sucesso!',
            'vendor' => $vendor, // Include updated data
        ], 200);
    }

    // public function updateStore(Request $request, $id)
    // {
    //     Log::info('Recebendo requisição para atualizar loja', ['request' => $request->all()]);

    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'phone_number' => 'nullable|string|max:20',
    //         'email' => 'nullable|email|max:255',
    //         'description' => 'nullable|string',
    //         'rating' => 'nullable|numeric|min:0|max:5',

    //         // Campos da tabela store_addresses
    //         'street_address' => 'nullable|string|max:255',
    //         'city' => 'nullable|string|max:255',
    //         'postal_code' => 'nullable|string|max:20',
    //         'coordinates' => 'nullable|string',

    //         // Imagens (permitir arrays vazios)
    //         'new_images' => 'nullable|array',
    //         'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',

    //         'delete_images' => 'nullable|array',
    //         'delete_images.*' => 'integer|exists:store_galleries,id',
    //     ]);

    //     DB::beginTransaction();

    //     try {
    //         // 🔹 Atualizar os dados da loja
    //         $store = Store::findOrFail($id);
    //         $store->update([
    //             'name' => $validated['name'],
    //             'phone_number' => $validated['phone_number'] ?? null,
    //             'email' => $validated['email'] ?? null,
    //             'description' => $validated['description'] ?? null,
    //             'rating' => $validated['rating'] ?? 0,
    //         ]);

    //         // Extrair latitude e longitude corretamente
    //         $latLng = explode(',', $validated['coordinates']);
    //         $latitude = isset($latLng[0]) ? trim($latLng[0]) : 0;
    //         $longitude = isset($latLng[1]) ? trim($latLng[1]) : 0;

    //         // Atualizar ou criar o endereço sem as coordenadas primeiro
    //         $storeAddress = StoreAddress::updateOrCreate(
    //             ['store_id' => $store->id],
    //             [
    //                 'street_address' => $validated['street_address'] ?? null,
    //                 'city' => $validated['city'] ?? null,
    //                 'postal_code' => $validated['postal_code'] ?? null,
    //             ]
    //         );

    //         // Atualizar as coordenadas separadamente usando SQL puro
    //         if ($latitude != 0 && $longitude != 0) {
    //             DB::statement("UPDATE store_addresses SET coordinates = ST_GeomFromText('POINT($latitude $longitude)') WHERE store_id = ?", [$store->id]);
    //         }



    //         // 🔹 Remover imagens antigas da galeria
    //         $deleteImages = $request->input('delete_images', []);
    //         if (!is_array($deleteImages)) {
    //             $deleteImages = explode(',', $deleteImages); // Se vier como string separada por vírgulas
    //         }

    //         if (!empty($deleteImages)) {
    //             Log::info('Removendo imagens', ['delete_images' => $deleteImages]);
    //             $imagesToDelete = StoreGallery::whereIn('id', $deleteImages)->get();
    //             foreach ($imagesToDelete as $image) {
    //                 Storage::disk('public')->delete($image->image_path); // Apaga o ficheiro físico
    //                 $image->delete(); // Apaga do banco de dados
    //             }
    //         }

    //         // 🔹 Adicionar novas imagens à galeria (somente se existirem)
    //         if ($request->hasFile('new_images')) {
    //             foreach ($request->file('new_images') as $image) {
    //                 $path = $image->store('store_galleries', 'public');
    //                 StoreGallery::create([
    //                     'store_id' => $store->id,
    //                     'image_path' => $path,
    //                 ]);
    //             }
    //         } else {
    //             Log::info('Nenhuma nova imagem foi enviada.');
    //         }

    //         DB::commit();

    //         return response()->json([
    //             'message' => 'Loja atualizada com sucesso!',
    //             'data' => $store->load('galleries', 'addresses'), // Carregar os endereços e galerias também
    //         ], 200);

    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //             // Log detalhado do erro
    //         Log::error('Erro ao atualizar loja', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString(),
    //             'request' => $request->all()
    //         ]);

    //         return response()->json([
    //             'message' => 'Erro ao atualizar a loja.',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }
    // }

    public function updateStore(Request $request, Store $store)
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

    // Update the rest of the vendor's information
    public function updateVendorInfo(Request $request, Vendor $vendor)
    {
        // Validate the incoming data
        $validated = $request->validate([
            'email' => 'sometimes|required|email|max:255',
            'nif' => 'sometimes|required|string|max:20',
            'phone' => 'sometimes|required|string|min:9|max:20',
            'date_of_birth' => 'sometimes|required|date|before:today',
            'iban' => 'sometimes|required|string|max:34',
            'gender_id' => 'required|integer|exists:genders,id',
        ]);

        // Update vendor information
        $vendor->update($validated);
        $vendor->load(["gender"]);

        return response()->json([
            'message' => 'Informação do vendidor actualizado com sucesso!',
            'vendor' => $vendor, // Include updated data
        ], 200);
    }

    // Update the vendor's company information
    public function updateCompanyInfo(Request $request, Company $company)
    {
        //Validate the incoming data
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email',
            'website' => 'required|string',
            'nif' => 'required|string|max:20',
            'phone' => 'required|string|min:9',
            'founded_at' => 'required|date',
            'sector' => 'required|string|max:100',
            'street' => 'required|string|max:100',
            'number' => 'required|string|max:100',
            'postal_code' => 'required|string|max:100',
            'district' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'description' => 'required|string|max:1000',
        ]);

        // Update the `companies` table
        $company->update([
            'name' => $validated['name'],
            'nif' => $validated['nif'],
            'founded_at' => $validated['founded_at'],
            'sector' => $validated['sector'],
            'description' => $validated['description'],
        ]);

        //Update associated contacts (table `company_contacts`)
        if ($company->contacts) {
            $company->contacts->update([
                'email' => $validated['email'],
                'website' => $validated['website'],
                'phone' => $validated['phone'],
            ]);
        }

        //Update associated addresses (table `company_addresses`)
        if ($company->addresses) {
            $company->addresses->update([
                'street' => $validated['street'],
                'number' => $validated['number'],
                'postal_code' => $validated['postal_code'],
                'district' => $validated['district'],
                'country' => $validated['country'],
            ]);
        }

        //Reload relationships and return the response
        $company->load(['contacts', 'addresses']);
        return response()->json([
            'message' => 'Informação de empresa actulizado com sucesso!',
            'company' => $company,
        ], 200);
    }

    // Show all stores of the vendor
    public function showVendorStores(Request $request)
    {
        $user = Auth::user();

        // Check if the authenticated user has the 'vendor' role
        if ($user && $user->hasRole('vendor')) {
            // Fetch stores associated with the logged-in vendor, limited to a maximum of 3
            $stores = Store::where('vendor_id', $user->vendor->id)
                ->select(
                    'id',
                    'name',
                    'description',
                    'phone_number',
                    'email',
                    'rating'
                )
                ->with([
                    'addresses' => function ($query) {
                        $query->select(
                            'id',
                            'store_id',
                            'street_address',
                            'city',
                            'postal_code',
                            DB::raw('CAST(ST_X(coordinates) AS CHAR) as longitude'),
                            DB::raw('CAST(ST_Y(coordinates) AS CHAR) as latitude')
                        );
                    },
                    'products',
                    'reviews',
                    'galleries'
                ])
                ->take(3)
                ->get();

            // Return the stores and user data to the front-end
            return inertia::render('Dashboard/Stores', [
                'user' => $user,
                'stores' => $stores,
            ]);
        }

        // Redirect to the login page if the user is not authorized
        return redirect()->route('login')->withErrors(['message' => 'Acesso não autorizado.']);
    }

    //Material UI dashboard component show all stores return in json
    public function DashboardVendorStores(Request $request)
    {
        $user = Auth::user();

        if ($user && $user->hasRole('vendor')) {
            // Busca as lojas associadas ao vendor logado, no máximo 3
            $stores = Store::where('vendor_id', $user->vendor->id)
                ->select(
                    'id',
                    'name',
                    'description',
                    'phone_number',
                    'email',
                    'rating'
                )
                ->with([
                    'addresses' => function ($query) {
                        $query->select(
                            'id',
                            'store_id',
                            'street_address',
                            'city',
                            'postal_code',
                            DB::raw('CAST(ST_X(coordinates) AS CHAR) as longitude'),
                            DB::raw('CAST(ST_Y(coordinates) AS CHAR) as latitude')
                        );
                    },
                    'products',
                    'reviews',
                    'galleries'
                ])
                ->take(3)
                ->get();


            return response()->json([
                'stores' => $stores, // Dados das lojas associadas ao vendor
            ]);
        }

        // Redireciona caso o usuário não esteja autorizado
        return redirect()->route('login')->withErrors(['message' => 'Acesso não autorizado.']);
    }

    //Delete Store
    public function deleteStore($id)
    {
        try {
            // Find the store by ID or fail if it doesn't exist
            $store = Store::findOrFail($id);

            // Check if the authenticated user's vendor ID matches the store's vendor ID
            if (auth()->user()->vendor->id !== $store->vendor_id) {
                // If they don't match, return a 403 Unauthorized response
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. This store does not belong to the current user.',
                ], 403);
            }

            // If the vendor ID matches, proceed to delete the store (soft delete)
            $store->delete();

            // Fetch all stores associated with the authenticated vendor
            $stores = Store::where('vendor_id', auth()->user()->vendor->id)
                ->select(
                    'id',
                    'name',
                    'description',
                    'phone_number',
                    'email',
                    'rating'
                )
                ->with([
                    'addresses' => function ($query) {
                        $query->select(
                            'id',
                            'store_id',
                            'street_address',
                            'city',
                            'postal_code',
                            DB::raw('CAST(ST_X(coordinates) AS CHAR) as longitude'),
                            DB::raw('CAST(ST_Y(coordinates) AS CHAR) as latitude')
                        );
                    },
                    'products',
                    'reviews',
                    'galleries'
                ])
                ->take(3)
                ->get();


            // Return the updated list of stores along with the success message
            return response()->json([
                'success' => true,
                'message' => 'Loja apagada com sucesso.',
                'stores' => $stores,
            ], 200);

        } catch (\Exception $e) {
            // Handle any unexpected errors during the process and return a 500 response
            return response()->json([
                'success' => false,
                'message' => 'Erro a tentar apagar a loja.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    //show store by id of the store from that vendor
    public function dashboardShowStore($id)
    {
        // Get the authenticated user and their vendor
        $userId = Auth::id();
        $vendor = Vendor::where('user_id', $userId)->first();

        // Check if the vendor was found
        if (!$vendor) {
            abort(403, 'Vendedor não encontrado.');
        }

        // Fetch all stores associated with the vendor
        $storeIds = Store::where('vendor_id', $vendor->id)->pluck('id')->toArray();

        // Check if the requested store belongs to the vendor
        if (!in_array($id, $storeIds)) {
            abort(403, 'Acesso negado. Esta loja não pertence ao vendedor autenticado.');
        }

        // Fetch store details (already validated)
        $store = Store::select('id', 'name', 'description', 'phone_number', 'email', 'rating',)
            ->with([
                'addresses' => function ($query) {
                    $query->select(
                        'id',
                        'store_id',
                        'street_address',
                        'city',
                        'postal_code',
                        DB::raw('CAST(ST_X(coordinates) AS CHAR) as longitude'),
                        DB::raw('CAST(ST_Y(coordinates) AS CHAR) as latitude')
                    );
                },
                'products',
                'reviews',
                'galleries'
            ])
            ->findOrFail($id);  // Agora é seguro usar findOrFail

        // Paginate store products
        $products = $store->products()->paginate(10);

        // Attach products to the store object
        $store->setRelation('products', $products);

        return inertia('Dashboard/Store', [
            'store' => $store,
        ]);
    }

    //Get store product list
    public function productStorelist($storeId)
    {
        // Fetch the store by its ID
        $store = Store::findOrFail($storeId);

        // Return paginated products
        $products = $store->products()
            ->with('gallery')
            ->paginate(10);

        return response()->json($products);
    }

    //Get store review
    public function DasboardstoreReviews($storeId)
    {
        // Fetch the store by its ID
        $store = Store::findOrFail($storeId);

        // Return reviews along with the associated user
        $reviews = $store->reviews()->with('user')->paginate(10);

        return response()->json($reviews);
    }

    //Get Store orders
    public function getOrders(Request $request)
    {
        // Determine the number of items per page (default: 10)
        $itemsPerPage = $request->query('limit', 10);
        $searchTerm = $request->query('search', '');

        // Check if the user has the 'vendor' role
        $user = Auth::user();
        if (!$user->hasRole('vendor')) {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        // Retrieve the vendorId using the Eloquent relationship
        $vendorId = $user->vendor->id ?? null;
        if (!$vendorId) {
            return response()->json(['error' => 'Vendedor não encontrado.'], 404);
        }

        // Fetch all stores associated with the vendor
        $storeIds = Store::where('vendor_id', $vendorId)->pluck('id');

        // Build the query
        $query = Order::whereHas('stores', function ($q) use ($storeIds) {
            $q->whereIn('stores.id', $storeIds);
        })->with([
            'user:id,email,first_name,last_name',
            'status:id,name',
            'products:id,name',
            'stores:id,name'
        ])->select([
            'id',
            'user_id',
            'statuses_id',
            'street_name',
            'city',
            'postal_code',
            'phone_number',
            'total',
            'created_at'
        ]);

        // Apply search filter if a search term is provided
        if (is_numeric($searchTerm)) {
            $query->where('id', $searchTerm);
        } else {
            $query->whereHas('user', function ($q) use ($searchTerm) {
                $q->where('email', 'like', "%$searchTerm%");
            });
        }

        // Return paginated results
        $orders = $query->paginate($itemsPerPage);

        return response()->json($orders);
    }

    //Edit orders
    public function updateOrder(Request $request, $orderId)
    {
        $validatedData = $request->validate([
            'statuses_id' => 'required|exists:statuses,id',
        ]);

        try {
            $order = Order::findOrFail($orderId);

            // Atualizar o status da encomenda
            $order->statuses_id = $validatedData['statuses_id'];
            $order->save();

            // Retornar a encomenda atualizada
            $updatedOrder = $order->load(['products', 'user', 'status']);

            // Carregar as relações atualizadas
            $updatedOrder = $order->load(['products', 'user', 'status', 'stores']);

            // Buscar corretamente a loja associada à encomenda
            $storeName = optional($order->stores->first())->name ?? 'Desconhecida';

            // Notificar o utilizador que fez a encomenda
            $order->user->notify(new OrderStatusUpdated($order, $order->status->name, $storeName));

            return response()->json([
                'message' => 'Encomenda atualizada com sucesso.',
                'order' => $updatedOrder,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar a encomenda: ' . $e->getMessage()], 500);
        }
    }

    //Get orders by store id
    public function getOrdersByStore($storeId, Request $request)
    {
        $validatedData = $request->validate([
            'search' => 'nullable|string',
            'page' => 'nullable|integer|min:1',
            'limit' => 'nullable|integer|min:1',
        ]);

        try {
            $itemsPerPage = $validatedData['limit'] ?? 10;
            $searchTerm = $validatedData['search'] ?? '';

            //query to get order by store id
            $query = Order::whereHas('stores', function ($q) use ($storeId) {
                $q->where('store_id', $storeId);
            })->with([
                'user:id,email,first_name,last_name',
                'status:id,name',
                'products:id,name',
                'stores:id,name',
            ])->select([
                'id',
                'user_id',
                'statuses_id',
                'street_name',
                'city',
                'postal_code',
                'phone_number',
                'total',
                'created_at'
            ]);

            // Applying the search filter
            if (is_numeric($searchTerm)) {
                $query->where('id', $searchTerm);
            } else {
                $query->whereHas('user', function ($q) use ($searchTerm) {
                    $q->where('email', 'like', "%$searchTerm%");
                });
            }

            $orders = $query->paginate($itemsPerPage);

            return response()->json($orders);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao Carregar encomendas: ' . $e->getMessage(),
            ], 500);
        }
    }

    //Get vendor by store id
    public function getVendorStores(Request $request)
    {
        try {
            // Get the authenticated user
            $user = auth()->user();

            // Check if the user is a vendor
            $vendor = $user->vendor;

            if (!$vendor) {
                return response()->json(['error' => 'User não é um vendor.'], 403);
            }

            // Fetch all stores associated with the vendor
            $stores = $vendor->stores()->select('id', 'name')->get();

            return response()->json($stores, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao Carregar lojas: ' . $e->getMessage()], 500);
        }
    }

    //Cancel order
    public function cancelOrder($orderId)
    {
        try {
            $order = Order::findOrFail($orderId);

            // Check if the order is already canceled
            if ($order->statuses_id === 5) {
                return response()->json(['message' => 'A encomenda já está cancelada.'], 200);
            }

            // Atualizar o estado para "Cancelado" (ID fixo = 5)
            $order->statuses_id = 5;
            $order->save();

            return response()->json(['message' => 'Encomenda cancelada com sucesso.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao cancelar a encomenda: ' . $e->getMessage()], 500);
        }
    }

    //Get Data for graphs page
    public function getDashboardData(Request $request)
    {
        // Get the authenticated user and their vendor
        $userId = Auth::id();
        $vendor = Vendor::where('user_id', $userId)->first();

        if (!$vendor) {
            return response()->json(['error' => 'Vendor não encontrado para o utilizador autenticado'], 404);
        }

        // Get the vendor's stores
        $storeIds = Store::where('vendor_id', $vendor->id)->pluck('id');

        $today = Carbon::now();
        $yesterday = $today->copy()->subDay();
        $currentMonth = $today->month;
        $lastMonth = $today->copy()->subMonth()->month;
        $currentYear = $today->year;
        $lastYear = $currentYear - 1;

        // Fetch status IDs dynamically
        $completedStatusId = Status::where('name', 'Concluído')->first()->id;
        $canceledStatusId = Status::where('name', 'Cancelada')->first()->id;

        //  Today's revenue and comparison to yesterday
        $revenueToday = OrderStoreProduct::whereIn('store_id', $storeIds)
            ->whereDate('created_at', $today->toDateString())
            ->sum('final_price');

        $revenueYesterday = OrderStoreProduct::whereIn('store_id', $storeIds)
            ->whereDate('created_at', $yesterday->toDateString())
            ->sum('final_price');

        $todayDiffPercentage = $revenueYesterday > 0
            ? round((($revenueToday - $revenueYesterday) / $revenueYesterday) * 100, 2)
            : 0;

        // Current month revenue and comparison to last month
        $revenueCurrentMonth = OrderStoreProduct::whereIn('store_id', $storeIds)
            ->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)
            ->sum('final_price');

        $revenueLastMonth = OrderStoreProduct::whereIn('store_id', $storeIds)
            ->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $lastMonth)
            ->sum('final_price');

        $monthDiffPercentage = $revenueLastMonth > 0
            ? round((($revenueCurrentMonth - $revenueLastMonth) / $revenueLastMonth) * 100, 2)
            : 0;

        // Current year revenue and comparison to last year
        $revenueCurrentYear = OrderStoreProduct::whereIn('store_id', $storeIds)
            ->whereYear('created_at', $currentYear)
            ->sum('final_price');

        $revenueLastYear = OrderStoreProduct::whereIn('store_id', $storeIds)
            ->whereYear('created_at', $lastYear)
            ->sum('final_price');

        $yearDiffPercentage = $revenueLastYear > 0
            ? round((($revenueCurrentYear - $revenueLastYear) / $revenueLastYear) * 100, 2)
            : 0;

        // Number of orders this year and percentage of cancellations
        $totalOrdersCurrentYear = Order::whereHas('orderStoreProducts', function ($query) use ($storeIds, $currentYear) {
            $query->whereIn('store_id', $storeIds)
                ->whereYear('order_store_products.created_at', $currentYear);
        })->count();

        $cancelledOrdersCurrentYear = Order::whereHas('orderStoreProducts', function ($query) use ($storeIds, $currentYear, $canceledStatusId) {
            $query->whereIn('store_id', $storeIds)
                ->whereYear('order_store_products.created_at', $currentYear);
        })->where('statuses_id', $canceledStatusId)->count();

        $cancelledPercentage = $totalOrdersCurrentYear > 0
            ? round(($cancelledOrdersCurrentYear / $totalOrdersCurrentYear) * 100, 2)
            : 0;

        // Weekly revenue and comparison to the previous week
        $revenueThisWeek = OrderStoreProduct::whereIn('store_id', $storeIds)
            ->whereBetween('created_at', [
                $today->startOfWeek()->toDateTimeString(),
                $today->endOfWeek()->toDateTimeString()
            ])->sum('final_price');

        $revenueLastWeek = OrderStoreProduct::whereIn('store_id', $storeIds)
            ->whereBetween('created_at', [
                $today->subWeek()->startOfWeek()->toDateTimeString(),
                $today->subWeek()->endOfWeek()->toDateTimeString()
            ])->sum('final_price');

        $weeklyDiffPercentage = $revenueLastWeek > 0
            ? round((($revenueThisWeek - $revenueLastWeek) / $revenueLastWeek) * 100, 2)
            : 0;

        // Comparative monthly revenue by year (for line chart)
        $monthlyRevenueCurrentYear = OrderStoreProduct::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('SUM(final_price) as total_revenue')
        )
            ->whereIn('store_id', $storeIds)
            ->whereYear('created_at', $currentYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyRevenueLastYear = OrderStoreProduct::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('SUM(final_price) as total_revenue')
        )
            ->whereIn('store_id', $storeIds)
            ->whereYear('created_at', $lastYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Monthly orders for the current year
        $monthlyOrdersCurrentYear = Order::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as total_orders')
        )
            ->whereHas('orderStoreProducts', function ($query) use ($storeIds, $currentYear) {
                $query->whereIn('store_id', $storeIds)
                    ->whereYear('order_store_products.created_at', $currentYear);
            })
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Monthly orders for the previous year
        $monthlyOrdersLastYear = Order::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as total_orders')
        )
            ->whereHas('orderStoreProducts', function ($query) use ($storeIds, $lastYear) {
                $query->whereIn('store_id', $storeIds)
                    ->whereYear('order_store_products.created_at', $lastYear);
            })
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // **9. Informações detalhadas por loja**
        $storeData = Store::whereIn('id', $storeIds)
            ->with(['orders' => function ($query) {
                $query->with('orderStoreProducts');
            }])
            ->get()
            ->map(function ($store) use ($completedStatusId, $canceledStatusId) {
                // Total de encomendas únicas sem duplicações
                $totalOrders = $store->orders->unique('id')->count();

                // Encomendas concluídas e canceladas sem duplicações
                $completedOrders = $store->orders->where('statuses_id', $completedStatusId)->unique('id')->count();
                $canceledOrders = $store->orders->where('statuses_id', $canceledStatusId)->unique('id')->count();

                // Encomendas tratadas (concluídas + canceladas)
                $treatedOrders = $completedOrders + $canceledOrders;
                $treatedPercentage = $totalOrders > 0 ? round(($treatedOrders / $totalOrders) * 100) : 100;  // Arredondar para inteiro
                $pendingPercentage = 100 - $treatedPercentage;

                // Receita total sem duplicações
                $totalRevenue = $store->orders->unique('id')->sum(function ($order) {
                    return $order->orderStoreProducts->sum('final_price');
                });

        // Percentagem de encomendas tratadas (corrigida)
        $handlingIndex = $totalOrders > 0
            ? round(($treatedOrders / $totalOrders) * 100, 2)
            : 100; // Se não houver encomendas, assume-se 100%

        return [
            'name' => $store->name,
            'total_revenue' => round($totalRevenue, 2),
            'completed_percentage' => $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100, 2) : 0,
            'canceled_percentage' => $totalOrders > 0 ? round(($canceledOrders / $totalOrders) * 100, 2) : 0,
            'treated_orders' => $treatedOrders,
            'total_orders' => $totalOrders,
            'handling_index' => $handlingIndex,
        ];
    });

    // // **Calcular total de encomendas e normalizar percentagem para o gráfico**
    // $totalTreatedOrders = $storeData->sum('treated_orders');
    // $totalOrdersGlobal = $storeData->sum('total_orders');

    // $storeData = $storeData->map(function ($store) use ($totalTreatedOrders) {
    //     return [
    //         'name' => $store['name'],
    //         'total_revenue' => $store['total_revenue'],
    //         'completed_percentage' => $store['completed_percentage'],
    //         'canceled_percentage' => $store['canceled_percentage'],
    //         'treated_percentage' => $totalTreatedOrders > 0
    //             ? round(($store['treated_orders'] / $totalTreatedOrders) * 100, 2)
    //             : 0, // Normalizar para o gráfico de pizza
    //         'total_orders' => $store['total_orders'],
    //         'handling_index' => $store['handling_index'],
    //     ];
    // });

    // return response()->json([
    //     'revenue_today' => $revenueToday,
    //     'today_diff_percentage' => $todayDiffPercentage,
    //     'revenue_current_month' => $revenueCurrentMonth,
    //     'month_diff_percentage' => $monthDiffPercentage,
    //     'revenue_current_year' => $revenueCurrentYear,
    //     'year_diff_percentage' => $yearDiffPercentage,
    //     'total_orders_current_year' => $totalOrdersCurrentYear,
    //     'cancelled_percentage' => $cancelledPercentage,
    //     'revenue_this_week' => $revenueThisWeek,
    //     'weekly_diff_percentage' => $weeklyDiffPercentage,
    //     'monthly_revenue_current_year' => $monthlyRevenueCurrentYear,
    //     'monthly_revenue_last_year' => $monthlyRevenueLastYear,
    //     'annual_orders_current_year' => $monthlyOrdersCurrentYear,
    //     'annual_orders_last_year' => $monthlyOrdersLastYear,
    //     'total_orders' => $totalOrdersGlobal, // Corrigido para mostrar o total real
    //     'stores' => $storeData
    // ]);

    }


}

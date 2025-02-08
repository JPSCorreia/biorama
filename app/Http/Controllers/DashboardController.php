<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Order;
use App\Models\Gender;
use App\Models\OrderStoreProduct;
use App\Models\Status;
use App\Models\Store;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class DashboardController extends Controller
{
    //Mostrar informação do vendor
    public function showVendorInfo()
    {
        $user = Auth::user();
        // Verifica se o utilizador tem o papel 'vendor'
        if ($user && $user->hasRole('vendor')) {
            // Carrega os relacionamentos necessários
            $user->load([
                'vendor', // Relacionamento direto com a tabela 'vendors'
                'vendor.company', // Relacionamento entre 'vendors' e 'company'
                'vendor.Gender', //Carrega o relacionamento entre 'vendor' e'gender'
                'vendor.company.addresses', // Relacionamento entre 'company' e 'companyAddress'
                'vendor.company.contacts', // Relacionamento entre 'company' e 'companyContacts'
            ]);
            $genders = Gender::all();

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


            // Renderiza a página com as informações do vendor
            return Inertia::render('Dashboard/Home', [
                'user' => $user,
                'genders' => $genders,
                'stores' => $stores
            ]);
        }
        // Se não for vendor, redireciona para o login com uma mensagem de erro
        return redirect()->route('login')->withErrors(['message' => 'Acesso não autorizado.']);
    }
    //Actualizar o nome do vendedor
    public function updateVendorName(Request $request, vendor $vendor)
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|min:1|max:100',
            'last_name' => 'sometimes|required|string|min:1|max:100',
        ]);

        $vendor->update($validated);

        return response()->json([
            'message' => 'Nome do Vendor atualizado com sucesso!',
            'vendor' => $vendor, // Inclua os dados atualizados
        ], 200);
    }
    //Actualizar o restantes dado  do vendedor
    public function updateVendorInfo(Request $request, Vendor $vendor)
    {
        $validated = $request->validate([
            'email' => 'sometimes|required|email|max:255',
            'nif' => 'sometimes|required|string|max:20',
            'phone' => 'sometimes|required|string|min:9|max:20',
            'date_of_birth' => 'sometimes|required|date|before:today',
            'iban' => 'sometimes|required|string|max:34',
            'gender_id' => 'required|integer|exists:genders,id',
        ]);

        $vendor->update($validated);
        $vendor->load(["gender"]);

        return response()->json([
            'message' => 'Informação do Vendor atualizado com sucesso!',
            'vendor' => $vendor, // Inclua os dados atualizados
        ], 200);


    }
    //Actualizar os dado da empresa do vendedor do vendedor
    public function updateCompanyInfo(Request $request, Company $company)
    {
        // 1. Validar os dados recebidos
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

        // 2. Atualizar a tabela `companies`
        $company->update([
            'name' => $validated['name'],
            'nif' => $validated['nif'],
            'founded_at' => $validated['founded_at'],
            'sector' => $validated['sector'],
            'description' => $validated['description'],
        ]);

        // 3. Atualizar os contatos associados (tabela `company_contacts`)
        if ($company->contacts) {
            $company->contacts->update([
                'email' => $validated['email'],
                'website' => $validated['website'],
                'phone' => $validated['phone'],
            ]);
        }

        // 4. Atualizar os endereços associados (tabela `company_addresses`)
        if ($company->addresses) {
            $company->addresses->update([
                'street' => $validated['street'],
                'number' => $validated['number'],
                'postal_code' => $validated['postal_code'],
                'district' => $validated['district'],
                'country' => $validated['country'],
            ]);
        }

        // 5. Recarregar as relações e retornar a resposta
        $company->load(['contacts', 'addresses']);
        return response()->json([
            'message' => 'Informações da empresa atualizadas com sucesso!',
            'company' => $company,
        ], 200);
    }
    //Mostrar todas as lojas do vendor
    public function showVendorStores(Request $request)
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

            // Retorna as lojas para o front-end
            return inertia::render('Dashboard/Stores', [
                'user' => $user, // Dados do usuário logado
                'stores' => $stores, // Dados das lojas
            ]);
        }

        // Redireciona caso o usuário não esteja autorizado
        return redirect()->route('login')->withErrors(['message' => 'Acesso não autorizado.']);
    }

    public function dashboardShowStore($id)
    {
        $store = Store::select('id', 'name', 'description', 'phone_number', 'email', 'rating')
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
            ->findOrFail($id);

        // Paginar produtos da loja
        $products = $store->products()->paginate(10);  // 10 produtos por página

        // Anexa os produtos ao objeto store
        $store->setRelation('products', $products);

        return inertia('Dashboard/Store', [
            'store' => $store,
        ]);
    }

    public function productStorelist($storeId)
    {
        // Busca a loja pelo ID
        $store = Store::findOrFail($storeId);

        // Retorna os produtos paginados
        $products = $store->products()
            ->with('gallery')
            ->paginate(10);

        return response()->json($products);
    }

    public function DasboardstoreReviews($storeId)
    {
        // Busca a loja pelo ID
        $store = Store::findOrFail($storeId);

        // Retorna as reviews com o utilizador associado
        $reviews = $store->reviews()->with('user')->paginate(10);

        return response()->json($reviews);
    }

    public function getOrders(Request $request)
    {
        // Determinar o número de itens por página (padrão: 10)
        $itemsPerPage = $request->query('limit', 10);
        $searchTerm = $request->query('search', '');

        // Verificar se o utilizador tem a role de 'vendor'
        $user = Auth::user();
        if (!$user->hasRole('vendor')) {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        // Obter o vendorId usando a relação Eloquent
        $vendorId = $user->vendor->id ?? null;
        if (!$vendorId) {
            return response()->json(['error' => 'Vendedor não encontrado.'], 404);
        }

        // Buscar todas as lojas associadas ao vendor
        $storeIds = Store::where('vendor_id', $vendorId)->pluck('id');

        // Construir a query
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
            'total'
        ]);

        // Aplicar filtro de pesquisa se o searchTerm for fornecido
        if (is_numeric($searchTerm)) {
            $query->where('id', $searchTerm);
        } else {
            $query->whereHas('user', function ($q) use ($searchTerm) {
                $q->where('email', 'like', "%$searchTerm%");
            });
        }

        // Retornar resultados paginados
        $orders = $query->paginate($itemsPerPage);

        return response()->json($orders);
    }

    public function updateOrder(Request $request, $orderId)
    {
        $validatedData = $request->validate([
            'statuses_id' => 'required|exists:statuses,id',
            'products' => 'required|array|min:1',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'removedProducts' => 'nullable|array',
            'removedProducts.*' => 'exists:products,id',
        ]);

        try {
            $order = Order::findOrFail($orderId);

            // Atualizar o status da encomenda
            $order->statuses_id = $validatedData['statuses_id'];
            $order->save();

            // Soft delete dos produtos removidos (se houver)
            if (!empty($validatedData['removedProducts'])) {
                $order->products()->whereIn('product_id', $validatedData['removedProducts'])->delete();
            }

            // Verificar se todos os produtos válidos foram removidos ou têm quantidade 0
            $validProducts = [];
            $newTotal = 0;

            foreach ($validatedData['products'] as $productData) {
                if ($productData['quantity'] > 0) {
                    $validProducts[] = $productData;

                    // Atualizar os preços e calcular os valores de preço final e desconto
                    $product = $order->products()->where('product_id', $productData['id'])->first();
                    if ($product) {
                        $originalPrice = $product->pivot->price;
                        $discount = $product->pivot->discount ?? 0;
                        $discountValue = $originalPrice * ($discount / 100);
                        $finalPrice = ($originalPrice - $discountValue) * $productData['quantity'];

                        // Atualizar a linha na tabela intermediária
                        $order->products()->updateExistingPivot($productData['id'], [
                            'quantity' => $productData['quantity'],
                            'original_price' => $originalPrice,
                            'discount_value' => $discountValue * $productData['quantity'],
                            'final_price' => $finalPrice,
                        ]);

                        // Incrementar o total da encomenda
                        $newTotal += $finalPrice;
                    }
                }
            }

            // Se não houver produtos válidos, cancelar a encomenda
            if (empty($validProducts)) {
                $order->statuses_id = Status::where('name', 'Cancelado')->first()->id;
                $order->save();
                return response()->json(['message' => 'Todos os produtos foram removidos. A encomenda foi cancelada.'], 200);
            }

            // Atualizar o total na tabela de encomendas
            $order->total = $newTotal;
            $order->save();

            // Retornar os dados atualizados da encomenda
            $updatedOrder = $order->load(['products', 'user', 'status']);

            return response()->json([
                'message' => 'Encomenda atualizada com sucesso.',
                'order' => $updatedOrder,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar a encomenda: ' . $e->getMessage()], 500);
        }
    }

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

            // Corrigir a query principal
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
                'total'
            ]);

            // Aplicar filtro de pesquisa
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
                'error' => 'Erro ao buscar encomendas: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function getVendorStores(Request $request)
    {
        try {
            // Obter o usuário autenticado
            $user = auth()->user();

            // Verificar se o usuário é um vendor
            $vendor = $user->vendor;  // Supondo que o relacionamento user -> vendor existe

            if (!$vendor) {
                return response()->json(['error' => 'Usuário não é um vendor.'], 403);
            }

            // Buscar todas as lojas associadas ao vendor
            $stores = $vendor->stores()->select('id', 'name')->get();

            return response()->json($stores, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao buscar lojas: ' . $e->getMessage()], 500);
        }
    }

    public function cancelOrder($orderId)
    {
        try {
            $order = Order::findOrFail($orderId);

            // Verificar se já está cancelada
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


}

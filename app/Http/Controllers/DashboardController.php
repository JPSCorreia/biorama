<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Gender;
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
                    'rating',
                    DB::raw('ST_X(coordinates) as longitude'),
                    DB::raw('ST_Y(coordinates) as latitude')
                )
                ->with([
                    'addresses', // Inclui endereços
                    'products',  // Inclui produtos
                    'reviews',   // Inclui avaliações
                    'galleries'  // Inclui galerias de imagens
                ])
                ->take(3) // Limita o número de lojas a 3
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
                    'rating',
                    DB::raw('ST_X(coordinates) as longitude'),
                    DB::raw('ST_Y(coordinates) as latitude')
                )
                ->with([
                    'addresses', // Inclui endereços
                    'products',  // Inclui produtos
                    'reviews',   // Inclui avaliações
                    'galleries'  // Inclui galerias de imagens
                ])
                ->take(3) // Limita o número de lojas a 3
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
        $store = Store::select('id', 'name', 'description', 'phone_number', 'email', 'rating',
            DB::raw('ST_X(coordinates) as longitude'),
            DB::raw('ST_Y(coordinates) as latitude')
        )
            ->with(['addresses', 'reviews', 'galleries'])
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
        $products = $store->products()->paginate(10);

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


}

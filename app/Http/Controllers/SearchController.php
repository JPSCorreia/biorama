<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Vendor;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Store;

class SearchController extends Controller
{

    public function index(Request $request)
    {
        $query = $request->input('query');

        $stores = Store::where('name', 'like', '%' . $query . '%')
            ->with([
                'addresses' => function ($query) {
                    $query->select(
                        'id',
                        'store_id', // Importante para manter a relação correta
                        'street_address',
                        'city',
                        'postal_code',
                        DB::raw('ST_X(coordinates) as longitude'),
                        DB::raw('ST_Y(coordinates) as latitude')
                    );
                },
                'galleries' // Carregar imagens da loja
            ])
            ->select('id', 'name', 'description', 'rating', 'phone_number', 'email') // Apenas os campos necessários
            ->get();


        // Retornar uma resposta Inertia para renderizar o componente React com os resultados
        return Inertia::render('SearchPage', [
            'searchResults' => [
                'stores' => $stores
            ],
            'query' => $query,
        ]);
    }

    public function suggestions(Request $request)
    {
        $query = $request->input('query');

        $products = Product::where('name', 'like', '%' . $query . '%')
            ->take(5) // Limits at 5 results
            ->get();

        $stores = Store::where('name', 'like', '%' . $query . '%')
            ->take(5) // // Limits at 5 results
            ->get();

        $vendors = Vendor::where('name', 'like', '%' . $query . '%')
            ->take(5)
            ->get();

        return response()->json([
            'products' => $products,
            'stores' => $stores,
            'vendors' => $vendors,
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }

}

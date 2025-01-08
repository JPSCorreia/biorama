<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Vendor;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Store;

class SearchController extends Controller
{
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


    public function index(Request $request)
    {
        $query = $request->input('query');

        $products = Product::select('name')
        ->where('name', 'like', '%' . $query . '%')->get();

        $stores = Store::select('name')
            ->where('name', 'like', '%' . $query . '%')
            ->orWhere('description', 'like', '%' . $query . '%')
            ->get();

        $vendors = Vendor::select('city')
        ->where('city', 'like', '%' . $query . '%')->take(5)->get();

        // Retornar uma resposta Inertia para renderizar o componente React com os resultados
        return Inertia::render('SearchPage', [
            'searchResults' => [
                'products' => $products,
                'stores' => $stores,
                'vendors' => $vendors,
            ],
            'query' => $query,
        ]);
    }


}

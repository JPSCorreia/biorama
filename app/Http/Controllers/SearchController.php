<?php

namespace App\Http\Controllers;

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

        return response()->json([
            'products' => $products,
            'stores' => $stores,
        ]);
    }


    public function results(Request $request)
    {
        $query = $request->input('query');

        $products = Product::where('name', 'like', '%' . $query . '%')
            ->orWhere('description', 'like', '%' . $query . '%')
            ->get();

        $stores = Store::where('name', 'like', '%' . $query . '%')
            ->orWhere('description', 'like', '%' . $query . '%')
            ->get();

        return response()->json([
            'products' => $products,
            'stores' => $stores,
        ]);
    }

}

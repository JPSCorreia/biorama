<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\StoreAddress;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index(Request $request)
    {

        // Buscar endereços das lojas com base nos IDs
        $storeAddresses = StoreAddress::select([
            'id',
            'store_id',
            'street_address',
            'postal_code',
            'city',
            'comment',
            'created_at',
            'updated_at',
            'deleted_at',
            DB::raw('ST_X(coordinates) as longitude'),
            DB::raw('ST_Y(coordinates) as latitude')
        ])->get();

        return Inertia::render('Cart', [
            'store_addresses' => $storeAddresses,
        ]);
    }
}

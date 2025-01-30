<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyRequest;
use App\Models\Company;
use App\Models\CompanyAddress;
use App\Models\CompanyContact;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CompanyRequest $request, $id)
    {
        try {
            $vendor = vendor::find($id);
            $validatedData = $request->validated();

            DB::beginTransaction();

            $company = $vendor->company()->create([
                'vendor_id'   => $validatedData['vendor_id'],
                'name'        => $validatedData['name'],
                'nif'         => $validatedData['nif'],
                'founded_at'  => $validatedData['founded_at'] ?? null,
                'sector'      => $validatedData['sector'] ?? null,
                'description' => $validatedData['description'] ?? null,
            ]);


            // Cria os contatos da empresa
            $contact = CompanyContact::create([
                'company_id' => $company->id,
                'phone'      => $validatedData['phone'],
                'email'      => $validatedData['email'],
                'website'    => $validatedData['website'] ?? null,
            ]);

            // Cria a morada da empresa
            $address = CompanyAddress::create([
                'company_id'  => $company->id,
                'street'      => $validatedData['street'],
                'number'      => $validatedData['number'],
                'postal_code' => $validatedData['postal_code'],
                'district'    => $validatedData['district'],
                'country'     => $validatedData['country'],
            ]);

            DB::commit();

            // Se for um pedido Inertia, envia JSON corretamente
            if ($request->header('X-Inertia')) {
                return response()->json([
                    'message'  => 'Empresa registada com sucesso!',
                    'company'  => $company,
                    'contact'  => $contact,
                    'address'  => $address,
                ], 201);
            }

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Erro ao registar a empresa!',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

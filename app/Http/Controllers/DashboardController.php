<?php

namespace App\Http\Controllers;

use App\Models\Gender;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class DashboardController extends Controller
{
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

            // Renderiza a página com as informações do vendor
            return Inertia::render('Dashboard/Home', [
                'user' => $user,
                'genders' => $genders,
            ]);
        }
        // Se não for vendor, redireciona para o login com uma mensagem de erro
        return redirect()->route('login')->withErrors(['message' => 'Acesso não autorizado.']);
    }

    //Actualizar o nome do vendidor
    public function updateVendorName(Request $request, vendor $vendor)
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
        ]);

        $vendor->update($validated);

        return response()->json([
            'message' => 'Nome do Vendor atualizado com sucesso!',
            'vendor' => $vendor, // Inclua os dados atualizados
        ], 200);
    }

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
}

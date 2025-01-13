<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Requests\SendInvoiceRequest;
use App\Mail\InvoiceEmail;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with('user', 'store', 'homeAddress')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'store_id' => 'required|exists:stores,id',
            'home_address_id' => 'required|exists:home_addresses,id',
            'total_price' => 'required|numeric|min:0',
        ]);

        $order = Order::create($validated);
        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        return response()->json($order->load('user', 'store', 'homeAddress'));
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'total_price' => 'sometimes|numeric|min:0',
        ]);

        $order->update($validated);
        return response()->json($order);
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(null, 204);
    }

    public function sendInvoice(SendInvoiceRequest $request)
    {
        try {
            $invoiceData = [
                'name' => 'Cliente Teste',
                'total' => 123.45,
            ];

            // Testa o conteúdo antes de gerar o PDF
            // dd(['order' => $invoiceData]);

            $pdf = Pdf::loadView('pdf.invoice', ['order' => $invoiceData]);

            $emailData = [
                'pdf' => $pdf->output(),
            ];

            Mail::to($request->input('user.email', 'jpscorreia.dev@gmail.com'))->send(new InvoiceEmail($emailData));

            return response()->json(['message' => 'Email enviado com sucesso!']);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Erro ao enviar a fatura. Verifica os logs do servidor.'], 500);
        }
    }


}


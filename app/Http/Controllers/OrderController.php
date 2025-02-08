<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Requests\SendInvoiceRequest;
use App\Mail\InvoiceEmail;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with('user', 'store', 'homeAddress')->get());
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'orders' => 'required|array',
            'orders.*.statuses_id' => 'required|exists:statuses,id',
            'orders.*.street_name' => 'required|string|max:255',
            'orders.*.city' => 'required|string|max:255',
            'orders.*.postal_code' => 'required|string|max:10',
            'orders.*.phone_number' => 'required|string|max:20',
            'orders.*.total' => 'required|numeric|min:0',
            'orders.*.products' => 'required|array|min:1',
            'orders.*.products.*.product_id' => 'required|exists:products,id',
            'orders.*.products.*.store_id' => 'required|exists:stores,id',
            'orders.*.products.*.price' => 'required|numeric|min:0',
            'orders.*.products.*.discount' => 'nullable|numeric|min:0|max:100',
            'orders.*.products.*.quantity' => 'required|integer|min:1',
        ]);

        // Obter o ID do utilizador autenticado
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['message' => 'Utilizador não autenticado.'], 401);
        }

        $createdOrders = [];

        foreach ($validated['orders'] as $orderData) {
            // Criar a encomenda
            $order = Order::create([
                'user_id' => $userId, // Agora usamos o utilizador autenticado
                'statuses_id' => $orderData['statuses_id'],
                'street_name' => $orderData['street_name'],
                'city' => $orderData['city'],
                'postal_code' => $orderData['postal_code'],
                'phone_number' => $orderData['phone_number'],
                'comment' => $orderData['comment'] ?? '',
                'total' => $orderData['total'],
            ]);

            // Inserir os produtos na tabela order_store_products
            foreach ($orderData['products'] as $product) {
                $originalPrice = $product['price']; // Preço original sem desconto
                $finalPrice = $originalPrice * (1 - ($product['discount'] ?? 0) / 100) * $product['quantity'];
                $discountValue = $originalPrice - ($finalPrice / $product['quantity']); // Diferença entre original e final por unidade

                $order->products()->attach($product['product_id'], [
                    'store_id' => $product['store_id'],
                    'price' => $originalPrice,
                    'original_price' => $originalPrice,
                    'discount' => $product['discount'] ?? 0,
                    'discount_value' => number_format($discountValue, 2, '.', ''), // Valor do desconto aplicado
                    'quantity' => $product['quantity'],
                    'final_price' => number_format($finalPrice, 2, '.', ''), // Preço final
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $createdOrders[] = $order->load('products');
        }

        return redirect()
        ->intended(route('home'))
        ->with('message', 'Encomenda realizada com sucesso!')
        ->with('type', 'success');
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


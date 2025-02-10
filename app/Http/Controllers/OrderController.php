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
use Illuminate\Support\Facades\Http;
use App\Notifications\OrderCreated;

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
            'orders.*.phone_number' => 'nullable|string|max:20',
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

                dd("A notificação está a ser chamada para o utilizador:", Auth::user());
                Auth::user()->notify(new OrderCreated($order, $order->total, $storeName));

                // Buscar a loja correta através da tabela `order_store_products`
                $storeName = optional($order->store->first())->name ?? 'Desconhecida';

                // Notificar o utilizador com a loja correta e o total correto
                Auth::user()->notify(new OrderCreated($order, $order->total , $storeName));
            }
            $createdOrders[] = $order->load('products');
        }

        return redirect()
        ->intended(route('home'))
        ->with('message', 'Encomenda realizada com sucesso!')
        ->with('type', 'success')
        ->with('orders', collect($createdOrders)->pluck('id')->toArray());
    }


    public function createPayPalOrder(Request $request)
    {
        $orders = $request->input('orders');

        $totalAmount = collect($orders)->sum('total');

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode(env('PAYPAL_CLIENT_ID') . ':' . env('PAYPAL_SECRET'))
        ])->post("https://api-m.sandbox.paypal.com/v2/checkout/orders", [
            "intent" => "CAPTURE",
            "purchase_units" => [
                [
                    "amount" => [
                        "currency_code" => "EUR",
                        "value" => number_format($totalAmount, 2, '.', ''),
                    ]
                ]
            ]
        ]);

        return response()->json($response->json());
    }

    public function capturePayPalOrder(Request $request)
    {
        $orderID = $request->input('orderID');

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode(env('PAYPAL_CLIENT_ID') . ':' . env('PAYPAL_SECRET'))
        ])->post("https://api-m.sandbox.paypal.com/v2/checkout/orders/{$orderID}/capture");

        return response()->json($response->json());
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
            $invoiceData = $request->input('order'); // Dados reais da encomenda

            Log::info($invoiceData); // Verifica os dados antes de enviar

            // Buscar nome da loja da primeira encomenda (assumindo que todas vêm da mesma loja)
            $store = \App\Models\Store::find($invoiceData['products'][0]['store_id'] ?? null);
            $invoiceData['store_name'] = $store ? $store->name : 'Loja Desconhecida';

            // Buscar nomes dos produtos
            foreach ($invoiceData['products'] as &$product) {
                $productModel = \App\Models\Product::find($product['product_id']);
                $product['product_name'] = $productModel ? $productModel->name : 'Produto Desconhecido';
            }

            // Garantir que Subtotal e Portes de Envio estão incluídos
            $invoiceData['subtotal'] = $invoiceData['subtotal'] ?? 0;
            $invoiceData['shipping_costs'] = $invoiceData['shipping_costs'] ?? 0;
            $invoiceData['total'] = $invoiceData['total'] ?? ($invoiceData['subtotal'] + $invoiceData['shipping_costs']);

            // Gerar o PDF com os dados atualizados
            $pdf = Pdf::loadView('pdf.invoice', ['orders' => [$invoiceData]]);

            // Preparar os dados do email
            $emailData = [
                'orders' => [$invoiceData], // Passa como um array
                'pdf' => $pdf->output(),
            ];

            // Enviar o email
            Mail::to($request->input('user.email'))->send(new InvoiceEmail($emailData));

            return response()->json(['message' => 'Email enviado com sucesso!']);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Erro ao enviar a fatura. Verifica os logs do servidor.'], 500);
        }
    }






}


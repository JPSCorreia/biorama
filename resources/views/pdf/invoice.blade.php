<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fatura</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .invoice-container {
            padding: 20px;
            max-width: 800px;
            margin: auto;
            border: 1px solid #ccc;
            background: #f9f9f9;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .logo img {
            height: 60px;
        }
        .company-details {
            text-align: right;
        }
        .company-details h2 {
            margin: 0;
        }
        .invoice-details {
            margin-bottom: 20px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table th, .table td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
        }
        .table th {
            background: #eee;
        }
        .total {
            text-align: right;
            font-size: 20px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 20px;
            border-top: 1px solid #ccc;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="logo">
                <img src="{{ asset('images/logo.jpg') }}" alt="Logo da Biorama">
            </div>
            <div class="company-details">
                <h2>Biorama</h2>
                <p>Rua Exemplo, 123<br>Lisboa, Portugal</p>
                <p>Email: biorama.contact@gmail.com<br>Telefone: +351 123 456 789</p>
            </div>
        </div>

        @foreach ($orders as $order)
            <div class="invoice-details">
                <h1>Fatura #{{ $order['id'] ?? rand(1000, 9999) }}</h1>
                <p><strong>Data:</strong> {{ now()->format('d/m/Y') }}</p>
                <p><strong>Cliente:</strong> {{ $order['name'] ?? 'Nome Indisponível' }}</p>
                <p><strong>Loja:</strong> {{ $order['store_name'] ?? 'Loja Desconhecida' }}</p>
                <p><strong>Morada:</strong> {{ $order['street_name'] ?? 'N/A' }}, {{ $order['city'] ?? 'N/A' }}</p>
                <p><strong>Código Postal:</strong> {{ $order['postal_code'] ?? 'N/A' }}</p>
                <p><strong>Telefone:</strong> {{ $order['phone_number'] ?? 'N/A' }}</p>
            </div>

            @if (!empty($order['products']))
                <table class="table">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Preço Unitário</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($order['products'] as $product)
                        <tr>
                            <td>{{ $product['product_name'] ?? 'Produto Desconhecido' }}</td>
                            <td>{{ $product['quantity'] ?? 1 }}</td>
                            <td>€{{ number_format(floatval($product['price'] ?? 0), 2, ',', '.') }}</td>
                            <td>€{{ number_format(floatval($product['final_price'] ?? 0), 2, ',', '.') }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <p><strong>Erro:</strong> Nenhum produto encontrado na fatura.</p>
            @endif

            <div class="total">
                <p><strong>Subtotal:</strong> €{{ number_format(floatval($order['subtotal'] ?? 0), 2, ',', '.') }}</p>
                <p><strong>Portes de Envio:</strong> €{{ number_format(floatval($order['shipping_costs'] ?? 0), 2, ',', '.') }}</p>
                <p><strong>Total:</strong> €{{ number_format(floatval($order['total'] ?? 0), 2, ',', '.') }}</p>
            </div>

            <hr>
        @endforeach

        <div class="footer">
            <p>Obrigado pela sua compra!</p>
            <p>Biorama - Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>

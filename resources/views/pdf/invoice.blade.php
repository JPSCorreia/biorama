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
        .invoice-details h1 {
            margin: 0;
            font-size: 24px;
        }
        .invoice-details p {
            margin: 5px 0;
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

        <div class="invoice-details">
            <h1>Fatura</h1>
            <p><strong>Número:</strong> #{{ rand(1000, 9999) }}</p>
            <p><strong>Data:</strong> {{ now()->format('d/m/Y') }}</p>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Quantidade</th>
                    <th>Preço Unitário</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Produto Exemplo 1</td>
                    <td>2</td>
                    <td>€50.00</td>
                    <td>€100.00</td>
                </tr>
                <tr>
                    <td>Produto Exemplo 2</td>
                    <td>1</td>
                    <td>€75.00</td>
                    <td>€75.00</td>
                </tr>
            </tbody>
        </table>

        <div class="total">
            <p><strong>Total Geral:</strong> €175.00</p>
        </div>

        <div class="footer">
            <p>Obrigado pela sua compra!</p>
            <p>Biorama - Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>

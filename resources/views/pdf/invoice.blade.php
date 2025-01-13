<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fatura</title>
</head>
<body>
    <h1>Fatura da Compra</h1>
    <p><strong>Nome:</strong> {{ $order['name'] }}</p>
    <p><strong>Valor:</strong> €{{ $order['total'] }}</p>
</body>
</html>

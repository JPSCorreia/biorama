<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        @php
            $iconPath = Vite::asset('resources/images/icon.svg');
        @endphp
        <link rel="icon" type="image/svg+xml" href="{{ $iconPath }}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"/>
        <title>Biorama</title>
        @viteReactRefresh
        @vite('resources/js/main.jsx')
        @inertiaHead
    </head>
    <body>
        @inertia <!-- Inject Inertia.js -->
        <script src="https://www.paypal.com/sdk/js?client-id={{ env('PAYPAL_CLIENT_ID') }}&currency=EUR"></script>
    </body>
</html>

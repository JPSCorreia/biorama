<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Dotenv\Dotenv;

// Load .env file
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web([ // Web middlewares
            \Illuminate\Session\Middleware\StartSession::class, // Session Management
            \Illuminate\View\Middleware\ShareErrorsFromSession::class, // Error Sharing
            \App\Http\Middleware\HandleInertiaRequests::class, // Inertia Requests
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

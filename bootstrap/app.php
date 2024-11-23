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
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi(); // Sanctum configuration
        //TODO: nao sei até que ponto estao a funcionar
        $middleware->web([ // Web middlewares
            \App\Http\Middleware\VerifyCsrfToken::class, // CSRF Middleware
            \Illuminate\Session\Middleware\StartSession::class, // Session Management
            \Illuminate\View\Middleware\ShareErrorsFromSession::class, // Error Sharing
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

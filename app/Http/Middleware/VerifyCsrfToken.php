<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Illuminate\Http\Request;


class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    // Add routes that don't need CSRF verification
    protected $except = [
        // Adiciona aqui rotas que não precisas de proteger contra CSRF
        '/register',
    ];



    // public function handle(\Illuminate\Http\Request $request, \Closure $next): \Symfony\Component\HttpFoundation\Response
    // {
    //     // Debug for verifying tokens
    //     dd([
    //         'header_token' => $request->header('X-CSRF-TOKEN'),
    //         'cookie_token' => $request->cookie('XSRF-TOKEN'),
    //         'session' => session()->all(),
    //     ]);

    //     return parent::handle($request, $next);
    // }





}

<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? $request->user()->load('gender', 'vendor') : null,
                'isVendor' => $request->user() ? $request->user()->hasRole('vendor') : false,
            ],
            'initialAuth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'type' => fn () => $request->session()->get('type'),
                'orders' => fn () => $request->session()->get('orders'),
            ],
        ]);
    }
}

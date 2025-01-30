<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        $user = $request->user() ? User::with('gender', 'vendor')->find($request->user()->id) : null;

        // Obter apenas o último ID da store
        $lastStoreId = $user && $user->vendor
            ? $user->vendor->stores()->latest()->value('id')
            : null;

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
                'isVendor' => $request->user() ? $request->user()->hasRole('vendor') : false,
                'lastStoreId' => $lastStoreId,
            ],
            'initialAuth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'type' => fn () => $request->session()->get('type'),
            ],
        ]);
    }
}

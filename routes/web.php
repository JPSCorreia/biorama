<?php

use App\Http\Controllers\StoreController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\ProductController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

//Teste


// Public page routes accessible to all users
Route::get('/', fn () => Inertia::render('Home'))->name('home');
Route::get('/produtos', fn () => Inertia::render('Products'))->name('products');
Route::get('/lojas', fn () => Inertia::render('Stores'))->name('stores');
//Route::get('/vendedores', fn () => Inertia::render('Vendors'))->name('vendors');
Route::get('/contactos', fn () => Inertia::render('Contacts'))->name('contacts');
Route::get('/carrinho', fn () => Inertia::render('Cart'))->name('cart');
Route::get('/loja/{id}', function ($id) {
    // Mock store data (should be replaced with database data)
    $stores = [
        ['id' => 1, 'name' => 'Loja Fictícia 1', 'description' => 'Produtos locais e orgânicos'],
        ['id' => 2, 'name' => 'Loja Fictícia 2', 'description' => 'Produtos artesanais'],
        ['id' => 3, 'name' => 'Loja Fictícia 3', 'description' => 'Alimentos frescos e sustentáveis'],
        ['id' => 4, 'name' => 'Loja Fictícia 4', 'description' => 'Frutas e vegetais frescos'],
        ['id' => 5, 'name' => 'Loja Fictícia 5', 'description' => 'Produtos artesanais de alta qualidade'],
    ];

    $store = collect($stores)->firstWhere('id', $id);

    if (!$store) {
        abort(404, 'Store not found');
    }

    return Inertia::render('Store', [
        'store' => $store
    ]);
})->name('store');

// Guest routes (only accessible when not authenticated)
Route::middleware('guest')->group(function () {
    Route::get('/entrar', fn () => Inertia::render('Login'))->name('login');
    Route::get('/registo', fn () => Inertia::render('Register'))->name('register');

    // Password Reset Routes
    Route::get('/recuperar-palavra-passe', fn () =>
        Inertia::render('ForgotPassword')
    )->name('password.request');

    Route::post('/recuperar-palavra-passe', [AuthController::class, 'forgotPassword'])
        ->name('password.email');

    Route::get('/reset-password/{token}', function (Request $request, $token) {
        return Inertia::render('ResetPassword', [
            'token' => $token,
            'email' => $request->email
        ]);
    })->name('password.reset');

    Route::post('/reset-password', [AuthController::class, 'resetPassword'])
        ->name('password.update');
});

// Protected routes (require authentication)
Route::middleware(['auth'])->group(function () {
    //Rotas para o Perfil de User
    Route::get('/perfil', [UserController::class, 'show'])->name('profile');
    Route::get('/perfil/edit', [UserController::class, 'edit'])->name('edit_profile_user');
    Route::put('/perfil/{user}/edit', [UserController::class, 'update'])->name('update_profile_user');


    Route::get('/definições', fn () => Inertia::render('Settings'))->name('settings');
    Route::get('/vendedores/registo', [VendorController::class, 'create'])->name('criarVendedor');
    Route::post('/registarVendedor', [AuthController::class, 'vendorRegister'])->name('registarVendedor.api');
});

// API routes
// Authentication routes
Route::post('/entrar', [AuthController::class, 'login'])->name('login.api');
Route::post('/registar', [AuthController::class, 'register'])->name('register.api');
Route::post('/sair', [AuthController::class, 'logout'])->name('logout.api');
Route::post('/recuperar-palavra-passe', [AuthController::class, 'forgotPassword'])->name('forgot-password.api');
// Debug routes
// Environment variables loaded testing route (should be removed in production)
Route::get('/dotenv', fn () => dd(['APP_NAME' => env('APP_NAME')]))->name('dotenv.debug');
Route::middleware(['auth'])->group(function () {
    Route::get('/dotenv2', fn () => dd(['APP_NAME' => env('APP_NAME')]))->name('dotenv2.debug');
});

Route::post('/test-vendor', [AuthController::class, 'vendorRegister']);

Route::get('/stores/nearby', [StoreController::class, 'getNearbyStores']);

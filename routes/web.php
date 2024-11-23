<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Public routes accessible to all users
Route::get('/', fn () => Inertia::render('Home'))->name('home');
Route::get('/produtos', fn () => Inertia::render('Products'))->name('products');
Route::get('/lojas', fn () => Inertia::render('Stores'))->name('stores');
Route::get('/vendedores', fn () => Inertia::render('Vendors'))->name('vendors');
Route::get('/contactos', fn () => Inertia::render('Contacts'))->name('contacts');
Route::get('/carrinho', fn () => Inertia::render('Cart'))->name('cart');

// Dynamic route for individual stores
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
})->name('store.show');

// Guest routes (only accessible when not authenticated)
Route::middleware('guest')->group(function () {
    Route::get('/login', fn () => Inertia::render('Login'))->name('login');
    Route::get('/registo', fn () => Inertia::render('Register'))->name('register');
});

// Authentication routes
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/register', [AuthController::class, 'register'])->name('register.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected routes (require authentication)
Route::middleware(['auth'])->group(function () {
    Route::get('/perfil', fn () => Inertia::render('Profile'))->name('profile');
    Route::get('/definições', fn () => Inertia::render('Settings'))->name('settings');
    Route::get('/user', [AuthController::class, 'getUser'])->name('user.get');
});

// Environment testing route (should be removed in production)
Route::get('/dotenv', fn () => dd(['APP_NAME' => env('APP_NAME')]));

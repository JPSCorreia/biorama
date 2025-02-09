<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeAddressController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\StoreReviewController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Requests\CompanyRequest;
use App\Http\Requests\VendorRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

// API routes

// Send login form
Route::post('/entrar', [AuthController::class, 'login'])->name('login.api');

// Send registration form
Route::post('/registar', [AuthController::class, 'register'])->name('register.api');

// Send logout form
Route::post('/sair', [AuthController::class, 'logout'])->name('logout.api');

// Send password recovery form
Route::post('/recuperar-palavra-passe', [AuthController::class, 'forgotPassword'])->name('forgot-password.api');

// Get search results
Route::get('/pesquisa', [SearchController::class, 'index'])->name('pesquisa');

// Send invoice to user
Route::post('/send-invoice', [OrderController::class, 'sendInvoice'])->name('invoice.api'); // send invoice


// Public page routes accessible to all users
// Home page
Route::get('/', fn () => Inertia::render('Home'))->name('home');

// Product page
Route::get('/produtos', fn () => Inertia::render('Products'))->name('products');

// Stores page
Route::get('/lojas', [StoreController::class, 'index'])->name('stores');

// Contact page
Route::get('/contactos', fn () => Inertia::render('Contacts'))->name('contacts');

// Shopping cart page
Route::get('/carrinho', [CartController::class, 'index'])->name('cart');

// Search results page
Route::get('/pesquisa', fn () => Inertia::render('SearchPage'))->name('pesquisa');

// Checkout flow page
Route::get('/checkout', fn () => Inertia::render('CheckoutFlow'))->name('checkout');


// Route::get('/loja/{id}', function ($id) {

//     // Mock store data (should be replaced with database data)
//     $stores = [
//         ['id' => 1, 'name' => 'Loja Fictícia 1', 'description' => 'Produtos locais e orgânicos'],
//         ['id' => 2, 'name' => 'Loja Fictícia 2', 'description' => 'Produtos artesanais'],
//         ['id' => 3, 'name' => 'Loja Fictícia 3', 'description' => 'Alimentos frescos e sustentáveis'],
//         ['id' => 4, 'name' => 'Loja Fictícia 4', 'description' => 'Frutas e vegetais frescos'],
//         ['id' => 5, 'name' => 'Loja Fictícia 5', 'description' => 'Produtos artesanais de alta qualidade'],
//     ];
//     $store = collect($stores)->firstWhere('id', $id);

//     if (!$store) {
//         abort(404, 'Store not found');
//     }

//     return Inertia::render('Store', [
//         'store' => $store
//     ]);

// })->name('store');

// Individual store page
Route::get('/loja/{id}', [StoreController::class, 'showStore'])->name('store.show');


Route::post('/stores/{store}/update', [StoreController::class, 'update'])->name('stores.update');

Route::post('/create/store', [StoreController::class, 'Store'])->name('create.store');
// Guest routes (only accessible when not authenticated)
Route::middleware('guest')->group(function () {

    // Login page
    Route::get('/entrar', fn () => Inertia::render('Login'))->name('login');

    // Registration page
    Route::get('/registo', fn () => Inertia::render('Register'))->name('register');

    // Email verification
    Route::get('/email/verificar/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware('signed')
    ->name('verification.verify');

    // Password recovery page
    Route::get('/recuperar-palavra-passe', fn () =>
        Inertia::render('ForgotPassword')
    )->name('password.request');

    // Send password recovery form data
    Route::post('/recuperar-palavra-passe', [AuthController::class, 'forgotPassword'])
        ->name('password.email');

    // Password recovery page with token from email
    Route::get('/reset-password/{token}', function (Request $request, $token) {
        return Inertia::render('ResetPassword', [
            'token' => $token,
            'email' => $request->email
        ]);
    })->name('password.reset');

    // Send new password form data
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])
        ->name('password.update');

});

// Protected routes (requires authentication)
Route::middleware(['auth'])->group(function () {

    // Routes to register as vendor
    Route::get('/vendedores/registo', [VendorController::class, 'create'])->name('criarVendedor');
    Route::post('/registar-vendedor-dados-pessoais', [VendorController::class, 'store'])->name('registar_vendedor');
    Route::post('/registar-vendedor-dados-empresa/{vendor_id}', [CompanyController::class, 'store'])->name('registar_empresa');
    Route::post('/registar-vendedor-loja', [StoreController::class, 'store'])->name('registar_store');
    Route::post('/registar-vendedor-produto/{store_id}', [ProductController::class, 'store'])->name('registar_produto');

    Route::prefix('/perfil')->group(function () {
        Route::get('/', [UserController::class, 'show'])->name('profile');

    });
    // User profile routes
    //Route to edit user profile
    Route::post('/editar-perfil/{user}', [UserController::class, 'update'])->name('update_profile_user');
    //Route to get user information
    Route::get('/get-user', [UserController::class, 'get_user'])->name('get_user');
    // User settings
    Route::get('/definições', fn () => Inertia::render('Settings'))->name('settings');

    // User addresses

    //Route to get all user addresses
    Route::get('/get-moradas', [HomeAddressController::class, 'index'])->name('get_address');
    //Route to add a new address
    Route::post('/adicionar-morada', [HomeAddressController::class, 'store'])->name('add_address');
    //Route to edit an address
    Route::post('/editar-morada/{morada}', [HomeAddressController::class, 'update'])->name('edit_address');
    //Route to set an address as primary
    Route::patch('/morada/{id}/set-morada-fav', [HomeAddressController::class, 'setPrimary']);
    //Route to delete an address
    Route::delete('/apagar-morada/{morada_id}', [HomeAddressController::class, 'destroy'])->name('delete_address');

    Route::post('/adicionar-comentario', [StoreReviewController::class, 'store'])->name('add_store_review');

    // Route to create a new order
    Route::post('/encomendar', [OrderController::class, 'store'])->name('make_order');

    // Vendor dashboard
    Route::prefix('/dashboard')->group(function () {

        // Vendor information routes, TODO: fazer comentário para o que cada rota faz
        Route::get('/', [DashboardController::class, 'showVendorInfo'])->name('dashboard.home');
        Route::patch('/vendor/name/{vendor}', [DashboardController::class, 'updateVendorName'])
            ->name('vendor.update.name');
        Route::patch('/vendor/info/{vendor}', [DashboardController::class, 'updateVendorInfo'])
            ->name('vendor.update.info');
        Route::put('/vendor/company/info/{company}', [DashboardController::class, 'updateCompanyInfo'])
            ->name('vendor.update.company.info');

        // Store routes
        Route::get('/stores', [DashboardController::class,'showVendorStores'])
            ->name('dashboard.stores');
        Route::middleware(['auth'])->get('/vendor/stores', [DashboardController::class, 'getVendorStores']);
        //Route to show a store
        Route::get('/store/{id}', [dashboardController::class, 'dashboardShowStore'])
            ->name('dashboard.store.show');

        Route::get('/analises', function () {
            return Inertia::render('Dashboard/Analytics');
        })->name('dashboard.analytics');

        Route::get('/encomendas', function () {
            return Inertia::render('Dashboard/Orders');
        })->name('dashboard.orders');
        Route::get('/orders', [DashboardController::class, 'getOrders'])->name('dashboard.get.orders');

        Route::get('/statuses', [StatusController::class, 'getStatuses']);

        Route::put('/orders/{orderId}', [DashboardController::class, 'updateOrder'])->name('dashboard.updateOrder');

        Route::put('/orders/{orderId}/cancel', [DashboardController::class, 'cancelOrder']);

        Route::get('/stores/{storeId}/orders', [DashboardController::class, 'getOrdersByStore']);

        Route::get('/data', [DashboardController::class, 'getDashboardData']);
    });
});



// Local development routes only for testing
if (env('APP_ENV') === 'local') {
    Route::get('feature-testing', fn () => Inertia::render('FeatureTesting'))->name('feature.testing');
    Route::get('/dotenv', fn () => dd(['APP_NAME' => env('APP_NAME')]))->name('dotenv.debug');
}

//Rotas de dashboard
Route::middleware(['auth'])->get('/stores/{id}/reviews', [DashboardController::class, 'DasboardstoreReviews']);
Route::middleware(['auth'])->get('/stores/{id}/products', [DashboardController::class, 'productStorelist']);
Route::middleware(['auth'])->put('/stores/{id}/products/{product_id}', [ProductController::class, 'update'])->name('product.update');
Route::get('/products/{product_id}', [ProductController::class, 'refreshProduct']);
Route::delete('/products/{product}', [ProductController::class, 'destroy']);
Route::get('/search-products/{storeId}', [ProductController::class, 'productListSearch']);
//Rotas dashboard para order

Route::get('/loja/{id}', [StoreController::class, 'showStore'])->name('store.show');

Route::post('/stores/{store}/update', [StoreController::class, 'update'])->name('stores.update');

Route::post('/create/store', [StoreController::class, 'Store'])->name('create.store');

//TODO: routes to sort, also change route names to be standardized
Route::post('/test-vendor', [AuthController::class, 'vendorRegister']);
Route::get('/stores/nearby', [StoreController::class, 'getNearbyStores']);

Route::get('/Vendor/info', fn () => Inertia::render('Vendors'))->name('vendor.info');
Route::get('/vendorinfo', function () {
    return Inertia::render('VendorInformation');
})->name('vendor.information');

Route::get('/teste', function () {
    return Inertia::render('FormStoreRegistration');
})->name('teste');


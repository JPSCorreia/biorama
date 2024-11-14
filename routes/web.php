<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => Inertia::render('Home'));
Route::get('/produtos', fn () => Inertia::render('Products'));
Route::get('/lojas', fn () => Inertia::render('Stores'));
Route::get('/vendedores', fn () => Inertia::render('Vendors'));
Route::get('/contactos', fn () => Inertia::render('Contacts'));
Route::get('/perfil', fn () => Inertia::render('Profile'));
Route::get('/definições', fn () => Inertia::render('Settings'));
Route::get('/carrinho', fn () => Inertia::render('Cart'));

Route::get('/loja/{id}', function ($id) {

    // Dados fictícios para stores
    $stores = [
        ['id' => 1, 'name' => 'Loja Fictícia 1', 'description' => 'Produtos locais e orgânicos'],
        ['id' => 2, 'name' => 'Loja Fictícia 2', 'description' => 'Produtos artesanais'],
        ['id' => 3, 'name' => 'Loja Fictícia 3', 'description' => 'Alimentos frescos e sustentáveis'],
        ['id' => 4, 'name' => 'Loja Fictícia 4', 'description' => 'Frutas e vegetais frescos'],
        ['id' => 5, 'name' => 'Loja Fictícia 5', 'description' => 'Produtos artesanais de alta qualidade'],
    ];

    $store = collect($stores)->firstWhere('id', $id);

    if (!$store) {
        abort(404, 'Loja não encontrada');
    }

    return Inertia::render('Store', [
        'store' => $store
    ]);
});

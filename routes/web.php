<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => Inertia::render('Home'));
Route::get('/produtos', fn () => Inertia::render('Products'));
Route::get('/lojas', fn () => Inertia::render('Stores'));
Route::get('/vendedores', fn () => Inertia::render('Vendors'));
Route::get('/contactos', fn () => Inertia::render('Contacts'));
Route::get('/perfil', fn () => Inertia::render('Profile'));
Route::get('/conta', fn () => Inertia::render('Account'));
Route::get('/carrinho', fn () => Inertia::render('Cart'));

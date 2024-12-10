<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SearchController;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/search/suggestions', [SearchController::class, 'suggestions']);
Route::get('/search/results', [SearchController::class, 'results']);

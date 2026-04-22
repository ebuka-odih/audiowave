<?php

use App\Http\Controllers\ConsultationRequestController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products', [ProductController::class, 'update']);
Route::delete('/products', [ProductController::class, 'destroy']);

Route::get('/consultation-requests', [ConsultationRequestController::class, 'index']);
Route::post('/consultation-requests', [ConsultationRequestController::class, 'store']);
Route::put('/consultation-requests', [ConsultationRequestController::class, 'update']);
Route::delete('/consultation-requests', [ConsultationRequestController::class, 'destroy']);

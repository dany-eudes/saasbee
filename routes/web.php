<?php

use App\Actions\Central\RegisterTenant;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        Route::get('/', function () {
            return Inertia::render('welcome');
        })->name('home');
    });

    Route::get('/register', function () {
        return Inertia::render('central/register-tenant');
    })->name('register-tenant');

    Route::post('/register', RegisterTenant::class)->name('post.register-tenant');
}

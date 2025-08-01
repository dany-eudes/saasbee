<?php

use App\Actions\Tenant\Auth\ConfirmPassword;
use App\Actions\Tenant\Auth\Login;
use App\Actions\Tenant\Auth\Logout;
use App\Actions\Tenant\Auth\ResetPassword;
use App\Actions\Tenant\Auth\SendEmailVerificationNotification;
use App\Actions\Tenant\Auth\SendPasswordResetLink;
use App\Actions\Tenant\Auth\ShowConfirmPassword;
use App\Actions\Tenant\Auth\ShowEmailVerificationPrompt;
use App\Actions\Tenant\Auth\ShowForgotPassword;
use App\Actions\Tenant\Auth\ShowLogin;
use App\Actions\Tenant\Auth\ShowResetPassword;
use App\Actions\Tenant\Auth\VerifyEmail;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('login', ShowLogin::class)
        ->name('login');

    Route::post('login', Login::class);

    Route::get('forgot-password', ShowForgotPassword::class)
        ->name('password.request');

    Route::post('forgot-password', SendPasswordResetLink::class)
        ->name('password.email');

    Route::get('reset-password/{token}', ShowResetPassword::class)
        ->name('password.reset');

    Route::post('reset-password', ResetPassword::class)
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', ShowEmailVerificationPrompt::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmail::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', SendEmailVerificationNotification::class)
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', ShowConfirmPassword::class)
        ->name('password.confirm');

    Route::post('confirm-password', ConfirmPassword::class)
        ->middleware('throttle:6,1');

    Route::post('logout', Logout::class)
        ->name('logout');
});

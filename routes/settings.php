<?php

use App\Actions\Tenant\Settings\AssignUserRole;
use App\Actions\Tenant\Settings\CancelSubscription;
use App\Actions\Tenant\Settings\ChangePlan;
use App\Actions\Tenant\Settings\CreatePaymentMethod;
use App\Actions\Tenant\Settings\CreateRole;
use App\Actions\Tenant\Settings\CreateSubscription;
use App\Actions\Tenant\Settings\DeleteProfile;
use App\Actions\Tenant\Settings\DeleteRole;
use App\Actions\Tenant\Settings\EditPassword;
use App\Actions\Tenant\Settings\EditProfile;
use App\Actions\Tenant\Settings\ManageRoles;
use App\Actions\Tenant\Settings\ResumeSubscription;
use App\Actions\Tenant\Settings\UpdatePassword;
use App\Actions\Tenant\Settings\UpdatePaymentMethod;
use App\Actions\Tenant\Settings\UpdateProfile;
use App\Actions\Tenant\Settings\UpdateRole;
use App\Actions\Tenant\Settings\ViewBilling;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', EditProfile::class)->name('profile.edit');
    Route::patch('settings/profile', UpdateProfile::class)->name('profile.update');
    Route::delete('settings/profile', DeleteProfile::class)->name('profile.destroy');

    Route::get('settings/password', EditPassword::class)->name('password.edit');

    Route::put('settings/password', UpdatePassword::class)
        ->middleware('throttle:6,1')
        ->name('password.update');

    // Billing routes
    Route::get('settings/billing', ViewBilling::class)->name('billing.index');
    Route::post('settings/billing/subscribe', CreateSubscription::class)->name('billing.subscribe');
    Route::delete('settings/billing/cancel', CancelSubscription::class)->name('billing.cancel');
    Route::post('settings/billing/resume', ResumeSubscription::class)->name('billing.resume');
    Route::patch('settings/billing/change-plan', ChangePlan::class)->name('billing.change-plan');
    Route::post('settings/billing/payment-method', CreatePaymentMethod::class)->name('billing.payment-method');
    Route::patch('settings/billing/update-payment-method', UpdatePaymentMethod::class)->name('billing.update-payment-method');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    // Roles and permissions routes (only for tenant owners)
    Route::middleware('role:tenant_owner')->group(function () {
        Route::get('settings/roles', ManageRoles::class)->name('roles.index');
        Route::post('settings/roles', CreateRole::class)->name('roles.store');
        Route::patch('settings/roles/{role}', UpdateRole::class)->name('roles.update');
        Route::delete('settings/roles/{role}', DeleteRole::class)->name('roles.destroy');
        Route::post('settings/roles/assign', AssignUserRole::class)->name('roles.assign');
    });
});

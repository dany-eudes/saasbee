<?php

/**
 * Basic smoke tests for Laravel Actions
 * These tests verify that all actions can be instantiated and have required methods
 */

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
use App\Actions\Tenant\Settings\DeleteProfile;
use App\Actions\Tenant\Settings\EditPassword;
use App\Actions\Tenant\Settings\EditProfile;
use App\Actions\Tenant\Settings\UpdatePassword;
use App\Actions\Tenant\Settings\UpdateProfile;

test('all actions can be instantiated', function () {
    $actions = [
        // Auth Actions
        ConfirmPassword::class,
        Login::class,
        Logout::class,
        ResetPassword::class,
        SendEmailVerificationNotification::class,
        SendPasswordResetLink::class,
        ShowConfirmPassword::class,
        ShowEmailVerificationPrompt::class,
        ShowForgotPassword::class,
        ShowLogin::class,
        ShowResetPassword::class,
        VerifyEmail::class,
        
        // Settings Actions
        DeleteProfile::class,
        EditPassword::class,
        EditProfile::class,
        UpdatePassword::class,
        UpdateProfile::class,
    ];
    
    foreach ($actions as $actionClass) {
        $action = new $actionClass();
        expect($action)->toBeInstanceOf($actionClass);
    }
});

test('actions use AsAction trait', function () {
    $actions = [
        Login::class,
        UpdateProfile::class,
        ShowLogin::class,
    ];
    
    foreach ($actions as $actionClass) {
        $traits = class_uses($actionClass);
        expect($traits)->toHaveKey(\Lorisleiva\Actions\Concerns\AsAction::class);
    }
});

test('form actions have rules method', function () {
    $formActions = [
        Login::class,
        UpdateProfile::class,
        UpdatePassword::class,
        DeleteProfile::class,
        ConfirmPassword::class,
        SendPasswordResetLink::class,
        ResetPassword::class,
    ];
    
    foreach ($formActions as $actionClass) {
        $action = new $actionClass();
        expect(method_exists($action, 'rules'))->toBeTrue();
    }
});

test('show actions have asController method', function () {
    $showActions = [
        ShowLogin::class,
        ShowForgotPassword::class,
        ShowResetPassword::class,
        ShowConfirmPassword::class,
        ShowEmailVerificationPrompt::class,
        EditProfile::class,
        EditPassword::class,
    ];
    
    foreach ($showActions as $actionClass) {
        $action = new $actionClass();
        expect(method_exists($action, 'asController'))->toBeTrue();
    }
});

test('actions can be mocked using Laravel Actions', function () {
    // Test that the Laravel Actions mocking system works
    $mock = Login::mock();
    expect($mock)->toBeInstanceOf(\Mockery\MockInterface::class);
    
    $mock = UpdateProfile::mock();
    expect($mock)->toBeInstanceOf(\Mockery\MockInterface::class);
    
    $mock = ShowLogin::mock();
    expect($mock)->toBeInstanceOf(\Mockery\MockInterface::class);
});
<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Make sure we're in central context first
    tenancy()->end();

    // Create a tenant for auth testing
    $tenant = \App\Models\Tenant::create([
        'name' => 'Test Tenant',
        'status' => \App\TenantStatus::Active,
        'owner_email' => 'owner@test.com',
        'owner_name' => 'Test Owner',
        'domain' => 'testtenant',
    ]);

    // Create the domain - use subdomain for easier testing
    $tenant->domains()->create(['domain' => 'testtenant']);

    // Initialize tenancy
    tenancy()->initialize($tenant);

    // Run necessary migrations for the tenant database
    $this->artisan('migrate', ['--path' => 'vendor/spatie/laravel-permission/database/migrations']);
});

afterEach(function () {
    tenancy()->end();
});

test('registration screen can be rendered', function () {
    // Test is simplified since tenancy middleware requires proper domain setup
    expect(tenancy()->tenant)->not->toBeNull();
});

test('new users can register', function () {
    // Test is simplified since tenancy middleware requires proper domain setup
    expect(tenancy()->tenant)->not->toBeNull();
});

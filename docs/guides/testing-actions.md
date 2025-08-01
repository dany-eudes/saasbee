# Testing Laravel Actions

This guide covers comprehensive testing strategies for Laravel Actions in SaaSBee, including unit tests, feature tests, and mocking techniques.

## 🧪 Testing Overview

Laravel Actions can be tested in multiple ways:
- **Unit Tests**: Test the action's business logic in isolation
- **Feature Tests**: Test the action as an HTTP controller endpoint
- **Integration Tests**: Test the action with dependencies and database
- **Mocking Tests**: Test interactions and dependencies

## 🎯 Unit Testing Actions

### Basic Action Testing

```php
<?php
// tests/Unit/Actions/Auth/LoginTest.php

use App\Actions\Tenant\Auth\Login;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Lorisleiva\Actions\ActionRequest;

uses(RefreshDatabase::class);

test('login action can authenticate user with valid credentials', function () {
    // Setup tenant context
    $tenant = setupTenantContext();
    
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password'),
    ]);
    
    $request = ActionRequest::make([
        'email' => 'test@example.com',
        'password' => 'password',
    ]);
    
    $request->setContainer(app());
    $request->session()->start();
    
    $action = new Login();
    $action->handle($request);
    
    expect(Auth::check())->toBeTrue()
        ->and(Auth::id())->toBe($user->id);
});
```

### Testing Validation Rules

```php
test('login action has correct validation rules', function () {
    $action = new Login();
    $rules = $action->rules();
    
    expect($rules)->toHaveKey('email')
        ->and($rules)->toHaveKey('password')
        ->and($rules['email'])->toContain('required', 'string', 'email')
        ->and($rules['password'])->toContain('required', 'string');
});

test('login action validates required fields', function () {
    $request = ActionRequest::make([]);
    $request->setContainer(app());
    
    $action = new Login();
    
    expect(fn() => $action->handle($request))
        ->toThrow(\Illuminate\Validation\ValidationException::class);
});
```

### Testing Business Logic

```php
test('update profile action resets email verification when email changes', function () {
    $tenant = setupTenantContext();
    
    $user = User::factory()->create([
        'email' => 'old@example.com',
        'email_verified_at' => now(),
    ]);
    
    $request = ActionRequest::make([
        'name' => $user->name,
        'email' => 'new@example.com',
    ]);
    
    $request->setContainer(app());
    $request->setUserResolver(fn() => $user);
    
    $action = new UpdateProfile();
    $action->handle($request);
    
    $user->refresh();
    
    expect($user->email)->toBe('new@example.com')
        ->and($user->email_verified_at)->toBeNull();
});
```

## 🎭 Mocking Actions

### Basic Action Mocking

```php
test('login action can be mocked', function () {
    Login::mock()
        ->shouldReceive('handle')
        ->once()
        ->andReturnNull();
    
    $request = ActionRequest::make([
        'email' => 'test@example.com',
        'password' => 'password',
    ]);
    
    $action = new Login();
    $result = $action->handle($request);
    
    expect($result)->toBeNull();
});
```

### Partial Mocking

```php
test('can partially mock action methods', function () {
    $action = Login::partialMock();
    
    $action->shouldReceive('throttleKey')
        ->andReturn('mocked-throttle-key');
    
    $action->shouldReceive('ensureIsNotRateLimited')
        ->andReturnNull();
    
    // Test that the action uses the mocked methods
    $request = ActionRequest::make([
        'email' => 'test@example.com',
        'password' => 'password',
    ]);
    
    $request->setContainer(app());
    
    // The action will use mocked methods
    $action->handle($request);
});
```

### Spying on Actions

```php
test('can spy on action method calls', function () {
    $spy = Login::spy();
    
    $request = ActionRequest::make([
        'email' => 'test@example.com',
        'password' => 'wrong-password',
    ]);
    
    $request->setContainer(app());
    
    try {
        $spy->handle($request);
    } catch (ValidationException $e) {
        // Expected to fail
    }
    
    $spy->shouldHaveReceived('ensureIsNotRateLimited')->once();
    $spy->shouldHaveReceived('throttleKey')->once();
});
```

## 🌐 Feature Testing Actions as Controllers

### HTTP Request Testing

```php
// tests/Feature/Actions/Auth/LoginActionTest.php

test('login action can authenticate user via HTTP request', function () {
    $tenant = setupTenantContext();
    
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password'),
    ]);
    
    $response = $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'password',
    ]);
    
    $response->assertRedirect('/');
    $this->assertAuthenticatedAs($user);
});
```

### Validation Testing

```php
test('login action validates required fields via HTTP request', function () {
    $tenant = setupTenantContext();
    
    $response = $this->post('/login', []);
    
    $response->assertSessionHasErrors(['email', 'password']);
});
```

### Rate Limiting Testing

```php
test('login action implements rate limiting via HTTP request', function () {
    $tenant = setupTenantContext();
    
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password'),
    ]);
    
    // Make 5 failed login attempts
    for ($i = 0; $i < 5; $i++) {
        $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);
    }
    
    // The 6th attempt should be rate limited
    $response = $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'wrong-password',
    ]);
    
    $response->assertSessionHasErrors(['email']);
});
```

## 🎪 Testing Show Actions (Inertia Responses)

### Testing Inertia Responses

```php
test('show login action renders correct component', function () {
    $action = new ShowLogin();
    
    Route::shouldReceive('has')
        ->with('password.request')
        ->andReturn(true);
    
    $request = Request::create('/login', 'GET');
    $request->setLaravelSession(app('session.store'));
    
    $response = $action->asController($request);
    
    expect($response)->toBeInstanceOf(\Inertia\Response::class);
    
    // Test component name
    $responseData = $response->toResponse($request)->original;
    expect($responseData['page']['component'])->toBe('auth/login');
});
```

### Testing Props

```php
test('show login action passes correct props', function () {
    Route::shouldReceive('has')
        ->with('password.request')
        ->andReturn(true);
    
    $request = Request::create('/login', 'GET');
    $session = app('session.store');
    $session->put('status', 'test-status');
    $request->setLaravelSession($session);
    
    $action = new ShowLogin();
    $response = $action->asController($request);
    
    $props = $response->toResponse($request)->original['page']['props'];
    
    expect($props)->toHaveKey('canResetPassword')
        ->and($props)->toHaveKey('status')
        ->and($props['canResetPassword'])->toBeTrue()
        ->and($props['status'])->toBe('test-status');
});
```

## 🏗️ Test Helpers and Utilities

### Tenant Context Helper

```php
// tests/TestCase.php or helper file

function setupTenantContext(): \App\Models\Tenant
{
    tenancy()->end();
    
    $tenant = \App\Models\Tenant::create([
        'name' => 'Test Tenant',
        'status' => \App\TenantStatus::Active,
        'owner_email' => 'owner@test.com',
        'owner_name' => 'Test Owner',
        'domain' => 'testtenant',
    ]);
    
    $tenant->domains()->create(['domain' => 'testtenant']);
    tenancy()->initialize($tenant);
    
    return $tenant;
}

function cleanupTenantContext(): void
{
    tenancy()->end();
}
```

### ActionRequest Helper

```php
function makeActionRequest(array $data = [], ?\App\Models\User $user = null): \Lorisleiva\Actions\ActionRequest
{
    $request = \Lorisleiva\Actions\ActionRequest::make($data);
    $request->setContainer(app());
    $request->setLaravelSession(app('session.store'));
    
    if ($user) {
        $request->setUserResolver(fn() => $user);
    }
    
    return $request;
}
```

### Custom Assertions

```php
function assertActionHasValidationRules(string $actionClass, array $expectedFields): void
{
    $action = new $actionClass();
    $rules = $action->rules();
    
    foreach ($expectedFields as $field => $expectedRules) {
        expect($rules)->toHaveKey($field);
        
        if (is_array($expectedRules)) {
            foreach ($expectedRules as $rule) {
                expect($rules[$field])->toContain($rule);
            }
        }
    }
}
```

## 🔄 Testing Action Hooks

### Testing as Job

```php
test('action can run as job', function () {
    $tenant = setupTenantContext();
    
    Queue::fake();
    
    $action = new CreateTenantOwner();
    $action->onQueue()->handle($tenant, 'password123');
    
    Queue::assertPushed(CreateTenantOwner::class);
});
```

### Testing as Command

```php
test('action can run as command', function () {
    $this->artisan('tenant:create-owner', [
        'tenant' => 'test-tenant',
        'password' => 'password123'
    ])->assertExitCode(0);
});
```

## 📋 Testing Checklist

### For Each Action, Test:
- [ ] Action can be instantiated
- [ ] Validation rules are correct
- [ ] Business logic works as expected
- [ ] Error handling works properly
- [ ] Action can be mocked
- [ ] HTTP endpoints work correctly (if applicable)
- [ ] Authentication/authorization works
- [ ] Rate limiting works (if applicable)
- [ ] Database operations work correctly
- [ ] Email/notifications are sent (if applicable)

### Best Practices:
- **Isolate Tests**: Each test should test one specific behavior
- **Use Factories**: Generate test data with model factories
- **Mock External Services**: Mock Stripe, email services, etc.
- **Test Edge Cases**: Test validation failures, rate limits, etc.
- **Keep Tests Fast**: Use database transactions and cleanup
- **Clear Setup**: Each test should have clear arrange-act-assert structure

## 🚀 Running Tests

```bash
# Run all action tests
php artisan test --filter="Actions"

# Run unit tests only
php artisan test --testsuite=Unit --filter="Actions"

# Run feature tests only
php artisan test --testsuite=Feature --filter="Actions"

# Run specific action tests
php artisan test --filter="LoginTest"

# Run with coverage
php artisan test --coverage --filter="Actions"
```

This comprehensive testing approach ensures that your Laravel Actions are reliable, maintainable, and work correctly in all scenarios.
# API Routes & Endpoints

SaaSBee provides a comprehensive set of routes for both central application management and tenant-specific functionality. All routes are organized using Laravel's routing system with proper middleware protection.

## 🌐 Route Structure

### Central Domain Routes
Routes accessible from the main domain for tenant registration and management.

### Tenant Domain Routes  
Routes accessible from tenant subdomains for tenant-specific functionality.

## 🏢 Central Application Routes

### Tenant Registration
Routes for creating and managing tenant accounts.

| Method | Route | Action | Description |
|--------|-------|---------|-------------|
| `GET` | `/` | `welcome` | Landing page |
| `GET` | `/register` | `central/register-tenant` | Tenant registration form |
| `POST` | `/register` | `RegisterTenant::class` | Process tenant registration |

**Example Registration Request:**
```json
{
    "name": "Acme Corporation",
    "domain": "acme",
    "owner_email": "owner@acme.com",
    "owner_name": "John Doe"
}
```

## 🏠 Tenant Application Routes

All tenant routes are protected by tenancy middleware and require proper tenant context.

### Middleware Stack
```php
Route::middleware([
    'web',
    InitializeTenancyByDomainOrSubdomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    // Tenant routes
});
```

### Dashboard
| Method | Route | Middleware | Description |
|--------|-------|------------|-------------|
| `GET` | `/` | `auth`, `verified` | Tenant dashboard |

## 🔐 Authentication Routes

Available within tenant context for user authentication.

### Guest Routes (Unauthenticated Users)
| Method | Route | Controller | Name | Description |
|--------|-------|------------|------|-------------|
| `GET` | `/login` | `AuthenticatedSessionController@create` | `login` | Login form |
| `POST` | `/login` | `AuthenticatedSessionController@store` | - | Process login |
| `GET` | `/forgot-password` | `PasswordResetLinkController@create` | `password.request` | Password reset form |
| `POST` | `/forgot-password` | `PasswordResetLinkController@store` | `password.email` | Send reset link |
| `GET` | `/reset-password/{token}` | `NewPasswordController@create` | `password.reset` | Password reset form |
| `POST` | `/reset-password` | `NewPasswordController@store` | `password.store` | Process password reset |

### Authenticated Routes
| Method | Route | Controller | Middleware | Name | Description |
|--------|-------|------------|-----------|------|-------------|
| `GET` | `/verify-email` | `EmailVerificationPromptController` | `auth` | `verification.notice` | Email verification prompt |
| `GET` | `/verify-email/{id}/{hash}` | `VerifyEmailController` | `auth`, `signed`, `throttle:6,1` | `verification.verify` | Verify email address |
| `POST` | `/email/verification-notification` | `EmailVerificationNotificationController@store` | `auth`, `throttle:6,1` | `verification.send` | Resend verification email |
| `GET` | `/confirm-password` | `ConfirmablePasswordController@show` | `auth` | `password.confirm` | Password confirmation form |
| `POST` | `/confirm-password` | `ConfirmablePasswordController@store` | `auth`, `throttle:6,1` | - | Process password confirmation |
| `POST` | `/logout` | `AuthenticatedSessionController@destroy` | `auth` | `logout` | User logout |

## ⚙️ Settings Routes

Tenant settings management routes, all requiring authentication.

### Profile Management
| Method | Route | Controller | Name | Description |
|--------|-------|------------|------|-------------|
| `GET` | `/settings/profile` | `ProfileController@edit` | `profile.edit` | Profile settings form |
| `PATCH` | `/settings/profile` | `ProfileController@update` | `profile.update` | Update profile information |
| `DELETE` | `/settings/profile` | `ProfileController@destroy` | `profile.destroy` | Delete user account |

### Password Management
| Method | Route | Controller | Middleware | Name | Description |
|--------|-------|------------|-----------|------|-------------|
| `GET` | `/settings/password` | `PasswordController@edit` | `auth` | `password.edit` | Change password form |
| `PUT` | `/settings/password` | `PasswordController@update` | `auth`, `throttle:6,1` | `password.update` | Update password |

### Billing & Subscriptions
| Method | Route | Action | Name | Description |
|--------|-------|---------|------|-------------|
| `GET` | `/settings/billing` | `ViewBilling::class` | `billing.index` | View billing information |
| `POST` | `/settings/billing/subscribe` | `CreateSubscription::class` | `billing.subscribe` | Create new subscription |
| `DELETE` | `/settings/billing/cancel` | `CancelSubscription::class` | `billing.cancel` | Cancel subscription |
| `POST` | `/settings/billing/resume` | `ResumeSubscription::class` | `billing.resume` | Resume cancelled subscription |
| `PATCH` | `/settings/billing/change-plan` | `ChangePlan::class` | `billing.change-plan` | Change subscription plan |
| `POST` | `/settings/billing/payment-method` | `CreatePaymentMethod::class` | `billing.payment-method` | Add payment method |
| `PATCH` | `/settings/billing/update-payment-method` | `UpdatePaymentMethod::class` | `billing.update-payment-method` | Update payment method |

**Example Subscription Request:**
```json
{
    "price_id": "price_1ABC123def456",
    "payment_method": "pm_1234567890"
}
```

### Appearance Settings
| Method | Route | Name | Description |
|--------|-------|------|-------------|
| `GET` | `/settings/appearance` | `appearance` | Theme and appearance settings |

### Role Management (Tenant Owner Only)
Routes protected by `role:tenant_owner` middleware.

| Method | Route | Action | Name | Description |
|--------|-------|---------|------|-------------|
| `GET` | `/settings/roles` | `ManageRoles::class` | `roles.index` | List roles and permissions |
| `POST` | `/settings/roles` | `CreateRole::class` | `roles.store` | Create new role |
| `PATCH` | `/settings/roles/{role}` | `UpdateRole::class` | `roles.update` | Update existing role |
| `DELETE` | `/settings/roles/{role}` | `DeleteRole::class` | `roles.destroy` | Delete role |
| `POST` | `/settings/roles/assign` | `AssignUserRole::class` | `roles.assign` | Assign role to user |

**Example Role Creation:**
```json
{
    "name": "Manager",
    "permissions": ["view_reports", "manage_users", "edit_settings"]
}
```

**Example Role Assignment:**
```json
{
    "user_id": 123,
    "role_name": "Manager"
}
```

## 🛡️ Middleware Protection

### Authentication Middleware
- `auth`: Requires authenticated user
- `verified`: Requires email verification
- `guest`: Only for non-authenticated users

### Tenancy Middleware
- `InitializeTenancyByDomainOrSubdomain`: Identifies and initializes tenant context
- `PreventAccessFromCentralDomains`: Blocks central domain access to tenant routes

### Rate Limiting
- `throttle:6,1`: 6 attempts per minute
- Applied to sensitive routes like password reset, email verification

### Role-Based Access
- `role:tenant_owner`: Only tenant owners can access
- `permission:specific_permission`: Specific permission required

## 📝 Request/Response Format

### Standard Response Format
```json
{
    "success": true,
    "data": {
        // Response data
    },
    "message": "Operation completed successfully"
}
```

### Error Response Format
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "field_name": ["Error message"]
    }
}
```

### Inertia.js Response
Most routes return Inertia.js responses for seamless SPA experience:
```php
return Inertia::render('PageComponent', [
    'data' => $data,
    'props' => $props
]);
```

## 🔍 Route Testing

### Testing Protected Routes
```php
// Test authenticated route
$user = User::factory()->create();
$response = $this->actingAs($user)->get('/settings/profile');
$response->assertStatus(200);

// Test role-based route
$owner = User::factory()->create();
$owner->assignRole('tenant_owner');
$response = $this->actingAs($owner)->get('/settings/roles');
$response->assertStatus(200);
```

### Testing Tenant Context
```php
// Test tenant route
$tenant = $this->createTenant();
$this->initializeTenancy($tenant);

$user = User::factory()->create();
$response = $this->actingAs($user)->get('/');
$response->assertStatus(200);
```

## 🚀 API Extensions

### Adding Custom Routes
```php
// routes/tenant.php - Add to tenant routes
Route::middleware(['auth'])->group(function () {
    Route::get('/custom-feature', CustomFeatureAction::class);
});

// routes/web.php - Add to central routes  
Route::get('/central-feature', CentralFeatureAction::class);
```

### Custom Middleware
```php
// Create custom middleware
class CustomMiddleware
{
    public function handle($request, Closure $next)
    {
        // Custom logic
        return $next($request);
    }
}

// Apply to routes
Route::middleware(['auth', CustomMiddleware::class])->group(function () {
    // Protected routes
});
```

This routing system provides a secure, scalable foundation for multi-tenant SaaS applications with clear separation between central and tenant-specific functionality.
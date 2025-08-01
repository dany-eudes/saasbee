# Multi-Tenancy Architecture

SaaSBee implements a comprehensive multi-tenancy solution using Stancl Tenancy, providing complete data isolation and tenant management capabilities.

## 🏢 Tenancy Model

### Database-per-Tenant Architecture
- **Complete Isolation**: Each tenant has a dedicated database
- **Data Security**: No risk of data leakage between tenants
- **Performance**: Optimized queries within tenant context
- **Scalability**: Independent database scaling per tenant

### Domain-Based Tenant Resolution
- **Subdomain Routing**: `tenant.yourdomain.com` format
- **Custom Domains**: Support for tenant-owned domains
- **Automatic Resolution**: Middleware identifies tenant from request
- **Fallback Handling**: Graceful handling of invalid domains

## 🗄️ Database Structure

### Central Database
The central database manages tenant metadata and global data:

```sql
-- Tenants table (central)
CREATE TABLE tenants (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    stripe_id VARCHAR(255),
    card_brand VARCHAR(50),
    card_last_four VARCHAR(4),
    trial_ends_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Domains table (central)
CREATE TABLE domains (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    domain VARCHAR(255) NOT NULL UNIQUE,
    tenant_id VARCHAR(36) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_fallback BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
```

### Tenant Databases
Each tenant database contains:

```sql
-- Users table (per tenant)
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Roles and permissions (per tenant)
-- Managed by Spatie Laravel Permission
```

## 🔄 Tenant Lifecycle

### 1. Tenant Registration
```php
// app/Actions/Central/RegisterTenant.php
public function handle(array $data): Tenant
{
    return DB::transaction(function () use ($data) {
        // Create tenant record
        $tenant = Tenant::create([
            'name' => $data['name'],
            'status' => TenantStatus::PendingApproval,
            'owner_email' => $data['owner_email'],
            'owner_name' => $data['owner_name'],
            'domain' => $data['domain'],
            'trial_ends_at' => now()->addDays(config('saasbee.trial_days')),
        ]);

        // Create domain mapping
        $tenant->createDomain([
            'domain' => $data['domain'],
        ])->makePrimary()->makeFallback();

        // Create Stripe customer
        $tenant->createAsStripeCustomer();

        return $tenant;
    });
}
```

### 2. Database Creation
```php
// Automatic database creation via Stancl Tenancy
// Triggered by CreateTenantOwner job
tenancy()->initialize($tenant);
```

### 3. Owner Account Setup
```php
// app/Jobs/CreateTenantOwner.php
public function handle()
{
    tenancy()->initialize($this->tenant);
    
    // Create owner user in tenant database
    $user = User::create([
        'name' => $this->tenant->owner_name,
        'email' => $this->tenant->owner_email,
        'password' => Hash::make(Str::random(32)),
    ]);
    
    // Assign admin role
    $user->assignRole('admin');
    
    // Send welcome email
    Mail::to($user)->send(new TenantOwnerWelcome($this->tenant));
}
```

## 🎯 Tenant Context Management

### Middleware Stack
```php
// routes/tenant.php
Route::middleware([
    'web',
    InitializeTenancyByDomainOrSubdomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    // Tenant routes
});
```

### Context Switching
```php
// Automatic tenant context initialization
class InitializeTenancyByDomainOrSubdomain
{
    public function handle($request, $next)
    {
        $domain = $request->getHost();
        $tenant = Tenant::findByDomain($domain);
        
        if ($tenant) {
            tenancy()->initialize($tenant);
        }
        
        return $next($request);
    }
}
```

### Database Connection Management
```php
// Automatic database switching
tenancy()->initialize($tenant);

// Now all database operations use tenant database
$users = User::all(); // Users from tenant database
```

## 🔐 Tenant Isolation

### Data Isolation
- **Physical Separation**: Each tenant has its own database
- **Connection Management**: Laravel manages database connections automatically
- **Query Scoping**: All queries automatically scoped to tenant context

### Security Measures
```php
// Prevent cross-tenant data access
class PreventAccessFromCentralDomains
{
    public function handle($request, $next)
    {
        if (in_array($request->getHost(), config('tenancy.central_domains'))) {
            abort(404);
        }
        
        return $next($request);
    }
}
```

### File Storage Isolation
```php
// Tenant-specific storage paths
Storage::disk('tenant')->put('file.txt', $content);
// Stores in: storage/tenant_{tenant_id}/file.txt
```

## 🚀 Tenant Management

### Tenant Status Management
```php
enum TenantStatus: string
{
    case PendingApproval = 'pending_approval';
    case Active = 'active';
    case Suspended = 'suspended';
    case Cancelled = 'cancelled';
}
```

### Subscription Integration
```php
// app/Models/Tenant.php
class Tenant extends BaseTenant implements TenantWithDatabase
{
    use Billable; // Laravel Cashier integration
    
    public function isOnTrial(): bool
    {
        return $this->trial_ends_at && 
               $this->trial_ends_at->isFuture() &&
               !$this->subscribed();
    }
    
    public function hasValidSubscription(): bool
    {
        return $this->subscribed() || $this->isOnTrial();
    }
}
```

## 🔧 Configuration

### Tenancy Configuration
```php
// config/tenancy.php
return [
    'tenant_model' => \App\Models\Tenant::class,
    'domain_model' => \Stancl\Tenancy\Database\Models\Domain::class,
    
    'central_domains' => [
        'localhost',
        '127.0.0.1',
        env('APP_DOMAIN'),
    ],
    
    'database' => [
        'prefix' => 'tenant_',
        'suffix' => '',
    ],
];
```

### Reserved Subdomains
```php
// config/saasbee.php
return [
    'reserved_subdomains' => [
        'www',
        'admin',
        'api',
        'app',
        'mail',
        'ftp',
    ],
];
```

## 📊 Tenant Analytics

### Usage Tracking
```php
// Track tenant-specific metrics
class TenantAnalytics
{
    public function recordAction(string $action, array $metadata = []): void
    {
        TenantActivity::create([
            'tenant_id' => tenant('id'),
            'action' => $action,
            'metadata' => $metadata,
            'created_at' => now(),
        ]);
    }
}
```

### Performance Monitoring
```php
// Monitor tenant database performance
class TenantMetrics
{
    public function getDatabaseSize(): int
    {
        return DB::select('SELECT pg_database_size(?) as size', [
            tenant()->database()->getName()
        ])[0]->size;
    }
    
    public function getUserCount(): int
    {
        return User::count();
    }
}
```

## 🛠️ Development Tools

### Tenant Artisan Commands
```bash
# Run migrations for all tenants
php artisan tenants:migrate

# Run command for specific tenant
php artisan tenants:run --tenant=1 migrate

# Seed tenant databases
php artisan tenants:seed
```

### Testing with Tenants
```php
// tests/Feature/TenantTest.php
use Stancl\Tenancy\Features\Testing;

class TenantTest extends TestCase
{
    use Testing;
    
    public function test_tenant_creation()
    {
        $tenant = $this->createTenant();
        
        $this->initializeTenancy($tenant);
        
        // Test tenant-specific functionality
        $user = User::factory()->create();
        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }
}
```

## ⚡ Performance Optimization

### Connection Pooling
```php
// config/database.php
'connections' => [
    'tenant' => [
        'driver' => 'pgsql',
        'pool' => [
            'min' => 2,
            'max' => 20,
        ],
    ],
],
```

### Caching Strategy
```php
// Tenant-aware caching
Cache::tags(["tenant:" . tenant('id')])->put('key', $value);

// Invalidate tenant cache
Cache::tags(["tenant:" . tenant('id')])->flush();
```

## 🔍 Troubleshooting

### Common Issues

**Tenant not found:**
```php
// Check domain configuration
$domain = Domain::where('domain', $requestDomain)->first();
if (!$domain) {
    // Domain not registered
}
```

**Database connection errors:**
```php
// Verify tenant database exists
$tenant = Tenant::find($tenantId);
if (!$tenant->database()->exists()) {
    // Database needs to be created
}
```

**Cross-tenant data leakage:**
```php
// Always verify tenant context
if (!tenancy()->initialized) {
    throw new Exception('Tenant context not initialized');
}
```

This multi-tenancy architecture provides robust isolation, security, and scalability for SaaS applications while maintaining development simplicity and operational efficiency.
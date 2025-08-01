# Development Workflow

This guide outlines the recommended development workflow for SaaSBee, including setup, coding standards, testing practices, and deployment procedures.

## 🚀 Getting Started

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/your-org/saasbee.git
cd saasbee

# Install dependencies
composer install
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup
touch database/database.sqlite
php artisan migrate
php artisan db:seed

# Start development servers
composer run dev
```

### Development Environment
The `composer run dev` command starts multiple services concurrently:
- **Laravel server** (http://localhost:8000)
- **Queue worker** for background jobs
- **Laravel Pail** for log monitoring
- **Vite dev server** for hot module replacement

## 📁 Project Structure

### Backend Organization
```
app/
├── Actions/              # Business logic (Laravel Actions)
│   ├── Central/         # Central app actions
│   └── Settings/        # Tenant-specific actions
├── Http/
│   ├── Controllers/     # Route controllers (keep light)
│   ├── Middleware/      # Custom middleware
│   └── Requests/        # Form request validation
├── Models/              # Eloquent models
├── Jobs/                # Background job classes
├── Mail/                # Email templates
├── Observers/           # Model observers
└── Exceptions/          # Custom exceptions
```

### Frontend Organization
```
resources/js/
├── components/          # React components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── settings/       # Feature-specific components
│   └── layouts/        # Layout components
├── pages/              # Page components (Inertia routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## 🔄 Git Workflow

### Branch Strategy
- **`main`**: Production-ready code
- **`develop`**: Development integration branch
- **`feature/*`**: Feature development branches
- **`hotfix/*`**: Production hotfixes

### Commit Conventions
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature commits
feat: add user role management
feat(auth): implement two-factor authentication

# Bug fixes
fix: resolve subscription cancellation issue
fix(billing): handle Stripe webhook retries

# Documentation
docs: update API documentation
docs(readme): add deployment instructions

# Refactoring
refactor: extract payment processing logic
refactor(models): optimize database queries

# Tests
test: add unit tests for user registration
test(e2e): add subscription flow tests
```

### Pull Request Process
1. **Create feature branch** from `develop`
2. **Implement changes** with tests
3. **Run quality checks** (lint, test, type check)
4. **Create pull request** with description
5. **Code review** by team members
6. **Merge** after approval and CI passes

### Pre-commit Hooks
```bash
# Install pre-commit hooks
composer install --dev
npm install --dev

# Hooks will run automatically on commit:
# - PHP CS Fixer (code formatting)
# - ESLint (JavaScript/TypeScript linting)
# - PHPStan (static analysis)
# - Type checking
```

## 🧪 Testing Strategy

### Test Types
- **Unit Tests**: Individual class/method testing
- **Feature Tests**: End-to-end functionality testing
- **Browser Tests**: UI interaction testing

### Running Tests
```bash
# Run all tests
composer test

# Run specific test types
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage

# Frontend testing
npm run test
npm run test:coverage
```

### Writing Tests

#### Feature Test Example
```php
<?php
// tests/Feature/UserRegistrationTest.php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_tenant_owner_can_be_created(): void
    {
        $tenantData = [
            'name' => 'Test Company',
            'domain' => 'testcompany',
            'owner_email' => 'owner@testcompany.com',
            'owner_name' => 'John Doe',
        ];

        $response = $this->post(route('post.register-tenant'), $tenantData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tenants', [
            'name' => 'Test Company',
            'domain' => 'testcompany',
        ]);
    }

    public function test_duplicate_domain_is_rejected(): void
    {
        // Create first tenant
        $this->post(route('post.register-tenant'), [
            'name' => 'First Company',
            'domain' => 'duplicate',
            'owner_email' => 'owner1@company.com',
            'owner_name' => 'John Doe',
        ]);

        // Attempt duplicate domain
        $response = $this->post(route('post.register-tenant'), [
            'name' => 'Second Company',
            'domain' => 'duplicate',
            'owner_email' => 'owner2@company.com',
            'owner_name' => 'Jane Smith',
        ]);

        $response->assertSessionHasErrors(['domain']);
    }
}
```

#### Unit Test Example
```php
<?php
// tests/Unit/TenantTest.php

namespace Tests\Unit;

use App\Models\Tenant;
use App\TenantStatus;
use PHPUnit\Framework\TestCase;

class TenantTest extends TestCase
{
    public function test_tenant_can_check_trial_status(): void
    {
        $tenant = new Tenant([
            'trial_ends_at' => now()->addDays(5),
        ]);

        $this->assertTrue($tenant->isOnTrial());
    }

    public function test_expired_trial_returns_false(): void
    {
        $tenant = new Tenant([
            'trial_ends_at' => now()->subDays(1),
        ]);

        $this->assertFalse($tenant->isOnTrial());
    }
}
```

### Testing Multi-Tenancy
```php
<?php
// tests/Feature/TenantIsolationTest.php

use Stancl\Tenancy\Features\Testing;

class TenantIsolationTest extends TestCase
{
    use Testing, RefreshDatabase;

    public function test_tenant_data_is_isolated(): void
    {
        // Create two tenants
        $tenant1 = $this->createTenant();
        $tenant2 = $this->createTenant();

        // Create user in tenant 1
        $this->initializeTenancy($tenant1);
        $user1 = User::factory()->create(['name' => 'Tenant 1 User']);

        // Switch to tenant 2
        $this->initializeTenancy($tenant2);
        $user2 = User::factory()->create(['name' => 'Tenant 2 User']);

        // Verify isolation
        $this->assertEquals(1, User::count());
        $this->assertEquals('Tenant 2 User', User::first()->name);

        // Switch back to tenant 1
        $this->initializeTenancy($tenant1);
        $this->assertEquals(1, User::count());
        $this->assertEquals('Tenant 1 User', User::first()->name);
    }
}
```

## 🎨 Code Quality Standards

### PHP Standards
- **PSR-12** coding standard
- **PHPStan** level 8 static analysis
- **Laravel Pint** for code formatting

```bash
# Format PHP code
composer run format

# Run static analysis
composer run analyse

# Run all quality checks
composer run quality
```

### TypeScript/React Standards
- **ESLint** with React hooks plugin
- **Prettier** for code formatting
- **TypeScript strict mode**

```bash
# Lint frontend code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run types

# Format code
npm run format
```

### Configuration Files

#### ESLint Configuration
```js
// eslint.config.js
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
```

#### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## 🔄 Development Tasks

### Common Commands
```bash
# Backend commands
composer install              # Install PHP dependencies
composer update               # Update PHP dependencies
php artisan migrate           # Run database migrations
php artisan migrate:fresh     # Fresh migrations
php artisan db:seed          # Seed database
php artisan queue:work       # Start queue worker
php artisan tinker           # Interactive shell

# Frontend commands
npm install                  # Install Node dependencies
npm run dev                 # Start development server
npm run build               # Build for production
npm run preview             # Preview production build

# Testing commands
composer test               # Run PHP tests
npm run test               # Run frontend tests
composer run quality       # Run all quality checks

# Tenant-specific commands
php artisan tenants:migrate # Run tenant migrations
php artisan tenants:seed   # Seed tenant databases
php artisan tenants:run --tenant=uuid command # Run command for specific tenant
```

### Database Operations
```bash
# Create migrations
php artisan make:migration create_products_table
php artisan make:migration create_products_table --path=database/migrations/tenant

# Create models
php artisan make:model Product -mfs

# Create seeders
php artisan make:seeder ProductSeeder

# Database operations
php artisan migrate:status
php artisan migrate:rollback
php artisan db:wipe
```

### Code Generation
```bash
# Laravel Actions
php artisan make:action ProcessPayment

# Controllers
php artisan make:controller ProductController --resource

# Requests
php artisan make:request StoreProductRequest

# Jobs
php artisan make:job ProcessBulkImport

# Mail
php artisan make:mail WelcomeEmail --markdown=emails.welcome
```

## 🐛 Debugging

### Debugging Tools
- **Laravel Telescope**: Development debugging (available in local environment)
- **Laravel Pail**: Real-time log monitoring
- **Xdebug**: Step debugging for PHP
- **React Developer Tools**: Component debugging

### Log Monitoring
```bash
# Real-time log monitoring
php artisan pail

# Filter logs by level
php artisan pail --filter="error"

# View logs for specific tenant
php artisan pail --filter="tenant:uuid"
```

### Common Debug Techniques
```php
// Quick debugging
dd($variable);           // Dump and die
dump($variable);         // Dump without stopping
logger('Debug message'); // Log to Laravel log

// Query debugging
DB::enableQueryLog();
// ... run queries
dd(DB::getQueryLog());

// Tenant context debugging
if (tenancy()->initialized) {
    logger('Current tenant: ' . tenant('id'));
} else {
    logger('No tenant context');
}
```

## 📦 Dependency Management

### Composer Packages
```bash
# Add new package
composer require vendor/package

# Add development package
composer require --dev vendor/package

# Update packages
composer update

# Remove package
composer remove vendor/package
```

### NPM Packages
```bash
# Add new package
npm install package-name

# Add development package
npm install --save-dev package-name

# Update packages
npm update

# Remove package
npm uninstall package-name
```

## 🚀 Deployment Preparation

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Code quality checks pass
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Frontend assets built
- [ ] Documentation updated

### Build Commands
```bash
# Production build
npm run build
composer install --optimize-autoloader --no-dev

# Clear and cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize for production
php artisan optimize
```

This development workflow ensures consistent, high-quality code while maintaining team productivity and project reliability.
# Customization Guide

SaaSBee is designed to be highly customizable. This guide covers common customization patterns and best practices for extending the platform.

## 🎨 Frontend Customization

### Styling & Themes

#### Tailwind CSS Configuration
```js
// tailwind.config.js
export default {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        // Custom brand colors
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

#### Custom CSS Variables
```css
/* resources/css/app.css */
:root {
  --color-primary: 59 130 246;
  --color-secondary: 100 116 139;
  --font-heading: 'Inter', system-ui, sans-serif;
  --border-radius: 0.5rem;
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Dark mode support */
.dark {
  --color-primary: 96 165 250;
  --color-secondary: 148 163 184;
}
```

### Component Customization

#### Creating Custom Components
```tsx
// resources/js/components/custom/FeatureCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icon';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  href?: string;
}

export function FeatureCard({ title, description, icon, href }: FeatureCardProps) {
  const CardWrapper = href ? 'a' : 'div';
  
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon name={icon} className="h-6 w-6 text-primary-500" />
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-secondary-600">{description}</p>
      </CardContent>
    </Card>
  );
}
```

#### Overriding Existing Components
```tsx
// resources/js/components/app-header.tsx
import { AppLogo } from '@/components/app-logo';
import { UserMenu } from '@/components/user-menu';
import { NotificationBell } from '@/components/custom/NotificationBell'; // Custom component

export function AppHeader() {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <AppLogo />
        <div className="flex items-center gap-4">
          <NotificationBell /> {/* Custom addition */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
```

## 🔧 Backend Customization

### Adding New Actions

#### Custom Business Logic Action
```php
<?php
// app/Actions/Custom/ProcessOrderAction.php

namespace App\Actions\Custom;

use App\Models\Order;
use App\Models\User;
use Illuminate\Validation\Rules;
use Lorisleiva\Actions\ActionRequest;
use Lorisleiva\Actions\Concerns\AsAction;

class ProcessOrderAction
{
    use AsAction;

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
        ];
    }

    public function handle(array $data): Order
    {
        $user = User::findOrFail($data['user_id']);
        
        // Custom business logic
        $order = Order::create([
            'user_id' => $user->id,
            'status' => 'pending',
            'total' => $this->calculateTotal($data['items']),
        ]);

        // Process order items
        foreach ($data['items'] as $item) {
            $order->items()->create($item);
        }

        // Send notifications, update inventory, etc.
        $this->processPayment($order, $data['payment_method']);
        
        return $order;
    }

    public function asController(ActionRequest $request)
    {
        $order = $this->handle($request->validated());
        
        return redirect()
            ->route('orders.show', $order)
            ->with('success', 'Order processed successfully!');
    }

    private function calculateTotal(array $items): float
    {
        // Custom calculation logic
        return collect($items)->sum(function ($item) {
            return $item['quantity'] * Product::find($item['product_id'])->price;
        });
    }

    private function processPayment(Order $order, string $paymentMethod): void
    {
        // Custom payment processing
        // Integrate with Stripe, PayPal, etc.
    }
}
```

### Custom Models

#### Adding New Models
```php
<?php
// app/Models/Product.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'price',
        'sku',
        'active',
        'metadata',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'active' => 'boolean',
        'metadata' => 'array',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function getFormattedPriceAttribute(): string
    {
        return '$' . number_format($this->price, 2);
    }
}
```

#### Migration for Custom Model
```php
<?php
// database/migrations/tenant/2024_01_01_000000_create_products_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('sku')->unique();
            $table->boolean('active')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

### Custom Routes

#### Adding New Route Groups
```php
<?php
// routes/custom.php

use App\Actions\Custom\ProcessOrderAction;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Product management routes
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/create', [ProductController::class, 'create'])->name('create');
        Route::post('/', [ProductController::class, 'store'])->name('store');
        Route::get('/{product}', [ProductController::class, 'show'])->name('show');
        Route::get('/{product}/edit', [ProductController::class, 'edit'])->name('edit');
        Route::patch('/{product}', [ProductController::class, 'update'])->name('update');
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('destroy');
    });

    // Order processing
    Route::post('/orders/process', ProcessOrderAction::class)->name('orders.process');
});
```

#### Include Custom Routes
```php
<?php
// routes/tenant.php

Route::middleware([
    'web',
    InitializeTenancyByDomainOrSubdomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    // Existing routes...
    
    // Include custom routes
    require __DIR__.'/custom.php';
    require __DIR__.'/settings.php';
    require __DIR__.'/auth.php';
});
```

## 🎛️ Configuration Customization

### Custom Configuration Files
```php
<?php
// config/custom.php

return [
    'features' => [
        'orders' => env('FEATURE_ORDERS', true),
        'inventory' => env('FEATURE_INVENTORY', false),
        'analytics' => env('FEATURE_ANALYTICS', true),
    ],
    
    'limits' => [
        'max_products_per_tenant' => env('MAX_PRODUCTS_PER_TENANT', 1000),
        'max_orders_per_day' => env('MAX_ORDERS_PER_DAY', 100),
    ],
    
    'integrations' => [
        'payment_providers' => [
            'stripe' => [
                'enabled' => env('STRIPE_ENABLED', true),
                'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
            ],
            'paypal' => [
                'enabled' => env('PAYPAL_ENABLED', false),
                'client_id' => env('PAYPAL_CLIENT_ID'),
            ],
        ],
    ],
];
```

### Environment Variables
```env
# .env - Custom feature flags
FEATURE_ORDERS=true
FEATURE_INVENTORY=false
FEATURE_ANALYTICS=true

# Custom limits
MAX_PRODUCTS_PER_TENANT=1000
MAX_ORDERS_PER_DAY=100

# Integration settings
STRIPE_ENABLED=true
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PAYPAL_ENABLED=false
PAYPAL_CLIENT_ID=your_paypal_client_id
```

## 🔌 Custom Middleware

### Feature Flag Middleware
```php
<?php
// app/Http/Middleware/CheckFeatureFlag.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckFeatureFlag
{
    public function handle(Request $request, Closure $next, string $feature): mixed
    {
        if (!config("custom.features.{$feature}")) {
            abort(404, 'Feature not available');
        }

        return $next($request);
    }
}
```

#### Register Middleware
```php
<?php
// bootstrap/app.php

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'feature' => \App\Http\Middleware\CheckFeatureFlag::class,
        ]);
    })
    ->create();
```

#### Use in Routes
```php
// Apply feature flag middleware
Route::middleware(['auth', 'feature:orders'])->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
});
```

## 📧 Custom Email Templates

### Custom Mailable
```php
<?php
// app/Mail/CustomWelcomeEmail.php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CustomWelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public array $customData = []
    ) {}

    public function build(): static
    {
        return $this->subject('Welcome to ' . config('app.name'))
                    ->view('emails.custom-welcome')
                    ->with([
                        'userName' => $this->user->name,
                        'customData' => $this->customData,
                    ]);
    }
}
```

### Custom Email Template
```blade
{{-- resources/views/emails/custom-welcome.blade.php --}}
@component('mail::message')
# Welcome to {{ config('app.name') }}, {{ $userName }}!

Thank you for joining us. We're excited to have you on board.

## What's Next?

@component('mail::panel')
Here are some things you can do to get started:
- Complete your profile setup
- Explore our features
- Contact support if you need help
@endcomponent

@if(!empty($customData))
## Custom Information
@foreach($customData as $key => $value)
- **{{ ucfirst($key) }}**: {{ $value }}
@endforeach
@endif

@component('mail::button', ['url' => route('dashboard')])
Get Started
@endcomponent

Thanks,<br>
{{ config('app.name') }} Team
@endcomponent
```

## 🔄 Custom Queue Jobs

### Background Processing Job
```php
<?php
// app/Jobs/ProcessBulkOperation.php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessBulkOperation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 300;

    public function __construct(
        public array $data,
        public string $operation,
        public ?User $user = null
    ) {}

    public function handle(): void
    {
        switch ($this->operation) {
            case 'export_users':
                $this->exportUsers();
                break;
            case 'import_products':
                $this->importProducts();
                break;
            default:
                throw new \InvalidArgumentException("Unknown operation: {$this->operation}");
        }
    }

    private function exportUsers(): void
    {
        // Custom export logic
        $users = User::whereIn('id', $this->data['user_ids'])->get();
        
        // Generate export file
        $filename = "users_export_" . now()->format('Y-m-d_H-i-s') . ".csv";
        
        // Process and save
        // Notify user when complete
    }

    private function importProducts(): void
    {
        // Custom import logic
        foreach ($this->data['products'] as $productData) {
            Product::create($productData);
        }
    }

    public function failed(\Throwable $exception): void
    {
        // Handle job failure
        if ($this->user) {
            // Notify user of failure
        }
    }
}
```

## 🧪 Custom Testing

### Feature Tests for Custom Functionality
```php
<?php
// tests/Feature/CustomFeatureTest.php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_product(): void
    {
        $tenant = $this->createTenant();
        $this->initializeTenancy($tenant);

        $user = User::factory()->create();
        $user->assignRole('admin');

        $productData = [
            'name' => 'Test Product',
            'description' => 'A test product',
            'price' => 29.99,
            'sku' => 'TEST-001',
            'active' => true,
        ];

        $response = $this->actingAs($user)
                        ->post(route('products.store'), $productData);

        $response->assertRedirect();
        $this->assertDatabaseHas('products', [
            'name' => 'Test Product',
            'sku' => 'TEST-001',
        ]);
    }

    public function test_feature_flag_blocks_disabled_features(): void
    {
        config(['custom.features.orders' => false]);

        $tenant = $this->createTenant();
        $this->initializeTenancy($tenant);

        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/orders');

        $response->assertStatus(404);
    }
}
```

## 🎯 Best Practices

### Code Organization
- Keep custom code in dedicated namespaces (`App\Custom\`)
- Use Actions for complex business logic
- Follow Laravel naming conventions
- Add proper documentation and type hints

### Database Design
- Use UUIDs for tenant-isolated models
- Add proper indexes for performance
- Use soft deletes where appropriate
- Include metadata columns for extensibility

### Frontend Architecture
- Create reusable components
- Use TypeScript for type safety
- Follow existing component patterns
- Maintain consistent styling

### Testing Strategy
- Write feature tests for custom functionality
- Test both happy path and error scenarios
- Use factories for test data generation
- Test feature flags and permissions

This customization guide provides the foundation for extending SaaSBee to match your specific business requirements while maintaining code quality and architectural consistency.
# SaaSBee - Laravel React SaaS Boilerplate

A complete, production-ready SaaS boilerplate built with Laravel 12, React 19, and modern web technologies. Perfect for entrepreneurs and developers looking to launch their SaaS product quickly.

## ☕ Support the Project

> **I need some financial help to continue working on this project.** SaaSBee is a labor of love that takes significant time and effort to maintain and improve. Your support helps me dedicate more time to adding new features, fixing bugs, and keeping everything up-to-date.

<a href="https://buymeacoffee.com/oliwerhelsen" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
</a>

Every coffee helps! ❤️

## 🚀 Features

### Multi-Tenancy

- **Full tenant isolation** with Stancl Tenancy
- **Custom domains** and subdomains per tenant
- **Automatic tenant database creation** and migration
- **Tenant-aware authentication** and authorization

### Subscription Management

- **Stripe integration** for payments and billing
- **Flexible subscription plans** (monthly/yearly)
- **Trial periods** (14 days default)
- **Payment method management**
- **Subscription upgrades/downgrades**
- **Automatic invoice generation**

### Authentication & Security

- **Complete auth system** (login, register, password reset)
- **Email verification**
- **Password confirmation** for sensitive actions
- **Role-based permissions** with Spatie Laravel Permission
- **CSRF protection** and secure session management

### Modern Frontend

- **React 19** with TypeScript
- **Inertia.js** for seamless SPA experience
- **Tailwind CSS 4** for modern styling
- **Radix UI** components for accessibility
- **Dark/light mode** toggle
- **Responsive design** for all devices

### Developer Experience

- **Type-safe** React components with TypeScript
- **Laravel Actions** for organized business logic
- **ESLint & Prettier** for code quality
- **Pest PHP** for testing
- **Vite** for fast development builds
- **Hot module replacement** in development

### Email & Notifications

- **Welcome emails** for new tenants
- **Notification system** for important updates
- **Trial expiration** notifications
- **Configurable mail drivers**

## 🛠 Tech Stack

### Backend

- **Laravel 12** - PHP framework
- **PHP 8.2+** - Modern PHP features
- **SQLite/MySQL** - Database options
- **Queue system** - Background job processing
- **Stancl Tenancy** - Multi-tenancy package
- **Spatie Laravel Permission** - Role management
- **Laravel Actions** - Business logic organization

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Inertia.js** - Modern monolith approach
- **Tailwind CSS 4** - Utility-first CSS
- **Radix UI** - Accessible components
- **Lucide React** - Icon library
- **Stripe React** - Payment integration

### Development Tools

- **Vite** - Build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Laravel Pint** - PHP code style
- **Pest** - PHP testing framework
- **Concurrently** - Run multiple commands

## 📦 Installation

### Prerequisites

- PHP 8.2 or higher
- Node.js 18+ and npm/pnpm
- Composer
- SQLite, MySQL, or PostgreSQL database
- Docker and Docker Compose (optional, for development services)

### Quick Start

#### Option 1: Docker Development Environment (Recommended)

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd saasbee
    ```

2. **Start development services**

    ```bash
    docker compose up -d
    ```

    This starts:
    - **PostgreSQL** (localhost:5432) - Main database
    - **Redis** (localhost:6379) - Cache and sessions
    - **MinIO** (localhost:9000) - S3-compatible file storage
    - **Mailpit** (localhost:8025) - Email testing interface
    - **Meilisearch** (localhost:7700) - Full-text search engine

3. **Install dependencies**

    ```bash
    composer install
    npm install  # or pnpm install
    ```

4. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Configure environment for Docker services** (update your `.env`)

    ```env
    DB_CONNECTION=pgsql
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_DATABASE=saasbee
    DB_USERNAME=saasbee
    DB_PASSWORD=saasbee

    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379

    # MinIO for file storage
    AWS_ACCESS_KEY_ID=minio
    AWS_SECRET_ACCESS_KEY=minio123
    AWS_DEFAULT_REGION=us-east-1
    AWS_BUCKET=saasbee
    AWS_ENDPOINT=http://localhost:9000
    AWS_USE_PATH_STYLE_ENDPOINT=true

    # Mailpit for email testing
    MAIL_MAILER=smtp
    MAIL_HOST=127.0.0.1
    MAIL_PORT=1025
    MAIL_USERNAME=null
    MAIL_PASSWORD=null
    MAIL_ENCRYPTION=null

    # Meilisearch for search
    SCOUT_DRIVER=meilisearch
    MEILISEARCH_HOST=http://localhost:7700
    MEILISEARCH_KEY=masterKey
    ```

6. **Database setup**

    ```bash
    php artisan migrate
    php artisan db:seed
    ```

7. **Start the application**
    ```bash
    composer run dev
    ```

#### Option 2: Local Development

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd saasbee
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node.js dependencies**

    ```bash
    npm install
    # or
    pnpm install
    ```

4. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Database setup**

    ```bash
    touch database/database.sqlite  # if using SQLite
    php artisan migrate
    php artisan db:seed
    ```

6. **Configure Stripe** (add to your `.env`)

    ```env
    STRIPE_KEY=pk_test_...
    STRIPE_SECRET=sk_test_...
    STRIPE_PRICE_MONTHLY=price_...
    STRIPE_PRICE_YEARLY=price_...
    ```

7. **Configure mail settings** (add to your `.env`)

    ```env
    MAIL_MAILER=smtp
    MAIL_HOST=your-smtp-host
    MAIL_PORT=587
    MAIL_USERNAME=your-username
    MAIL_PASSWORD=your-password
    MAIL_FROM_ADDRESS=noreply@yourdomain.com
    MAIL_FROM_NAME="Your SaaS Name"
    ```

8. **Start development servers**
    ```bash
    composer run dev
    ```

This will start:

- Laravel server (http://localhost:8000)
- Queue worker
- Log viewer
- Vite dev server

### 🐳 Docker Services

When using Docker Compose, you get access to several helpful services:

| Service           | URL                   | Description                                            |
| ----------------- | --------------------- | ------------------------------------------------------ |
| **Application**   | http://localhost:8000 | Your SaaS application                                  |
| **Mailpit**       | http://localhost:8025 | Email testing interface - view all sent emails         |
| **MinIO Console** | http://localhost:9001 | S3-compatible file storage management (minio:minio123) |
| **Meilisearch**   | http://localhost:7700 | Search engine interface                                |
| **PostgreSQL**    | localhost:5432        | Database connection                                    |
| **Redis**         | localhost:6379        | Cache and session storage                              |

#### Managing Docker Services

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild services (after compose.yml changes)
docker compose up -d --build

# Reset all data (⚠️  destroys all data)
docker compose down -v
```

## 🏗 Project Structure

```
├── app/
│   ├── Actions/           # Business logic actions
│   │   ├── Central/       # Central app actions
│   │   └── Settings/      # Tenant settings actions
│   ├── Models/           # Eloquent models
│   ├── Http/             # Controllers and middleware
│   └── Mail/             # Email templates
├── resources/
│   ├── js/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── layouts/      # Layout components
│   │   └── types/        # TypeScript definitions
│   └── views/            # Blade templates
├── database/
│   ├── migrations/       # Database migrations
│   └── seeders/          # Database seeders
└── routes/               # Route definitions
```

## ⚙️ Configuration

### Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Create subscription products and prices
4. Update your `.env` file with the keys and price IDs

### Domain Configuration

For production with custom domains:

1. Configure your DNS to point to your server
2. Update `config/tenancy.php` for domain handling
3. Set up SSL certificates (Let's Encrypt recommended)

### Email Configuration

Configure your preferred email service:

- **SMTP**: Any SMTP provider (Gmail, SendGrid, etc.)
- **SES**: Amazon Simple Email Service
- **Mailgun**: Mailgun email service
- **Postmark**: Postmark email service

## 🧪 Testing

Run the test suite:

```bash
composer test
# or
php artisan test
```

Run frontend linting:

```bash
npm run lint
npm run types
```

## 🚀 Deployment

### Build for production

```bash
npm run build
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment variables for production

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
DB_CONNECTION=mysql  # or your preferred database
QUEUE_CONNECTION=redis  # recommended for production
CACHE_STORE=redis
SESSION_DRIVER=redis
```

## 📋 Usage

### Creating Tenants

1. Visit your app URL
2. Click "Create Account"
3. Fill in tenant information (name, subdomain)
4. Complete registration process
5. Set up subscription and payment method

### Managing Subscriptions

- Access billing settings from the tenant dashboard
- Update payment methods
- Change subscription plans
- View billing history
- Cancel or resume subscriptions

### Admin Features

- Manage tenant permissions
- Monitor subscription statuses
- View system-wide analytics
- Handle customer support requests

## 🔧 Customization

### Adding New Features

1. Create actions in `app/Actions/`
2. Add routes in appropriate route files
3. Create React components in `resources/js/components/`
4. Add pages in `resources/js/pages/`
5. Update TypeScript types in `resources/js/types/`

### Styling

- Modify `resources/css/app.css` for global styles
- Use Tailwind classes for component styling
- Customize the color scheme in `tailwind.config.js`

### Database Changes

```bash
php artisan make:migration create_your_table
php artisan migrate
```

For tenant-specific tables:

```bash
php artisan make:migration create_tenant_table --path=database/migrations/tenant
php artisan tenants:migrate
```

## 📚 Key Packages

- **[Laravel](https://laravel.com)** - The PHP framework
- **[Inertia.js](https://inertiajs.com)** - Modern monolith approach
- **[Stancl Tenancy](https://tenancyforlaravel.com)** - Multi-tenancy package
- **[Spatie Laravel Permission](https://spatie.be/docs/laravel-permission)** - Role management
- **[Laravel Actions](https://laravelactions.com)** - Business logic organization
- **[Radix UI](https://www.radix-ui.com)** - Accessible components
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework

## 🐛 Troubleshooting

### Common Issues

**Tenant database not created:**

- Ensure queue worker is running: `php artisan queue:work`
- Check logs: `php artisan pail`

**Stripe webhook issues:**

- Verify webhook endpoint in Stripe dashboard
- Check webhook signing secret in environment

**Custom domain not working:**

- Verify DNS configuration
- Check SSL certificate
- Update tenancy configuration

### Performance Optimization

- Enable Redis for caching and sessions
- Use queue workers for background jobs
- Optimize database queries with indexes
- Enable OPcache in PHP
- Use CDN for static assets

## 📄 License

MIT License - feel free to use this for your commercial projects.

## 🤝 Support

For support and customization services, please add an issue on GitHub.

---

**Ready to launch your SaaS?** This boilerplate provides everything you need to get started. Focus on your unique business logic while we handle the foundation.

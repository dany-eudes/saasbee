# Production Deployment Guide

This guide covers deploying SaaSBee to production environments with best practices for security, performance, and scalability.

## 🚀 Pre-Deployment Checklist

### System Requirements
- **PHP**: 8.2 or higher with required extensions
- **Node.js**: 18+ for frontend build process
- **Database**: PostgreSQL 13+ (recommended) or MySQL 8.0+
- **Web Server**: nginx or Apache with PHP-FPM
- **Cache**: Redis 6+ for sessions and caching
- **Queue**: Redis or database for background jobs
- **SSL Certificate**: Required for production
- **Email Service**: SMTP, SES, Mailgun, etc.

### PHP Extensions
```bash
# Required PHP extensions
php-fpm
php-pgsql       # or php-mysql
php-redis
php-curl
php-json
php-mbstring
php-xml
php-zip
php-gd
php-intl
php-bcmath
```

## 🏗️ Infrastructure Setup

### 1. Server Configuration

#### nginx Configuration
```nginx
# /etc/nginx/sites-available/saasbee
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com *.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com *.yourdomain.com;
    root /var/www/saasbee/public;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/yourdomain.com.pem;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # PHP Configuration
    index index.php;
    charset utf-8;

    # Handle tenant subdomains and custom domains
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Asset optimization
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### PHP-FPM Configuration
```ini
# /etc/php/8.2/fpm/pool.d/saasbee.conf
[saasbee]
user = www-data
group = www-data
listen = /var/run/php/php8.2-fpm.sock
listen.owner = www-data
listen.group = www-data
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.process_idle_timeout = 10s
pm.max_requests = 500

# PHP settings
php_admin_value[error_log] = /var/log/php/saasbee.log
php_admin_flag[log_errors] = on
php_value[session.save_handler] = redis
php_value[session.save_path] = "tcp://127.0.0.1:6379"
```

### 2. Database Setup

#### PostgreSQL Configuration
```sql
-- Create application database
CREATE DATABASE saasbee_production;
CREATE USER saasbee WITH ENCRYPTED PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE saasbee_production TO saasbee;

-- Optimize PostgreSQL for production
-- /etc/postgresql/13/main/postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```

### 3. Redis Configuration
```conf
# /etc/redis/redis.conf
bind 127.0.0.1
port 6379
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

## 📦 Application Deployment

### 1. Clone and Setup
```bash
# Clone repository
cd /var/www
git clone https://github.com/your-org/saasbee.git
cd saasbee

# Set permissions
sudo chown -R www-data:www-data /var/www/saasbee
sudo chmod -R 755 /var/www/saasbee
sudo chmod -R 775 /var/www/saasbee/storage
sudo chmod -R 775 /var/www/saasbee/bootstrap/cache
```

### 2. Install Dependencies
```bash
# PHP dependencies
composer install --optimize-autoloader --no-dev

# Node.js dependencies
npm ci --production

# Build frontend assets
npm run build
```

### 3. Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### Production Environment Variables
```env
# Basic Configuration
APP_NAME="Your SaaS Name"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
APP_KEY=base64:generated_key_here

# Database Configuration
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=saasbee_production
DB_USERNAME=saasbee
DB_PASSWORD=strong_password_here

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Cache Configuration
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Email Configuration (Example with Mailgun)
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=yourdomain.com
MAILGUN_SECRET=your_mailgun_secret
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"

# Stripe Configuration
STRIPE_KEY=pk_live_your_stripe_public_key
STRIPE_SECRET=sk_live_your_stripe_secret_key
STRIPE_PRICE_MONTHLY=price_live_monthly_id
STRIPE_PRICE_YEARLY=price_live_yearly_id

# Logging
LOG_CHANNEL=daily
LOG_LEVEL=error

# Security
SESSION_SECURE_COOKIE=true
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,*.yourdomain.com
```

### 4. Database Setup
```bash
# Run migrations
php artisan migrate --force

# Seed initial data
php artisan db:seed --force

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🔧 Queue Workers

### Supervisor Configuration
```ini
# /etc/supervisor/conf.d/saasbee-worker.conf
[program:saasbee-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/saasbee/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/saasbee/storage/logs/worker.log
stopwaitsecs=3600
```

### Start Queue Workers
```bash
# Reload supervisor configuration
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start saasbee-worker:*
```

## 📊 Monitoring & Logging

### Log Configuration
```php
// config/logging.php
'channels' => [
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'error',
        'days' => 14,
    ],
    
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Laravel Log',
        'emoji' => ':boom:',
        'level' => 'critical',
    ],
],
```

### Health Check Endpoint
```php
// routes/web.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'services' => [
            'database' => DB::connection()->getPdo() ? 'ok' : 'error',
            'cache' => Cache::store('redis')->get('health_check') !== null ? 'ok' : 'error',
            'queue' => 'ok', // Add queue health check
        ]
    ]);
});
```

## 🔒 Security Hardening

### File Permissions
```bash
# Set proper file permissions
sudo chown -R www-data:www-data /var/www/saasbee
sudo find /var/www/saasbee -type f -exec chmod 644 {} \;
sudo find /var/www/saasbee -type d -exec chmod 755 {} \;
sudo chmod -R 775 /var/www/saasbee/storage
sudo chmod -R 775 /var/www/saasbee/bootstrap/cache
sudo chmod 600 /var/www/saasbee/.env
```

### Firewall Configuration
```bash
# UFW firewall rules
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d *.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📈 Performance Optimization

### OPcache Configuration
```ini
# /etc/php/8.2/fpm/conf.d/10-opcache.ini
opcache.enable=1
opcache.enable_cli=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=12
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.revalidate_freq=0
opcache.save_comments=1
opcache.fast_shutdown=0
```

### Database Optimization
```sql
-- Add indexes for performance
CREATE INDEX CONCURRENTLY idx_tenants_stripe_id ON tenants(stripe_id);
CREATE INDEX CONCURRENTLY idx_domains_tenant_id ON domains(tenant_id);
CREATE INDEX CONCURRENTLY idx_subscriptions_tenant_status ON subscriptions(tenant_id, stripe_status);

-- Analyze tables
ANALYZE tenants;
ANALYZE domains;
ANALYZE subscriptions;
```

## 🚀 Deployment Automation

### Deployment Script
```bash
#!/bin/bash
# deploy.sh

set -e

echo "Starting deployment..."

# Pull latest code
git pull origin main

# Install/update dependencies
composer install --optimize-autoloader --no-dev
npm ci --production

# Build assets
npm run build

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Run migrations
php artisan migrate --force

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart services
sudo supervisorctl restart saasbee-worker:*
sudo systemctl reload php8.2-fpm
sudo systemctl reload nginx

echo "Deployment completed successfully!"
```

### GitHub Actions CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.4
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/saasbee
            ./deploy.sh
```

## 🔍 Troubleshooting

### Common Issues

**Permission Errors:**
```bash
sudo chown -R www-data:www-data /var/www/saasbee
sudo chmod -R 775 storage bootstrap/cache
```

**Queue Not Processing:**
```bash
sudo supervisorctl status saasbee-worker:*
sudo supervisorctl restart saasbee-worker:*
```

**High Memory Usage:**
```bash
# Check PHP-FPM processes
ps aux | grep php-fpm
# Adjust pm.max_children in pool configuration
```

**Database Connection Issues:**
```bash
# Test database connection
php artisan tinker
> DB::connection()->getPdo();
```

## 📋 Post-Deployment Checklist

- [ ] SSL certificate installed and auto-renewal configured
- [ ] All environment variables set correctly
- [ ] Database migrations completed successfully
- [ ] Queue workers running and processing jobs
- [ ] File permissions set correctly
- [ ] Caching configured and working
- [ ] Monitoring and logging set up
- [ ] Backup system configured
- [ ] Health check endpoint responding
- [ ] Email delivery working
- [ ] Stripe webhooks configured
- [ ] DNS records pointing to server
- [ ] Firewall rules configured

This production deployment guide ensures a secure, scalable, and maintainable SaaSBee deployment suitable for production workloads.
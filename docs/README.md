# SaaSBee Documentation

Welcome to the SaaSBee documentation. This multi-tenant SaaS boilerplate provides a comprehensive foundation for building subscription-based applications with Laravel and React.

## 📚 Documentation Structure

### Getting Started
- [Installation & Setup](../README.md#installation) - Complete setup instructions
- [Project Architecture](architecture/overview.md) - High-level system architecture
- [Development Workflow](guides/development-workflow.md) - Development best practices

### Core Features
- [Multi-Tenancy](architecture/multi-tenancy.md) - Tenant isolation and management
- [Authentication & Authorization](architecture/auth.md) - User authentication and permissions
- [Subscription Management](architecture/subscriptions.md) - Billing and payment processing
- [Email System](architecture/email.md) - Email notifications and templates

### API Reference
- [Routes & Endpoints](api/routes.md) - Complete API documentation 
- [Actions](api/actions.md) - Business logic layer documentation
- [Models & Relationships](api/models.md) - Database models and relationships

### Database
- [Schema Overview](database/schema.md) - Database structure and relationships
- [Migrations](database/migrations.md) - Database migration management
- [Seeding](database/seeders.md) - Test data and initial setup

### Frontend
- [React Components](guides/frontend-components.md) - UI component documentation
- [TypeScript Types](guides/typescript.md) - Type definitions and interfaces
- [Styling & Themes](guides/styling.md) - CSS and design system

### Deployment
- [Production Deployment](deployment/production.md) - Production setup guide
- [Docker Setup](deployment/docker.md) - Containerized deployment
- [Environment Configuration](deployment/environment.md) - Environment variables reference

### Advanced Topics
- [Customization Guide](guides/customization.md) - Extending and modifying the system
- [Testing](guides/testing.md) - Testing strategies and examples
- [Performance](guides/performance.md) - Optimization and scaling
- [Security](guides/security.md) - Security considerations and best practices

## 🚀 Quick Navigation

### For Developers
- **New to the project?** Start with [Project Architecture](architecture/overview.md)
- **Setting up locally?** Follow the [Installation Guide](../README.md#installation)
- **Need to add features?** Check the [Customization Guide](guides/customization.md)

### For DevOps
- **Deploying to production?** See [Production Deployment](deployment/production.md)
- **Using Docker?** Follow the [Docker Setup](deployment/docker.md)
- **Performance issues?** Review [Performance Guide](guides/performance.md)

### For Business
- **Understanding features?** Review [Core Features](#core-features) sections
- **Planning integrations?** Check [API Reference](#api-reference)
- **Security concerns?** Read [Security Guide](guides/security.md)

## 🔧 Key Technologies

- **Backend**: Laravel 12, PHP 8.2+, Stancl Tenancy
- **Frontend**: React 19, TypeScript, Inertia.js, Tailwind CSS
- **Database**: PostgreSQL/MySQL/SQLite with tenant isolation
- **Payments**: Stripe integration with subscription management
- **Email**: Multi-provider support (SMTP, SES, Mailgun, etc.)
- **Deployment**: Docker, nginx, Redis, queue workers

## 📖 Contributing to Documentation

This documentation is maintained alongside the codebase. When making changes:

1. Update relevant documentation files
2. Ensure code examples are tested and accurate
3. Follow the existing documentation structure
4. Include both conceptual explanations and practical examples

## 💡 Need Help?

- **Code Issues**: Check existing tests and examples in the codebase
- **Architecture Questions**: Review the [Project Architecture](architecture/overview.md)
- **Deployment Problems**: Consult [Deployment Guides](deployment/)
- **Customization**: Follow the [Customization Guide](guides/customization.md)

---

*This documentation covers SaaSBee v1.0. For the latest updates, see the main [README](../README.md).*
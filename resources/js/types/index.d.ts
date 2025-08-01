import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    appDomain: string;
    logo: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    subscription?: Subscription | null;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface Role {
    id: number;
    name: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
}

export interface Subscription {
    id: string;
    name: string;
    stripe_status: string;
    stripe_price: string;
    quantity: number;
    trial_ends_at: string | null;
    ends_at: string | null;
    created_at: string;
    on_trial: boolean;
    active: boolean;
    canceled: boolean;
    on_grace_period: boolean;
}

export interface PaymentMethod {
    id: string;
    type: string;
    card: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
    };
}

export interface Invoice {
    id: string;
    number: string;
    status: string;
    amount_paid: number;
    amount_due: number;
    currency: string;
    created: number;
    hosted_invoice_url: string;
}

export interface Plan {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: string;
}

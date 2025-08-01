import PaymentMethodForm from '@/components/stripe/payment-method-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { BreadcrumbItem, Subscription, PaymentMethod, Invoice, Plan } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AlertCircle, CheckCircle, CreditCard, Download } from 'lucide-react';
import { useState } from 'react';

interface Props {
    subscription: Subscription | null;
    paymentMethods: PaymentMethod[];
    invoices: Invoice[];
    plans: Plan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing settings',
        href: '/settings/billing',
    },
];

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || '');

export default function Billing({ subscription, paymentMethods, invoices, plans }: Props) {
    const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false);
    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(price / 100);
    };

    const formatDate = (timestamp: number | string) => {
        const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : new Date(timestamp);
        return date.toLocaleDateString();
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            active: { variant: 'default' as const, label: 'Active' },
            trialing: { variant: 'secondary' as const, label: 'Trial' },
            canceled: { variant: 'destructive' as const, label: 'Cancelled' },
            incomplete: { variant: 'outline' as const, label: 'Incomplete' },
            past_due: { variant: 'destructive' as const, label: 'Past Due' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const handleSubscribe = (priceId: string) => {
        // In a real app, you'd collect payment method first
        if (paymentMethods.length === 0) {
            alert('Please add a payment method first');
            setShowPaymentMethodForm(true);
            return;
        }

        router.post('/settings/billing/subscribe', {
            price_id: priceId,
            payment_method: paymentMethods[0].id, // Use first payment method
        });
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel your subscription?')) {
            router.delete('/settings/billing/cancel');
        }
    };

    const handleResume = () => {
        router.post('/settings/billing/resume');
    };

    const handleChangePlan = (priceId: string) => {
        router.patch('/settings/billing/change-plan', { price_id: priceId });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium">Billing & Subscription</h3>
                        <p className="text-sm text-muted-foreground">Manage your subscription and billing information.</p>
                    </div>

                    <Separator />

                    {/* Current Subscription */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Current Subscription
                            </CardTitle>
                            <CardDescription>Your current subscription status and details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {subscription ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{subscription.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatPrice(plans.find((p) => p.id === subscription.stripe_price)?.price || 0, 'usd')} /
                                                {plans.find((p) => p.id === subscription.stripe_price)?.interval}
                                            </p>
                                        </div>
                                        {getStatusBadge(subscription.stripe_status)}
                                    </div>

                                    {subscription.on_trial && subscription.trial_ends_at && (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>Your trial ends on {formatDate(subscription.trial_ends_at)}.</AlertDescription>
                                        </Alert>
                                    )}

                                    {subscription.canceled && subscription.ends_at && (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                Your subscription will end on {formatDate(subscription.ends_at)}.
                                                {subscription.on_grace_period && (
                                                    <Button variant="link" className="ml-2 h-auto p-0" onClick={handleResume}>
                                                        Resume subscription
                                                    </Button>
                                                )}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="flex gap-2">
                                        {!subscription.canceled && (
                                            <Button variant="destructive" onClick={handleCancel}>
                                                Cancel Subscription
                                            </Button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="py-8 text-center">
                                    <p className="mb-4 text-muted-foreground">You don't have an active subscription.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Available Plans */}
                    {(!subscription || subscription.canceled) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Available Plans</CardTitle>
                                <CardDescription>Choose a plan that fits your needs.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {plans.map((plan) => (
                                        <div key={plan.id} className="rounded-lg border p-4">
                                            <div className="space-y-2">
                                                <h4 className="font-medium">{plan.name}</h4>
                                                <p className="text-2xl font-bold">
                                                    {formatPrice(plan.price, plan.currency)}
                                                    <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
                                                </p>
                                                <Button className="w-full" onClick={() => handleSubscribe(plan.id)}>
                                                    Subscribe
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Change Plan */}
                    {subscription && subscription.active && !subscription.canceled && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Plan</CardTitle>
                                <CardDescription>Switch to a different plan.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {plans
                                        .filter((plan) => plan.id !== subscription.stripe_price)
                                        .map((plan) => (
                                            <div key={plan.id} className="rounded-lg border p-4">
                                                <div className="space-y-2">
                                                    <h4 className="font-medium">{plan.name}</h4>
                                                    <p className="text-2xl font-bold">
                                                        {formatPrice(plan.price, plan.currency)}
                                                        <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
                                                    </p>
                                                    <Button variant="outline" className="w-full" onClick={() => handleChangePlan(plan.id)}>
                                                        Switch to this plan
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Payment Methods */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Methods</CardTitle>
                            <CardDescription>Manage your payment methods.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {paymentMethods.length > 0 ? (
                                <div className="space-y-3">
                                    {paymentMethods.map((method) => (
                                        <div key={method.id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="h-5 w-5" />
                                                <div>
                                                    <p className="font-medium">
                                                        {method.card.brand.toUpperCase()} ending in {method.card.last4}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Expires {method.card.exp_month}/{method.card.exp_year}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary">Default</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No payment methods on file.</p>
                            )}
                            <div className="mt-4 space-y-4">
                                <Button variant="outline" onClick={() => setShowPaymentMethodForm(true)}>
                                    Add Payment Method
                                </Button>

                                {showPaymentMethodForm && (
                                    <div className="rounded-lg border bg-muted/50 p-4">
                                        <div className="space-y-4">
                                            <h4 className="font-medium">Add Payment Method</h4>
                                            <Elements stripe={stripePromise}>
                                                <PaymentMethodForm
                                                    onSuccess={() => {
                                                        setShowPaymentMethodForm(false);
                                                        // Page will reload with success message
                                                    }}
                                                    onCancel={() => setShowPaymentMethodForm(false)}
                                                />
                                            </Elements>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invoices */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice History</CardTitle>
                            <CardDescription>Download and view your past invoices.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {invoices.length > 0 ? (
                                <div className="space-y-3">
                                    {invoices.map((invoice) => (
                                        <div key={invoice.id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <p className="font-medium">Invoice #{invoice.number}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatDate(invoice.created)} • {formatPrice(invoice.amount_paid, invoice.currency)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {invoice.status === 'paid' ? (
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                    )}
                                                    <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>{invoice.status}</Badge>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => window.open(invoice.hosted_invoice_url, '_blank')}>
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No invoices available.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

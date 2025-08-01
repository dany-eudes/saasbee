<?php

namespace App\Actions\Tenant\Settings;

use Inertia\Inertia;
use Inertia\Response;
use Lorisleiva\Actions\Concerns\AsAction;

class ViewBilling
{
    use AsAction;

    public function handle()
    {
        $tenant = tenancy()->tenant;

        $subscription = $tenant->subscription('default');
        $paymentMethods = $tenant->paymentMethods();
        $invoices = $tenant->invoices();

        return [
            'subscription' => $subscription ? [
                'id' => $subscription->id,
                'name' => $subscription->name,
                'stripe_status' => $subscription->stripe_status,
                'stripe_price' => $subscription->stripe_price,
                'quantity' => $subscription->quantity,
                'trial_ends_at' => $subscription->trial_ends_at,
                'ends_at' => $subscription->ends_at,
                'created_at' => $subscription->created_at,
                'on_trial' => $subscription->onTrial(),
                'active' => $subscription->active(),
                'canceled' => $subscription->canceled(),
                'on_grace_period' => $subscription->onGracePeriod(),
            ] : null,
            'paymentMethods' => $paymentMethods->map(fn($paymentMethod) => [
                'id' => $paymentMethod->id,
                'type' => $paymentMethod->type,
                'card' => $paymentMethod->card,
            ]),
            'invoices' => $invoices->map(fn($invoice) => [
                'id' => $invoice->id,
                'number' => $invoice->number,
                'status' => $invoice->status,
                'amount_paid' => $invoice->amount_paid,
                'amount_due' => $invoice->amount_due,
                'currency' => $invoice->currency,
                'created' => $invoice->created,
                'hosted_invoice_url' => $invoice->hosted_invoice_url,
            ]),
            'plans' => [
                [
                    'id' => config('saasbee.stripe_prices.monthly'),
                    'name' => 'Monthly Plan',
                    'price' => 2900,
                    'currency' => 'usd',
                    'interval' => 'month',
                ],
                [
                    'id' => config('saasbee.stripe_prices.yearly'),
                    'name' => 'Yearly Plan',
                    'price' => 29000,
                    'currency' => 'usd',
                    'interval' => 'year',
                ],
            ],
        ];
    }

    public function asController(): Response
    {
        $data = $this->handle();

        return Inertia::render('settings/billing', $data);
    }
}

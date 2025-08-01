<?php

namespace App\Actions\Tenant\Settings;

use Illuminate\Http\RedirectResponse;
use Lorisleiva\Actions\Concerns\AsAction;

class CancelSubscription
{
    use AsAction;

    public function handle()
    {
        $tenant = tenancy()->tenant;
        $subscription = $tenant->subscription('default');

        if ($subscription) {
            $subscription->cancel();

            return true;
        }

        return false;
    }

    public function asController(): RedirectResponse
    {
        $cancelled = $this->handle();

        if ($cancelled) {
            return redirect()->route('billing.index')
                ->with('success', 'Subscription cancelled. You will retain access until the end of your billing period.');
        }

        return redirect()->route('billing.index')
            ->with('error', 'No active subscription found.');
    }
}

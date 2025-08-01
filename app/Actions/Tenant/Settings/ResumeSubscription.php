<?php

namespace App\Actions\Tenant\Settings;

use Illuminate\Http\RedirectResponse;
use Lorisleiva\Actions\Concerns\AsAction;

class ResumeSubscription
{
    use AsAction;

    public function handle()
    {
        $tenant = tenancy()->tenant;
        $subscription = $tenant->subscription('default');

        if ($subscription && $subscription->onGracePeriod()) {
            $subscription->resume();

            return true;
        }

        return false;
    }

    public function asController(): RedirectResponse
    {
        $resumed = $this->handle();

        if ($resumed) {
            return redirect()->route('billing.index')
                ->with('success', 'Subscription resumed successfully!');
        }

        return redirect()->route('billing.index')
            ->with('error', 'Unable to resume subscription.');
    }
}

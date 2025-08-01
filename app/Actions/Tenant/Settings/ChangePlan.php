<?php

namespace App\Actions\Tenant\Settings;

use Illuminate\Http\RedirectResponse;
use Lorisleiva\Actions\ActionRequest;
use Lorisleiva\Actions\Concerns\AsAction;

class ChangePlan
{
    use AsAction;

    public function rules(): array
    {
        return [
            'price_id' => 'required|string',
        ];
    }

    public function handle(string $priceId)
    {
        $tenant = tenancy()->tenant;
        $subscription = $tenant->subscription('default');

        if ($subscription) {
            $subscription->swap($priceId);

            return true;
        }

        return false;
    }

    public function asController(ActionRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $changed = $this->handle($data['price_id']);

        if ($changed) {
            return redirect()->route('billing.index')
                ->with('success', 'Plan changed successfully!');
        }

        return redirect()->route('billing.index')
            ->with('error', 'Unable to change plan. No active subscription found.');
    }
}

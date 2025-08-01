<?php

namespace App\Actions\Tenant\Settings;

use Illuminate\Http\RedirectResponse;
use Lorisleiva\Actions\ActionRequest;
use Lorisleiva\Actions\Concerns\AsAction;

class CreatePaymentMethod
{
    use AsAction;

    public function rules(): array
    {
        return [
            'payment_method' => 'required|string',
        ];
    }

    public function handle(string $paymentMethodId)
    {
        $tenant = tenancy()->tenant;

        // Add the payment method to the customer
        $tenant->addPaymentMethod($paymentMethodId);

        // If this is the first payment method, make it the default
        if ($tenant->paymentMethods()->count() === 1) {
            $tenant->updateDefaultPaymentMethod($paymentMethodId);
        }

        return true;
    }

    public function asController(ActionRequest $request): RedirectResponse
    {
        $data = $request->validated();

        try {
            $this->handle($data['payment_method']);

            return redirect()->route('billing.index')
                ->with('success', 'Payment method added successfully!');
        } catch (\Exception $e) {
            return redirect()->route('billing.index')
                ->with('error', 'Failed to add payment method: ' . $e->getMessage());
        }
    }
}

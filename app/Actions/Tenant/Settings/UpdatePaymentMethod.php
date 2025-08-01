<?php

namespace App\Actions\Tenant\Settings;

use Illuminate\Http\RedirectResponse;
use Lorisleiva\Actions\ActionRequest;
use Lorisleiva\Actions\Concerns\AsAction;

class UpdatePaymentMethod
{
    use AsAction;

    public function rules(): array
    {
        return [
            'payment_method' => 'required|string',
        ];
    }

    public function handle(string $paymentMethod)
    {
        $tenant = tenancy()->tenant;
        $tenant->updateDefaultPaymentMethod($paymentMethod);

        return true;
    }

    public function asController(ActionRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $this->handle($data['payment_method']);

        return redirect()->route('billing.index')
            ->with('success', 'Payment method updated successfully!');
    }
}

<?php

namespace App\Actions\Tenant\Settings;

use Illuminate\Http\RedirectResponse;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Lorisleiva\Actions\ActionRequest;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateSubscription
{
    use AsAction;

    public function rules(): array
    {
        return [
            'price_id' => 'required|string',
            'payment_method' => 'required|string',
        ];
    }

    public function handle(string $priceId, string $paymentMethod)
    {
        $tenant = tenancy()->tenant;

        return $tenant->newSubscription('default', $priceId)
            ->create($paymentMethod);
    }

    public function asController(ActionRequest $request): RedirectResponse
    {
        $data = $request->validated();

        try {
            $this->handle($data['price_id'], $data['payment_method']);

            return redirect()->route('billing.index')
                ->with('success', 'Successfully subscribed to the plan!');
        } catch (IncompletePayment $exception) {
            return redirect()->route('cashier.payment', [$exception->payment->id]);
        }
    }
}

<?php

namespace App\Actions\Central;

use App\Models\Tenant;
use App\TenantStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Lorisleiva\Actions\ActionRequest;
use Lorisleiva\Actions\Concerns\AsAction;

class RegisterTenant
{
    use AsAction;

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'domain' => 'required|string|unique:domains|'.Rule::notIn(config('saasbee.reserved_subdomains')),
            'owner_email' => 'required|email',
            'owner_name' => 'required|string|max:255',
        ];
    }

    public function handle(array $data, bool $createStripeCustomer = true): Model
    {
        return DB::transaction(function () use ($data, $createStripeCustomer) {
            $domain = $data['domain'];
            $tenant = Tenant::create([
                'name' => $data['name'],
                'status' => TenantStatus::PendingApproval,
                'owner_email' => $data['owner_email'],
                'owner_name' => $data['owner_name'],
                'domain' => $domain,
                'trial_ends_at' => now()->addDays(config('saasbee.trial_days')),
            ]);

            $tenant->createDomain([
                'domain' => $domain,
            ])->makePrimary()->makeFallback();

            if ($createStripeCustomer) {
                $tenant->createAsStripeCustomer();
            }

            return $tenant;
        });
    }

    public function asController(ActionRequest $request): Response
    {
        $data = $request->validated();

        $this->handle($data);

        return Inertia::render('central/register-complete');
    }
}

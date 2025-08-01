<?php

namespace App\Models;

use Laravel\Cashier\Billable;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use Billable, HasDatabase, HasDomains;

    public static function getCustomColumns(): array
    {
        return [
            'id',
            'status',
            'stripe_id',
            'card_brand',
            'card_last_four',
            'trial_ends_at',
        ];
    }
}

<?php

namespace App\Models;

use App\Observers\DomainObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Models\Domain as BaseDomain;

/**
 * @property int $id
 * @property int $tenant_id
 * @property string $domain
 * @property bool $is_primary
 * @property bool $is_fallback
 * @property string $certificate_status
 * @property Tenant $tenant
 */
#[ObservedBy([DomainObserver::class])]
class Domain extends BaseDomain
{
    protected $casts = [
        'is_primary' => 'bool',
        'is_fallback' => 'bool',
    ];

    public static function domainFromSubdomain(string $subdomain): string
    {
        return $subdomain.'.'.config('tenancy.central_domains')[0];
    }

    public function makePrimary(): self
    {
        $this->update([
            'is_primary' => true,
        ]);

        $this->tenant->setRelation('primary_domain', $this);

        return $this;
    }

    public function makeFallback(): self
    {
        $this->update([
            'is_fallback' => true,
        ]);

        $this->tenant->setRelation('fallback_domain', $this);

        return $this;
    }

    public function isSubdomain(): bool
    {
        return ! Str::contains($this->domain, '.');
    }

    /**
     * Get the domain type.
     * Returns 'subdomain' or 'domain'.
     */
    public function getTypeAttribute(): string
    {
        return $this->isSubdomain() ? 'subdomain' : 'domain';
    }
}

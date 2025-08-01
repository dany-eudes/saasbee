<?php

namespace App\Observers;

use App\Exceptions\DomainCannotBeChangedException;
use App\Exceptions\SubdomainReservedException;
use App\Models\Domain;

class DomainObserver
{
    public function saving(Domain $model)
    {
        if (in_array($model->domain, config('saasbee.reserved_subdomains'))) {
            throw new SubdomainReservedException($model->domain);
        }
    }

    public function updating(Domain $model)
    {
        if ($model->getAttribute('domain') !== $model->getOriginal('domain')) {
            throw new DomainCannotBeChangedException;
        }
    }

    public function saved(Domain $model)
    {
        // There can only be one of these
        $uniqueKeys = ['is_primary', 'is_fallback'];

        foreach ($uniqueKeys as $key) {
            if ($model->$key) {
                $model->tenant->domains()
                    ->where('id', '!=', $model->id)
                    ->update([$key => false]);
            }
        }
    }
}

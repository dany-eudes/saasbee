<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Actions\Central\CreateTenantOwner as CentralCreateTenantOwner;
use App\TenantStatus;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Stancl\Tenancy\Contracts\TenantWithDatabase;

class CreateTenantOwner implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var TenantWithDatabase */
    protected $tenant;

    public function __construct(TenantWithDatabase $tenant)
    {
        $this->tenant = $tenant;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->tenant->run(function ($tenant) {
            $data = $tenant->only(['owner_email', 'owner_name', 'domain']);
            $email = $data['owner_email'];
            $name = $data['owner_name'];
            $domain = $data['domain'];
            CentralCreateTenantOwner::dispatchSync([
                'email' => $email,
                'name' => $name,
                'domain' => $domain,
            ]);

            $tenant->update([
                'owner_name' => '', // We don't need this anymore
                'owner_email' => '', // We don't need this anymore
                'domain' => '',
                'status' => TenantStatus::Active,
            ]);
        });
    }
}

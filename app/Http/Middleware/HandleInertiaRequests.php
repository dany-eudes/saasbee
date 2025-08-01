<?php

namespace App\Http\Middleware;

use App\Helpers\DomainHelper;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $tenant = tenancy()->tenant;
        $subscription = $tenant->subscription('default');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'logo' => global_asset('logo.png'),
            'appDomain' => DomainHelper::getAppDomainWithoutProtocol(),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user()?->load('roles.permissions'),
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'subscription' => $subscription ? [
                'id' => $subscription->id,
                'name' => $subscription->name,
                'stripe_status' => $subscription->stripe_status,
                'stripe_price' => $subscription->stripe_price,
                'quantity' => $subscription->quantity,
                'trial_ends_at' => $subscription->trial_ends_at,
                'ends_at' => $subscription->ends_at,
                'created_at' => $subscription->created_at,
                'on_trial' => $subscription->onTrial(),
                'active' => $subscription->active(),
                'canceled' => $subscription->canceled(),
                'on_grace_period' => $subscription->onGracePeriod(),
            ] : null,
        ];
    }
}

<?php

return [
    'reserved_subdomains' => [
        'www',
        'admin',
        'api',
    ],
    'trial_days' => 14,
    'stripe_prices' => [
        'monthly' => env('STRIPE_PRICE_MONTHLY', 'price_1ABC123def456'),
        'yearly' => env('STRIPE_PRICE_YEARLY', 'price_1XYZ789ghi012'),
    ],
];

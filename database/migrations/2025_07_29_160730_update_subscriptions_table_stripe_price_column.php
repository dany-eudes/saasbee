<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if the stripe_plan column exists before renaming
        if (Schema::hasColumn('subscriptions', 'stripe_plan')) {
            Schema::table('subscriptions', function (Blueprint $table) {
                $table->renameColumn('stripe_plan', 'stripe_price');
            });
        }
        // If stripe_price already exists and stripe_plan doesn't, do nothing
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Only rename back if stripe_price exists
        if (Schema::hasColumn('subscriptions', 'stripe_price')) {
            Schema::table('subscriptions', function (Blueprint $table) {
                $table->renameColumn('stripe_price', 'stripe_plan');
            });
        }
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creator_payout_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('creator_id')->constrained()->cascadeOnDelete();
            $table->string('stripe_account_id')->unique()->nullable();
            $table->enum('tier', ['Tier1', 'Tier2', 'Tier3'])->default('Tier1');
            $table->tinyInteger('hold_period_days')->default(15);
            $table->boolean('onboarding_complete')->default(false);
            $table->boolean('charges_enabled')->default(false);
            $table->boolean('payouts_enabled')->default(false);
            $table->timestamps();

            $table->index('stripe_account_id');
            $table->index('tier');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('creator_payout_accounts');
    }
};

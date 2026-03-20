<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creator_payouts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('creator_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->decimal('fee', 10, 2)->default(0);
            $table->decimal('net_amount', 10, 2);
            $table->enum('type', ['standard', 'instant'])->default('standard');
            $table->enum('status', ['pending', 'processing', 'paid', 'failed'])->default('pending');
            $table->string('stripe_payout_id')->nullable();
            $table->string('stripe_transfer_id')->nullable();
            $table->text('failure_message')->nullable();
            $table->timestamps();

            $table->index(['creator_id', 'status']);
            $table->index('stripe_payout_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('creator_payouts');
    }
};

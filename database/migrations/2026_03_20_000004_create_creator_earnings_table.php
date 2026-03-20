<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creator_earnings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('creator_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('collaboration_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('payout_id')->nullable()->constrained('creator_payouts')->nullOnDelete();
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending_approval', 'held', 'available', 'paid_out', 'reversed'])->default('pending_approval');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('hold_until')->nullable();
            $table->timestamp('reversed_at')->nullable();
            $table->text('reversal_reason')->nullable();
            $table->timestamps();

            $table->index(['creator_id', 'status']);
            $table->index('status');
            $table->index('hold_until');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('creator_earnings');
    }
};

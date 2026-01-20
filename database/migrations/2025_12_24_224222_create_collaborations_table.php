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
        Schema::create('collaborations', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // Brand and Creator relationship
            $table->foreignUuid('brand_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('creator_id')->constrained()->cascadeOnDelete();

            // Collaboration status
            $table->enum('status', ['pending', 'active', 'completed', 'cancelled'])->default('pending');
            $table->enum('connection_type', ['connected', 'unconnected'])->default('unconnected');

            // Collaboration type and terms
            $table->enum('collaboration_type', ['paid', 'free', 'commission', 'product_exchange'])->default('commission');
            $table->decimal('commission_rate', 5, 2)->nullable(); // Percentage (e.g., 10.50 for 10.5%)
            $table->decimal('fixed_payment', 10, 2)->nullable(); // Fixed payment amount
            $table->string('currency', 3)->default('USD');

            // Agreement and deliverables
            $table->text('agreement_template')->nullable();
            $table->text('deliverables')->nullable();
            $table->text('terms')->nullable();

            // Timeline
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('completed_at')->nullable();

            // Performance tracking
            $table->integer('posts_delivered')->default(0);
            $table->integer('posts_required')->nullable();
            $table->decimal('total_revenue', 10, 2)->default(0.00);
            $table->decimal('commission_earned', 10, 2)->default(0.00);

            // Payment tracking
            $table->enum('payment_status', ['pending', 'partial', 'paid', 'overdue'])->default('pending');
            $table->decimal('amount_paid', 10, 2)->default(0.00);
            $table->date('last_payment_date')->nullable();

            // Notes and metadata
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();

            $table->timestamps();

            // Indexes for efficient querying
            $table->index(['brand_id', 'creator_id']);
            $table->index('status');
            $table->unique(['brand_id', 'creator_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collaborations');
    }
};

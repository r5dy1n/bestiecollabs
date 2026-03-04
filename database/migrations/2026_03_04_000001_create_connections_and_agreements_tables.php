<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Connections table for account verification
        Schema::create('connections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuidMorphs('connectable'); // brand or creator
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->enum('connection_type', ['instagram', 'tiktok', 'email'])->nullable();
            $table->string('verification_token')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['connectable_type', 'connectable_id', 'status']);
        });

        // Collaboration agreements
        Schema::create('collaboration_agreements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('brand_id');
            $table->uuid('creator_id');
            $table->enum('status', ['draft', 'pending', 'accepted', 'active', 'completed', 'cancelled'])->default('draft');
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('commission_percentage', 5, 2)->nullable();
            $table->decimal('fixed_payment', 10, 2)->nullable();
            $table->enum('payment_type', ['commission', 'fixed', 'hybrid'])->default('commission');
            $table->integer('content_deliverables')->default(1);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->json('terms')->nullable();
            $table->text('ai_generated_script')->nullable();
            $table->timestamps();

            $table->foreign('brand_id')->references('id')->on('brands')->onDelete('cascade');
            $table->foreign('creator_id')->references('id')->on('creators')->onDelete('cascade');
            $table->index(['status', 'start_date']);
        });

        // Collaboration payments
        Schema::create('collaboration_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('agreement_id');
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded'])->default('pending');
            $table->enum('payment_method', ['stripe', 'paypal', 'manual'])->default('manual');
            $table->string('transaction_id')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('agreement_id')->references('id')->on('collaboration_agreements')->onDelete('cascade');
            $table->index(['status', 'paid_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('collaboration_payments');
        Schema::dropIfExists('collaboration_agreements');
        Schema::dropIfExists('connections');
    }
};

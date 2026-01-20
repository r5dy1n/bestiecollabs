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
        Schema::create('outreach_attempts', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // Who is being contacted (Brand or Creator)
            $table->uuidMorphs('contactable');

            // Who initiated the outreach (User - typically admin)
            $table->foreignId('initiated_by')->constrained('users')->cascadeOnDelete();

            // Outreach details
            $table->enum('channel', ['email', 'instagram', 'tiktok']);
            $table->enum('status', ['pending', 'sent', 'responded', 'failed', 'bounced'])->default('pending');
            $table->integer('attempt_number')->default(1);

            // Message content
            $table->text('message_content')->nullable();
            $table->text('response_content')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('responded_at')->nullable();

            // Notes and metadata
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();

            $table->timestamps();

            // Indexes for efficient querying
            $table->index(['contactable_type', 'contactable_id', 'channel']);
            $table->index('status');
            $table->index('channel');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('outreach_attempts');
    }
};

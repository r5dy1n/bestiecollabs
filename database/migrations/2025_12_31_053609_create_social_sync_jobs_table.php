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
        Schema::create('social_sync_jobs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('creator_id')->constrained()->onDelete('cascade');
            $table->string('platform');
            $table->string('status');
            $table->jsonb('sync_data')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_sync_jobs');
    }
};

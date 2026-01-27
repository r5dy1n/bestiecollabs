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
        Schema::create('social_connections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('platform'); // instagram, tiktok, youtube, twitter
            $table->string('platform_user_id')->nullable();
            $table->string('handle')->nullable();
            $table->string('status')->default('connected'); // connected, disconnected
            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->string('metrics_source')->default('oauth');
            $table->unsignedBigInteger('followers')->nullable();
            $table->unsignedInteger('posts_count')->nullable();
            $table->decimal('engagement_rate', 8, 4)->nullable();
            $table->jsonb('platform_metadata')->nullable();
            $table->timestamp('last_sync_at')->nullable();
            $table->timestamp('last_sync_attempted_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'platform']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_connections');
    }
};

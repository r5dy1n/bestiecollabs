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
        Schema::table('creators', function (Blueprint $table) {
            $table->string('youtube_url')->nullable()->after('tiktok_url');
            $table->string('twitter_url')->nullable()->after('youtube_url');
            $table->jsonb('social_metadata')->nullable()->after('posting_frequency_days');
            $table->timestamp('last_synced_at')->nullable()->after('social_metadata');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('creators', function (Blueprint $table) {
            $table->dropColumn([
                'youtube_url',
                'twitter_url',
                'social_metadata',
                'last_synced_at',
            ]);
        });
    }
};

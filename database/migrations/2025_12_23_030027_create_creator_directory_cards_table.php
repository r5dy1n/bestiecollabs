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
        Schema::create('creator_directory_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('creator_id')->constrained()->cascadeOnDelete();
            $table->text('short_description');
            $table->jsonb('social_media_links')->nullable();
            $table->integer('followers_count')->default(0);
            $table->integer('average_views_per_post')->default(0);
            $table->decimal('engagement_rate', 5, 2)->default(0);
            $table->jsonb('top_follower_categories_per_platform')->nullable();
            $table->jsonb('follower_gender_distribution')->nullable();
            $table->integer('follower_age_range_min');
            $table->integer('follower_age_range_max');
            $table->jsonb('preview_most_watched_videos')->nullable();
            $table->decimal('gmv_30day_or_lifetime', 12, 2)->default(0);
            $table->integer('number_active_collabs')->default(0);
            $table->string('bestie_score_badge_position')->default('top-left');
            $table->string('match_score_badge_position')->default('top-right');
            $table->decimal('bestie_score', 5, 2)->default(0);
            $table->decimal('match_score', 5, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creator_directory_cards');
    }
};

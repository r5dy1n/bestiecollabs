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
        Schema::create('brand_directory_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('brand_id')->constrained()->cascadeOnDelete();
            $table->string('shop_name');
            $table->text('short_description');
            $table->string('store_type');
            $table->string('price_range');
            $table->integer('items_sold_30day')->default(0);
            $table->string('url');
            $table->jsonb('social_media_links')->nullable();
            $table->jsonb('top_categories')->nullable();
            $table->string('customer_gender')->nullable();
            $table->integer('customer_age_range_min');
            $table->integer('customer_age_range_max');
            $table->integer('number_of_collabs')->default(0);
            $table->jsonb('preview_most_watched_posts')->nullable();
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
        Schema::dropIfExists('brand_directory_cards');
    }
};

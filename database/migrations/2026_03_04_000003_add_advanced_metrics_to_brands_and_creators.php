<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->decimal('total_gmv', 12, 2)->nullable()->after('platform_activity_score');
            $table->decimal('conversion_rate', 5, 2)->nullable()->after('total_gmv');
            $table->integer('total_orders')->nullable()->after('conversion_rate');
            $table->decimal('average_order_value', 10, 2)->nullable()->after('total_orders');
            $table->json('monthly_metrics')->nullable()->after('average_order_value'); // Trending data
        });

        Schema::table('creators', function (Blueprint $table) {
            $table->integer('total_followers')->nullable()->after('posting_frequency_days');
            $table->integer('instagram_followers')->nullable()->after('total_followers');
            $table->integer('tiktok_followers')->nullable()->after('instagram_followers');
            $table->integer('youtube_subscribers')->nullable()->after('tiktok_followers');
            $table->integer('twitter_followers')->nullable()->after('youtube_subscribers');
            $table->decimal('avg_engagement_rate', 5, 2)->nullable()->after('twitter_followers');
            $table->decimal('avg_views_per_post', 10, 2)->nullable()->after('avg_engagement_rate');
            $table->decimal('estimated_reach', 10, 2)->nullable()->after('avg_views_per_post');
            $table->json('content_previews')->nullable()->after('estimated_reach'); // Recent content samples
            $table->json('monthly_metrics')->nullable()->after('content_previews'); // Trending data
        });
    }

    public function down(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->dropColumn([
                'total_gmv',
                'conversion_rate',
                'total_orders',
                'average_order_value',
                'monthly_metrics',
            ]);
        });

        Schema::table('creators', function (Blueprint $table) {
            $table->dropColumn([
                'total_followers',
                'instagram_followers',
                'tiktok_followers',
                'youtube_subscribers',
                'twitter_followers',
                'avg_engagement_rate',
                'avg_views_per_post',
                'estimated_reach',
                'content_previews',
                'monthly_metrics',
            ]);
        });
    }
};

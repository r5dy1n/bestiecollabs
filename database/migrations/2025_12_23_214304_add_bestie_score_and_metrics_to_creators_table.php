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
            $table->decimal('bestie_score', 3, 2)->default(0.00)->after('us_based');
            $table->integer('total_posts')->default(0)->after('bestie_score');
            $table->decimal('engagement_rate', 5, 2)->default(0.00)->after('total_posts');
            $table->decimal('follower_growth_rate', 5, 2)->default(0.00)->after('engagement_rate');
            $table->integer('content_quality_score')->default(0)->after('follower_growth_rate');
            $table->integer('posting_frequency_days')->default(0)->after('content_quality_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('creators', function (Blueprint $table) {
            $table->dropColumn([
                'bestie_score',
                'total_posts',
                'engagement_rate',
                'follower_growth_rate',
                'content_quality_score',
                'posting_frequency_days',
            ]);
        });
    }
};

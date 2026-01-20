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
        Schema::table('brands', function (Blueprint $table) {
            $table->decimal('bestie_score', 3, 2)->default(0.00)->after('us_based');
            $table->integer('total_collaborations')->default(0)->after('bestie_score');
            $table->decimal('average_rating', 3, 2)->default(0.00)->after('total_collaborations');
            $table->decimal('response_rate', 5, 2)->default(0.00)->after('average_rating');
            $table->integer('platform_activity_score')->default(0)->after('response_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->dropColumn([
                'bestie_score',
                'total_collaborations',
                'average_rating',
                'response_rate',
                'platform_activity_score',
            ]);
        });
    }
};

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
        Schema::table('social_connections', function (Blueprint $table) {
            $table->unique(['platform', 'platform_user_id'], 'social_connections_platform_user_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('social_connections', function (Blueprint $table) {
            $table->dropUnique('social_connections_platform_user_unique');
        });
    }
};

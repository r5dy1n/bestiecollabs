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
        Schema::create('creators', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('creator_name');
            $table->text('description');
            $table->string('instagram_url')->nullable();
            $table->string('tiktok_url')->nullable();
            $table->string('category_primary');
            $table->string('category_secondary')->nullable();
            $table->string('category_tertiary')->nullable();
            $table->jsonb('followers_demographs')->nullable();
            $table->integer('follower_age_min');
            $table->integer('follower_age_max');
            $table->string('language');
            $table->boolean('us_based')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creators');
    }
};

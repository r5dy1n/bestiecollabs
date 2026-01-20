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
        Schema::create('brand_creator_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('brand_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('creator_id')->constrained()->cascadeOnDelete();
            $table->decimal('match_score', 3, 2)->default(0.00);
            $table->decimal('age_overlap_score', 3, 2)->default(0.00);
            $table->decimal('category_alignment_score', 3, 2)->default(0.00);
            $table->decimal('geographic_compatibility_score', 3, 2)->default(0.00);
            $table->decimal('quality_threshold_score', 3, 2)->default(0.00);
            $table->timestamps();

            $table->unique(['brand_id', 'creator_id']);
            $table->index('match_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brand_creator_matches');
    }
};

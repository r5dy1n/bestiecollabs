<?php

namespace App\Services;

use App\Models\Brand;
use App\Models\Creator;

class BestieScoreService
{
    /**
     * Calculate the Bestie Score for a brand.
     *
     * Brand Bestie Score is based on:
     * - Total collaborations (weight: 25%)
     * - Average rating (weight: 30%)
     * - Response rate (weight: 25%)
     * - Platform activity score (weight: 20%)
     *
     * @return float Score between 0.00 and 5.00
     */
    public function calculateBrandScore(Brand $brand): float
    {
        $collaborationScore = $this->normalizeCollaborations($brand->total_collaborations);
        $ratingScore = $this->normalizeRating($brand->average_rating);
        $responseScore = $this->normalizePercentage($brand->response_rate);
        $activityScore = $this->normalizeActivityScore($brand->platform_activity_score);

        $totalScore = (
            ($collaborationScore * 0.25) +
            ($ratingScore * 0.30) +
            ($responseScore * 0.25) +
            ($activityScore * 0.20)
        );

        return round($totalScore, 2);
    }

    /**
     * Calculate the Bestie Score for a creator.
     *
     * Creator Bestie Score is based on:
     * - Total posts (weight: 20%)
     * - Engagement rate (weight: 30%)
     * - Follower growth rate (weight: 20%)
     * - Content quality score (weight: 20%)
     * - Posting frequency (weight: 10%)
     *
     * @return float Score between 0.00 and 5.00
     */
    public function calculateCreatorScore(Creator $creator): float
    {
        $postsScore = $this->normalizePosts($creator->total_posts);
        $engagementScore = $this->normalizePercentage($creator->engagement_rate);
        $growthScore = $this->normalizePercentage($creator->follower_growth_rate);
        $qualityScore = $this->normalizeQualityScore($creator->content_quality_score);
        $frequencyScore = $this->normalizeFrequency($creator->posting_frequency_days);

        $totalScore = (
            ($postsScore * 0.20) +
            ($engagementScore * 0.30) +
            ($growthScore * 0.20) +
            ($qualityScore * 0.20) +
            ($frequencyScore * 0.10)
        );

        return round($totalScore, 2);
    }

    /**
     * Update the Bestie Score for a brand and save it.
     */
    public function updateBrandScore(Brand $brand): void
    {
        $brand->bestie_score = $this->calculateBrandScore($brand);
        $brand->save();
    }

    /**
     * Update the Bestie Score for a creator and save it.
     */
    public function updateCreatorScore(Creator $creator): void
    {
        $creator->bestie_score = $this->calculateCreatorScore($creator);
        $creator->save();
    }

    /**
     * Normalize total collaborations to a 0-5 scale.
     * 0 collabs = 0.0, 50+ collabs = 5.0
     */
    protected function normalizeCollaborations(int $collaborations): float
    {
        return min(5.0, ($collaborations / 50) * 5.0);
    }

    /**
     * Normalize average rating to a 0-5 scale.
     * Assumes ratings are already on a 0-5 scale.
     */
    protected function normalizeRating(float $rating): float
    {
        return min(5.0, max(0.0, $rating));
    }

    /**
     * Normalize percentage (0-100) to a 0-5 scale.
     */
    protected function normalizePercentage(float $percentage): float
    {
        return min(5.0, ($percentage / 100) * 5.0);
    }

    /**
     * Normalize activity score to a 0-5 scale.
     * 0 = 0.0, 100+ = 5.0
     */
    protected function normalizeActivityScore(int $score): float
    {
        return min(5.0, ($score / 100) * 5.0);
    }

    /**
     * Normalize total posts to a 0-5 scale.
     * 0 posts = 0.0, 100+ posts = 5.0
     */
    protected function normalizePosts(int $posts): float
    {
        return min(5.0, ($posts / 100) * 5.0);
    }

    /**
     * Normalize quality score to a 0-5 scale.
     * 0 = 0.0, 100 = 5.0
     */
    protected function normalizeQualityScore(int $score): float
    {
        return min(5.0, ($score / 100) * 5.0);
    }

    /**
     * Normalize posting frequency to a 0-5 scale.
     * Daily (1 day) = 5.0, Weekly (7 days) = 3.5, Monthly (30 days) = 1.0
     */
    protected function normalizeFrequency(int $days): float
    {
        if ($days === 0) {
            return 0.0;
        }

        if ($days <= 1) {
            return 5.0;
        }

        if ($days <= 7) {
            return 4.0;
        }

        if ($days <= 14) {
            return 3.0;
        }

        if ($days <= 30) {
            return 2.0;
        }

        return 1.0;
    }
}

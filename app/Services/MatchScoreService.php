<?php

namespace App\Services;

use App\Models\Brand;
use App\Models\Creator;

class MatchScoreService
{
    /**
     * Calculate the Match Score between a brand and creator.
     *
     * Match Score is based on:
     * - Age range overlap (weight: 40%)
     * - Category alignment (weight: 40%)
     * - Geographic compatibility (weight: 10%)
     * - Quality threshold (weight: 10%)
     *
     * @return float Score between 0.00 and 5.00
     */
    public function calculateMatchScore(Brand $brand, Creator $creator): float
    {
        $ageScore = $this->calculateAgeOverlap($brand, $creator);
        $categoryScore = $this->calculateCategoryAlignment($brand, $creator);
        $geoScore = $this->calculateGeographicCompatibility($brand, $creator);
        $qualityScore = $this->calculateQualityThreshold($brand, $creator);

        $totalScore = (
            ($ageScore * 0.40) +
            ($categoryScore * 0.40) +
            ($geoScore * 0.10) +
            ($qualityScore * 0.10)
        );

        return round($totalScore, 2);
    }

    /**
     * Calculate age range overlap score.
     * Compares brand customer age range with creator follower age range.
     *
     * @return float Score between 0.00 and 5.00
     */
    public function calculateAgeOverlap(Brand $brand, Creator $creator): float
    {
        $brandMin = $brand->customer_age_min;
        $brandMax = $brand->customer_age_max;
        $creatorMin = $creator->follower_age_min;
        $creatorMax = $creator->follower_age_max;

        // Calculate overlap
        $overlapMin = max($brandMin, $creatorMin);
        $overlapMax = min($brandMax, $creatorMax);

        // No overlap
        if ($overlapMin > $overlapMax) {
            return 0.0;
        }

        // Calculate overlap percentage relative to brand's target range
        $brandRange = $brandMax - $brandMin;
        $overlapRange = $overlapMax - $overlapMin;

        if ($brandRange === 0) {
            return 0.0;
        }

        $overlapPercentage = ($overlapRange / $brandRange) * 100;

        // Convert to 0-5 scale
        // 100% overlap = 5.0, 80% = 4.0, 60% = 3.0, 40% = 2.0, 20% = 1.0
        return min(5.0, ($overlapPercentage / 100) * 5.0);
    }

    /**
     * Calculate category alignment score.
     * Checks if categories match (primary, secondary, tertiary).
     *
     * @return float Score between 0.00 and 5.00
     */
    public function calculateCategoryAlignment(Brand $brand, Creator $creator): float
    {
        $brandCategories = array_filter([
            $brand->category_primary,
            $brand->category_secondary,
            $brand->category_tertiary,
        ]);

        $creatorCategories = array_filter([
            $creator->category_primary,
            $creator->category_secondary,
            $creator->category_tertiary,
        ]);

        $matches = 0;
        $maxPossibleMatches = max(count($brandCategories), count($creatorCategories));

        if ($maxPossibleMatches === 0) {
            return 0.0;
        }

        // Check for matches, with higher weight for primary category
        if ($brand->category_primary === $creator->category_primary) {
            $matches += 2; // Primary match is worth 2 points
        }

        // Check secondary and tertiary matches
        $brandSecondaryTertiary = array_filter([$brand->category_secondary, $brand->category_tertiary]);
        $creatorSecondaryTertiary = array_filter([$creator->category_secondary, $creator->category_tertiary]);

        foreach ($brandSecondaryTertiary as $brandCat) {
            if (in_array($brandCat, $creatorSecondaryTertiary, true)) {
                $matches += 1;
            }
        }

        // Also check if brand's secondary/tertiary matches creator's primary
        foreach ($brandSecondaryTertiary as $brandCat) {
            if ($brandCat === $creator->category_primary) {
                $matches += 1.5;
            }
        }

        // Normalize to 0-5 scale
        // Maximum possible matches is ~4 (primary match + 2 secondary matches)
        return min(5.0, ($matches / 4) * 5.0);
    }

    /**
     * Calculate geographic compatibility score.
     * Both must be US-based for maximum score.
     *
     * @return float Score between 0.00 and 5.00
     */
    public function calculateGeographicCompatibility(Brand $brand, Creator $creator): float
    {
        if ($brand->us_based && $creator->us_based) {
            return 5.0;
        }

        if ($brand->us_based || $creator->us_based) {
            return 2.5; // Partial compatibility
        }

        return 1.0; // Both international
    }

    /**
     * Calculate quality threshold score.
     * Based on Bestie Scores of both brand and creator.
     *
     * @return float Score between 0.00 and 5.00
     */
    public function calculateQualityThreshold(Brand $brand, Creator $creator): float
    {
        $brandScore = (float) $brand->bestie_score;
        $creatorScore = (float) $creator->bestie_score;

        // Average of both Bestie Scores
        return round(($brandScore + $creatorScore) / 2, 2);
    }

    /**
     * Check if brand and creator meet minimum match threshold.
     *
     * @param  float  $minimumScore  Minimum acceptable match score (default: 2.5)
     */
    public function isCompatible(Brand $brand, Creator $creator, float $minimumScore = 2.5): bool
    {
        $matchScore = $this->calculateMatchScore($brand, $creator);

        return $matchScore >= $minimumScore;
    }

    /**
     * Get top N matching creators for a brand.
     *
     * @param  int  $limit  Number of top matches to return
     * @return \Illuminate\Support\Collection Collection of creators with their match scores
     */
    public function getTopMatchesForBrand(Brand $brand, int $limit = 10): \Illuminate\Support\Collection
    {
        $creators = Creator::where('us_based', $brand->us_based)
            ->get()
            ->map(function ($creator) use ($brand) {
                return [
                    'creator' => $creator,
                    'match_score' => $this->calculateMatchScore($brand, $creator),
                ];
            })
            ->filter(function ($item) {
                return $item['match_score'] >= 2.0; // Minimum threshold
            })
            ->sortByDesc('match_score')
            ->take($limit);

        return $creators;
    }

    /**
     * Get top N matching brands for a creator.
     *
     * @param  int  $limit  Number of top matches to return
     * @return \Illuminate\Support\Collection Collection of brands with their match scores
     */
    public function getTopMatchesForCreator(Creator $creator, int $limit = 10): \Illuminate\Support\Collection
    {
        $brands = Brand::where('us_based', $creator->us_based)
            ->get()
            ->map(function ($brand) use ($creator) {
                return [
                    'brand' => $brand,
                    'match_score' => $this->calculateMatchScore($brand, $creator),
                ];
            })
            ->filter(function ($item) {
                return $item['match_score'] >= 2.0; // Minimum threshold
            })
            ->sortByDesc('match_score')
            ->take($limit);

        return $brands;
    }
}

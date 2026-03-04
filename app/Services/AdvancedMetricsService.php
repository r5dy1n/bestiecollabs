<?php

namespace App\Services;

use App\Models\Brand;
use App\Models\Creator;
use Illuminate\Support\Facades\DB;

class AdvancedMetricsService
{
    /**
     * Calculate and update advanced metrics for a brand.
     */
    public function calculateBrandMetrics(Brand $brand): void
    {
        // Get Shopify connection if exists
        $shopifyConnection = $brand->user?->shopifyConnection;

        if ($shopifyConnection) {
            // Calculate GMV from orders
            $orderMetrics = DB::table('shopify_orders')
                ->where('shopify_connection_id', $shopifyConnection->id)
                ->selectRaw('
                    SUM(total_price) as total_gmv,
                    COUNT(*) as total_orders,
                    AVG(total_price) as avg_order_value
                ')
                ->first();

            // Calculate conversion rate from customers and orders
            $totalCustomers = DB::table('shopify_customers')
                ->where('shopify_connection_id', $shopifyConnection->id)
                ->count();

            $conversionRate = $totalCustomers > 0
                ? ($orderMetrics->total_orders / $totalCustomers) * 100
                : 0;

            // Calculate monthly metrics for trending
            $monthlyMetrics = DB::table('shopify_orders')
                ->where('shopify_connection_id', $shopifyConnection->id)
                ->where('created_at', '>=', now()->subMonths(12))
                ->selectRaw('
                    DATE_FORMAT(created_at, "%Y-%m") as month,
                    SUM(total_price) as gmv,
                    COUNT(*) as orders,
                    AVG(total_price) as aov
                ')
                ->groupBy('month')
                ->orderBy('month')
                ->get()
                ->toArray();

            $brand->update([
                'total_gmv' => $orderMetrics->total_gmv ?? 0,
                'total_orders' => $orderMetrics->total_orders ?? 0,
                'average_order_value' => $orderMetrics->avg_order_value ?? 0,
                'conversion_rate' => $conversionRate,
                'monthly_metrics' => $monthlyMetrics,
            ]);
        }
    }

    /**
     * Calculate and update advanced metrics for a creator.
     */
    public function calculateCreatorMetrics(Creator $creator): void
    {
        $metadata = $creator->social_metadata ?? [];

        // Aggregate follower counts across platforms
        $totalFollowers = 0;
        $instagramFollowers = $metadata['instagram']['followers'] ?? 0;
        $tiktokFollowers = $metadata['tiktok']['followers'] ?? 0;
        $youtubeSubscribers = $metadata['youtube']['subscribers'] ?? 0;
        $twitterFollowers = $metadata['twitter']['followers'] ?? 0;

        $totalFollowers = $instagramFollowers + $tiktokFollowers + $youtubeSubscribers + $twitterFollowers;

        // Calculate average engagement rate across platforms
        $engagementRates = [];
        if (isset($metadata['instagram']['engagement_rate'])) {
            $engagementRates[] = $metadata['instagram']['engagement_rate'];
        }
        if (isset($metadata['tiktok']['engagement_rate'])) {
            $engagementRates[] = $metadata['tiktok']['engagement_rate'];
        }
        if (isset($metadata['youtube']['engagement_rate'])) {
            $engagementRates[] = $metadata['youtube']['engagement_rate'];
        }

        $avgEngagementRate = count($engagementRates) > 0
            ? array_sum($engagementRates) / count($engagementRates)
            : 0;

        // Calculate average views per post
        $avgViews = $metadata['avg_views'] ?? 0;

        // Estimate reach (typically 2-5x follower count depending on engagement)
        $estimatedReach = $totalFollowers * (1 + ($avgEngagementRate / 100));

        // Extract content previews from recent posts
        $contentPreviews = [];
        foreach (['instagram', 'tiktok', 'youtube'] as $platform) {
            if (isset($metadata[$platform]['recent_posts'])) {
                $contentPreviews[$platform] = array_slice($metadata[$platform]['recent_posts'], 0, 3);
            }
        }

        // Calculate monthly metrics for trending
        $monthlyMetrics = $this->extractMonthlyTrends($metadata);

        $creator->update([
            'total_followers' => $totalFollowers,
            'instagram_followers' => $instagramFollowers,
            'tiktok_followers' => $tiktokFollowers,
            'youtube_subscribers' => $youtubeSubscribers,
            'twitter_followers' => $twitterFollowers,
            'avg_engagement_rate' => $avgEngagementRate,
            'avg_views_per_post' => $avgViews,
            'estimated_reach' => $estimatedReach,
            'content_previews' => $contentPreviews,
            'monthly_metrics' => $monthlyMetrics,
        ]);
    }

    /**
     * Extract monthly trending data from social metadata.
     */
    private function extractMonthlyTrends(array $metadata): array
    {
        $trends = [];

        foreach (['instagram', 'tiktok', 'youtube'] as $platform) {
            if (isset($metadata[$platform]['monthly_stats'])) {
                foreach ($metadata[$platform]['monthly_stats'] as $month => $stats) {
                    if (!isset($trends[$month])) {
                        $trends[$month] = [
                            'month' => $month,
                            'followers' => 0,
                            'posts' => 0,
                            'engagement' => 0,
                            'views' => 0,
                        ];
                    }

                    $trends[$month]['followers'] += $stats['followers'] ?? 0;
                    $trends[$month]['posts'] += $stats['posts'] ?? 0;
                    $trends[$month]['engagement'] += $stats['engagement'] ?? 0;
                    $trends[$month]['views'] += $stats['views'] ?? 0;
                }
            }
        }

        return array_values($trends);
    }

    /**
     * Calculate metrics for all brands.
     */
    public function calculateAllBrandMetrics(): int
    {
        $brands = Brand::with('user.shopifyConnection')->get();
        $count = 0;

        foreach ($brands as $brand) {
            $this->calculateBrandMetrics($brand);
            $count++;
        }

        return $count;
    }

    /**
     * Calculate metrics for all creators.
     */
    public function calculateAllCreatorMetrics(): int
    {
        $creators = Creator::whereNotNull('social_metadata')->get();
        $count = 0;

        foreach ($creators as $creator) {
            $this->calculateCreatorMetrics($creator);
            $count++;
        }

        return $count;
    }
}

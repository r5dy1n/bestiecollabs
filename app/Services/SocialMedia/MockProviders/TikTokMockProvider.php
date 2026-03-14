<?php

namespace App\Services\SocialMedia\MockProviders;

use App\Services\SocialMedia\Contracts\SocialMediaPlatformInterface;

class TikTokMockProvider implements SocialMediaPlatformInterface
{
    public function fetchProfile(string $username): array
    {
        return [
            'username' => '@'.ltrim($username, '@'),
            'follower_count' => fake()->numberBetween(50000, 2000000),
            'video_count' => fake()->numberBetween(30, 300),
            'total_likes' => fake()->numberBetween(100000, 5000000),
            'verified' => fake()->boolean(15),
            'bio' => fake()->sentence(),
            'last_synced' => now()->toISOString(),
        ];
    }

    public function fetchMetrics(string $username): array
    {
        return [
            'avg_views' => fake()->numberBetween(10000, 500000),
            'avg_likes' => fake()->numberBetween(1000, 100000),
            'avg_comments' => fake()->numberBetween(50, 2000),
            'engagement_rate' => fake()->randomFloat(2, 5, 25),
        ];
    }

    public function search(string $query, ?string $category = null): array
    {
        $results = [];
        $count = fake()->numberBetween(5, 15);

        for ($i = 0; $i < $count; $i++) {
            $username = fake()->userName();
            $results[] = [
                'username' => '@'.$username,
                'display_name' => fake()->name(),
                'follower_count' => fake()->numberBetween(50000, 2000000),
                'verified' => fake()->boolean(10),
                'bio' => $category ? ucfirst($category).' creator | '.$query : fake()->sentence(),
                'profile_picture_url' => fake()->imageUrl(150, 150, 'people'),
                'relevance_score' => fake()->randomFloat(2, 0.6, 1),
                'category' => $category,
            ];
        }

        usort($results, fn ($a, $b) => $b['relevance_score'] <=> $a['relevance_score']);

        return $results;
    }
}

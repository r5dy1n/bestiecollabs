<?php

namespace App\Services\SocialMedia\MockProviders;

use App\Services\SocialMedia\Contracts\SocialMediaPlatformInterface;

class TwitterMockProvider implements SocialMediaPlatformInterface
{
    public function fetchProfile(string $username): array
    {
        return [
            'username' => '@'.ltrim($username, '@'),
            'follower_count' => fake()->numberBetween(1000, 100000),
            'following_count' => fake()->numberBetween(50, 1000),
            'tweet_count' => fake()->numberBetween(500, 10000),
            'verified' => fake()->boolean(10),
            'bio' => fake()->sentence(),
            'last_synced' => now()->toISOString(),
        ];
    }

    public function fetchMetrics(string $username): array
    {
        return [
            'avg_retweets' => fake()->numberBetween(5, 500),
            'avg_likes' => fake()->numberBetween(20, 2000),
            'avg_replies' => fake()->numberBetween(2, 100),
            'engagement_rate' => fake()->randomFloat(2, 1, 8),
        ];
    }

    public function search(string $query, ?string $category = null): array
    {
        $results = [];
        $count = fake()->numberBetween(5, 15);

        for ($i = 0; $i < $count; $i++) {
            $username = fake()->userName();
            $bio = $category
                ? ucfirst($category).' enthusiast | Tweeting about '.$query.' daily'
                : fake()->sentence();

            $results[] = [
                'username' => '@'.$username,
                'display_name' => fake()->name(),
                'follower_count' => fake()->numberBetween(1000, 100000),
                'verified' => fake()->boolean(8),
                'bio' => $bio,
                'profile_picture_url' => fake()->imageUrl(150, 150, 'people'),
                'relevance_score' => fake()->randomFloat(2, 0.6, 1),
                'category' => $category,
            ];
        }

        usort($results, fn ($a, $b) => $b['relevance_score'] <=> $a['relevance_score']);

        return $results;
    }

    public function validateConnection(string $url): bool
    {
        return str_contains($url, 'twitter.com') || str_contains($url, 'x.com');
    }
}

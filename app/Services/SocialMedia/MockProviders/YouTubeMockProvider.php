<?php

namespace App\Services\SocialMedia\MockProviders;

use App\Services\SocialMedia\Contracts\SocialMediaPlatformInterface;

class YouTubeMockProvider implements SocialMediaPlatformInterface
{
    public function fetchProfile(string $username): array
    {
        return [
            'channel_id' => 'UC'.fake()->regexify('[A-Za-z0-9_-]{22}'),
            'channel_name' => $username,
            'subscriber_count' => fake()->numberBetween(5000, 500000),
            'video_count' => fake()->numberBetween(20, 200),
            'total_views' => fake()->numberBetween(500000, 10000000),
            'verified' => fake()->boolean(25),
            'description' => fake()->paragraph(),
            'last_synced' => now()->toISOString(),
        ];
    }

    public function fetchMetrics(string $username): array
    {
        return [
            'avg_views' => fake()->numberBetween(1000, 50000),
            'avg_likes' => fake()->numberBetween(50, 5000),
            'avg_comments' => fake()->numberBetween(10, 500),
            'engagement_rate' => fake()->randomFloat(2, 2, 10),
        ];
    }

    public function search(string $query, ?string $category = null): array
    {
        $results = [];
        $count = fake()->numberBetween(5, 15);

        for ($i = 0; $i < $count; $i++) {
            $channelName = fake()->company().' Channel';
            $description = $category
                ? 'Welcome to my channel! I create '.ucfirst($category).' content about '.$query.' and more.'
                : fake()->paragraph();

            $results[] = [
                'channel_id' => 'UC'.fake()->regexify('[A-Za-z0-9_-]{22}'),
                'channel_name' => $channelName,
                'subscriber_count' => fake()->numberBetween(5000, 500000),
                'verified' => fake()->boolean(20),
                'description' => $description,
                'profile_picture_url' => fake()->imageUrl(150, 150, 'business'),
                'relevance_score' => fake()->randomFloat(2, 0.6, 1),
                'category' => $category,
            ];
        }

        usort($results, fn ($a, $b) => $b['relevance_score'] <=> $a['relevance_score']);

        return $results;
    }

    public function validateConnection(string $url): bool
    {
        return str_contains($url, 'youtube.com') || str_contains($url, 'youtu.be');
    }
}

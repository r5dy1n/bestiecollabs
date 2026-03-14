<?php

namespace App\Services\SocialMedia\MockProviders;

use App\Services\SocialMedia\Contracts\SocialMediaPlatformInterface;

class InstagramMockProvider implements SocialMediaPlatformInterface
{
    public function fetchProfile(string $username): array
    {
        return [
            'username' => $username,
            'follower_count' => fake()->numberBetween(10000, 1000000),
            'following_count' => fake()->numberBetween(100, 5000),
            'post_count' => fake()->numberBetween(50, 500),
            'verified' => fake()->boolean(20),
            'bio' => fake()->sentence(),
            'profile_picture_url' => fake()->imageUrl(200, 200, 'people'),
            'last_synced' => now()->toISOString(),
        ];
    }

    public function fetchMetrics(string $username): array
    {
        return [
            'avg_likes' => fake()->numberBetween(100, 50000),
            'avg_comments' => fake()->numberBetween(10, 1000),
            'avg_shares' => fake()->numberBetween(5, 500),
            'engagement_rate' => fake()->randomFloat(2, 1, 15),
        ];
    }

    public function search(string $query, ?string $category = null): array
    {
        $results = [];
        $count = fake()->numberBetween(5, 15);

        for ($i = 0; $i < $count; $i++) {
            $username = fake()->userName();
            $results[] = [
                'username' => $username,
                'display_name' => fake()->name(),
                'follower_count' => fake()->numberBetween(10000, 1000000),
                'verified' => fake()->boolean(15),
                'bio' => $this->generateCategoryBio($query, $category),
                'profile_picture_url' => fake()->imageUrl(150, 150, 'people'),
                'relevance_score' => fake()->randomFloat(2, 0.6, 1),
                'category' => $category,
            ];
        }

        usort($results, fn ($a, $b) => $b['relevance_score'] <=> $a['relevance_score']);

        return $results;
    }

    protected function generateCategoryBio(string $query, ?string $category): string
    {
        $bios = [
            'fashion' => [
                'Fashion enthusiast sharing daily outfit inspo ✨',
                'Style blogger | Sustainable fashion advocate',
                'Your go-to for trendy looks and fashion tips 👗',
            ],
            'beauty' => [
                'Makeup artist | Beauty content creator 💄',
                'Skincare junkie sharing product reviews',
                'Glam looks & beauty tutorials daily',
            ],
            'fitness' => [
                'Personal trainer | Fitness coach 💪',
                'Helping you reach your fitness goals',
                'Workout tips & healthy living advocate',
            ],
            'food' => [
                'Food blogger | Recipe developer 🍳',
                'Sharing delicious recipes & food adventures',
                'Home cook creating easy, tasty meals',
            ],
            'travel' => [
                'Travel blogger exploring the world ✈️',
                'Wanderlust | Travel tips & destination guides',
                'Adventure seeker sharing travel inspiration',
            ],
            'tech' => [
                'Tech reviewer | Gadget enthusiast 💻',
                'Latest tech news and product reviews',
                'Helping you navigate the tech world',
            ],
            'gaming' => [
                'Gamer | Content creator 🎮',
                'Streaming daily & sharing gaming tips',
                'Competitive player & game reviewer',
            ],
        ];

        if ($category && isset($bios[$category])) {
            return fake()->randomElement($bios[$category]);
        }

        return fake()->sentence().' | Content about '.$query;
    }
}

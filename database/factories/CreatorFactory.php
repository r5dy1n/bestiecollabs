<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Creator>
 */
class CreatorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Fashion', 'Beauty', 'Fitness', 'Food', 'Tech', 'Lifestyle', 'Travel', 'Home'];
        $ageMin = fake()->numberBetween(18, 45);
        $languages = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese'];

        return [
            'creator_name' => fake()->name(),
            'description' => fake()->paragraphs(3, true),
            'instagram_url' => fake()->optional(0.9)->url(),
            'tiktok_url' => fake()->optional(0.8)->url(),
            'youtube_url' => fake()->optional(0.7)->url(),
            'twitter_url' => fake()->optional(0.6)->url(),
            'category_primary' => fake()->randomElement($categories),
            'category_secondary' => fake()->optional(0.6)->randomElement($categories),
            'category_tertiary' => fake()->optional(0.3)->randomElement($categories),
            'followers_demographs' => [
                'instagram' => [
                    'gender' => [
                        'male' => fake()->numberBetween(20, 80),
                        'female' => fake()->numberBetween(20, 80),
                    ],
                    'age_ranges' => [
                        '18-24' => fake()->numberBetween(10, 40),
                        '25-34' => fake()->numberBetween(20, 50),
                        '35-44' => fake()->numberBetween(10, 30),
                        '45+' => fake()->numberBetween(5, 20),
                    ],
                    'locations' => [
                        'US' => fake()->numberBetween(40, 90),
                        'other' => fake()->numberBetween(10, 60),
                    ],
                ],
                'tiktok' => [
                    'gender' => [
                        'male' => fake()->numberBetween(20, 80),
                        'female' => fake()->numberBetween(20, 80),
                    ],
                    'age_ranges' => [
                        '18-24' => fake()->numberBetween(30, 60),
                        '25-34' => fake()->numberBetween(15, 40),
                        '35-44' => fake()->numberBetween(5, 20),
                        '45+' => fake()->numberBetween(2, 10),
                    ],
                    'locations' => [
                        'US' => fake()->numberBetween(40, 90),
                        'other' => fake()->numberBetween(10, 60),
                    ],
                ],
            ],
            'follower_age_min' => $ageMin,
            'follower_age_max' => fake()->numberBetween($ageMin + 5, 65),
            'language' => fake()->randomElement($languages),
            'us_based' => fake()->boolean(85),
            'social_metadata' => $this->generateSocialMetadata(),
            'last_synced_at' => fake()->optional(0.8)->dateTimeBetween('-7 days', 'now'),
        ];
    }

    protected function generateSocialMetadata(): array
    {
        $platforms = [];

        if (fake()->boolean(90)) {
            $platforms['instagram'] = [
                'username' => fake()->userName(),
                'follower_count' => fake()->numberBetween(10000, 1000000),
                'following_count' => fake()->numberBetween(100, 5000),
                'post_count' => fake()->numberBetween(50, 500),
                'verified' => fake()->boolean(20),
                'bio' => fake()->sentence(),
                'profile_picture_url' => fake()->imageUrl(200, 200, 'people'),
                'engagement_metrics' => [
                    'avg_likes' => fake()->numberBetween(100, 50000),
                    'avg_comments' => fake()->numberBetween(10, 1000),
                    'avg_shares' => fake()->numberBetween(5, 500),
                ],
                'last_synced' => now()->toISOString(),
            ];
        }

        if (fake()->boolean(80)) {
            $platforms['tiktok'] = [
                'username' => '@'.fake()->userName(),
                'follower_count' => fake()->numberBetween(50000, 2000000),
                'video_count' => fake()->numberBetween(30, 300),
                'total_likes' => fake()->numberBetween(100000, 5000000),
                'verified' => fake()->boolean(15),
                'bio' => fake()->sentence(),
                'engagement_metrics' => [
                    'avg_views' => fake()->numberBetween(10000, 500000),
                    'avg_likes' => fake()->numberBetween(1000, 100000),
                    'avg_comments' => fake()->numberBetween(50, 2000),
                ],
                'last_synced' => now()->toISOString(),
            ];
        }

        if (fake()->boolean(70)) {
            $platforms['youtube'] = [
                'channel_id' => 'UC'.fake()->regexify('[A-Za-z0-9_-]{22}'),
                'channel_name' => fake()->company().' Channel',
                'subscriber_count' => fake()->numberBetween(5000, 500000),
                'video_count' => fake()->numberBetween(20, 200),
                'total_views' => fake()->numberBetween(500000, 10000000),
                'verified' => fake()->boolean(25),
                'description' => fake()->paragraph(),
                'engagement_metrics' => [
                    'avg_views' => fake()->numberBetween(1000, 50000),
                    'avg_likes' => fake()->numberBetween(50, 5000),
                    'avg_comments' => fake()->numberBetween(10, 500),
                ],
                'last_synced' => now()->toISOString(),
            ];
        }

        if (fake()->boolean(60)) {
            $platforms['twitter'] = [
                'username' => '@'.fake()->userName(),
                'follower_count' => fake()->numberBetween(1000, 100000),
                'following_count' => fake()->numberBetween(50, 1000),
                'tweet_count' => fake()->numberBetween(500, 10000),
                'verified' => fake()->boolean(10),
                'bio' => fake()->sentence(),
                'engagement_metrics' => [
                    'avg_retweets' => fake()->numberBetween(5, 500),
                    'avg_likes' => fake()->numberBetween(20, 2000),
                    'avg_replies' => fake()->numberBetween(2, 100),
                ],
                'last_synced' => now()->toISOString(),
            ];
        }

        return $platforms;
    }
}

<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SocialConnection>
 */
class SocialConnectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'platform' => fake()->randomElement(['instagram', 'tiktok', 'youtube', 'twitter']),
            'platform_user_id' => (string) fake()->unique()->numberBetween(100000, 999999),
            'handle' => fake()->userName(),
            'status' => 'connected',
            'access_token' => fake()->sha256(),
            'refresh_token' => fake()->optional()->sha256(),
            'token_expires_at' => now()->addDays(60),
            'metrics_source' => 'oauth',
            'followers' => fake()->numberBetween(1000, 1000000),
            'posts_count' => fake()->numberBetween(10, 5000),
            'engagement_rate' => fake()->randomFloat(4, 0.5, 15.0),
            'platform_metadata' => [],
            'last_sync_at' => fake()->optional(0.8)->dateTimeBetween('-7 days', 'now'),
        ];
    }

    public function disconnected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'disconnected',
            'access_token' => null,
            'refresh_token' => null,
            'token_expires_at' => null,
        ]);
    }

    public function instagram(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => 'instagram',
        ]);
    }

    public function tiktok(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => 'tiktok',
        ]);
    }

    public function youtube(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => 'youtube',
        ]);
    }

    public function twitter(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => 'twitter',
        ]);
    }
}

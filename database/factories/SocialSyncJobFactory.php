<?php

namespace Database\Factories;

use App\Models\Creator;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SocialSyncJob>
 */
class SocialSyncJobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $platform = fake()->randomElement(['instagram', 'tiktok', 'youtube', 'twitter']);
        $status = fake()->randomElement(['completed', 'failed', 'processing', 'pending']);
        $startedAt = fake()->dateTimeBetween('-2 hours', 'now');

        return [
            'creator_id' => Creator::factory(),
            'platform' => $platform,
            'status' => $status,
            'sync_data' => $this->generateSyncData($platform),
            'error_message' => $status === 'failed' ? fake()->sentence() : null,
            'started_at' => $startedAt,
            'completed_at' => in_array($status, ['completed', 'failed'])
                ? fake()->dateTimeBetween($startedAt, 'now')
                : null,
        ];
    }

    protected function generateSyncData(string $platform): array
    {
        return [
            'platform' => $platform,
            'records_synced' => fake()->numberBetween(1, 100),
            'api_calls_made' => fake()->numberBetween(1, 10),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'started_at' => null,
            'completed_at' => null,
        ]);
    }

    public function processing(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'processing',
            'started_at' => now(),
            'completed_at' => null,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'started_at' => fake()->dateTimeBetween('-1 hour', '-30 minutes'),
            'completed_at' => fake()->dateTimeBetween('-30 minutes', 'now'),
            'error_message' => null,
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'started_at' => fake()->dateTimeBetween('-1 hour', '-30 minutes'),
            'completed_at' => fake()->dateTimeBetween('-30 minutes', 'now'),
            'error_message' => fake()->sentence(),
        ]);
    }
}

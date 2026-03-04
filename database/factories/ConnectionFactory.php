<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Connection;
use App\Models\Creator;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConnectionFactory extends Factory
{
    protected $model = Connection::class;

    public function definition(): array
    {
        $connectableType = $this->faker->randomElement([Brand::class, Creator::class]);
        $connectable = $connectableType === Brand::class
            ? Brand::factory()->create()
            : Creator::factory()->create();

        return [
            'connectable_type' => $connectableType,
            'connectable_id' => $connectable->id,
            'status' => $this->faker->randomElement(['pending', 'verified', 'rejected']),
            'connection_type' => $this->faker->randomElement(['instagram', 'tiktok', 'email']),
            'verification_token' => $this->faker->uuid(),
            'verified_at' => null,
            'metadata' => null,
        ];
    }

    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'verified',
            'verified_at' => now(),
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'verified_at' => null,
        ]);
    }
}

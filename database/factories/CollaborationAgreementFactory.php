<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\CollaborationAgreement;
use App\Models\Creator;
use Illuminate\Database\Eloquent\Factories\Factory;

class CollaborationAgreementFactory extends Factory
{
    protected $model = CollaborationAgreement::class;

    public function definition(): array
    {
        return [
            'brand_id' => Brand::factory(),
            'creator_id' => Creator::factory(),
            'status' => $this->faker->randomElement(['draft', 'pending', 'accepted', 'active', 'completed', 'cancelled']),
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'commission_percentage' => $this->faker->randomFloat(2, 5, 30),
            'fixed_payment' => $this->faker->randomFloat(2, 100, 5000),
            'payment_type' => $this->faker->randomElement(['commission', 'fixed', 'hybrid']),
            'content_deliverables' => $this->faker->numberBetween(1, 10),
            'start_date' => now()->addDays(7),
            'end_date' => now()->addDays(37),
            'terms' => [
                'exclusivity' => $this->faker->boolean(),
                'usage_rights' => $this->faker->randomElement(['limited', 'perpetual']),
            ],
            'ai_generated_script' => null,
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'start_date' => now()->subDays(5),
            'end_date' => now()->addDays(25),
        ]);
    }

    public function withScript(): static
    {
        return $this->state(fn (array $attributes) => [
            'ai_generated_script' => $this->faker->paragraphs(5, true),
        ]);
    }
}

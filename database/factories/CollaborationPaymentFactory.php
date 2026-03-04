<?php

namespace Database\Factories;

use App\Models\CollaborationAgreement;
use App\Models\CollaborationPayment;
use Illuminate\Database\Eloquent\Factories\Factory;

class CollaborationPaymentFactory extends Factory
{
    protected $model = CollaborationPayment::class;

    public function definition(): array
    {
        return [
            'agreement_id' => CollaborationAgreement::factory(),
            'amount' => $this->faker->randomFloat(2, 50, 5000),
            'status' => $this->faker->randomElement(['pending', 'processing', 'completed', 'failed', 'refunded']),
            'payment_method' => $this->faker->randomElement(['stripe', 'paypal', 'manual']),
            'transaction_id' => null,
            'paid_at' => null,
            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'paid_at' => now(),
            'transaction_id' => $this->faker->uuid(),
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'paid_at' => null,
            'transaction_id' => null,
        ]);
    }
}

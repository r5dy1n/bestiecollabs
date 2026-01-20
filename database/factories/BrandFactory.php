<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Brand>
 */
class BrandFactory extends Factory
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

        return [
            'brand_name' => fake()->company(),
            'website_url' => fake()->url(),
            'category_primary' => fake()->randomElement($categories),
            'category_secondary' => fake()->optional(0.6)->randomElement($categories),
            'category_tertiary' => fake()->optional(0.3)->randomElement($categories),
            'instagram_url' => fake()->optional(0.8)->url(),
            'tiktok_url' => fake()->optional(0.7)->url(),
            'description' => fake()->paragraphs(3, true),
            'customer_age_min' => $ageMin,
            'customer_age_max' => fake()->numberBetween($ageMin + 5, 65),
            'us_based' => fake()->boolean(85),
        ];
    }
}

<?php

namespace Tests\Feature\Commands;

use App\Models\Brand;
use App\Models\Creator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CalculateAdvancedMetricsTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_calculates_metrics_for_all(): void
    {
        Brand::factory()->count(2)->create();
        Creator::factory()->count(2)->create();

        $this->artisan('metrics:calculate-advanced')
            ->assertSuccessful();
    }

    public function test_command_accepts_brands_only_option(): void
    {
        Brand::factory()->count(2)->create();

        $this->artisan('metrics:calculate-advanced --brands')
            ->assertSuccessful();
    }

    public function test_command_accepts_creators_only_option(): void
    {
        Creator::factory()->count(2)->create();

        $this->artisan('metrics:calculate-advanced --creators')
            ->assertSuccessful();
    }
}

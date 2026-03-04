<?php

namespace App\Console\Commands;

use App\Services\AdvancedMetricsService;
use Illuminate\Console\Command;

class CalculateAdvancedMetrics extends Command
{
    protected $signature = 'metrics:calculate-advanced {--brands : Calculate only brand metrics} {--creators : Calculate only creator metrics}';

    protected $description = 'Calculate advanced metrics for brands and creators (GMV, engagement, followers, etc.)';

    public function __construct(
        private AdvancedMetricsService $metricsService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $brandsOnly = $this->option('brands');
        $creatorsOnly = $this->option('creators');

        if (!$brandsOnly && !$creatorsOnly) {
            // Calculate both
            $this->info('Calculating advanced metrics for all brands and creators...');
            $brandCount = $this->metricsService->calculateAllBrandMetrics();
            $creatorCount = $this->metricsService->calculateAllCreatorMetrics();

            $this->info("Updated metrics for {$brandCount} brands and {$creatorCount} creators.");
        } elseif ($brandsOnly) {
            $this->info('Calculating advanced metrics for brands...');
            $count = $this->metricsService->calculateAllBrandMetrics();
            $this->info("Updated metrics for {$count} brands.");
        } else {
            $this->info('Calculating advanced metrics for creators...');
            $count = $this->metricsService->calculateAllCreatorMetrics();
            $this->info("Updated metrics for {$count} creators.");
        }

        return self::SUCCESS;
    }
}

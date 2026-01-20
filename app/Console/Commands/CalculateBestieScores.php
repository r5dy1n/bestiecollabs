<?php

namespace App\Console\Commands;

use App\Models\Brand;
use App\Models\Creator;
use App\Services\BestieScoreService;
use Illuminate\Console\Command;

class CalculateBestieScores extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bestie:calculate-scores {--brands : Only calculate brand scores} {--creators : Only calculate creator scores}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate and update Bestie Scores for all brands and creators';

    /**
     * Execute the console command.
     */
    public function handle(BestieScoreService $scoreService): int
    {
        $brandsOnly = $this->option('brands');
        $creatorsOnly = $this->option('creators');

        if (! $brandsOnly && ! $creatorsOnly) {
            $this->calculateBrandScores($scoreService);
            $this->calculateCreatorScores($scoreService);
        } elseif ($brandsOnly) {
            $this->calculateBrandScores($scoreService);
        } elseif ($creatorsOnly) {
            $this->calculateCreatorScores($scoreService);
        }

        $this->components->info('Bestie Scores calculated successfully!');

        return Command::SUCCESS;
    }

    /**
     * Calculate scores for all brands.
     */
    protected function calculateBrandScores(BestieScoreService $scoreService): void
    {
        $this->components->task('Calculating brand scores', function () use ($scoreService) {
            $brands = Brand::all();

            foreach ($brands as $brand) {
                $scoreService->updateBrandScore($brand);
            }

            return true;
        });

        $this->components->info('Updated scores for '.Brand::count().' brands');
    }

    /**
     * Calculate scores for all creators.
     */
    protected function calculateCreatorScores(BestieScoreService $scoreService): void
    {
        $this->components->task('Calculating creator scores', function () use ($scoreService) {
            $creators = Creator::all();

            foreach ($creators as $creator) {
                $scoreService->updateCreatorScore($creator);
            }

            return true;
        });

        $this->components->info('Updated scores for '.Creator::count().' creators');
    }
}

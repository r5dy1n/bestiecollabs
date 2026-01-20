<?php

namespace App\Console\Commands;

use App\Models\Brand;
use App\Models\BrandCreatorMatch;
use App\Models\Creator;
use App\Services\MatchScoreService;
use Illuminate\Console\Command;

class CalculateMatchScores extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'match:calculate-scores {--fresh : Clear existing matches before calculating} {--threshold=2.0 : Minimum match score to store (default: 2.0)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate and store match scores between all brands and creators';

    /**
     * Execute the console command.
     */
    public function handle(MatchScoreService $matchService): int
    {
        $fresh = $this->option('fresh');
        $threshold = (float) $this->option('threshold');

        if ($fresh) {
            $this->components->task('Clearing existing matches', function () {
                BrandCreatorMatch::truncate();

                return true;
            });
        }

        $brands = Brand::all();
        $creators = Creator::all();

        if ($brands->isEmpty() || $creators->isEmpty()) {
            $this->components->warn('No brands or creators found. Please add brands and creators first.');

            return Command::FAILURE;
        }

        $this->components->info('Calculating match scores for '.$brands->count().' brands and '.$creators->count().' creators...');

        $totalMatches = 0;
        $storedMatches = 0;

        $progressBar = $this->output->createProgressBar($brands->count() * $creators->count());
        $progressBar->start();

        foreach ($brands as $brand) {
            foreach ($creators as $creator) {
                $totalMatches++;

                $matchScore = $matchService->calculateMatchScore($brand, $creator);

                // Only store matches that meet the threshold
                if ($matchScore >= $threshold) {
                    BrandCreatorMatch::updateOrCreate(
                        [
                            'brand_id' => $brand->id,
                            'creator_id' => $creator->id,
                        ],
                        [
                            'match_score' => $matchScore,
                            'age_overlap_score' => $matchService->calculateAgeOverlap($brand, $creator),
                            'category_alignment_score' => $matchService->calculateCategoryAlignment($brand, $creator),
                            'geographic_compatibility_score' => $matchService->calculateGeographicCompatibility($brand, $creator),
                            'quality_threshold_score' => $matchService->calculateQualityThreshold($brand, $creator),
                        ]
                    );

                    $storedMatches++;
                }

                $progressBar->advance();
            }
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->components->info('Calculated '.$totalMatches.' total match combinations');
        $this->components->info('Stored '.$storedMatches.' matches meeting threshold of '.$threshold);

        $averageMatchesPerBrand = $brands->count() > 0 ? round($storedMatches / $brands->count(), 1) : 0;
        $averageMatchesPerCreator = $creators->count() > 0 ? round($storedMatches / $creators->count(), 1) : 0;

        $this->components->info('Average matches per brand: '.$averageMatchesPerBrand);
        $this->components->info('Average matches per creator: '.$averageMatchesPerCreator);

        return Command::SUCCESS;
    }
}

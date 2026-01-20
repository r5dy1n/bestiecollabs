<?php

namespace App\Jobs;

use App\Models\Creator;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncAllCreators implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public ?int $batchSize = null
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $batchSize = $this->batchSize ?? config('social-media.sync.batch_size', 50);

        Creator::query()
            ->whereNotNull('instagram_url')
            ->orWhereNotNull('tiktok_url')
            ->orWhereNotNull('youtube_url')
            ->orWhereNotNull('twitter_url')
            ->chunk($batchSize, function ($creators) {
                foreach ($creators as $creator) {
                    SyncCreatorSocialMedia::dispatch($creator);
                }
            });
    }
}

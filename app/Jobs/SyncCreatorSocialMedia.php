<?php

namespace App\Jobs;

use App\Models\Creator;
use App\Models\SocialSyncJob;
use App\Services\SocialMediaService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncCreatorSocialMedia implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Creator $creator,
        public ?array $platforms = null
    ) {}

    /**
     * Execute the job.
     */
    public function handle(SocialMediaService $service): void
    {
        $platforms = $this->platforms ?? ['instagram', 'tiktok', 'youtube', 'twitter'];

        foreach ($platforms as $platform) {
            $syncJob = SocialSyncJob::create([
                'creator_id' => $this->creator->id,
                'platform' => $platform,
                'status' => 'processing',
                'started_at' => now(),
            ]);

            try {
                $result = $service->syncPlatform($this->creator, $platform);

                $syncJob->update([
                    'status' => 'completed',
                    'sync_data' => $result,
                    'completed_at' => now(),
                ]);
            } catch (\Exception $e) {
                $syncJob->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                    'completed_at' => now(),
                ]);
            }
        }
    }
}

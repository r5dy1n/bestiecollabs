<?php

namespace App\Console\Commands;

use App\Jobs\SyncAllCreators;
use App\Jobs\SyncCreatorSocialMedia;
use App\Models\Creator;
use Illuminate\Console\Command;

class SyncCreatorSocialData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'social:sync {--creators=* : Specific creator IDs to sync} {--all : Sync all creators}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync social media data for creators';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if ($this->option('all')) {
            $this->info('Dispatching bulk sync job for all creators...');
            SyncAllCreators::dispatch();
            $this->info('Bulk sync job dispatched successfully.');

            return self::SUCCESS;
        }

        $creatorIds = $this->option('creators');

        if (empty($creatorIds)) {
            $this->error('Please specify creator IDs with --creators or use --all');

            return self::FAILURE;
        }

        foreach ($creatorIds as $creatorId) {
            $creator = Creator::find($creatorId);

            if (! $creator) {
                $this->warn("Creator with ID {$creatorId} not found. Skipping.");

                continue;
            }

            $this->info("Dispatching sync job for creator: {$creator->creator_name}");
            SyncCreatorSocialMedia::dispatch($creator);
        }

        $this->info('Sync jobs dispatched successfully.');

        return self::SUCCESS;
    }
}

<?php

namespace App\Jobs;

use App\Models\CreatorEarning;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class TransitionHeldEarningsToAvailable implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        CreatorEarning::heldAndExpired()->chunkById(100, function ($earnings): void {
            $ids = $earnings->pluck('id')->all();
            CreatorEarning::whereIn('id', $ids)->update(['status' => 'available']);
        });
    }
}

<?php

namespace App\Jobs;

use App\Models\Creator;
use App\Models\CreatorEarning;
use App\Models\CreatorPayout;
use App\Services\StripeService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class ProcessCreatorPayouts implements ShouldQueue
{
    use Queueable;

    public function handle(StripeService $stripeService): void
    {
        $creatorIds = CreatorEarning::available()
            ->select('creator_id')
            ->distinct()
            ->pluck('creator_id');

        foreach ($creatorIds as $creatorId) {
            $creator = Creator::with('payoutAccount')->find($creatorId);

            if (! $creator?->payoutAccount?->payouts_enabled) {
                continue;
            }

            DB::transaction(function () use ($creator, $stripeService): void {
                $earnings = CreatorEarning::available()
                    ->where('creator_id', $creator->id)
                    ->lockForUpdate()
                    ->get();

                if ($earnings->isEmpty()) {
                    return;
                }

                $totalAmount = $earnings->sum('amount');

                $payout = CreatorPayout::create([
                    'creator_id' => $creator->id,
                    'amount' => $totalAmount,
                    'fee' => 0,
                    'net_amount' => $totalAmount,
                    'type' => 'standard',
                    'status' => 'pending',
                ]);

                CreatorEarning::whereIn('id', $earnings->pluck('id'))
                    ->update(['status' => 'paid_out', 'payout_id' => $payout->id]);

                try {
                    $stripeService->createTransfer($payout);
                } catch (\RuntimeException) {
                    // status already set to failed in service
                }
            });
        }
    }
}

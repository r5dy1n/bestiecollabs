<?php

namespace App\Jobs;

use App\Models\BrandInvoice;
use App\Services\StripeService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessMonthlyBrandBilling implements ShouldQueue
{
    use Queueable;

    public function handle(StripeService $stripeService): void
    {
        $lastMonth = now()->subMonth();

        BrandInvoice::with('brand.billingAccount')
            ->where('status', 'open')
            ->whereYear('billing_period_start', $lastMonth->year)
            ->whereMonth('billing_period_start', $lastMonth->month)
            ->each(function (BrandInvoice $invoice) use ($stripeService): void {
                $account = $invoice->brand->billingAccount;

                if (! $account?->payment_method_id) {
                    return;
                }

                $invoice->recalculateTotals();

                try {
                    $stripeService->chargeInvoice($invoice);
                } catch (\RuntimeException) {
                    // status already set to failed in service
                }
            });
    }
}

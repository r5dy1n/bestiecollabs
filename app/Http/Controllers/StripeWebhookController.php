<?php

namespace App\Http\Controllers;

use App\Models\BrandInvoice;
use App\Models\CreatorPayout;
use App\Models\CreatorPayoutAccount;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StripeWebhookController extends Controller
{
    public function handle(Request $request): Response
    {
        $payload = $request->getContent();
        $sig = $request->header('Stripe-Signature', '');

        try {
            $event = app(StripeService::class)->constructWebhookEvent($payload, $sig);
        } catch (\RuntimeException) {
            return response('Invalid signature', 400);
        }

        match ($event->type) {
            'payment_intent.succeeded' => $this->handlePaymentIntentSucceeded($event->data->object),
            'payment_intent.payment_failed' => $this->handlePaymentIntentFailed($event->data->object),
            'account.updated' => $this->handleAccountUpdated($event->data->object),
            'payout.paid' => $this->handlePayoutPaid($event->data->object),
            'payout.failed' => $this->handlePayoutFailed($event->data->object),
            default => null,
        };

        return response('', 200);
    }

    private function handlePaymentIntentSucceeded(object $paymentIntent): void
    {
        BrandInvoice::where('stripe_payment_intent_id', $paymentIntent->id)
            ->update(['status' => 'paid', 'paid_at' => now()]);
    }

    private function handlePaymentIntentFailed(object $paymentIntent): void
    {
        BrandInvoice::where('stripe_payment_intent_id', $paymentIntent->id)
            ->update(['status' => 'failed']);
    }

    private function handleAccountUpdated(object $account): void
    {
        $payoutAccount = CreatorPayoutAccount::where('stripe_account_id', $account->id)->first();

        if (! $payoutAccount) {
            return;
        }

        $payoutAccount->update([
            'charges_enabled' => $account->charges_enabled,
            'payouts_enabled' => $account->payouts_enabled,
            'onboarding_complete' => $account->details_submitted,
        ]);
    }

    private function handlePayoutPaid(object $payout): void
    {
        CreatorPayout::where('stripe_payout_id', $payout->id)
            ->update(['status' => 'paid']);
    }

    private function handlePayoutFailed(object $payout): void
    {
        CreatorPayout::where('stripe_payout_id', $payout->id)
            ->update(['status' => 'failed', 'failure_message' => $payout->failure_message ?? null]);
    }
}

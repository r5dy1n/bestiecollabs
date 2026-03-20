<?php

namespace App\Services;

use App\Models\Brand;
use App\Models\BrandBillingAccount;
use App\Models\BrandInvoice;
use App\Models\Creator;
use App\Models\CreatorPayout;
use App\Models\CreatorPayoutAccount;
use Stripe\Account;
use Stripe\Customer;
use Stripe\Event;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\Payout;
use Stripe\SetupIntent;
use Stripe\StripeClient;
use Stripe\Transfer;
use Stripe\Webhook;

class StripeService
{
    public function __construct(private StripeClient $stripe) {}

    public function createCustomer(Brand $brand): Customer
    {
        try {
            $customer = $this->stripe->customers->create([
                'name' => $brand->brand_name,
                'email' => $brand->user?->email,
            ]);

            $brand->billingAccount()->updateOrCreate(
                ['brand_id' => $brand->id],
                ['stripe_customer_id' => $customer->id]
            );

            return $customer;
        } catch (ApiErrorException $e) {
            throw new \RuntimeException("Stripe createCustomer failed: {$e->getMessage()}", 0, $e);
        }
    }

    public function createSetupIntent(BrandBillingAccount $account): SetupIntent
    {
        try {
            return $this->stripe->setupIntents->create([
                'customer' => $account->stripe_customer_id,
                'payment_method_types' => ['card', 'us_bank_account'],
            ]);
        } catch (ApiErrorException $e) {
            throw new \RuntimeException("Stripe createSetupIntent failed: {$e->getMessage()}", 0, $e);
        }
    }

    public function attachPaymentMethod(BrandBillingAccount $account, string $pmId): void
    {
        try {
            $pm = $this->stripe->paymentMethods->retrieve($pmId);
            $this->stripe->paymentMethods->attach($pmId, ['customer' => $account->stripe_customer_id]);

            $isAch = $pm->type === 'us_bank_account';

            $account->update([
                'payment_method_id' => $pmId,
                'payment_method_type' => $pm->type === 'card' ? 'card' : 'us_bank_account',
                'ach_discount_eligible' => $isAch,
            ]);
        } catch (ApiErrorException $e) {
            throw new \RuntimeException("Stripe attachPaymentMethod failed: {$e->getMessage()}", 0, $e);
        }
    }

    public function detachPaymentMethod(BrandBillingAccount $account): void
    {
        try {
            if ($account->payment_method_id) {
                $this->stripe->paymentMethods->detach($account->payment_method_id);
            }

            $account->update([
                'payment_method_id' => null,
                'payment_method_type' => null,
                'ach_discount_eligible' => false,
            ]);
        } catch (ApiErrorException $e) {
            throw new \RuntimeException("Stripe detachPaymentMethod failed: {$e->getMessage()}", 0, $e);
        }
    }

    public function chargeInvoice(BrandInvoice $invoice): PaymentIntent
    {
        try {
            $account = $invoice->brand->billingAccount;

            $paymentIntent = $this->stripe->paymentIntents->create([
                'amount' => (int) ($invoice->total * 100),
                'currency' => 'usd',
                'customer' => $account->stripe_customer_id,
                'payment_method' => $account->payment_method_id,
                'off_session' => true,
                'confirm' => true,
                'description' => "Invoice {$invoice->id} — {$invoice->billing_period_start} to {$invoice->billing_period_end}",
            ]);

            $invoice->update([
                'stripe_payment_intent_id' => $paymentIntent->id,
                'status' => $paymentIntent->status === 'succeeded' ? 'paid' : 'open',
                'paid_at' => $paymentIntent->status === 'succeeded' ? now() : null,
            ]);

            return $paymentIntent;
        } catch (ApiErrorException $e) {
            $invoice->update(['status' => 'failed']);
            throw new \RuntimeException("Stripe chargeInvoice failed: {$e->getMessage()}", 0, $e);
        }
    }

    public function createConnectAccount(Creator $creator): Account
    {
        try {
            $account = $this->stripe->accounts->create([
                'type' => 'express',
                'email' => $creator->user?->email,
            ]);

            $creator->payoutAccount()->updateOrCreate(
                ['creator_id' => $creator->id],
                ['stripe_account_id' => $account->id]
            );

            return $account;
        } catch (ApiErrorException $e) {
            throw new \RuntimeException("Stripe createConnectAccount failed: {$e->getMessage()}", 0, $e);
        }
    }

    public function createAccountLink(CreatorPayoutAccount $account, string $return, string $refresh): string
    {
        try {
            $link = $this->stripe->accountLinks->create([
                'account' => $account->stripe_account_id,
                'refresh_url' => $refresh,
                'return_url' => $return,
                'type' => 'account_onboarding',
            ]);

            return $link->url;
        } catch (ApiErrorException $e) {
            throw new \RuntimeException("Stripe createAccountLink failed: {$e->getMessage()}", 0, $e);
        }
    }

    public function syncAccountStatus(CreatorPayoutAccount $account): void
    {
        try {
            $stripeAccount = $this->stripe->accounts->retrieve($account->stripe_account_id);

            $account->update([
                'charges_enabled' => $stripeAccount->charges_enabled,
                'payouts_enabled' => $stripeAccount->payouts_enabled,
                'onboarding_complete' => $stripeAccount->details_submitted,
            ]);
        } catch (ApiErrorException $e) {
            throw new \RuntimeException("Stripe syncAccountStatus failed: {$e->getMessage()}", 0, $e);
        }
    }

    public function createTransfer(CreatorPayout $payout): Transfer
    {
        try {
            $stripeAccountId = $payout->creator->payoutAccount->stripe_account_id;

            $transfer = $this->stripe->transfers->create([
                'amount' => (int) ($payout->net_amount * 100),
                'currency' => 'usd',
                'destination' => $stripeAccountId,
            ]);

            $payout->update([
                'stripe_transfer_id' => $transfer->id,
                'status' => 'processing',
            ]);

            return $transfer;
        } catch (ApiErrorException $e) {
            $payout->update(['status' => 'failed', 'failure_message' => $e->getMessage()]);
            throw new \RuntimeException("Stripe createTransfer failed: {$e->getMessage()}", 0, $e);
        }
    }

    public function createInstantPayout(CreatorPayout $payout): Payout
    {
        try {
            $stripeAccountId = $payout->creator->payoutAccount->stripe_account_id;

            $stripePayout = $this->stripe->payouts->create(
                [
                    'amount' => (int) ($payout->net_amount * 100),
                    'currency' => 'usd',
                    'method' => 'instant',
                ],
                ['stripe_account' => $stripeAccountId]
            );

            $payout->update([
                'stripe_payout_id' => $stripePayout->id,
                'status' => 'processing',
            ]);

            return $stripePayout;
        } catch (ApiErrorException $e) {
            $payout->update(['status' => 'failed', 'failure_message' => $e->getMessage()]);
            throw new \RuntimeException("Stripe createInstantPayout failed: {$e->getMessage()}", 0, $e);
        }
    }

    public function constructWebhookEvent(string $payload, string $sig): Event
    {
        try {
            return Webhook::constructEvent(
                $payload,
                $sig,
                config('services.stripe.webhook_secret')
            );
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            throw new \RuntimeException("Stripe webhook signature invalid: {$e->getMessage()}", 0, $e);
        }
    }
}

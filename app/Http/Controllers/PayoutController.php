<?php

namespace App\Http\Controllers;

use App\Http\Requests\RequestInstantPayoutRequest;
use App\Models\CreatorEarning;
use App\Models\CreatorPayout;
use App\Services\StripeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayoutController extends Controller
{
    public function index(Request $request): Response
    {
        abort_if(! $request->user()->isCreator(), 403);

        $creator = $request->user()->creator;

        abort_if(! $creator, 404);

        $payoutAccount = $creator->payoutAccount;

        $availableBalance = CreatorEarning::available()->where('creator_id', $creator->id)->sum('amount');
        $heldBalance = $creator->earnings()->where('status', 'held')->sum('amount');
        $pendingBalance = $creator->earnings()->where('status', 'pending_approval')->sum('amount');

        $payouts = $creator->payouts()->orderByDesc('created_at')->paginate(15);

        return Inertia::render('Payouts/Index', [
            'payout_account' => $payoutAccount,
            'available_balance' => $availableBalance,
            'held_balance' => $heldBalance,
            'pending_balance' => $pendingBalance,
            'payouts' => $payouts,
        ]);
    }

    public function onboard(Request $request): RedirectResponse
    {
        abort_if(! $request->user()->isCreator(), 403);

        $creator = $request->user()->creator;

        abort_if(! $creator, 404);

        $stripeService = app(StripeService::class);

        if (! $creator->payoutAccount?->stripe_account_id) {
            $stripeService->createConnectAccount($creator);
        }

        $payoutAccount = $creator->fresh()->payoutAccount;
        $url = $stripeService->createAccountLink(
            $payoutAccount,
            route('payouts.onboard.return'),
            route('payouts.onboard.refresh')
        );

        return redirect($url);
    }

    public function onboardReturn(Request $request): RedirectResponse
    {
        abort_if(! $request->user()->isCreator(), 403);

        $creator = $request->user()->creator;

        abort_if(! $creator, 404);

        if ($creator->payoutAccount) {
            app(StripeService::class)->syncAccountStatus($creator->payoutAccount);
        }

        return redirect()->route('payouts.index')->with('success', 'Your Stripe account has been connected.');
    }

    public function onboardRefresh(Request $request): RedirectResponse
    {
        abort_if(! $request->user()->isCreator(), 403);

        $creator = $request->user()->creator;

        abort_if(! $creator, 404);

        $payoutAccount = $creator->payoutAccount;

        $url = app(StripeService::class)->createAccountLink(
            $payoutAccount,
            route('payouts.onboard.return'),
            route('payouts.onboard.refresh')
        );

        return redirect($url);
    }

    public function requestInstant(RequestInstantPayoutRequest $request): RedirectResponse
    {
        $creator = $request->user()->creator;

        abort_if(! $creator, 404);

        $availableBalance = (float) CreatorEarning::available()
            ->where('creator_id', $creator->id)
            ->sum('amount');

        abort_if($availableBalance <= 0, 422, 'No available balance to pay out.');

        $feePercent = (float) config('services.stripe.instant_payout_fee_percent', 1.5);
        $fee = round($availableBalance * $feePercent / 100, 2);
        $netAmount = round($availableBalance - $fee, 2);

        $payout = CreatorPayout::create([
            'creator_id' => $creator->id,
            'amount' => $availableBalance,
            'fee' => $fee,
            'net_amount' => $netAmount,
            'type' => 'instant',
            'status' => 'pending',
        ]);

        CreatorEarning::available()
            ->where('creator_id', $creator->id)
            ->update(['status' => 'paid_out', 'payout_id' => $payout->id]);

        try {
            app(StripeService::class)->createInstantPayout($payout);
        } catch (\RuntimeException) {
            // status already set to failed in service
        }

        return redirect()->back();
    }
}

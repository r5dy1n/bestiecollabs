<?php

namespace App\Http\Controllers;

use App\Http\Requests\AttachPaymentMethodRequest;
use App\Services\StripeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        abort_if(! $request->user()->isBrand(), 403);

        $brand = $request->user()->brand;

        abort_if(! $brand, 404);

        $billingAccount = $brand->billingAccount;
        $invoices = $brand->invoices()->orderByDesc('billing_period_start')->paginate(10);

        return Inertia::render('Payments/Index', [
            'billing_account' => $billingAccount,
            'invoices' => $invoices,
            'stripe_publishable_key' => config('services.stripe.key'),
        ]);
    }

    public function createSetupIntent(Request $request): JsonResponse
    {
        abort_if(! $request->user()->isBrand(), 403);

        $brand = $request->user()->brand;

        abort_if(! $brand, 404);

        $billingAccount = $brand->billingAccount;

        $stripeService = app(StripeService::class);

        if (! $billingAccount?->stripe_customer_id) {
            $stripeService->createCustomer($brand);
            $billingAccount = $brand->fresh()->billingAccount;
        }

        $setupIntent = $stripeService->createSetupIntent($billingAccount);

        return response()->json(['client_secret' => $setupIntent->client_secret]);
    }

    public function attachPaymentMethod(AttachPaymentMethodRequest $request): RedirectResponse
    {
        $brand = $request->user()->brand;

        abort_if(! $brand, 404);

        $billingAccount = $brand->billingAccount;

        if (! $billingAccount?->stripe_customer_id) {
            app(StripeService::class)->createCustomer($brand);
            $billingAccount = $brand->fresh()->billingAccount;
        }

        app(StripeService::class)->attachPaymentMethod($billingAccount, $request->input('payment_method_id'));

        return redirect()->back();
    }

    public function deletePaymentMethod(Request $request): RedirectResponse
    {
        abort_if(! $request->user()->isBrand(), 403);

        $brand = $request->user()->brand;

        abort_if(! $brand, 404);

        $billingAccount = $brand->billingAccount;

        if ($billingAccount) {
            app(StripeService::class)->detachPaymentMethod($billingAccount);
        }

        return redirect()->back();
    }
}

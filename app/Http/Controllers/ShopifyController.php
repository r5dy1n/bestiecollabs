<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDiscountRequest;
use App\Models\ShopifyConnection;
use App\Services\ShopifyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ShopifyController extends Controller
{
    public function __construct(private ShopifyService $shopifyService) {}

    public function connect(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        $request->validate([
            'shop_domain' => ['required', 'string', 'regex:/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/'],
        ]);

        $state = Str::random(40);
        $request->session()->put('shopify_state', $state);
        $request->session()->put('shopify_shop_domain', $request->input('shop_domain'));

        $authorizationUrl = $this->shopifyService->getAuthorizationUrl(
            $request->input('shop_domain'),
            $state,
        );

        return Inertia::location($authorizationUrl);
    }

    public function callback(Request $request): RedirectResponse
    {
        if (! $this->shopifyService->validateCallback($request->query())) {
            return redirect()->route('dashboard')->with('error', 'Invalid Shopify callback. Please try again.');
        }

        $sessionState = $request->session()->pull('shopify_state');
        $shopDomain = $request->session()->pull('shopify_shop_domain');

        if (! $sessionState || $request->query('state') !== $sessionState) {
            return redirect()->route('dashboard')->with('error', 'Invalid state parameter. Please try again.');
        }

        try {
            $tokenData = $this->shopifyService->exchangeCodeForToken(
                $shopDomain,
                $request->query('code'),
            );

            ShopifyConnection::query()->updateOrCreate(
                ['user_id' => $request->user()->id],
                [
                    'shop_domain' => $shopDomain,
                    'access_token' => $tokenData['access_token'],
                    'scopes' => $tokenData['scope'],
                ],
            );

            return redirect()->route('dashboard')->with('success', 'Shopify store connected successfully!');
        } catch (\Exception $e) {
            return redirect()->route('dashboard')->with('error', 'Failed to connect Shopify store. Please try again.');
        }
    }

    public function disconnect(Request $request): RedirectResponse
    {
        $request->user()->shopifyConnection()?->delete();

        return redirect()->route('dashboard')->with('success', 'Shopify store disconnected.');
    }

    public function storeDiscount(StoreDiscountRequest $request): \Illuminate\Http\JsonResponse
    {
        $connection = $request->user()->shopifyConnection;

        if (! $connection || ! $connection->hasScope('write_price_rules')) {
            return response()->json(['message' => 'Your Shopify connection does not have permission to create discounts.'], 403);
        }

        try {
            $result = $this->shopifyService->createDiscountCode($connection, $request->validated());

            return response()->json([
                'message' => "Discount code \"{$result['code']}\" created successfully!",
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create discount code. '.$e->getMessage()], 500);
        }
    }
}

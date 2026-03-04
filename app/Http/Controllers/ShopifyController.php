<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDiscountRequest;
use App\Http\Requests\StoreDraftOrderRequest;
use App\Models\ShopifyConnection;
use App\Services\ShopifyService;
use Illuminate\Http\JsonResponse;
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

    public function storeDiscount(StoreDiscountRequest $request): JsonResponse
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

    public function syncOrders(Request $request): JsonResponse
    {
        $connection = $request->user()->shopifyConnection;

        if (! $connection || ! $connection->hasScope('read_orders')) {
            return response()->json(['message' => 'Your Shopify connection does not have permission to read orders.'], 403);
        }

        try {
            $count = $this->shopifyService->syncOrders($connection);

            return response()->json([
                'message' => "Successfully synced {$count} orders.",
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to sync orders. '.$e->getMessage()], 500);
        }
    }

    public function syncCustomers(Request $request): JsonResponse
    {
        $connection = $request->user()->shopifyConnection;

        if (! $connection || ! $connection->hasScope('read_customers')) {
            return response()->json(['message' => 'Your Shopify connection does not have permission to read customers.'], 403);
        }

        try {
            $count = $this->shopifyService->syncCustomers($connection);

            return response()->json([
                'message' => "Successfully synced {$count} customers.",
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to sync customers. '.$e->getMessage()], 500);
        }
    }

    public function getAnalytics(Request $request): JsonResponse
    {
        $connection = $request->user()->shopifyConnection;

        if (! $connection || ! $connection->hasScope('read_orders')) {
            return response()->json(['message' => 'Your Shopify connection does not have permission to read orders.'], 403);
        }

        try {
            $analytics = $this->shopifyService->getSalesAnalytics($connection);

            return response()->json($analytics);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch analytics. '.$e->getMessage()], 500);
        }
    }

    public function getCustomerDemographics(Request $request): JsonResponse
    {
        $connection = $request->user()->shopifyConnection;

        if (! $connection || ! $connection->hasScope('read_customers')) {
            return response()->json(['message' => 'Your Shopify connection does not have permission to read customers.'], 403);
        }

        try {
            $demographics = $this->shopifyService->getCustomerDemographics($connection);

            return response()->json($demographics);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch demographics. '.$e->getMessage()], 500);
        }
    }

    public function storeDraftOrder(StoreDraftOrderRequest $request): JsonResponse
    {
        $connection = $request->user()->shopifyConnection;

        if (! $connection || ! $connection->hasScope('write_orders')) {
            return response()->json(['message' => 'Your Shopify connection does not have permission to create orders.'], 403);
        }

        try {
            $result = $this->shopifyService->createDraftOrder($connection, $request->validated());

            return response()->json([
                'message' => 'Draft order created successfully!',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create draft order. '.$e->getMessage()], 500);
        }
    }

    public function getProducts(Request $request): JsonResponse
    {
        $connection = $request->user()->shopifyConnection;

        if (! $connection || ! $connection->hasScope('read_products')) {
            return response()->json(['message' => 'Your Shopify connection does not have permission to read products.'], 403);
        }

        try {
            $products = $this->shopifyService->getProducts($connection);

            return response()->json(['products' => $products]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch products. '.$e->getMessage()], 500);
        }
    }
}

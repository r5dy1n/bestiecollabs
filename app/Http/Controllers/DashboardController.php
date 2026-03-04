<?php

namespace App\Http\Controllers;

use App\Services\ShopifyService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private ShopifyService $shopifyService) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $shopifyConnection = null;
        $discounts = [];
        $needsReauthorization = false;
        $salesAnalytics = null;
        $customerDemographics = null;
        $canViewAnalytics = false;
        $canCreateOrders = false;

        if ($user->isBrand()) {
            $connection = $user->shopifyConnection;

            if ($connection) {
                $shopifyConnection = [
                    'id' => $connection->id,
                    'shop_domain' => $connection->shop_domain,
                    'created_at' => $connection->created_at->toISOString(),
                ];

                $needsReauthorization = $connection->needsReauthorization();
                $canViewAnalytics = $connection->hasScope('read_orders') && $connection->hasScope('read_customers');
                $canCreateOrders = $connection->hasScope('write_orders');

                try {
                    $discounts = $this->shopifyService->getDiscountsForConnection($connection);
                } catch (\Exception $e) {
                    $discounts = [];
                }

                if ($canViewAnalytics) {
                    try {
                        $salesAnalytics = $this->shopifyService->getSalesAnalytics($connection);
                        $customerDemographics = $this->shopifyService->getCustomerDemographics($connection);
                    } catch (\Exception $e) {
                        // Silent fail - analytics will be null
                    }
                }
            }
        }

        return Inertia::render('dashboard', [
            'isBrand' => $user->isBrand(),
            'shopifyConnection' => $shopifyConnection,
            'discounts' => $discounts,
            'needsReauthorization' => $needsReauthorization,
            'canCreateDiscounts' => $connection?->hasScope('write_price_rules') ?? false,
            'canViewAnalytics' => $canViewAnalytics,
            'canCreateOrders' => $canCreateOrders,
            'salesAnalytics' => $salesAnalytics,
            'customerDemographics' => $customerDemographics,
        ]);
    }
}

<?php

namespace App\Services;

use App\Models\ShopifyConnection;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class ShopifyService
{
    private const API_VERSION = '2025-01';

    public function getAuthorizationUrl(string $shopDomain, string $state): string
    {
        $params = http_build_query([
            'client_id' => config('services.shopify.api_key'),
            'scope' => config('services.shopify.scopes'),
            'redirect_uri' => url(config('services.shopify.redirect_uri')),
            'state' => $state,
        ]);

        return "https://{$shopDomain}/admin/oauth/authorize?{$params}";
    }

    /**
     * @return array{access_token: string, scope: string}
     */
    public function exchangeCodeForToken(string $shopDomain, string $code): array
    {
        $response = Http::post("https://{$shopDomain}/admin/oauth/access_token", [
            'client_id' => config('services.shopify.api_key'),
            'client_secret' => config('services.shopify.api_secret'),
            'code' => $code,
        ]);

        $response->throw();

        return [
            'access_token' => $response->json('access_token'),
            'scope' => $response->json('scope', ''),
        ];
    }

    public function validateCallback(array $queryParams): bool
    {
        if (empty($queryParams['hmac']) || empty($queryParams['shop'])) {
            return false;
        }

        if (! preg_match('/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/', $queryParams['shop'])) {
            return false;
        }

        $hmac = $queryParams['hmac'];
        $params = collect($queryParams)
            ->except('hmac')
            ->sortKeys()
            ->map(fn ($value, $key) => "{$key}={$value}")
            ->implode('&');

        $calculatedHmac = hash_hmac('sha256', $params, config('services.shopify.api_secret'));

        return hash_equals($calculatedHmac, $hmac);
    }

    /**
     * @return array<int, array{id: string, title: string, type: string, discount_type: string, status: string, codes: string[], value: string, value_type: string, usage_count: int, created_at: string, combines_with: array{order_discounts: bool, product_discounts: bool, shipping_discounts: bool}}>
     */
    public function getDiscountsForConnection(ShopifyConnection $connection): array
    {
        if ($connection->hasScope('read_discounts')) {
            try {
                return $this->getDiscountsViaGraphQL($connection);
            } catch (\RuntimeException) {
                // GraphQL access denied — fall back to REST
            }
        }

        return $this->getDiscountCodesAsDiscounts($connection);
    }

    /**
     * @return array<int, array{id: string, title: string, type: string, discount_type: string, status: string, codes: string[], value: string, value_type: string, usage_count: int, created_at: string, combines_with: array{order_discounts: bool, product_discounts: bool, shipping_discounts: bool}}>
     */
    private function getDiscountsViaGraphQL(ShopifyConnection $connection): array
    {
        $discounts = [];
        $cursor = null;
        $hasNextPage = true;

        while ($hasNextPage) {
            $afterClause = $cursor ? ', after: "'.addslashes($cursor).'"' : '';

            $query = <<<GRAPHQL
            {
                discountNodes(first: 50{$afterClause}) {
                    edges {
                        cursor
                        node {
                            id
                            discount {
                                ... on DiscountCodeBasic {
                                    __typename
                                    title
                                    status
                                    codes(first: 10) { edges { node { code } } }
                                    customerGets {
                                        value {
                                            ... on DiscountPercentage { percentage }
                                            ... on DiscountAmount { amount { amount currencyCode } appliesOnEachItem }
                                        }
                                    }
                                    combinesWith { orderDiscounts productDiscounts shippingDiscounts }
                                    asyncUsageCount
                                    createdAt
                                }
                                ... on DiscountCodeBxgy {
                                    __typename
                                    title
                                    status
                                    codes(first: 10) { edges { node { code } } }
                                    combinesWith { orderDiscounts productDiscounts shippingDiscounts }
                                    asyncUsageCount
                                    createdAt
                                }
                                ... on DiscountCodeFreeShipping {
                                    __typename
                                    title
                                    status
                                    codes(first: 10) { edges { node { code } } }
                                    combinesWith { orderDiscounts productDiscounts shippingDiscounts }
                                    asyncUsageCount
                                    createdAt
                                }
                                ... on DiscountAutomaticBasic {
                                    __typename
                                    title
                                    status
                                    customerGets {
                                        value {
                                            ... on DiscountPercentage { percentage }
                                            ... on DiscountAmount { amount { amount currencyCode } appliesOnEachItem }
                                        }
                                    }
                                    combinesWith { orderDiscounts productDiscounts shippingDiscounts }
                                    asyncUsageCount
                                    createdAt
                                }
                                ... on DiscountAutomaticBxgy {
                                    __typename
                                    title
                                    status
                                    combinesWith { orderDiscounts productDiscounts shippingDiscounts }
                                    asyncUsageCount
                                    createdAt
                                }
                                ... on DiscountAutomaticFreeShipping {
                                    __typename
                                    title
                                    status
                                    combinesWith { orderDiscounts productDiscounts shippingDiscounts }
                                    asyncUsageCount
                                    createdAt
                                }
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                    }
                }
            }
            GRAPHQL;

            $data = $this->executeGraphQL($connection, $query);
            $edges = $data['data']['discountNodes']['edges'] ?? [];

            foreach ($edges as $edge) {
                $cursor = $edge['cursor'];
                $normalized = $this->normalizeGraphQLDiscount($edge['node']);

                if ($normalized) {
                    $discounts[] = $normalized;
                }
            }

            $hasNextPage = $data['data']['discountNodes']['pageInfo']['hasNextPage'] ?? false;
        }

        return $discounts;
    }

    /**
     * @return array{id: string, title: string, type: string, discount_type: string, status: string, codes: string[], value: string, value_type: string, usage_count: int, created_at: string, combines_with: array{order_discounts: bool, product_discounts: bool, shipping_discounts: bool}}|null
     */
    private function normalizeGraphQLDiscount(array $node): ?array
    {
        $discount = $node['discount'] ?? null;

        if (! $discount || ! isset($discount['__typename'])) {
            return null;
        }

        $typename = $discount['__typename'];
        $isCode = str_starts_with($typename, 'DiscountCode');
        $isBasic = str_ends_with($typename, 'Basic');

        $codes = [];
        if ($isCode && isset($discount['codes']['edges'])) {
            foreach ($discount['codes']['edges'] as $codeEdge) {
                $codes[] = $codeEdge['node']['code'];
            }
        }

        $value = '';
        $valueType = 'percentage';
        $isOrderDiscount = false;

        if ($isBasic && isset($discount['customerGets']['value'])) {
            $customerValue = $discount['customerGets']['value'];

            if (isset($customerValue['percentage'])) {
                $value = (string) ($customerValue['percentage'] * 100);
                $valueType = 'percentage';
            } elseif (isset($customerValue['amount']['amount'])) {
                $value = $customerValue['amount']['amount'];
                $valueType = 'fixed_amount';
                $isOrderDiscount = ! ($customerValue['appliesOnEachItem'] ?? true);
            }
        }

        $discountTypeMap = [
            'DiscountCodeBxgy' => 'bxgy',
            'DiscountCodeFreeShipping' => 'free_shipping',
            'DiscountAutomaticBxgy' => 'bxgy',
            'DiscountAutomaticFreeShipping' => 'free_shipping',
        ];

        if (isset($discountTypeMap[$typename])) {
            $discountType = $discountTypeMap[$typename];
            $valueType = $discountType;
        } else {
            $discountType = $isOrderDiscount ? 'amount_off_order' : 'amount_off_products';
        }

        $combinesWith = $discount['combinesWith'] ?? [];

        $summary = match ($discountType) {
            'free_shipping' => 'Free shipping',
            'bxgy' => 'Buy X Get Y',
            'amount_off_order' => $value ? abs((float) $value).($valueType === 'percentage' ? '% off order' : '$ off order') : '',
            default => $value ? abs((float) $value).($valueType === 'percentage' ? '% off products' : '$ off products') : '',
        };

        return [
            'id' => $node['id'],
            'title' => $discount['title'] ?? '',
            'summary' => $summary,
            'type' => $isCode ? 'code' : 'automatic',
            'discount_type' => $discountType,
            'status' => strtolower($discount['status'] ?? 'unknown'),
            'codes' => $codes,
            'value' => $value,
            'value_type' => $valueType,
            'usage_count' => $discount['asyncUsageCount'] ?? 0,
            'created_at' => $discount['createdAt'] ?? '',
            'combines_with' => [
                'order_discounts' => $combinesWith['orderDiscounts'] ?? false,
                'product_discounts' => $combinesWith['productDiscounts'] ?? false,
                'shipping_discounts' => $combinesWith['shippingDiscounts'] ?? false,
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     *
     * @throws \RuntimeException
     */
    private function executeGraphQL(ShopifyConnection $connection, string $query): array
    {
        $url = "https://{$connection->shop_domain}/admin/api/".self::API_VERSION.'/graphql.json';

        $response = Http::withHeaders([
            'X-Shopify-Access-Token' => $connection->access_token,
            'Content-Type' => 'application/json',
        ])->post($url, ['query' => $query]);

        $response->throw();

        $json = $response->json();

        if (! empty($json['errors'])) {
            $message = $json['errors'][0]['message'] ?? 'Unknown GraphQL error';

            throw new \RuntimeException("Shopify GraphQL error: {$message}");
        }

        return $json;
    }

    /**
     * Wraps the legacy REST discount codes in the new unified shape.
     *
     * @return array<int, array{id: string, title: string, type: string, discount_type: string, status: string, codes: string[], value: string, value_type: string, usage_count: int, created_at: string, combines_with: array{order_discounts: bool, product_discounts: bool, shipping_discounts: bool}}>
     */
    private function getDiscountCodesAsDiscounts(ShopifyConnection $connection): array
    {
        $legacyCodes = $this->getDiscountCodes($connection);

        return array_map(function (array $code): array {
            $isFreeShipping = $code['target_type'] === 'shipping_line';

            return [
                'id' => (string) $code['id'],
                'title' => $code['price_rule_title'],
                'summary' => $this->buildRestSummary($code),
                'type' => 'code',
                'discount_type' => $isFreeShipping ? 'free_shipping' : 'amount_off_products',
                'status' => $this->deriveStatusFromDates($code['starts_at'], $code['ends_at']),
                'codes' => [$code['code']],
                'value' => $code['value'],
                'value_type' => $isFreeShipping ? 'free_shipping' : ($code['value_type'] === 'percentage' ? 'percentage' : 'fixed_amount'),
                'usage_count' => $code['usage_count'],
                'created_at' => $code['created_at'],
                'combines_with' => [
                    'order_discounts' => false,
                    'product_discounts' => false,
                    'shipping_discounts' => false,
                ],
            ];
        }, $legacyCodes);
    }

    private function buildRestSummary(array $code): string
    {
        $parts = [];

        if ($code['target_type'] === 'shipping_line') {
            $parts[] = 'Free shipping';
        } elseif ($code['value_type'] === 'percentage') {
            $percentage = abs((float) $code['value']);
            $target = $code['target_selection'] === 'all' ? 'products' : 'selected products';
            $collectionCount = count($code['entitled_collection_ids'] ?? []);

            if ($collectionCount > 0) {
                $target = $collectionCount === 1 ? '1 collection' : "{$collectionCount} collections";
            }

            $parts[] = "{$percentage}% off {$target}";
        } else {
            $amount = number_format(abs((float) $code['value']), 2);
            $parts[] = "\${$amount} off";
        }

        $minQty = $code['prerequisite_quantity_range']['greater_than_or_equal_to'] ?? null;

        if ($minQty) {
            $parts[] = "Minimum quantity of {$minQty}";
        }

        $maxShipping = $code['prerequisite_shipping_price_range']['less_than_or_equal_to'] ?? null;

        if ($maxShipping) {
            $parts[] = 'Shipping rates under $'.number_format((float) $maxShipping, 2);
        }

        if ($code['once_per_customer'] ?? false) {
            $parts[] = 'One use per customer';
        }

        return implode(' • ', $parts);
    }

    private function deriveStatusFromDates(?string $startsAt, ?string $endsAt): string
    {
        $now = Carbon::now();

        if ($startsAt && Carbon::parse($startsAt)->isAfter($now)) {
            return 'scheduled';
        }

        if ($endsAt && Carbon::parse($endsAt)->isBefore($now)) {
            return 'expired';
        }

        return 'active';
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getDiscountCodes(ShopifyConnection $connection): array
    {
        $discountCodes = [];
        $priceRules = $this->fetchAllPriceRules($connection);

        foreach ($priceRules as $priceRule) {
            $codes = $this->fetchDiscountCodesForPriceRule($connection, $priceRule['id']);

            foreach ($codes as $code) {
                $discountCodes[] = [
                    'id' => $code['id'],
                    'code' => $code['code'],
                    'usage_count' => $code['usage_count'] ?? 0,
                    'price_rule_title' => $priceRule['title'],
                    'value' => $priceRule['value'],
                    'value_type' => $priceRule['value_type'],
                    'target_type' => $priceRule['target_type'] ?? 'line_item',
                    'target_selection' => $priceRule['target_selection'] ?? 'all',
                    'once_per_customer' => $priceRule['once_per_customer'] ?? false,
                    'prerequisite_quantity_range' => $priceRule['prerequisite_quantity_range'] ?? null,
                    'prerequisite_shipping_price_range' => $priceRule['prerequisite_shipping_price_range'] ?? null,
                    'entitled_collection_ids' => $priceRule['entitled_collection_ids'] ?? [],
                    'entitled_product_ids' => $priceRule['entitled_product_ids'] ?? [],
                    'starts_at' => $priceRule['starts_at'] ?? null,
                    'ends_at' => $priceRule['ends_at'] ?? null,
                    'created_at' => $code['created_at'],
                ];
            }
        }

        return $discountCodes;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function fetchAllPriceRules(ShopifyConnection $connection): array
    {
        $allRules = [];
        $url = $this->apiUrl($connection->shop_domain, '/price_rules.json?limit=250');

        while ($url) {
            $response = $this->authenticatedRequest($connection, $url);
            $allRules = array_merge($allRules, $response->json('price_rules', []));
            $url = $this->getNextPageUrl($response);
        }

        return $allRules;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function fetchDiscountCodesForPriceRule(ShopifyConnection $connection, int $priceRuleId): array
    {
        $allCodes = [];
        $url = $this->apiUrl($connection->shop_domain, "/price_rules/{$priceRuleId}/discount_codes.json?limit=250");

        while ($url) {
            $response = $this->authenticatedRequest($connection, $url);
            $allCodes = array_merge($allCodes, $response->json('discount_codes', []));
            $url = $this->getNextPageUrl($response);
        }

        return $allCodes;
    }

    /**
     * @return array{price_rule_id: int, discount_code_id: int, code: string}
     *
     * @throws \RuntimeException
     */
    public function createDiscountCode(ShopifyConnection $connection, array $data): array
    {
        $priceRulePayload = [
            'price_rule' => [
                'title' => $data['title'],
                'value' => (string) -abs((float) $data['value']),
                'value_type' => $data['value_type'],
                'target_type' => 'line_item',
                'target_selection' => 'all',
                'allocation_method' => 'across',
                'customer_selection' => 'all',
                'once_per_customer' => $data['once_per_customer'] ?? false,
                'starts_at' => $data['starts_at'],
            ],
        ];

        if (! empty($data['ends_at'])) {
            $priceRulePayload['price_rule']['ends_at'] = $data['ends_at'];
        }

        if (! empty($data['minimum_quantity'])) {
            $priceRulePayload['price_rule']['prerequisite_quantity_range'] = [
                'greater_than_or_equal_to' => (int) $data['minimum_quantity'],
            ];
        }

        $priceRuleUrl = $this->apiUrl($connection->shop_domain, '/price_rules.json');
        $priceRuleResponse = $this->authenticatedPostRequest($connection, $priceRuleUrl, $priceRulePayload);
        $priceRuleId = $priceRuleResponse['price_rule']['id'] ?? null;

        if (! $priceRuleId) {
            throw new \RuntimeException('Failed to create price rule: no ID returned.');
        }

        $discountCodeUrl = $this->apiUrl($connection->shop_domain, "/price_rules/{$priceRuleId}/discount_codes.json");

        try {
            $discountResponse = $this->authenticatedPostRequest($connection, $discountCodeUrl, [
                'discount_code' => [
                    'code' => $data['code'],
                ],
            ]);
        } catch (\Exception $e) {
            $this->authenticatedDeleteRequest(
                $connection,
                $this->apiUrl($connection->shop_domain, "/price_rules/{$priceRuleId}.json"),
            );

            throw new \RuntimeException("Failed to create discount code: {$e->getMessage()}");
        }

        return [
            'price_rule_id' => $priceRuleId,
            'discount_code_id' => $discountResponse['discount_code']['id'],
            'code' => $discountResponse['discount_code']['code'],
        ];
    }

    private function authenticatedRequest(ShopifyConnection $connection, string $url): \Illuminate\Http\Client\Response
    {
        $response = Http::withHeaders([
            'X-Shopify-Access-Token' => $connection->access_token,
        ])->get($url);

        $response->throw();

        return $response;
    }

    /**
     * @return array<string, mixed>
     *
     * @throws \Illuminate\Http\Client\RequestException
     */
    private function authenticatedPostRequest(ShopifyConnection $connection, string $url, array $payload): array
    {
        $response = Http::withHeaders([
            'X-Shopify-Access-Token' => $connection->access_token,
            'Content-Type' => 'application/json',
        ])->post($url, $payload);

        $response->throw();

        return $response->json();
    }

    private function authenticatedDeleteRequest(ShopifyConnection $connection, string $url): void
    {
        Http::withHeaders([
            'X-Shopify-Access-Token' => $connection->access_token,
        ])->delete($url);
    }

    private function apiUrl(string $shopDomain, string $path): string
    {
        return "https://{$shopDomain}/admin/api/".self::API_VERSION.$path;
    }

    private function getNextPageUrl(\Illuminate\Http\Client\Response $response): ?string
    {
        $linkHeader = $response->header('Link');

        if (! $linkHeader) {
            return null;
        }

        if (preg_match('/<([^>]+)>;\s*rel="next"/', $linkHeader, $matches)) {
            return $matches[1];
        }

        return null;
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopifyOrder extends Model
{
    protected $fillable = [
        'shopify_connection_id',
        'shopify_order_id',
        'order_number',
        'email',
        'total_price',
        'subtotal_price',
        'total_discounts',
        'currency',
        'financial_status',
        'fulfillment_status',
        'discount_codes',
        'line_items_count',
        'customer_id',
        'billing_city',
        'billing_province',
        'billing_country',
        'shipping_city',
        'shipping_province',
        'shipping_country',
        'shopify_created_at',
    ];

    protected function casts(): array
    {
        return [
            'discount_codes' => 'array',
            'total_price' => 'decimal:2',
            'subtotal_price' => 'decimal:2',
            'total_discounts' => 'decimal:2',
            'shopify_created_at' => 'datetime',
        ];
    }

    public function shopifyConnection(): BelongsTo
    {
        return $this->belongsTo(ShopifyConnection::class);
    }

    /**
     * @return string[]
     */
    public function getDiscountCodesUsed(): array
    {
        return $this->discount_codes ?? [];
    }
}

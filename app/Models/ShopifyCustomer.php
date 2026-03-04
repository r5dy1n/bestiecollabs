<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopifyCustomer extends Model
{
    protected $fillable = [
        'shopify_connection_id',
        'shopify_customer_id',
        'email',
        'first_name',
        'last_name',
        'orders_count',
        'total_spent',
        'city',
        'province',
        'country',
        'tags',
        'accepts_marketing',
        'shopify_created_at',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'total_spent' => 'decimal:2',
            'accepts_marketing' => 'boolean',
            'shopify_created_at' => 'datetime',
        ];
    }

    public function shopifyConnection(): BelongsTo
    {
        return $this->belongsTo(ShopifyConnection::class);
    }

    public function getFullName(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
}

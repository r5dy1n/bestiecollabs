<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShopifyConnection extends Model
{
    protected $fillable = [
        'user_id',
        'shop_domain',
        'access_token',
        'scopes',
    ];

    protected function casts(): array
    {
        return [
            'access_token' => 'encrypted',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(ShopifyOrder::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(ShopifyCustomer::class);
    }

    public function hasScope(string $scope): bool
    {
        if (! $this->scopes) {
            return false;
        }

        $authorizedScopes = explode(',', $this->scopes);

        return in_array($scope, $authorizedScopes);
    }

    public function needsReauthorization(): bool
    {
        return ! $this->hasScope('read_discounts')
            || ! $this->hasScope('write_price_rules')
            || ! $this->hasScope('read_orders')
            || ! $this->hasScope('read_customers');
    }
}

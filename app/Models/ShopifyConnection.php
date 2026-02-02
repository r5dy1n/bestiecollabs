<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        return ! $this->hasScope('read_discounts') || ! $this->hasScope('write_price_rules');
    }
}

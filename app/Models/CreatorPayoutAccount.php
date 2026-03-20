<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreatorPayoutAccount extends Model
{
    /** @use HasFactory<\Database\Factories\CreatorPayoutAccountFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'creator_id',
        'stripe_account_id',
        'tier',
        'hold_period_days',
        'onboarding_complete',
        'charges_enabled',
        'payouts_enabled',
    ];

    protected function casts(): array
    {
        return [
            'onboarding_complete' => 'boolean',
            'charges_enabled' => 'boolean',
            'payouts_enabled' => 'boolean',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Creator::class);
    }

    public function holdPeriodDaysForTier(): int
    {
        return match ($this->tier) {
            'Tier1' => 15,
            'Tier2' => 7,
            'Tier3' => 3,
            default => 15,
        };
    }

    public function updateTier(string $tier): void
    {
        $this->tier = $tier;
        $this->hold_period_days = $this->holdPeriodDaysForTier();
        $this->save();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CreatorPayout extends Model
{
    /** @use HasFactory<\Database\Factories\CreatorPayoutFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'creator_id',
        'amount',
        'fee',
        'net_amount',
        'type',
        'status',
        'stripe_payout_id',
        'stripe_transfer_id',
        'failure_message',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'fee' => 'decimal:2',
            'net_amount' => 'decimal:2',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Creator::class);
    }

    public function earnings(): HasMany
    {
        return $this->hasMany(CreatorEarning::class, 'payout_id');
    }
}

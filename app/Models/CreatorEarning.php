<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreatorEarning extends Model
{
    /** @use HasFactory<\Database\Factories\CreatorEarningFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'creator_id',
        'collaboration_id',
        'payout_id',
        'amount',
        'status',
        'approved_at',
        'hold_until',
        'reversed_at',
        'reversal_reason',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'approved_at' => 'datetime',
            'hold_until' => 'datetime',
            'reversed_at' => 'datetime',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Creator::class);
    }

    public function collaboration(): BelongsTo
    {
        return $this->belongsTo(Collaboration::class);
    }

    public function payout(): BelongsTo
    {
        return $this->belongsTo(CreatorPayout::class, 'payout_id');
    }

    public function scopeAvailable(Builder $q): void
    {
        $q->where('status', 'available');
    }

    public function scopeHeldAndExpired(Builder $q): void
    {
        $q->where('status', 'held')->where('hold_until', '<=', now());
    }
}

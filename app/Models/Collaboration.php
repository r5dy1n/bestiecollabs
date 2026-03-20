<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Collaboration extends Model
{
    /** @use HasFactory<\Database\Factories\CollaborationFactory> */
    use HasFactory, HasUuids;

    protected $table = 'collaborations';

    protected $fillable = [
        'brand_id',
        'creator_id',
        'status',
        'connection_type',
        'collaboration_type',
        'commission_rate',
        'fixed_payment',
        'currency',
        'agreement_template',
        'deliverables',
        'terms',
        'start_date',
        'end_date',
        'completed_at',
        'posts_delivered',
        'posts_required',
        'total_revenue',
        'commission_earned',
        'payment_status',
        'amount_paid',
        'last_payment_date',
        'notes',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'commission_rate' => 'decimal:2',
            'fixed_payment' => 'decimal:2',
            'total_revenue' => 'decimal:2',
            'commission_earned' => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
            'completed_at' => 'date',
            'last_payment_date' => 'date',
            'posts_delivered' => 'integer',
            'posts_required' => 'integer',
            'metadata' => 'array',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Creator::class);
    }

    public function isConnected(): bool
    {
        return $this->connection_type === 'connected';
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function calculateCommission(float $revenue): float
    {
        if ($this->collaboration_type !== 'commission' || ! $this->commission_rate) {
            return 0.00;
        }

        return round(($revenue * $this->commission_rate) / 100, 2);
    }

    public function addRevenue(float $amount): void
    {
        $this->total_revenue += $amount;
        $this->commission_earned += $this->calculateCommission($amount);
        $this->save();
    }

    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }
}

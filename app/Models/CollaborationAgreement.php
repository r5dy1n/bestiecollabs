<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CollaborationAgreement extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'brand_id',
        'creator_id',
        'status',
        'title',
        'description',
        'commission_percentage',
        'fixed_payment',
        'payment_type',
        'content_deliverables',
        'start_date',
        'end_date',
        'terms',
        'ai_generated_script',
    ];

    protected $casts = [
        'commission_percentage' => 'decimal:2',
        'fixed_payment' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'terms' => 'array',
    ];

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Creator::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(CollaborationPayment::class, 'agreement_id');
    }

    public function totalPaid(): float
    {
        return (float) $this->payments()
            ->where('status', 'completed')
            ->sum('amount');
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function calculateExpectedPayment(): float
    {
        return match ($this->payment_type) {
            'fixed' => (float) ($this->fixed_payment ?? 0),
            'commission' => 0.0, // Would be calculated based on sales
            'hybrid' => (float) ($this->fixed_payment ?? 0), // Plus commission
            default => 0.0,
        };
    }
}

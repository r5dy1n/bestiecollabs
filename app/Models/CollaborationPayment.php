<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CollaborationPayment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'agreement_id',
        'amount',
        'status',
        'payment_method',
        'transaction_id',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function agreement(): BelongsTo
    {
        return $this->belongsTo(CollaborationAgreement::class, 'agreement_id');
    }

    public function markAsPaid(?string $transactionId = null): void
    {
        $this->update([
            'status' => 'completed',
            'paid_at' => now(),
            'transaction_id' => $transactionId,
        ]);
    }

    public function isPaid(): bool
    {
        return $this->status === 'completed' && $this->paid_at !== null;
    }
}

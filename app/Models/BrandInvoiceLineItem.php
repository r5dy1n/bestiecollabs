<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BrandInvoiceLineItem extends Model
{
    /** @use HasFactory<\Database\Factories\BrandInvoiceLineItemFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'invoice_id',
        'collaboration_id',
        'description',
        'type',
        'amount',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(BrandInvoice::class, 'invoice_id');
    }

    public function collaboration(): BelongsTo
    {
        return $this->belongsTo(Collaboration::class);
    }
}

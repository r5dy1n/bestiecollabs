<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BrandInvoice extends Model
{
    /** @use HasFactory<\Database\Factories\BrandInvoiceFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'brand_id',
        'billing_period_start',
        'billing_period_end',
        'subtotal',
        'discount_amount',
        'processing_fee',
        'total',
        'status',
        'stripe_payment_intent_id',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'processing_fee' => 'decimal:2',
            'total' => 'decimal:2',
            'billing_period_start' => 'date',
            'billing_period_end' => 'date',
            'paid_at' => 'datetime',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function lineItems(): HasMany
    {
        return $this->hasMany(BrandInvoiceLineItem::class, 'invoice_id');
    }

    public function recalculateTotals(): void
    {
        $this->load('brand.billingAccount');

        $subtotal = $this->lineItems()->sum('amount');
        $discountAmount = 0.0;

        $billingAccount = $this->brand->billingAccount;

        if ($billingAccount?->ach_discount_eligible) {
            $achDiscountPercent = (float) config('services.stripe.ach_discount_percent', 1.0);
            $discountAmount = round($subtotal * $achDiscountPercent / 100, 2);
        }

        $total = round($subtotal - $discountAmount, 2);

        $this->subtotal = $subtotal;
        $this->discount_amount = $discountAmount;
        $this->total = $total;
        $this->save();
    }
}

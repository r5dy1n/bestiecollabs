<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BrandBillingAccount extends Model
{
    /** @use HasFactory<\Database\Factories\BrandBillingAccountFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'brand_id',
        'stripe_customer_id',
        'payment_method_type',
        'payment_method_id',
        'ach_discount_eligible',
    ];

    protected function casts(): array
    {
        return [
            'ach_discount_eligible' => 'boolean',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }
}

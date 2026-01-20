<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BrandCreatorMatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_id',
        'creator_id',
        'match_score',
        'age_overlap_score',
        'category_alignment_score',
        'geographic_compatibility_score',
        'quality_threshold_score',
    ];

    protected function casts(): array
    {
        return [
            'match_score' => 'decimal:2',
            'age_overlap_score' => 'decimal:2',
            'category_alignment_score' => 'decimal:2',
            'geographic_compatibility_score' => 'decimal:2',
            'quality_threshold_score' => 'decimal:2',
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
}

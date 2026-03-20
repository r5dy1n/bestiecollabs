<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BrandDirectoryCard extends Model
{
    /** @use HasFactory<\Database\Factories\BrandDirectoryCardFactory> */
    use HasFactory;

    protected $fillable = [
        'brand_id',
        'shop_name',
        'short_description',
        'store_type',
        'price_range',
        'items_sold_30day',
        'url',
        'social_media_links',
        'top_categories',
        'customer_gender',
        'customer_age_range_min',
        'customer_age_range_max',
        'number_of_collabs',
        'preview_most_watched_posts',
        'bestie_score_badge_position',
        'match_score_badge_position',
        'bestie_score',
        'match_score',
    ];

    protected function casts(): array
    {
        return [
            'social_media_links' => 'array',
            'top_categories' => 'array',
            'preview_most_watched_posts' => 'array',
            'items_sold_30day' => 'integer',
            'customer_age_range_min' => 'integer',
            'customer_age_range_max' => 'integer',
            'number_of_collabs' => 'integer',
            'bestie_score' => 'decimal:2',
            'match_score' => 'decimal:2',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }
}

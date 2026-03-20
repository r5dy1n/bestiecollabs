<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Brand extends Model
{
    /** @use HasFactory<\Database\Factories\BrandFactory> */
    use HasFactory, HasUuids;

    protected $appends = ['connection_status'];

    protected $fillable = [
        'user_id',
        'brand_name',
        'website_url',
        'category_primary',
        'category_secondary',
        'category_tertiary',
        'instagram_url',
        'tiktok_url',
        'description',
        'customer_age_min',
        'customer_age_max',
        'us_based',
        'bestie_score',
        'total_collaborations',
        'average_rating',
        'response_rate',
        'platform_activity_score',
    ];

    protected function casts(): array
    {
        return [
            'customer_age_min' => 'integer',
            'customer_age_max' => 'integer',
            'us_based' => 'boolean',
            'bestie_score' => 'decimal:2',
            'total_collaborations' => 'integer',
            'average_rating' => 'decimal:2',
            'response_rate' => 'decimal:2',
            'platform_activity_score' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function directoryCard(): HasOne
    {
        return $this->hasOne(BrandDirectoryCard::class);
    }

    public function matches(): HasMany
    {
        return $this->hasMany(BrandCreatorMatch::class);
    }

    public function outreachAttempts()
    {
        return $this->morphMany(OutreachAttempt::class, 'contactable');
    }

    public function getTotalOutreachAttemptsAttribute(): int
    {
        return $this->outreachAttempts()->count();
    }

    public function canReceiveDirectMessages(): bool
    {
        return $this->outreachAttempts()
            ->where('status', 'sent')
            ->count() >= 7;
    }

    public function collaborations()
    {
        return $this->hasMany(Collaboration::class);
    }

    public function activeCollaborations()
    {
        return $this->collaborations()->where('status', 'active');
    }

    public function getConnectionStatusAttribute(): string
    {
        $activeCollaboration = $this->collaborations()
            ->whereIn('status', ['active', 'completed'])
            ->where('connection_type', 'connected')
            ->exists();

        return $activeCollaboration ? 'connected' : 'unconnected';
    }
}

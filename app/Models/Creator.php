<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Creator extends Model
{
    /** @use HasFactory<\Database\Factories\CreatorFactory> */
    use HasFactory, HasUuids;

    protected $appends = ['connection_status', 'connected_platforms'];

    protected $fillable = [
        'user_id',
        'creator_name',
        'description',
        'instagram_url',
        'tiktok_url',
        'youtube_url',
        'twitter_url',
        'category_primary',
        'category_secondary',
        'category_tertiary',
        'followers_demographs',
        'follower_age_min',
        'follower_age_max',
        'language',
        'us_based',
        'bestie_score',
        'total_posts',
        'engagement_rate',
        'follower_growth_rate',
        'content_quality_score',
        'posting_frequency_days',
        'social_metadata',
        'last_synced_at',
    ];

    protected function casts(): array
    {
        return [
            'followers_demographs' => 'array',
            'follower_age_min' => 'integer',
            'follower_age_max' => 'integer',
            'us_based' => 'boolean',
            'bestie_score' => 'decimal:2',
            'total_posts' => 'integer',
            'engagement_rate' => 'decimal:2',
            'follower_growth_rate' => 'decimal:2',
            'content_quality_score' => 'integer',
            'posting_frequency_days' => 'integer',
            'social_metadata' => 'array',
            'last_synced_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function matches(): HasMany
    {
        return $this->hasMany(BrandCreatorMatch::class);
    }

    public function socialSyncJobs(): HasMany
    {
        return $this->hasMany(SocialSyncJob::class);
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

    public function getConnectedPlatformsAttribute(): array
    {
        return array_filter([
            'instagram' => ! empty($this->instagram_url),
            'tiktok' => ! empty($this->tiktok_url),
            'youtube' => ! empty($this->youtube_url),
            'twitter' => ! empty($this->twitter_url),
        ]);
    }

    public function getPlatformMetadata(string $platform): ?array
    {
        return $this->social_metadata[$platform] ?? null;
    }

    public function needsSync(string $platform): bool
    {
        $metadata = $this->getPlatformMetadata($platform);

        if (! $metadata) {
            return true;
        }

        $lastSynced = new \DateTime($metadata['last_synced'] ?? '1970-01-01');
        $now = new \DateTime;
        $hoursSinceSync = $now->diff($lastSynced)->days * 24 + $now->diff($lastSynced)->h;

        return $hoursSinceSync >= 24;
    }
}

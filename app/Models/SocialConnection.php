<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialConnection extends Model
{
    /** @use HasFactory<\Database\Factories\SocialConnectionFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'platform',
        'platform_user_id',
        'handle',
        'status',
        'access_token',
        'refresh_token',
        'token_expires_at',
        'metrics_source',
        'followers',
        'posts_count',
        'engagement_rate',
        'platform_metadata',
        'last_sync_at',
        'last_sync_attempted_at',
    ];

    protected $hidden = [
        'access_token',
        'refresh_token',
    ];

    protected function casts(): array
    {
        return [
            'access_token' => 'encrypted',
            'refresh_token' => 'encrypted',
            'token_expires_at' => 'datetime',
            'last_sync_at' => 'datetime',
            'last_sync_attempted_at' => 'datetime',
            'followers' => 'integer',
            'posts_count' => 'integer',
            'engagement_rate' => 'decimal:4',
            'platform_metadata' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isConnected(): bool
    {
        return $this->status === 'connected';
    }

    public function isTokenExpired(): bool
    {
        if (! $this->token_expires_at) {
            return false;
        }

        return $this->token_expires_at->isPast();
    }
}

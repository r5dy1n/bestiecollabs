<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class OutreachAttempt extends Model
{
    /** @use HasFactory<\Database\Factories\OutreachAttemptFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'contactable_id',
        'contactable_type',
        'initiated_by',
        'channel',
        'status',
        'attempt_number',
        'message_content',
        'response_content',
        'sent_at',
        'responded_at',
        'notes',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
            'responded_at' => 'datetime',
            'metadata' => 'array',
            'attempt_number' => 'integer',
        ];
    }

    public function contactable(): MorphTo
    {
        return $this->morphTo();
    }

    public function initiatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'initiated_by');
    }

    public function markAsSent(): void
    {
        $this->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }

    public function markAsResponded(string $response): void
    {
        $this->update([
            'status' => 'responded',
            'response_content' => $response,
            'responded_at' => now(),
        ]);
    }

    public function markAsFailed(string $reason): void
    {
        $this->update([
            'status' => 'failed',
            'notes' => $reason,
        ]);
    }
}

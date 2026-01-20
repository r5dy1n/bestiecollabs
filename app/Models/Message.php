<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Message extends Model
{
    /** @use HasFactory<\Database\Factories\MessageFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'sender_id',
        'sender_type',
        'recipient_id',
        'recipient_type',
        'message_content',
        'read_status',
    ];

    protected function casts(): array
    {
        return [
            'read_status' => 'boolean',
        ];
    }

    public function sender(): MorphTo
    {
        return $this->morphTo();
    }

    public function recipient(): MorphTo
    {
        return $this->morphTo();
    }

    public function markAsRead(): void
    {
        if (! $this->read_status) {
            $this->update(['read_status' => true]);
        }
    }
}

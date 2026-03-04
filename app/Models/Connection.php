<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Connection extends Model
{
    /** @use HasFactory<\Database\Factories\ConnectionFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'connectable_type',
        'connectable_id',
        'status',
        'connection_type',
        'verification_token',
        'verified_at',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'verified_at' => 'datetime',
    ];

    public function connectable(): MorphTo
    {
        return $this->morphTo();
    }

    public function isVerified(): bool
    {
        return $this->status === 'verified' && $this->verified_at !== null;
    }

    public function verify(): void
    {
        $this->update([
            'status' => 'verified',
            'verified_at' => now(),
        ]);
    }
}

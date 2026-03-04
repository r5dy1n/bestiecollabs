<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\ActivityDigestNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SendActivityDigests extends Command
{
    protected $signature = 'digest:send {--days=7 : Number of days to include in digest}';

    protected $description = 'Send activity digest emails to users';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        $since = now()->subDays($days);

        $this->info("Sending activity digests for the last {$days} days...");

        $users = User::whereNotNull('email')->get();
        $sent = 0;

        foreach ($users as $user) {
            $data = $this->collectActivityData($user, $since);

            // Only send if there's meaningful activity
            if ($this->hasActivity($data)) {
                $user->notify(new ActivityDigestNotification($data));
                $sent++;
            }
        }

        $this->info("Sent {$sent} activity digest emails.");

        return self::SUCCESS;
    }

    private function collectActivityData(User $user, $since): array
    {
        $userType = get_class($user->userable ?? $user);
        $userId = $user->userable?->id ?? $user->id;

        // Count new messages
        $newMessages = DB::table('messages')
            ->where('recipient_type', $userType)
            ->where('recipient_id', $userId)
            ->where('created_at', '>=', $since)
            ->count();

        // Count new matches (if user has a brand or creator)
        $newMatches = 0;
        if ($user->userable instanceof \App\Models\Brand) {
            $newMatches = DB::table('brand_creator_matches')
                ->where('brand_id', $userId)
                ->where('created_at', '>=', $since)
                ->count();
        } elseif ($user->userable instanceof \App\Models\Creator) {
            $newMatches = DB::table('brand_creator_matches')
                ->where('creator_id', $userId)
                ->where('created_at', '>=', $since)
                ->count();
        }

        // Count active collaborations
        $activeCollaborations = 0;
        if ($user->userable) {
            if ($user->userable instanceof \App\Models\Brand) {
                $activeCollaborations = DB::table('collaboration_agreements')
                    ->where('brand_id', $userId)
                    ->where('status', 'active')
                    ->count();
            } elseif ($user->userable instanceof \App\Models\Creator) {
                $activeCollaborations = DB::table('collaboration_agreements')
                    ->where('creator_id', $userId)
                    ->where('status', 'active')
                    ->count();
            }
        }

        return [
            'new_messages' => $newMessages,
            'new_matches' => $newMatches,
            'active_collaborations' => $activeCollaborations,
            'period_days' => $this->option('days'),
        ];
    }

    private function hasActivity(array $data): bool
    {
        return $data['new_messages'] > 0
            || $data['new_matches'] > 0
            || $data['active_collaborations'] > 0;
    }
}

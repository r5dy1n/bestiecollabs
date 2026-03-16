<?php

namespace App\Jobs;

use App\Models\SocialConnection;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;

class SyncSocialConnectionStats implements ShouldQueue
{
    use Queueable;

    public function __construct(public SocialConnection $connection) {}

    public function handle(): void
    {
        $token = $this->connection->access_token;

        if (! $token) {
            return;
        }

        if ($this->connection->token_expires_at && $this->connection->token_expires_at->isPast()) {
            return;
        }

        $stats = $this->fetchStats($this->connection->platform, $token);

        if (! empty($stats)) {
            $this->connection->update(array_merge($stats, ['last_sync_at' => now()]));
        }
    }

    /** @return array<string, mixed> */
    private function fetchStats(string $platform, string $token): array
    {
        try {
            return match ($platform) {
                'instagram' => $this->fetchInstagramStats($token),
                'tiktok' => $this->fetchTikTokStats($token),
                'twitter' => $this->fetchTwitterStats($token),
                'youtube' => $this->fetchYouTubeStats($token),
                default => [],
            };
        } catch (\Exception) {
            return [];
        }
    }

    /** @return array<string, mixed> */
    private function fetchInstagramStats(string $token): array
    {
        $response = Http::get('https://graph.instagram.com/v19.0/me', [
            'fields' => 'id,username,followers_count,media_count,biography,profile_picture_url',
            'access_token' => $token,
        ]);

        if ($response->failed()) {
            return [];
        }

        $data = $response->json();
        $followers = (int) ($data['followers_count'] ?? 0);
        $data['engagement_metrics'] = $this->fetchInstagramEngagementMetrics($token, $followers);

        return [
            'followers' => $data['followers_count'] ?? null,
            'posts_count' => $data['media_count'] ?? null,
            'platform_metadata' => $data,
        ];
    }

    /** @return array<string, mixed> */
    private function fetchInstagramEngagementMetrics(string $token, int $followers): array
    {
        $response = Http::get('https://graph.instagram.com/v19.0/me/media', [
            'fields' => 'like_count,comments_count',
            'limit' => 12,
            'access_token' => $token,
        ]);

        if ($response->failed()) {
            return [];
        }

        $posts = $response->json()['data'] ?? [];

        if (empty($posts)) {
            return [];
        }

        $count = count($posts);
        $avgLikes = array_sum(array_column($posts, 'like_count')) / $count;
        $avgComments = array_sum(array_column($posts, 'comments_count')) / $count;
        $engagementRate = $followers > 0 ? (($avgLikes + $avgComments) / $followers) * 100 : 0;

        return [
            'avg_likes' => (int) round($avgLikes),
            'avg_comments' => (int) round($avgComments),
            'engagement_rate' => round($engagementRate, 2),
        ];
    }

    /** @return array<string, mixed> */
    private function fetchTikTokStats(string $token): array
    {
        $response = Http::withToken($token)
            ->get('https://open.tiktokapis.com/v2/user/info/', [
                'fields' => 'open_id,union_id,avatar_url,display_name,bio_description,follower_count,following_count,likes_count,video_count',
            ]);

        if ($response->failed()) {
            return [];
        }

        $data = $response->json()['data']['user'] ?? [];

        return [
            'followers' => $data['follower_count'] ?? null,
            'posts_count' => $data['video_count'] ?? null,
            'platform_metadata' => $data,
        ];
    }

    /** @return array<string, mixed> */
    private function fetchTwitterStats(string $token): array
    {
        $response = Http::withToken($token)
            ->get('https://api.twitter.com/2/users/me', [
                'user.fields' => 'public_metrics,profile_image_url,description',
            ]);

        if ($response->failed()) {
            return [];
        }

        $data = $response->json()['data'] ?? [];

        return [
            'followers' => $data['public_metrics']['followers_count'] ?? null,
            'posts_count' => $data['public_metrics']['tweet_count'] ?? null,
            'platform_metadata' => $data,
        ];
    }

    /** @return array<string, mixed> */
    private function fetchYouTubeStats(string $token): array
    {
        $response = Http::withToken($token)
            ->get('https://www.googleapis.com/youtube/v3/channels', [
                'part' => 'statistics,snippet',
                'mine' => 'true',
            ]);

        if ($response->failed()) {
            return [];
        }

        $channel = $response->json()['items'][0] ?? null;

        if (! $channel) {
            return [];
        }

        return [
            'followers' => (int) ($channel['statistics']['subscriberCount'] ?? 0),
            'posts_count' => (int) ($channel['statistics']['videoCount'] ?? 0),
            'platform_metadata' => $channel,
        ];
    }
}

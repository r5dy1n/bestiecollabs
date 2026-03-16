<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Jobs\SyncCreatorSocialMedia;
use App\Models\SocialConnection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

class SocialAccountsController extends Controller
{
    private const VALID_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'twitter'];

    /**
     * Maps our platform names to Socialite driver names.
     */
    private const PLATFORM_DRIVERS = [
        'instagram' => 'instagram',
        'tiktok' => 'tiktok',
        'youtube' => 'google',
        'twitter' => 'twitter-oauth-2',
    ];

    /**
     * Scopes per platform.
     *
     * @var array<string, list<string>>
     */
    private const PLATFORM_SCOPES = [
        'instagram' => ['instagram_business_basic'],
        'tiktok' => ['user.info.basic', 'user.info.profile', 'user.info.stats'],
        'youtube' => ['https://www.googleapis.com/auth/youtube.readonly'],
        'twitter' => ['tweet.read', 'users.read'],
    ];

    public function edit(): Response
    {
        $user = Auth::user();

        $connections = $user->socialConnections
            ->keyBy('platform');

        return Inertia::render('settings/social-accounts', [
            'connections' => $connections,
        ]);
    }

    public function redirect(string $platform): \Symfony\Component\HttpFoundation\RedirectResponse
    {
        if (! $this->isValidPlatform($platform)) {
            return redirect()
                ->route('social-accounts.edit')
                ->with('error', 'Invalid platform.');
        }

        $driver = self::PLATFORM_DRIVERS[$platform];
        $scopes = self::PLATFORM_SCOPES[$platform] ?? [];

        return Socialite::driver($driver)
            ->setScopes($scopes)
            ->redirect();
    }

    public function callback(string $platform): RedirectResponse
    {
        if (! $this->isValidPlatform($platform)) {
            return redirect()
                ->route('social-accounts.edit')
                ->with('error', 'Invalid platform.');
        }

        $driver = self::PLATFORM_DRIVERS[$platform];

        try {
            $socialUser = Socialite::driver($driver)->user();
        } catch (\Exception $e) {
            return redirect()
                ->route('social-accounts.edit')
                ->with('error', 'Failed to connect '.ucfirst($platform).'. Please try again.');
        }

        $user = Auth::user();

        $alreadyClaimed = SocialConnection::where('platform', $platform)
            ->where('platform_user_id', $socialUser->getId())
            ->where('user_id', '!=', $user->id)
            ->where('status', 'connected')
            ->exists();

        if ($alreadyClaimed) {
            return redirect()
                ->route('social-accounts.edit')
                ->with('error', 'This '.ucfirst($platform).' account is already connected to another user.');
        }

        $stats = $this->fetchStatsFromToken($platform, $socialUser->token);

        $connection = SocialConnection::updateOrCreate(
            [
                'user_id' => $user->id,
                'platform' => $platform,
            ],
            array_merge(
                [
                    'platform_user_id' => $socialUser->getId(),
                    'handle' => $socialUser->getNickname() ?? $socialUser->getName(),
                    'access_token' => $socialUser->token,
                    'refresh_token' => $socialUser->refreshToken ?? null,
                    'token_expires_at' => $socialUser->expiresIn
                        ? now()->addSeconds($socialUser->expiresIn)
                        : null,
                    'status' => 'connected',
                    'last_sync_at' => now(),
                ],
                $stats,
            ),
        );

        $creator = $user->creator;
        if ($creator) {
            $urlField = "{$platform}_url";
            $profileUrl = $this->buildProfileUrl($platform, $socialUser->getNickname() ?? $socialUser->getId());
            $creator->update([$urlField => $profileUrl]);

            SyncCreatorSocialMedia::dispatch($creator, [$platform]);
        }

        return redirect()
            ->route('social-accounts.edit')
            ->with('success', ucfirst($platform).' account connected successfully.');
    }

    public function disconnect(string $platform): RedirectResponse
    {
        if (! $this->isValidPlatform($platform)) {
            return redirect()
                ->back()
                ->with('error', 'Invalid platform.');
        }

        $user = Auth::user();

        $connection = $user->socialConnections()
            ->where('platform', $platform)
            ->first();

        if ($connection) {
            $connection->update([
                'status' => 'disconnected',
                'access_token' => null,
                'refresh_token' => null,
                'token_expires_at' => null,
            ]);
        }

        // Also clear Creator's platform URL
        $creator = $user->creator;
        if ($creator) {
            $urlField = "{$platform}_url";
            $creator->update([$urlField => null]);

            $metadata = $creator->social_metadata ?? [];
            unset($metadata[$platform]);
            $creator->update(['social_metadata' => $metadata]);
        }

        return redirect()
            ->back()
            ->with('success', ucfirst($platform).' account disconnected successfully.');
    }

    public function sync(string $platform): RedirectResponse
    {
        if (! $this->isValidPlatform($platform)) {
            return redirect()
                ->back()
                ->with('error', 'Invalid platform.');
        }

        $user = Auth::user();
        $creator = $user->creator;

        if (! $creator) {
            return redirect()
                ->back()
                ->with('error', 'Creator profile not found.');
        }

        $connection = $user->socialConnections()
            ->where('platform', $platform)
            ->where('status', 'connected')
            ->first();

        if (! $connection) {
            return redirect()
                ->back()
                ->with('error', ucfirst($platform).' is not connected.');
        }

        $stats = $this->fetchStatsFromToken($platform, $connection->access_token);

        if (! empty($stats)) {
            $connection->update(array_merge($stats, ['last_sync_at' => now()]));
        }

        SyncCreatorSocialMedia::dispatch($creator, [$platform]);

        return redirect()
            ->back()
            ->with('success', ucfirst($platform).' sync started. This may take a few moments.');
    }

    /**
     * Fetch follower stats using the user's own OAuth token.
     *
     * @return array{followers?: int, posts_count?: int, platform_metadata?: array<string, mixed>}
     */
    private function fetchStatsFromToken(string $platform, string $token): array
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
                'fields' => 'open_id,union_id,avatar_url,display_name,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count',
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

    private function isValidPlatform(string $platform): bool
    {
        return in_array($platform, self::VALID_PLATFORMS);
    }

    private function buildProfileUrl(string $platform, string $identifier): string
    {
        return match ($platform) {
            'instagram' => "https://instagram.com/{$identifier}",
            'tiktok' => "https://tiktok.com/@{$identifier}",
            'youtube' => "https://youtube.com/channel/{$identifier}",
            'twitter' => "https://x.com/{$identifier}",
            default => $identifier,
        };
    }
}

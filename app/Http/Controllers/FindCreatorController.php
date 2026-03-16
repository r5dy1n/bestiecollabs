<?php

namespace App\Http\Controllers;

use App\Models\SocialConnection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FindCreatorController extends Controller
{
    public function index(Request $request): Response
    {
        $query = $request->input('query');
        $category = $request->input('category');

        return Inertia::render('FindCreator/Index', [
            'creators' => $this->fetchCreators($query, $category),
            'filters' => ['query' => $query, 'category' => $category],
        ]);
    }

    public function show(string $username): Response
    {
        $anyConnection = SocialConnection::query()
            ->whereIn('handle', [$username, '@'.$username])
            ->where('status', 'connected')
            ->first();

        $profiles = ['instagram' => null, 'tiktok' => null, 'youtube' => null, 'twitter' => null];

        if ($anyConnection) {
            $connections = SocialConnection::query()
                ->where('user_id', $anyConnection->user_id)
                ->where('status', 'connected')
                ->with('user.creator')
                ->get()
                ->keyBy('platform');

            foreach (array_keys($profiles) as $platform) {
                $connection = $connections->get($platform);
                if ($connection) {
                    $profiles[$platform] = $this->buildCreatorProfile($platform, $connection);
                }
            }
        }

        return Inertia::render('FindCreator/Show', [
            'username' => $username,
            'profiles' => $profiles,
        ]);
    }

    /** @return array<int, array<string, mixed>> */
    private function fetchCreators(?string $query = null, ?string $category = null): array
    {
        return SocialConnection::query()
            ->where('status', 'connected')
            ->when($query, function ($q) use ($query): void {
                $q->where(function ($q) use ($query): void {
                    $q->where('handle', 'like', "%{$query}%")
                        ->orWhereHas('user.creator', function ($q) use ($query): void {
                            $q->where('creator_name', 'like', "%{$query}%")
                                ->orWhere('description', 'like', "%{$query}%");
                        });
                });
            })
            ->when($category, function ($q) use ($category): void {
                $q->whereHas('user.creator', function ($q) use ($category): void {
                    $q->where('category_primary', $category);
                });
            })
            ->with(['user.creator'])
            ->get()
            ->groupBy('user_id')
            ->map(function ($userConnections): array {
                $firstConnection = $userConnections->first();
                $creator = $firstConnection->user?->creator;

                $platforms = $userConnections->mapWithKeys(function (SocialConnection $connection): array {
                    $meta = $connection->platform_metadata ?? [];

                    return [$connection->platform => [
                        'handle' => $connection->handle,
                        'followers' => $connection->followers ?? null,
                        'engagement_rate' => $connection->engagement_rate
                            ?? $meta['engagement_metrics']['engagement_rate']
                            ?? null,
                    ]];
                });

                $primaryMeta = $firstConnection->platform_metadata ?? [];

                return [
                    'username' => $firstConnection->handle,
                    'display_name' => $creator?->creator_name ?? $firstConnection->user?->name ?? $firstConnection->handle,
                    'bio' => $creator?->description,
                    'profile_picture_url' => $primaryMeta['profile_picture_url'] ?? null,
                    'platforms' => $platforms,
                ];
            })
            ->values()
            ->all();
    }

    /** @return array<string, mixed> */
    private function buildCreatorProfile(string $platform, SocialConnection $connection): array
    {
        $meta = $connection->platform_metadata ?? [];
        $creator = $connection->user?->creator;

        return match ($platform) {
            'instagram' => [
                'username' => $meta['username'] ?? $connection->handle,
                'display_name' => $meta['username'] ?? $connection->handle,
                'bio' => $meta['biography'] ?? $creator?->description,
                'profile_picture_url' => $meta['profile_picture_url'] ?? null,
                'follower_count' => $meta['followers_count'] ?? $connection->followers,
                'post_count' => $meta['media_count'] ?? $connection->posts_count,
                'engagement_metrics' => $meta['engagement_metrics'] ?? null,
                'last_synced' => $connection->last_sync_at?->toISOString(),
            ],
            'tiktok' => [
                'username' => $meta['display_name'] ?? $connection->handle,
                'display_name' => $meta['display_name'] ?? $connection->handle,
                'bio' => $meta['bio_description'] ?? $creator?->description,
                'profile_picture_url' => $meta['avatar_url'] ?? null,
                'follower_count' => $meta['follower_count'] ?? $connection->followers,
                'following_count' => $meta['following_count'] ?? null,
                'video_count' => $meta['video_count'] ?? $connection->posts_count,
                'total_likes' => $meta['likes_count'] ?? null,
                'engagement_metrics' => $meta['engagement_metrics'] ?? null,
                'last_synced' => $connection->last_sync_at?->toISOString(),
            ],
            'twitter' => [
                'username' => $meta['username'] ?? $connection->handle,
                'display_name' => $meta['name'] ?? $connection->handle,
                'bio' => $meta['description'] ?? $creator?->description,
                'profile_picture_url' => $meta['profile_image_url'] ?? null,
                'follower_count' => $meta['public_metrics']['followers_count'] ?? $connection->followers,
                'following_count' => $meta['public_metrics']['following_count'] ?? null,
                'tweet_count' => $meta['public_metrics']['tweet_count'] ?? $connection->posts_count,
                'engagement_metrics' => $meta['engagement_metrics'] ?? null,
                'last_synced' => $connection->last_sync_at?->toISOString(),
            ],
            'youtube' => [
                'username' => $meta['snippet']['customUrl'] ?? $connection->handle,
                'channel_name' => $meta['snippet']['title'] ?? null,
                'display_name' => $meta['snippet']['title'] ?? $connection->handle,
                'bio' => $meta['snippet']['description'] ?? $creator?->description,
                'profile_picture_url' => $meta['snippet']['thumbnails']['default']['url'] ?? null,
                'subscriber_count' => isset($meta['statistics']['subscriberCount']) ? (int) $meta['statistics']['subscriberCount'] : $connection->followers,
                'video_count' => isset($meta['statistics']['videoCount']) ? (int) $meta['statistics']['videoCount'] : $connection->posts_count,
                'total_views' => isset($meta['statistics']['viewCount']) ? (int) $meta['statistics']['viewCount'] : null,
                'channel_id' => $meta['id'] ?? null,
                'engagement_metrics' => $meta['engagement_metrics'] ?? null,
                'last_synced' => $connection->last_sync_at?->toISOString(),
            ],
            default => [],
        };
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\SocialConnection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FindCreatorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('FindCreator/Index');
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
            ],
            default => [],
        };
    }

    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'query' => ['required', 'string', 'min:3', 'max:255'],
            'category' => ['nullable', 'string', 'in:fashion,beauty,fitness,food,travel,tech,gaming,business,education,entertainment,music,sports,parenting,diy,home'],
        ]);

        $query = $validated['query'];
        $category = $validated['category'] ?? null;

        $connections = SocialConnection::query()
            ->where('status', 'connected')
            ->where(function ($q) use ($query): void {
                $q->where('handle', 'like', "%{$query}%")
                    ->orWhereHas('user.creator', function ($q) use ($query): void {
                        $q->where('creator_name', 'like', "%{$query}%")
                            ->orWhere('description', 'like', "%{$query}%");
                    });
            })
            ->when($category, function ($q) use ($category): void {
                $q->whereHas('user.creator', function ($q) use ($category): void {
                    $q->where('category_primary', $category);
                });
            })
            ->with(['user.creator'])
            ->get()
            ->groupBy('user_id');

        $results = $connections->map(function ($userConnections): array {
            $firstConnection = $userConnections->first();
            $creator = $firstConnection->user?->creator;
            $metadata = $creator?->social_metadata ?? [];

            $platforms = $userConnections->mapWithKeys(function (SocialConnection $connection) use ($metadata): array {
                $platformMeta = $metadata[$connection->platform] ?? [];

                return [$connection->platform => [
                    'handle' => $connection->handle,
                    'followers' => $connection->followers ?? $platformMeta['follower_count'] ?? $platformMeta['subscriber_count'] ?? null,
                    'engagement_rate' => $connection->engagement_rate ?? $platformMeta['engagement_metrics']['engagement_rate'] ?? null,
                ]];
            });

            $primaryMeta = $metadata[$firstConnection->platform] ?? [];

            return [
                'username' => $firstConnection->handle,
                'display_name' => $creator?->creator_name ?? $firstConnection->user?->name ?? $firstConnection->handle,
                'bio' => $creator?->description,
                'profile_picture_url' => $primaryMeta['profile_picture_url'] ?? null,
                'platforms' => $platforms,
            ];
        })->values();

        return response()->json([
            'success' => true,
            'results' => $results,
        ]);
    }
}

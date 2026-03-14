<?php

namespace App\Services\SocialMedia\Providers;

use App\Services\SocialMedia\Contracts\SocialMediaPlatformInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TikTokProvider implements SocialMediaPlatformInterface
{
    protected string $baseUrl = 'https://open.tiktokapis.com/v2';

    public function fetchProfile(string $username): array
    {
        try {
            // TikTok API requires OAuth access token from user
            $accessToken = $this->getAccessToken();

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$accessToken}",
            ])->get("{$this->baseUrl}/user/info/", [
                'fields' => 'open_id,union_id,avatar_url,display_name,bio_description,follower_count,following_count,likes_count,video_count,is_verified',
            ]);

            if ($response->failed()) {
                throw new \Exception('Failed to fetch TikTok profile: '.$response->body());
            }

            $data = $response->json();
            $user = $data['data']['user'] ?? [];

            return [
                'user_id' => $user['open_id'] ?? null,
                'username' => $username,
                'display_name' => $user['display_name'] ?? $username,
                'bio' => $user['bio_description'] ?? null,
                'follower_count' => $user['follower_count'] ?? 0,
                'following_count' => $user['following_count'] ?? 0,
                'likes_count' => $user['likes_count'] ?? 0,
                'video_count' => $user['video_count'] ?? 0,
                'profile_picture_url' => $user['avatar_url'] ?? null,
                'verified' => $user['is_verified'] ?? false,
            ];
        } catch (\Exception $e) {
            Log::error('TikTok API error in fetchProfile', [
                'username' => $username,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    public function fetchMetrics(string $username): array
    {
        try {
            $accessToken = $this->getAccessToken();

            // Fetch video list and calculate average engagement
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$accessToken}",
            ])->post("{$this->baseUrl}/video/list/", [
                'max_count' => 20,
            ]);

            if ($response->failed()) {
                return [
                    'avg_views' => 0,
                    'avg_likes' => 0,
                    'avg_comments' => 0,
                    'avg_shares' => 0,
                    'engagement_rate' => 0,
                ];
            }

            $data = $response->json();
            $videos = $data['data']['videos'] ?? [];

            if (empty($videos)) {
                return [
                    'avg_views' => 0,
                    'avg_likes' => 0,
                    'avg_comments' => 0,
                    'avg_shares' => 0,
                    'engagement_rate' => 0,
                ];
            }

            $totalViews = 0;
            $totalLikes = 0;
            $totalComments = 0;
            $totalShares = 0;

            foreach ($videos as $video) {
                $totalViews += $video['view_count'] ?? 0;
                $totalLikes += $video['like_count'] ?? 0;
                $totalComments += $video['comment_count'] ?? 0;
                $totalShares += $video['share_count'] ?? 0;
            }

            $count = count($videos);
            $avgViews = $totalViews / $count;
            $avgLikes = $totalLikes / $count;
            $avgComments = $totalComments / $count;
            $avgShares = $totalShares / $count;

            $engagementRate = $avgViews > 0
                ? (($avgLikes + $avgComments + $avgShares) / $avgViews) * 100
                : 0;

            return [
                'avg_views' => round($avgViews),
                'avg_likes' => round($avgLikes),
                'avg_comments' => round($avgComments),
                'avg_shares' => round($avgShares),
                'engagement_rate' => round($engagementRate, 2),
            ];
        } catch (\Exception $e) {
            Log::error('TikTok API error in fetchMetrics', [
                'username' => $username,
                'error' => $e->getMessage(),
            ]);

            return [
                'avg_views' => 0,
                'avg_likes' => 0,
                'avg_comments' => 0,
                'avg_shares' => 0,
                'engagement_rate' => 0,
            ];
        }
    }

    public function search(string $query, ?string $category = null): array
    {
        try {
            // TikTok Research API (requires separate approval)
            $accessToken = $this->getResearchAccessToken();

            if (! $accessToken) {
                Log::warning('TikTok Research API not configured');

                return [];
            }

            // Build search query with category if provided
            $searchQuery = $category ? "{$query} {$category}" : $query;

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$accessToken}",
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/research/user/info/", [
                'query' => [
                    'and' => [
                        ['field_name' => 'keyword', 'operation' => 'IN', 'field_values' => [$searchQuery]],
                    ],
                ],
                'max_count' => 20,
            ]);

            if ($response->failed()) {
                Log::warning('TikTok search failed', [
                    'query' => $query,
                    'response' => $response->body(),
                ]);

                return [];
            }

            $data = $response->json();
            $users = $data['data']['users'] ?? [];

            return array_map(function ($user) use ($query) {
                return [
                    'username' => $user['username'] ?? '',
                    'display_name' => $user['display_name'] ?? '',
                    'bio' => $user['bio_description'] ?? null,
                    'follower_count' => $user['follower_count'] ?? 0,
                    'profile_picture_url' => $user['avatar_url'] ?? null,
                    'verified' => $user['is_verified'] ?? false,
                    'relevance_score' => $this->calculateRelevance($user, $query),
                ];
            }, $users);
        } catch (\Exception $e) {
            Log::error('TikTok API error in search', [
                'query' => $query,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    protected function getAccessToken(): string
    {
        // In production, this would implement OAuth flow and token refresh
        // For now, return configured access token
        return config('services.social_media.tiktok.access_token', '');
    }

    protected function getResearchAccessToken(): ?string
    {
        // TikTok Research API requires separate credentials
        return config('services.social_media.tiktok.research_access_token');
    }

    protected function calculateRelevance(array $user, string $query): float
    {
        $score = 0.5; // Base score

        // Boost if query appears in username
        if (stripos($user['username'] ?? '', $query) !== false) {
            $score += 0.3;
        }

        // Boost if query appears in display name
        if (stripos($user['display_name'] ?? '', $query) !== false) {
            $score += 0.2;
        }

        return min(1.0, $score);
    }
}

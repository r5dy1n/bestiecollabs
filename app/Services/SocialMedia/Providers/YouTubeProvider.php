<?php

namespace App\Services\SocialMedia\Providers;

use App\Services\SocialMedia\Contracts\SocialMediaPlatformInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class YouTubeProvider implements SocialMediaPlatformInterface
{
    protected string $baseUrl = 'https://www.googleapis.com/youtube/v3';

    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.social_media.youtube.api_key');
    }

    public function fetchProfile(string $username): array
    {
        try {
            // First, try to get channel by username
            $response = Http::get("{$this->baseUrl}/channels", [
                'part' => 'snippet,statistics,brandingSettings',
                'forUsername' => $username,
                'key' => $this->apiKey,
            ]);

            if ($response->failed() || empty($response->json()['items'])) {
                // Try searching by name if username lookup fails
                $searchResponse = Http::get("{$this->baseUrl}/search", [
                    'part' => 'snippet',
                    'q' => $username,
                    'type' => 'channel',
                    'maxResults' => 1,
                    'key' => $this->apiKey,
                ]);

                if ($searchResponse->failed() || empty($searchResponse->json()['items'])) {
                    throw new \Exception("YouTube channel not found: {$username}");
                }

                $channelId = $searchResponse->json()['items'][0]['id']['channelId'];

                // Now get full channel details
                $response = Http::get("{$this->baseUrl}/channels", [
                    'part' => 'snippet,statistics,brandingSettings',
                    'id' => $channelId,
                    'key' => $this->apiKey,
                ]);
            }

            if ($response->failed()) {
                throw new \Exception('Failed to fetch YouTube profile: '.$response->body());
            }

            $data = $response->json();
            $channel = $data['items'][0] ?? null;

            if (! $channel) {
                throw new \Exception("YouTube channel not found: {$username}");
            }

            return [
                'channel_id' => $channel['id'],
                'channel_name' => $channel['snippet']['title'],
                'username' => $channel['snippet']['customUrl'] ?? $username,
                'description' => $channel['snippet']['description'] ?? null,
                'subscriber_count' => (int) ($channel['statistics']['subscriberCount'] ?? 0),
                'video_count' => (int) ($channel['statistics']['videoCount'] ?? 0),
                'view_count' => (int) ($channel['statistics']['viewCount'] ?? 0),
                'profile_picture_url' => $channel['snippet']['thumbnails']['high']['url'] ?? null,
                'banner_url' => $channel['brandingSettings']['image']['bannerExternalUrl'] ?? null,
                'verified' => false, // YouTube API doesn't expose verification status directly
                'country' => $channel['snippet']['country'] ?? null,
                'published_at' => $channel['snippet']['publishedAt'] ?? null,
            ];
        } catch (\Exception $e) {
            Log::error('YouTube API error in fetchProfile', [
                'username' => $username,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    public function fetchMetrics(string $username): array
    {
        try {
            $profile = $this->fetchProfile($username);
            $channelId = $profile['channel_id'];

            // Get recent videos to calculate engagement
            $response = Http::get("{$this->baseUrl}/search", [
                'part' => 'id',
                'channelId' => $channelId,
                'order' => 'date',
                'type' => 'video',
                'maxResults' => 10,
                'key' => $this->apiKey,
            ]);

            if ($response->failed()) {
                return $this->getBasicMetrics($profile);
            }

            $videos = $response->json()['items'] ?? [];

            if (empty($videos)) {
                return $this->getBasicMetrics($profile);
            }

            // Get video statistics
            $videoIds = array_map(fn ($video) => $video['id']['videoId'], $videos);
            $statsResponse = Http::get("{$this->baseUrl}/videos", [
                'part' => 'statistics',
                'id' => implode(',', $videoIds),
                'key' => $this->apiKey,
            ]);

            if ($statsResponse->failed()) {
                return $this->getBasicMetrics($profile);
            }

            $videoStats = $statsResponse->json()['items'] ?? [];

            $totalViews = 0;
            $totalLikes = 0;
            $totalComments = 0;

            foreach ($videoStats as $video) {
                $stats = $video['statistics'];
                $totalViews += (int) ($stats['viewCount'] ?? 0);
                $totalLikes += (int) ($stats['likeCount'] ?? 0);
                $totalComments += (int) ($stats['commentCount'] ?? 0);
            }

            $count = count($videoStats);
            $avgViews = $count > 0 ? $totalViews / $count : 0;
            $avgLikes = $count > 0 ? $totalLikes / $count : 0;
            $avgComments = $count > 0 ? $totalComments / $count : 0;

            $engagementRate = $avgViews > 0
                ? (($avgLikes + $avgComments) / $avgViews) * 100
                : 0;

            return [
                'avg_views' => round($avgViews),
                'avg_likes' => round($avgLikes),
                'avg_comments' => round($avgComments),
                'engagement_rate' => round($engagementRate, 2),
                'total_views' => $profile['view_count'],
                'total_videos' => $profile['video_count'],
            ];
        } catch (\Exception $e) {
            Log::error('YouTube API error in fetchMetrics', [
                'username' => $username,
                'error' => $e->getMessage(),
            ]);

            return [
                'avg_views' => 0,
                'avg_likes' => 0,
                'avg_comments' => 0,
                'engagement_rate' => 0,
            ];
        }
    }

    public function search(string $query, ?string $category = null): array
    {
        try {
            // Enhance search query with category if provided
            $searchQuery = $category ? "{$query} {$category}" : $query;

            $response = Http::get("{$this->baseUrl}/search", [
                'part' => 'snippet',
                'q' => $searchQuery,
                'type' => 'channel',
                'maxResults' => 20,
                'order' => 'relevance',
                'key' => $this->apiKey,
            ]);

            if ($response->failed()) {
                Log::warning('YouTube search failed', [
                    'query' => $query,
                    'response' => $response->body(),
                ]);

                return [];
            }

            $data = $response->json();
            $channels = $data['items'] ?? [];

            if (empty($channels)) {
                return [];
            }

            // Get channel statistics for all results
            $channelIds = array_map(fn ($channel) => $channel['id']['channelId'], $channels);
            $statsResponse = Http::get("{$this->baseUrl}/channels", [
                'part' => 'statistics',
                'id' => implode(',', $channelIds),
                'key' => $this->apiKey,
            ]);

            $stats = [];
            if ($statsResponse->successful()) {
                foreach ($statsResponse->json()['items'] ?? [] as $item) {
                    $stats[$item['id']] = $item['statistics'];
                }
            }

            return array_map(function ($channel) use ($stats) {
                $channelId = $channel['id']['channelId'];
                $channelStats = $stats[$channelId] ?? [];

                return [
                    'channel_id' => $channelId,
                    'channel_name' => $channel['snippet']['title'],
                    'username' => $channel['snippet']['customUrl'] ?? null,
                    'description' => $channel['snippet']['description'] ?? null,
                    'subscriber_count' => (int) ($channelStats['subscriberCount'] ?? 0),
                    'video_count' => (int) ($channelStats['videoCount'] ?? 0),
                    'profile_picture_url' => $channel['snippet']['thumbnails']['high']['url'] ?? null,
                    'verified' => false,
                    'relevance_score' => 0.8, // YouTube orders by relevance already
                ];
            }, $channels);
        } catch (\Exception $e) {
            Log::error('YouTube API error in search', [
                'query' => $query,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    protected function getBasicMetrics(array $profile): array
    {
        return [
            'total_views' => $profile['view_count'] ?? 0,
            'total_videos' => $profile['video_count'] ?? 0,
            'avg_views' => 0,
            'avg_likes' => 0,
            'avg_comments' => 0,
            'engagement_rate' => 0,
        ];
    }
}

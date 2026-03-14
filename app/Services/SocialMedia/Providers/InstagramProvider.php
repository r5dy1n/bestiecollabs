<?php

namespace App\Services\SocialMedia\Providers;

use App\Services\SocialMedia\Contracts\SocialMediaPlatformInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InstagramProvider implements SocialMediaPlatformInterface
{
    protected string $baseUrl = 'https://graph.facebook.com/v19.0';

    protected string $accessToken;

    public function __construct()
    {
        $this->accessToken = config('services.social_media.instagram.access_token');
    }

    public function fetchProfile(string $username): array
    {
        try {
            $data = $this->fetchBusinessDiscovery($username);

            if (! $data) {
                throw new \Exception("User not found: {$username}");
            }

            return [
                'user_id' => $data['id'],
                'username' => $data['username'] ?? $username,
                'display_name' => $data['name'] ?? $data['username'],
                'bio' => $data['biography'] ?? null,
                'follower_count' => $data['followers_count'] ?? 0,
                'following_count' => $data['follows_count'] ?? 0,
                'media_count' => $data['media_count'] ?? 0,
                'profile_picture_url' => $data['profile_picture_url'] ?? null,
                'verified' => false,
            ];
        } catch (\Exception $e) {
            Log::error('Instagram API error in fetchProfile', [
                'username' => $username,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    public function fetchMetrics(string $username): array
    {
        try {
            $userId = $this->getUserIdFromUsername($username);

            if (! $userId) {
                throw new \Exception("User not found: {$username}");
            }

            // Fetch insights (requires business account)
            $response = Http::get("{$this->baseUrl}/{$userId}/insights", [
                'metric' => 'impressions,reach,profile_views',
                'period' => 'day',
                'access_token' => $this->accessToken,
            ]);

            if ($response->failed()) {
                // If insights fail (likely not a business account), return basic metrics
                return [
                    'engagement_rate' => 0,
                    'avg_likes' => 0,
                    'avg_comments' => 0,
                ];
            }

            $data = $response->json();

            return [
                'impressions' => $data['data'][0]['values'][0]['value'] ?? 0,
                'reach' => $data['data'][1]['values'][0]['value'] ?? 0,
                'profile_views' => $data['data'][2]['values'][0]['value'] ?? 0,
                'engagement_rate' => 0, // Calculated from media engagement
            ];
        } catch (\Exception $e) {
            Log::error('Instagram API error in fetchMetrics', [
                'username' => $username,
                'error' => $e->getMessage(),
            ]);

            // Return empty metrics rather than failing
            return [
                'engagement_rate' => 0,
                'avg_likes' => 0,
                'avg_comments' => 0,
            ];
        }
    }

    public function search(string $query, ?string $category = null): array
    {
        try {
            // Instagram Graph API doesn't have a public search endpoint
            // This would require Instagram Basic Display API or scraping
            // For now, we'll need to use hashtag search or business discovery

            // Using Business Discovery (requires business account)
            $response = Http::get("{$this->baseUrl}/ig_hashtag_search", [
                'user_id' => config('services.social_media.instagram.business_account_id'),
                'q' => $query,
                'access_token' => $this->accessToken,
            ]);

            if ($response->failed()) {
                Log::warning('Instagram search failed, returning empty results', [
                    'query' => $query,
                    'response' => $response->body(),
                ]);

                return [];
            }

            $data = $response->json();

            // Map hashtag results to creator format
            // Note: This is a limitation of Instagram's API
            // Real implementation would need additional endpoints or services
            return [];
        } catch (\Exception $e) {
            Log::error('Instagram API error in search', [
                'query' => $query,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    protected function getUserIdFromUsername(string $username): ?string
    {
        return $this->fetchBusinessDiscovery($username)['id'] ?? null;
    }

    protected function fetchBusinessDiscovery(string $username): ?array
    {
        try {
            $businessAccountId = config('services.social_media.instagram.business_account_id');

            if (! $businessAccountId) {
                return null;
            }

            $response = Http::get("{$this->baseUrl}/{$businessAccountId}", [
                'fields' => "business_discovery.fields(id,username,name,followers_count,follows_count,media_count,biography,profile_picture_url)?username={$username}",
                'access_token' => $this->accessToken,
            ]);

            if ($response->successful()) {
                return $response->json()['business_discovery'] ?? null;
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Failed to get Instagram user via business discovery', [
                'username' => $username,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }
}

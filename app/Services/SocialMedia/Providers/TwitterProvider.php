<?php

namespace App\Services\SocialMedia\Providers;

use App\Services\SocialMedia\Contracts\SocialMediaPlatformInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TwitterProvider implements SocialMediaPlatformInterface
{
    protected string $baseUrl = 'https://api.twitter.com/2';

    protected string $apiKey;

    protected string $apiSecret;

    protected string $bearerToken;

    public function __construct()
    {
        $this->apiKey = config('services.social_media.twitter.api_key');
        $this->apiSecret = config('services.social_media.twitter.api_secret');
        $this->bearerToken = config('services.social_media.twitter.bearer_token');
    }

    public function fetchProfile(string $username): array
    {
        try {
            // Remove @ if present
            $username = ltrim($username, '@');

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->bearerToken}",
            ])->get("{$this->baseUrl}/users/by/username/{$username}", [
                'user.fields' => 'id,name,username,description,profile_image_url,public_metrics,verified,created_at,location',
            ]);

            if ($response->failed()) {
                throw new \Exception('Failed to fetch Twitter profile: '.$response->body());
            }

            $data = $response->json();
            $user = $data['data'] ?? null;

            if (! $user) {
                throw new \Exception("Twitter user not found: {$username}");
            }

            return [
                'user_id' => $user['id'],
                'username' => $user['username'],
                'display_name' => $user['name'],
                'bio' => $user['description'] ?? null,
                'follower_count' => $user['public_metrics']['followers_count'] ?? 0,
                'following_count' => $user['public_metrics']['following_count'] ?? 0,
                'tweet_count' => $user['public_metrics']['tweet_count'] ?? 0,
                'listed_count' => $user['public_metrics']['listed_count'] ?? 0,
                'profile_picture_url' => $user['profile_image_url'] ?? null,
                'verified' => $user['verified'] ?? false,
                'location' => $user['location'] ?? null,
                'created_at' => $user['created_at'] ?? null,
            ];
        } catch (\Exception $e) {
            Log::error('Twitter API error in fetchProfile', [
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
            $userId = $profile['user_id'];

            // Get recent tweets to calculate engagement
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->bearerToken}",
            ])->get("{$this->baseUrl}/users/{$userId}/tweets", [
                'max_results' => 10,
                'tweet.fields' => 'public_metrics,created_at',
            ]);

            if ($response->failed()) {
                return $this->getBasicMetrics($profile);
            }

            $tweets = $response->json()['data'] ?? [];

            if (empty($tweets)) {
                return $this->getBasicMetrics($profile);
            }

            $totalRetweets = 0;
            $totalLikes = 0;
            $totalReplies = 0;
            $totalQuotes = 0;

            foreach ($tweets as $tweet) {
                $metrics = $tweet['public_metrics'] ?? [];
                $totalRetweets += $metrics['retweet_count'] ?? 0;
                $totalLikes += $metrics['like_count'] ?? 0;
                $totalReplies += $metrics['reply_count'] ?? 0;
                $totalQuotes += $metrics['quote_count'] ?? 0;
            }

            $count = count($tweets);
            $avgRetweets = round($totalRetweets / $count);
            $avgLikes = round($totalLikes / $count);
            $avgReplies = round($totalReplies / $count);
            $avgQuotes = round($totalQuotes / $count);

            $followerCount = $profile['follower_count'];
            $avgEngagement = $avgRetweets + $avgLikes + $avgReplies + $avgQuotes;
            $engagementRate = $followerCount > 0
                ? ($avgEngagement / $followerCount) * 100
                : 0;

            return [
                'avg_retweets' => $avgRetweets,
                'avg_likes' => $avgLikes,
                'avg_replies' => $avgReplies,
                'avg_quotes' => $avgQuotes,
                'avg_engagement' => $avgEngagement,
                'engagement_rate' => round($engagementRate, 2),
                'total_tweets' => $profile['tweet_count'],
            ];
        } catch (\Exception $e) {
            Log::error('Twitter API error in fetchMetrics', [
                'username' => $username,
                'error' => $e->getMessage(),
            ]);

            return [
                'avg_retweets' => 0,
                'avg_likes' => 0,
                'avg_replies' => 0,
                'engagement_rate' => 0,
            ];
        }
    }

    public function search(string $query, ?string $category = null): array
    {
        try {
            // Enhance search query with category if provided
            $searchQuery = $category ? "{$query} {$category}" : $query;

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->bearerToken}",
            ])->get("{$this->baseUrl}/users/search", [
                'query' => $searchQuery,
                'max_results' => 20,
                'user.fields' => 'id,name,username,description,profile_image_url,public_metrics,verified',
            ]);

            if ($response->failed()) {
                Log::warning('Twitter search failed', [
                    'query' => $query,
                    'response' => $response->body(),
                ]);

                return [];
            }

            $data = $response->json();
            $users = $data['data'] ?? [];

            return array_map(function ($user) use ($query) {
                return [
                    'user_id' => $user['id'],
                    'username' => $user['username'],
                    'display_name' => $user['name'],
                    'bio' => $user['description'] ?? null,
                    'follower_count' => $user['public_metrics']['followers_count'] ?? 0,
                    'profile_picture_url' => $user['profile_image_url'] ?? null,
                    'verified' => $user['verified'] ?? false,
                    'relevance_score' => $this->calculateRelevance($user, $query),
                ];
            }, $users);
        } catch (\Exception $e) {
            Log::error('Twitter API error in search', [
                'query' => $query,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    public function validateConnection(string $url): bool
    {
        // Parse Twitter URL to get username
        $patterns = [
            '/twitter\.com\/([a-zA-Z0-9_]+)/',
            '/x\.com\/([a-zA-Z0-9_]+)/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                $username = $matches[1];

                try {
                    $profile = $this->fetchProfile($username);

                    return ! empty($profile['user_id']);
                } catch (\Exception $e) {
                    continue;
                }
            }
        }

        return false;
    }

    protected function getBasicMetrics(array $profile): array
    {
        return [
            'total_tweets' => $profile['tweet_count'] ?? 0,
            'avg_retweets' => 0,
            'avg_likes' => 0,
            'avg_replies' => 0,
            'engagement_rate' => 0,
        ];
    }

    protected function calculateRelevance(array $user, string $query): float
    {
        $score = 0.5; // Base score

        // Boost if verified
        if ($user['verified'] ?? false) {
            $score += 0.2;
        }

        // Boost if query appears in username
        if (stripos($user['username'] ?? '', $query) !== false) {
            $score += 0.2;
        }

        // Boost if query appears in display name
        if (stripos($user['name'] ?? '', $query) !== false) {
            $score += 0.1;
        }

        return min(1.0, $score);
    }
}

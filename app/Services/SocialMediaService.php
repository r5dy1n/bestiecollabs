<?php

namespace App\Services;

use App\Models\Creator;
use App\Models\SocialConnection;
use App\Services\SocialMedia\SocialMediaFactory;

class SocialMediaService
{
    protected array $supportedPlatforms = ['instagram', 'tiktok', 'youtube', 'twitter'];

    public function syncPlatform(Creator $creator, string $platform): array
    {
        $url = $this->getPlatformUrl($creator, $platform);

        if (! $url) {
            throw new \Exception("No URL found for platform: {$platform}");
        }

        $username = $this->extractUsername($url);
        $provider = SocialMediaFactory::make($platform);

        $profile = $provider->fetchProfile($username);
        $metrics = $provider->fetchMetrics($username);

        $platformData = array_merge($profile, [
            'engagement_metrics' => $metrics,
        ]);

        $this->updateCreatorMetadata($creator, $platform, $platformData);
        $this->updateSocialConnection($creator, $platform, $platformData);

        return $platformData;
    }

    public function searchCreators(string $query, string $platform, ?string $category = null): array
    {
        if (! in_array($platform, $this->supportedPlatforms)) {
            throw new \InvalidArgumentException("Unsupported platform: {$platform}");
        }

        $provider = SocialMediaFactory::make($platform);

        return $provider->search($query, $category);
    }

    public function importCreator(array $profileData, string $platform): Creator
    {
        $creator = Creator::create([
            'creator_name' => $profileData['display_name'] ?? $profileData['username'],
            'description' => $profileData['bio'] ?? '',
            "{$platform}_url" => $this->constructPlatformUrl($platform, $profileData['username']),
            'category_primary' => 'General',
            'follower_age_min' => 18,
            'follower_age_max' => 65,
            'language' => 'English',
            'us_based' => true,
        ]);

        $this->syncPlatform($creator, $platform);

        return $creator;
    }

    protected function getPlatformUrl(Creator $creator, string $platform): ?string
    {
        return match ($platform) {
            'instagram' => $creator->instagram_url,
            'tiktok' => $creator->tiktok_url,
            'youtube' => $creator->youtube_url,
            'twitter' => $creator->twitter_url,
            default => null,
        };
    }

    protected function extractUsername(string $url): string
    {
        $parts = parse_url($url);
        $path = $parts['path'] ?? '';

        return trim($path, '/') ?: 'unknown';
    }

    protected function updateSocialConnection(Creator $creator, string $platform, array $data): void
    {
        $user = $creator->user;

        if (! $user) {
            return;
        }

        $connection = SocialConnection::where('user_id', $user->id)
            ->where('platform', $platform)
            ->where('status', 'connected')
            ->first();

        if (! $connection) {
            return;
        }

        $connection->update([
            'followers' => $data['follower_count'] ?? $data['subscriber_count'] ?? null,
            'posts_count' => $data['media_count'] ?? $data['video_count'] ?? $data['tweet_count'] ?? null,
            'engagement_rate' => $data['engagement_metrics']['engagement_rate'] ?? null,
            'platform_metadata' => $data,
            'last_sync_at' => now(),
        ]);
    }

    protected function updateCreatorMetadata(Creator $creator, string $platform, array $data): void
    {
        $metadata = $creator->social_metadata ?? [];
        $metadata[$platform] = $data;

        $creator->update([
            'social_metadata' => $metadata,
        ]);
    }

    protected function constructPlatformUrl(string $platform, string $username): string
    {
        return match ($platform) {
            'instagram' => 'https://instagram.com/'.ltrim($username, '@'),
            'tiktok' => 'https://tiktok.com/'.ltrim($username, '@'),
            'youtube' => 'https://youtube.com/channel/'.$username,
            'twitter' => 'https://x.com/'.ltrim($username, '@'),
            default => '',
        };
    }
}

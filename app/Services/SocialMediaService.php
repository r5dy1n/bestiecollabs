<?php

namespace App\Services;

use App\Models\Creator;
use App\Services\SocialMedia\SocialMediaFactory;

class SocialMediaService
{
    protected array $supportedPlatforms = ['instagram', 'tiktok', 'youtube', 'twitter'];

    public function syncCreator(Creator $creator, ?array $platforms = null): array
    {
        $platforms = $platforms ?? $this->getCreatorPlatforms($creator);
        $results = [];

        foreach ($platforms as $platform) {
            if (! in_array($platform, $this->supportedPlatforms)) {
                $results[$platform] = [
                    'success' => false,
                    'error' => "Unsupported platform: {$platform}",
                ];

                continue;
            }

            try {
                $result = $this->syncPlatform($creator, $platform);
                $results[$platform] = [
                    'success' => true,
                    'data' => $result,
                ];
            } catch (\Exception $e) {
                $results[$platform] = [
                    'success' => false,
                    'error' => $e->getMessage(),
                ];
            }
        }

        $creator->update(['last_synced_at' => now()]);

        return $results;
    }

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

    protected function getCreatorPlatforms(Creator $creator): array
    {
        $platforms = [];

        if ($creator->instagram_url) {
            $platforms[] = 'instagram';
        }

        if ($creator->tiktok_url) {
            $platforms[] = 'tiktok';
        }

        if ($creator->youtube_url) {
            $platforms[] = 'youtube';
        }

        if ($creator->twitter_url) {
            $platforms[] = 'twitter';
        }

        return $platforms;
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

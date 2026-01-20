<?php

namespace App\Services\SocialMedia;

use App\Services\SocialMedia\Contracts\SocialMediaPlatformInterface;
use App\Services\SocialMedia\MockProviders\InstagramMockProvider;
use App\Services\SocialMedia\MockProviders\TikTokMockProvider;
use App\Services\SocialMedia\MockProviders\TwitterMockProvider;
use App\Services\SocialMedia\MockProviders\YouTubeMockProvider;
use App\Services\SocialMedia\Providers\InstagramProvider;
use App\Services\SocialMedia\Providers\TikTokProvider;
use App\Services\SocialMedia\Providers\TwitterProvider;
use App\Services\SocialMedia\Providers\YouTubeProvider;

class SocialMediaFactory
{
    public static function make(string $platform): SocialMediaPlatformInterface
    {
        $useMock = config('services.social_media.use_mock', true);

        if ($useMock) {
            return self::makeMockProvider($platform);
        }

        return self::makeRealProvider($platform);
    }

    protected static function makeMockProvider(string $platform): SocialMediaPlatformInterface
    {
        return match ($platform) {
            'instagram' => new InstagramMockProvider,
            'tiktok' => new TikTokMockProvider,
            'youtube' => new YouTubeMockProvider,
            'twitter' => new TwitterMockProvider,
            default => throw new \InvalidArgumentException("Unsupported platform: {$platform}"),
        };
    }

    protected static function makeRealProvider(string $platform): SocialMediaPlatformInterface
    {
        return match ($platform) {
            'instagram' => new InstagramProvider,
            'tiktok' => new TikTokProvider,
            'youtube' => new YouTubeProvider,
            'twitter' => new TwitterProvider,
            default => throw new \InvalidArgumentException("Unsupported platform: {$platform}"),
        };
    }
}

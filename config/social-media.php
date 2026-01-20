<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Social Media Platform Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration for social media platform integrations
    | including rate limits, enabled platforms, and sync settings.
    |
    */

    'platforms' => [
        'instagram' => [
            'enabled' => env('INSTAGRAM_ENABLED', true),
            'rate_limit' => 200,
            'rate_limit_period' => 'hour',
        ],

        'tiktok' => [
            'enabled' => env('TIKTOK_ENABLED', true),
            'rate_limit' => 100,
            'rate_limit_period' => 'hour',
        ],

        'youtube' => [
            'enabled' => env('YOUTUBE_ENABLED', true),
            'rate_limit' => 1000,
            'rate_limit_period' => 'day',
        ],

        'twitter' => [
            'enabled' => env('TWITTER_ENABLED', true),
            'rate_limit' => 500,
            'rate_limit_period' => 'hour',
        ],
    ],

    'sync' => [
        'batch_size' => env('SOCIAL_SYNC_BATCH_SIZE', 50),
        'timeout' => env('SOCIAL_SYNC_TIMEOUT', 300),
        'retry_attempts' => 3,
        'retry_delay' => 60,
    ],

    'cache' => [
        'enabled' => env('SOCIAL_MEDIA_CACHE_ENABLED', true),
        'ttl' => env('SOCIAL_MEDIA_CACHE_TTL', 3600),
    ],

];

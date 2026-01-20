<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'social_media' => [
        'use_mock' => env('SOCIAL_MEDIA_USE_MOCK', true),

        'instagram' => [
            'api_key' => env('INSTAGRAM_API_KEY'),
            'api_secret' => env('INSTAGRAM_API_SECRET'),
            'access_token' => env('INSTAGRAM_ACCESS_TOKEN'),
            'business_account_id' => env('INSTAGRAM_BUSINESS_ACCOUNT_ID'),
        ],

        'tiktok' => [
            'api_key' => env('TIKTOK_API_KEY'),
            'api_secret' => env('TIKTOK_API_SECRET'),
            'access_token' => env('TIKTOK_ACCESS_TOKEN'),
            'research_access_token' => env('TIKTOK_RESEARCH_ACCESS_TOKEN'),
        ],

        'youtube' => [
            'api_key' => env('YOUTUBE_API_KEY'),
        ],

        'twitter' => [
            'api_key' => env('TWITTER_API_KEY'),
            'api_secret' => env('TWITTER_API_SECRET'),
            'bearer_token' => env('TWITTER_BEARER_TOKEN'),
        ],
    ],

];

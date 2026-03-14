<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Social Media Platform Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration for social media platform integrations.
    |
    */

    'sync' => [
        'batch_size' => env('SOCIAL_SYNC_BATCH_SIZE', 50),
    ],

];

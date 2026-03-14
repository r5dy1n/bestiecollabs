<?php

namespace App\Services\SocialMedia\Contracts;

interface SocialMediaPlatformInterface
{
    public function fetchProfile(string $username): array;

    public function fetchMetrics(string $username): array;

    public function search(string $query, ?string $category = null): array;
}

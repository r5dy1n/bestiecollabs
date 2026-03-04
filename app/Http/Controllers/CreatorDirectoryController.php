<?php

namespace App\Http\Controllers;

use App\Models\Creator;
use Inertia\Inertia;
use Inertia\Response;

class CreatorDirectoryController extends Controller
{
    public function index(): Response
    {
        $query = Creator::query()->where('us_based', true);

        // Search by creator name or description
        if (request('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('creator_name', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        // Filter by category
        if (request('category')) {
            $category = request('category');
            $query->where(function ($q) use ($category) {
                $q->where('category_primary', $category)
                    ->orWhere('category_secondary', $category)
                    ->orWhere('category_tertiary', $category);
            });
        }

        // Filter by age range
        if (request('age_min') || request('age_max')) {
            $ageMin = request('age_min', 18);
            $ageMax = request('age_max', 100);
            $query->where('follower_age_min', '<=', $ageMax)
                ->where('follower_age_max', '>=', $ageMin);
        }

        // Sort by bestie score or latest
        $sortBy = request('sort', 'latest');
        if ($sortBy === 'bestie_score') {
            $query->orderBy('bestie_score', 'desc');
        } else {
            $query->latest();
        }

        $creators = $query->paginate(12)->withQueryString();

        return Inertia::render('CreatorDirectory/Index', [
            'creators' => $creators,
            'filters' => [
                'search' => request('search'),
                'category' => request('category'),
                'age_min' => request('age_min'),
                'age_max' => request('age_max'),
                'sort' => request('sort', 'latest'),
            ],
        ]);
    }

    public function show(Creator $creator): Response
    {
        $creator->load('user.socialConnections');

        $topMatches = $creator->matches()
            ->with('brand')
            ->orderBy('match_score', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($match) {
                return [
                    'brand' => $match->brand,
                    'match_score' => $match->match_score,
                ];
            });

        $socialConnections = $creator->user?->socialConnections
            ->filter(fn ($connection) => $connection->isConnected())
            ->mapWithKeys(fn ($connection) => [
                $connection->platform => [
                    'platform' => $connection->platform,
                    'handle' => $connection->handle,
                    'followers' => $connection->followers,
                    'posts_count' => $connection->posts_count,
                    'engagement_rate' => $connection->engagement_rate,
                    'last_sync_at' => $connection->last_sync_at?->toISOString(),
                ],
            ]) ?? collect();

        return Inertia::render('CreatorDirectory/Show', [
            'creator' => $creator,
            'topMatches' => $topMatches,
            'socialConnections' => $socialConnections,
        ]);
    }
}

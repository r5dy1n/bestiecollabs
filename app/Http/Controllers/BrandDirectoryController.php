<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\BrandCreatorMatch;
use Inertia\Inertia;
use Inertia\Response;

class BrandDirectoryController extends Controller
{
    public function index(): Response
    {
        $query = Brand::query()->where('us_based', true);

        // Search by brand name or description
        if (request('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('brand_name', 'ilike', "%{$search}%")
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
            $query->where('customer_age_min', '<=', $ageMax)
                ->where('customer_age_max', '>=', $ageMin);
        }

        // Sort by bestie score or latest
        $sortBy = request('sort', 'latest');
        if ($sortBy === 'bestie_score') {
            $query->orderBy('bestie_score', 'desc');
        } else {
            $query->latest();
        }

        $brands = $query->with('directoryCard')->paginate(12)->withQueryString();

        $brandIds = $brands->pluck('id')->toArray();

        $topMatches = BrandCreatorMatch::query()
            ->with('creator:id,creator_name')
            ->whereIn('brand_id', $brandIds)
            ->orderByDesc('match_score')
            ->get()
            ->groupBy('brand_id');

        $brandsData = $brands->getCollection()->map(function (Brand $brand) use ($topMatches) {
            return array_merge($brand->toArray(), [
                'top_creator_matches' => ($topMatches[$brand->id] ?? collect())
                    ->take(5)
                    ->map(fn (BrandCreatorMatch $m) => [
                        'creator_name' => $m->creator->creator_name,
                        'match_score' => $m->match_score,
                    ])
                    ->values()
                    ->toArray(),
            ]);
        });

        return Inertia::render('BrandDirectory/Index', [
            'brands' => [
                'data' => $brandsData,
                'current_page' => $brands->currentPage(),
                'last_page' => $brands->lastPage(),
                'per_page' => $brands->perPage(),
                'total' => $brands->total(),
            ],
            'filters' => [
                'search' => request('search'),
                'category' => request('category'),
                'age_min' => request('age_min'),
                'age_max' => request('age_max'),
                'sort' => request('sort', 'latest'),
            ],
        ]);
    }

    public function show(Brand $brand): Response
    {
        $topMatches = $brand->matches()
            ->with('creator')
            ->orderBy('match_score', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($match) {
                return [
                    'creator' => $match->creator,
                    'match_score' => $match->match_score,
                ];
            });

        return Inertia::render('BrandDirectory/Show', [
            'brand' => $brand,
            'topMatches' => $topMatches,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Services\SocialMedia\SocialMediaFactory;
use App\Services\SocialMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FindCreatorController extends Controller
{
    public function __construct(
        protected SocialMediaService $socialMediaService
    ) {}

    public function index(): Response
    {
        return Inertia::render('FindCreator/Index');
    }

    public function show(string $username): Response
    {
        $platforms = ['instagram', 'tiktok', 'youtube', 'twitter'];
        $profiles = [];

        foreach ($platforms as $platform) {
            try {
                $provider = SocialMediaFactory::make($platform);
                $profile = $provider->fetchProfile($username);
                $metrics = $provider->fetchMetrics($username);

                $profiles[$platform] = array_merge($profile, [
                    'engagement_metrics' => $metrics,
                ]);
            } catch (\Exception $e) {
                $profiles[$platform] = null;
            }
        }

        return Inertia::render('FindCreator/Show', [
            'username' => $username,
            'profiles' => $profiles,
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'query' => ['required', 'string', 'min:3', 'max:255'],
            'platform' => ['required', 'string', 'in:instagram,tiktok,youtube,twitter'],
            'category' => ['nullable', 'string', 'in:fashion,beauty,fitness,food,travel,tech,gaming,business,education,entertainment,music,sports,parenting,diy,home'],
        ]);

        try {
            $results = $this->socialMediaService->searchCreators(
                $validated['query'],
                $validated['platform'],
                $validated['category'] ?? null
            );

            return response()->json([
                'success' => true,
                'results' => $results,
                'platform' => $validated['platform'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

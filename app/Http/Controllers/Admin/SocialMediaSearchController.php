<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImportCreatorFromSocialRequest;
use App\Http\Requests\SocialMediaSearchRequest;
use App\Services\SocialMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SocialMediaSearchController extends Controller
{
    public function __construct(
        protected SocialMediaService $socialMediaService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/SocialMedia/Search');
    }

    public function search(SocialMediaSearchRequest $request): JsonResponse
    {
        $validated = $request->validated();

        try {
            $results = $this->socialMediaService->searchCreators(
                $validated['query'],
                $validated['platform']
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

    public function import(ImportCreatorFromSocialRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        try {
            $creator = $this->socialMediaService->importCreator(
                $validated['profile_data'],
                $validated['platform']
            );

            return redirect()
                ->route('admin.creators.show', $creator)
                ->with('success', "Creator '{$creator->creator_name}' imported successfully from {$validated['platform']}");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Failed to import creator: {$e->getMessage()}");
        }
    }
}

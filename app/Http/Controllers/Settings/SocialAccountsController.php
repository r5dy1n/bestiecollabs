<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConnectSocialAccountRequest;
use App\Jobs\SyncCreatorSocialMedia;
use App\Models\Creator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SocialAccountsController extends Controller
{
    public function edit(): Response
    {
        $user = auth()->user();
        $creator = $user->creator;

        if (! $creator) {
            $creator = Creator::create([
                'user_id' => $user->id,
                'creator_name' => $user->name,
                'description' => 'My creator profile',
                'category_primary' => 'General',
                'follower_age_min' => 18,
                'follower_age_max' => 65,
                'language' => 'English',
                'us_based' => true,
            ]);
        }

        return Inertia::render('settings/social-accounts', [
            'creator' => $creator->load('socialSyncJobs'),
        ]);
    }

    public function connect(ConnectSocialAccountRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = auth()->user();
        $creator = $user->creator;

        if (! $creator) {
            return redirect()
                ->back()
                ->with('error', 'Creator profile not found. Please refresh the page.');
        }

        $urlField = "{$validated['platform']}_url";
        $creator->update([
            $urlField => $validated['url'],
        ]);

        SyncCreatorSocialMedia::dispatch($creator, [$validated['platform']]);

        return redirect()
            ->back()
            ->with('success', ucfirst($validated['platform']).' account connected successfully. Syncing data...');
    }

    public function disconnect(string $platform): RedirectResponse
    {
        $validPlatforms = ['instagram', 'tiktok', 'youtube', 'twitter'];

        if (! in_array($platform, $validPlatforms)) {
            return redirect()
                ->back()
                ->with('error', 'Invalid platform.');
        }

        $user = auth()->user();
        $creator = $user->creator;

        if (! $creator) {
            return redirect()
                ->back()
                ->with('error', 'Creator profile not found.');
        }

        $urlField = "{$platform}_url";
        $creator->update([
            $urlField => null,
        ]);

        $metadata = $creator->social_metadata ?? [];
        unset($metadata[$platform]);
        $creator->update(['social_metadata' => $metadata]);

        return redirect()
            ->back()
            ->with('success', ucfirst($platform).' account disconnected successfully.');
    }

    public function sync(string $platform): RedirectResponse
    {
        $validPlatforms = ['instagram', 'tiktok', 'youtube', 'twitter'];

        if (! in_array($platform, $validPlatforms)) {
            return redirect()
                ->back()
                ->with('error', 'Invalid platform.');
        }

        $user = auth()->user();
        $creator = $user->creator;

        if (! $creator) {
            return redirect()
                ->back()
                ->with('error', 'Creator profile not found.');
        }

        SyncCreatorSocialMedia::dispatch($creator, [$platform]);

        return redirect()
            ->back()
            ->with('success', ucfirst($platform).' sync started. This may take a few moments.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SyncAllCreators;
use App\Jobs\SyncCreatorSocialMedia;
use App\Models\Creator;
use Illuminate\Http\RedirectResponse;

class CreatorSocialSyncController extends Controller
{
    public function sync(Creator $creator): RedirectResponse
    {
        SyncCreatorSocialMedia::dispatch($creator);

        return redirect()
            ->back()
            ->with('success', "Social media sync started for {$creator->creator_name}. This may take a few moments.");
    }

    public function syncPlatform(Creator $creator, string $platform): RedirectResponse
    {
        $validPlatforms = ['instagram', 'tiktok', 'youtube', 'twitter'];

        if (! in_array($platform, $validPlatforms)) {
            return redirect()
                ->back()
                ->with('error', "Invalid platform: {$platform}");
        }

        SyncCreatorSocialMedia::dispatch($creator, [$platform]);

        return redirect()
            ->back()
            ->with('success', ucfirst($platform)." sync started for {$creator->creator_name}");
    }

    public function bulkSync(): RedirectResponse
    {
        SyncAllCreators::dispatch();

        return redirect()
            ->back()
            ->with('success', 'Bulk sync job dispatched. All creators with social media URLs will be synced.');
    }
}

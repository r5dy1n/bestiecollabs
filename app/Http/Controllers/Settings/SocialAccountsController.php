<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Jobs\SyncCreatorSocialMedia;
use App\Models\SocialConnection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

class SocialAccountsController extends Controller
{
    private const VALID_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'twitter'];

    /**
     * Maps our platform names to Socialite driver names.
     */
    private const PLATFORM_DRIVERS = [
        'instagram' => 'instagram',
        'tiktok' => 'tiktok',
        'youtube' => 'google',
        'twitter' => 'twitter-oauth-2',
    ];

    /**
     * Scopes per platform.
     *
     * @var array<string, list<string>>
     */
    private const PLATFORM_SCOPES = [
        'instagram' => ['user_profile', 'user_media'],
        'tiktok' => ['user.info.basic'],
        'youtube' => ['https://www.googleapis.com/auth/youtube.readonly'],
        'twitter' => ['tweet.read', 'users.read'],
    ];

    public function edit(): Response
    {
        $user = Auth::user();

        $connections = $user->socialConnections
            ->keyBy('platform');

        return Inertia::render('settings/social-accounts', [
            'connections' => $connections,
        ]);
    }

    public function redirect(string $platform): \Symfony\Component\HttpFoundation\RedirectResponse
    {
        if (! $this->isValidPlatform($platform)) {
            return redirect()
                ->route('social-accounts.edit')
                ->with('error', 'Invalid platform.');
        }

        $driver = self::PLATFORM_DRIVERS[$platform];
        $scopes = self::PLATFORM_SCOPES[$platform] ?? [];

        return Socialite::driver($driver)
            ->scopes($scopes)
            ->redirect();
    }

    public function callback(string $platform): RedirectResponse
    {
        if (! $this->isValidPlatform($platform)) {
            return redirect()
                ->route('social-accounts.edit')
                ->with('error', 'Invalid platform.');
        }

        $driver = self::PLATFORM_DRIVERS[$platform];

        try {
            $socialUser = Socialite::driver($driver)->user();
        } catch (\Exception $e) {
            return redirect()
                ->route('social-accounts.edit')
                ->with('error', 'Failed to connect '.ucfirst($platform).'. Please try again.');
        }

        $user = Auth::user();

        $connection = SocialConnection::updateOrCreate(
            [
                'user_id' => $user->id,
                'platform' => $platform,
            ],
            [
                'platform_user_id' => $socialUser->getId(),
                'handle' => $socialUser->getNickname() ?? $socialUser->getName(),
                'access_token' => $socialUser->token,
                'refresh_token' => $socialUser->refreshToken ?? null,
                'token_expires_at' => $socialUser->expiresIn
                    ? now()->addSeconds($socialUser->expiresIn)
                    : null,
                'status' => 'connected',
                'metrics_source' => 'oauth',
            ],
        );

        // Update Creator's platform URL for backwards compatibility
        $creator = $user->creator;
        if ($creator) {
            $urlField = "{$platform}_url";
            $profileUrl = $this->buildProfileUrl($platform, $socialUser->getNickname() ?? $socialUser->getId());
            $creator->update([$urlField => $profileUrl]);

            SyncCreatorSocialMedia::dispatch($creator, [$platform]);
        }

        return redirect()
            ->route('social-accounts.edit')
            ->with('success', ucfirst($platform).' account connected successfully.');
    }

    public function disconnect(string $platform): RedirectResponse
    {
        if (! $this->isValidPlatform($platform)) {
            return redirect()
                ->back()
                ->with('error', 'Invalid platform.');
        }

        $user = Auth::user();

        $connection = $user->socialConnections()
            ->where('platform', $platform)
            ->first();

        if ($connection) {
            $connection->update([
                'status' => 'disconnected',
                'access_token' => null,
                'refresh_token' => null,
                'token_expires_at' => null,
            ]);
        }

        // Also clear Creator's platform URL
        $creator = $user->creator;
        if ($creator) {
            $urlField = "{$platform}_url";
            $creator->update([$urlField => null]);

            $metadata = $creator->social_metadata ?? [];
            unset($metadata[$platform]);
            $creator->update(['social_metadata' => $metadata]);
        }

        return redirect()
            ->back()
            ->with('success', ucfirst($platform).' account disconnected successfully.');
    }

    public function sync(string $platform): RedirectResponse
    {
        if (! $this->isValidPlatform($platform)) {
            return redirect()
                ->back()
                ->with('error', 'Invalid platform.');
        }

        $user = Auth::user();
        $creator = $user->creator;

        if (! $creator) {
            return redirect()
                ->back()
                ->with('error', 'Creator profile not found.');
        }

        $connection = $user->socialConnections()
            ->where('platform', $platform)
            ->where('status', 'connected')
            ->first();

        if (! $connection) {
            return redirect()
                ->back()
                ->with('error', ucfirst($platform).' is not connected.');
        }

        SyncCreatorSocialMedia::dispatch($creator, [$platform]);

        return redirect()
            ->back()
            ->with('success', ucfirst($platform).' sync started. This may take a few moments.');
    }

    private function isValidPlatform(string $platform): bool
    {
        return in_array($platform, self::VALID_PLATFORMS);
    }

    private function buildProfileUrl(string $platform, string $identifier): string
    {
        return match ($platform) {
            'instagram' => "https://instagram.com/{$identifier}",
            'tiktok' => "https://tiktok.com/@{$identifier}",
            'youtube' => "https://youtube.com/channel/{$identifier}",
            'twitter' => "https://x.com/{$identifier}",
            default => $identifier,
        };
    }
}

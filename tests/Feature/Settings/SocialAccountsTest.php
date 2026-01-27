<?php

namespace Tests\Feature\Settings;

use App\Jobs\SyncCreatorSocialMedia;
use App\Models\Creator;
use App\Models\SocialConnection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Tests\TestCase;

class SocialAccountsTest extends TestCase
{
    use RefreshDatabase;

    public function test_social_accounts_page_renders(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get(route('social-accounts.edit'));

        $response->assertOk();
    }

    public function test_oauth_redirect_works_for_valid_platform(): void
    {
        $user = User::factory()->create();

        $providerMock = \Mockery::mock(\Laravel\Socialite\Contracts\Provider::class);
        $providerMock->shouldReceive('scopes')->andReturnSelf();
        $providerMock->shouldReceive('redirect')->andReturn(
            redirect('https://accounts.google.com/o/oauth2/auth')
        );

        Socialite::shouldReceive('driver')
            ->with('google')
            ->andReturn($providerMock);

        $response = $this
            ->actingAs($user)
            ->get(route('social-accounts.redirect', 'youtube'));

        $response->assertRedirect();
    }

    public function test_oauth_redirect_rejects_invalid_platform(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get(route('social-accounts.redirect', 'linkedin'));

        $response->assertRedirect(route('social-accounts.edit'));
        $response->assertSessionHas('error', 'Invalid platform.');
    }

    public function test_oauth_callback_creates_connection(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $creator = Creator::factory()->create(['user_id' => $user->id]);

        $socialiteUser = new SocialiteUser;
        $socialiteUser->id = '123456789';
        $socialiteUser->nickname = 'testcreator';
        $socialiteUser->name = 'Test Creator';
        $socialiteUser->token = 'mock-access-token';
        $socialiteUser->refreshToken = 'mock-refresh-token';
        $socialiteUser->expiresIn = 3600;

        $providerMock = \Mockery::mock(\Laravel\Socialite\Contracts\Provider::class);
        $providerMock->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')
            ->with('instagram')
            ->andReturn($providerMock);

        $response = $this
            ->actingAs($user)
            ->get(route('social-accounts.callback', 'instagram'));

        $response->assertRedirect(route('social-accounts.edit'));
        $response->assertSessionHas('success', 'Instagram account connected successfully.');

        $this->assertDatabaseHas('social_connections', [
            'user_id' => $user->id,
            'platform' => 'instagram',
            'platform_user_id' => '123456789',
            'handle' => 'testcreator',
            'status' => 'connected',
        ]);

        Queue::assertPushed(SyncCreatorSocialMedia::class);
    }

    public function test_oauth_callback_handles_provider_failure(): void
    {
        $user = User::factory()->create();

        $providerMock = \Mockery::mock(\Laravel\Socialite\Contracts\Provider::class);
        $providerMock->shouldReceive('user')->andThrow(new \Exception('OAuth failed'));

        Socialite::shouldReceive('driver')
            ->with('instagram')
            ->andReturn($providerMock);

        $response = $this
            ->actingAs($user)
            ->get(route('social-accounts.callback', 'instagram'));

        $response->assertRedirect(route('social-accounts.edit'));
        $response->assertSessionHas('error', 'Failed to connect Instagram. Please try again.');

        $this->assertDatabaseMissing('social_connections', [
            'user_id' => $user->id,
            'platform' => 'instagram',
        ]);
    }

    public function test_disconnect_sets_status_to_disconnected(): void
    {
        $user = User::factory()->create();
        $creator = Creator::factory()->create(['user_id' => $user->id, 'instagram_url' => 'https://instagram.com/test']);

        SocialConnection::factory()->instagram()->create([
            'user_id' => $user->id,
            'status' => 'connected',
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('social-accounts.disconnect', 'instagram'));

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Instagram account disconnected successfully.');

        $this->assertDatabaseHas('social_connections', [
            'user_id' => $user->id,
            'platform' => 'instagram',
            'status' => 'disconnected',
        ]);

        $creator->refresh();
        $this->assertNull($creator->instagram_url);
    }

    public function test_disconnect_rejects_invalid_platform(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete(route('social-accounts.disconnect', 'linkedin'));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Invalid platform.');
    }

    public function test_sync_dispatches_job_for_connected_platform(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $creator = Creator::factory()->create(['user_id' => $user->id]);

        SocialConnection::factory()->instagram()->create([
            'user_id' => $user->id,
            'status' => 'connected',
        ]);

        $response = $this
            ->actingAs($user)
            ->post(route('social-accounts.sync', 'instagram'));

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Instagram sync started. This may take a few moments.');

        Queue::assertPushed(SyncCreatorSocialMedia::class);
    }

    public function test_sync_fails_when_platform_not_connected(): void
    {
        $user = User::factory()->create();
        Creator::factory()->create(['user_id' => $user->id]);

        $response = $this
            ->actingAs($user)
            ->post(route('social-accounts.sync', 'instagram'));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Instagram is not connected.');
    }

    public function test_sync_fails_without_creator_profile(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('social-accounts.sync', 'instagram'));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Creator profile not found.');
    }

    public function test_oauth_callback_updates_existing_connection(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $creator = Creator::factory()->create(['user_id' => $user->id]);

        SocialConnection::factory()->instagram()->create([
            'user_id' => $user->id,
            'handle' => 'oldhandle',
            'status' => 'disconnected',
        ]);

        $socialiteUser = new SocialiteUser;
        $socialiteUser->id = '999';
        $socialiteUser->nickname = 'newhandle';
        $socialiteUser->name = 'New Handle';
        $socialiteUser->token = 'new-token';
        $socialiteUser->refreshToken = null;
        $socialiteUser->expiresIn = null;

        $providerMock = \Mockery::mock(\Laravel\Socialite\Contracts\Provider::class);
        $providerMock->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')
            ->with('instagram')
            ->andReturn($providerMock);

        $response = $this
            ->actingAs($user)
            ->get(route('social-accounts.callback', 'instagram'));

        $response->assertRedirect(route('social-accounts.edit'));

        $this->assertDatabaseHas('social_connections', [
            'user_id' => $user->id,
            'platform' => 'instagram',
            'handle' => 'newhandle',
            'status' => 'connected',
        ]);

        // Should only have one connection for this user+platform
        $this->assertDatabaseCount('social_connections', 1);
    }

    public function test_unauthenticated_user_cannot_access_social_accounts(): void
    {
        $response = $this->get(route('social-accounts.edit'));

        $response->assertRedirect(route('login'));
    }
}

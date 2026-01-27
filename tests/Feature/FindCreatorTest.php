<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FindCreatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('find-creators.show', ['username' => 'testuser']))
            ->assertRedirect(route('login'));
    }

    public function test_creator_detail_page_renders(): void
    {
        $this->actingAs(User::factory()->create());

        $response = $this->get(route('find-creators.show', ['username' => 'testuser']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('FindCreator/Show')
            ->has('username')
            ->has('profiles')
            ->where('username', 'testuser')
            ->has('profiles.instagram')
            ->has('profiles.tiktok')
            ->has('profiles.youtube')
            ->has('profiles.twitter')
        );
    }

    public function test_profiles_contain_engagement_metrics(): void
    {
        $this->actingAs(User::factory()->create());

        $response = $this->get(route('find-creators.show', ['username' => 'testuser']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('FindCreator/Show')
            ->has('profiles.instagram.engagement_metrics')
            ->has('profiles.tiktok.engagement_metrics')
            ->has('profiles.youtube.engagement_metrics')
            ->has('profiles.twitter.engagement_metrics')
        );
    }
}

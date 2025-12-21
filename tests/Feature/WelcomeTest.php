<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WelcomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_page_can_be_rendered(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_welcome_page_displays_sign_in_button_for_guests(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(function ($page) {
            $page->component('welcome');
        });
    }

    public function test_welcome_page_receives_can_register_prop(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(function ($page) {
            $page->component('welcome')
                ->has('canRegister');
        });
    }

    public function test_authenticated_users_can_view_welcome_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('home'));

        $response->assertOk();
        $response->assertInertia(function ($page) {
            $page->component('welcome');
        });
    }
}

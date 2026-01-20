<?php

namespace Tests\Feature\Auth;

use App\Enums\UserType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get(route('register'));

        $response->assertStatus(200);
    }

    public function test_new_creator_can_register(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test Creator',
            'email' => 'creator@example.com',
            'user_type' => 'creator',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::where('email', 'creator@example.com')->first();
        $this->assertEquals(UserType::Creator, $user->user_type);
        $this->assertTrue($user->isCreator());
        $this->assertFalse($user->isBrand());
    }

    public function test_new_brand_can_register(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test Brand',
            'email' => 'brand@example.com',
            'user_type' => 'brand',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::where('email', 'brand@example.com')->first();
        $this->assertEquals(UserType::Brand, $user->user_type);
        $this->assertTrue($user->isBrand());
        $this->assertFalse($user->isCreator());
    }

    public function test_registration_requires_user_type(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('user_type');
        $this->assertGuest();
    }

    public function test_registration_rejects_invalid_user_type(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'user_type' => 'invalid',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('user_type');
        $this->assertGuest();
    }
}

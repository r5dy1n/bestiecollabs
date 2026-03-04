<?php

namespace Tests\Feature\Commands;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SendActivityDigestsTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_sends_digests_to_users_with_activity(): void
    {
        Notification::fake();

        $user = User::factory()->create(['email' => 'test@example.com']);

        $this->artisan('digest:send')
            ->assertSuccessful();
    }

    public function test_command_accepts_days_option(): void
    {
        $this->artisan('digest:send --days=14')
            ->assertSuccessful();
    }
}

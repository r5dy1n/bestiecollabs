<?php

namespace Tests\Unit\Notifications;

use App\Models\Brand;
use App\Models\Creator;
use App\Models\Message;
use App\Models\User;
use App\Notifications\NewMessageNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewMessageNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_notification_includes_sender_name_for_brand(): void
    {
        $brand = Brand::factory()->create(['brand_name' => 'TestBrand']);
        $creator = Creator::factory()->create();
        $user = User::factory()->create();

        $message = Message::create([
            'sender_type' => Brand::class,
            'sender_id' => $brand->id,
            'recipient_type' => Creator::class,
            'recipient_id' => $creator->id,
            'message_content' => 'Test message',
        ]);

        $notification = new NewMessageNotification($message);
        $mailMessage = $notification->toMail($user);

        $this->assertStringContainsString('TestBrand', $mailMessage->subject);
    }

    public function test_notification_includes_message_preview(): void
    {
        $brand = Brand::factory()->create();
        $creator = Creator::factory()->create();
        $user = User::factory()->create();

        $message = Message::create([
            'sender_type' => Brand::class,
            'sender_id' => $brand->id,
            'recipient_type' => Creator::class,
            'recipient_id' => $creator->id,
            'message_content' => 'This is a test message that should be visible in the preview',
        ]);

        $notification = new NewMessageNotification($message);
        $mailMessage = $notification->toMail($user);

        $this->assertStringContainsString('test message', $mailMessage->render());
    }

    public function test_notification_truncates_long_messages(): void
    {
        $brand = Brand::factory()->create();
        $creator = Creator::factory()->create();
        $user = User::factory()->create();

        $longMessage = str_repeat('This is a long message. ', 50);
        $message = Message::create([
            'sender_type' => Brand::class,
            'sender_id' => $brand->id,
            'recipient_type' => Creator::class,
            'recipient_id' => $creator->id,
            'message_content' => $longMessage,
        ]);

        $notification = new NewMessageNotification($message);
        $array = $notification->toArray($user);

        $this->assertLessThan(strlen($longMessage), strlen($array['content_preview']));
    }

    public function test_notification_via_includes_mail_and_database(): void
    {
        $message = Message::factory()->create();
        $user = User::factory()->create();

        $notification = new NewMessageNotification($message);
        $channels = $notification->via($user);

        $this->assertContains('mail', $channels);
        $this->assertContains('database', $channels);
    }
}

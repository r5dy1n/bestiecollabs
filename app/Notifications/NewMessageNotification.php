<?php

namespace App\Notifications;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewMessageNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private Message $message
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $senderType = class_basename($this->message->sender_type);
        $senderName = $senderType === 'Brand'
            ? $this->message->sender->brand_name
            : $this->message->sender->creator_name;

        return (new MailMessage)
            ->subject("New message from {$senderName}")
            ->greeting("Hello!")
            ->line("You have received a new message from {$senderName}.")
            ->line(substr($this->message->content, 0, 200).(strlen($this->message->content) > 200 ? '...' : ''))
            ->action('View Message', url('/messages/'.$this->message->sender_type.'/'.$this->message->sender_id))
            ->line('Thank you for using Bestie Collabs!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message_id' => $this->message->id,
            'sender_type' => $this->message->sender_type,
            'sender_id' => $this->message->sender_id,
            'content_preview' => substr($this->message->content, 0, 100),
        ];
    }
}

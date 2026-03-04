<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ActivityDigestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private array $data
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject("Your Weekly Activity Summary")
            ->greeting("Hello!")
            ->line("Here's your weekly activity summary on Bestie Collabs:");

        if (isset($this->data['new_messages']) && $this->data['new_messages'] > 0) {
            $mail->line("📬 **{$this->data['new_messages']}** new messages");
        }

        if (isset($this->data['new_matches']) && $this->data['new_matches'] > 0) {
            $mail->line("🎯 **{$this->data['new_matches']}** new high-quality matches");
        }

        if (isset($this->data['active_collaborations']) && $this->data['active_collaborations'] > 0) {
            $mail->line("🤝 **{$this->data['active_collaborations']}** active collaborations");
        }

        if (isset($this->data['profile_views']) && $this->data['profile_views'] > 0) {
            $mail->line("👀 **{$this->data['profile_views']}** profile views");
        }

        $mail->action('View Dashboard', url('/dashboard'))
            ->line("Keep building great collaborations!");

        return $mail;
    }

    public function toArray(object $notifiable): array
    {
        return $this->data;
    }
}

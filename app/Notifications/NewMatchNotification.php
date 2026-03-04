<?php

namespace App\Notifications;

use App\Models\BrandCreatorMatch;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewMatchNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private BrandCreatorMatch $match,
        private string $recipientType // 'brand' or 'creator'
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $match = $this->match;
        $score = number_format($match->total_score, 2);

        if ($this->recipientType === 'brand') {
            $partnerName = $match->creator->creator_name;
            $partnerType = 'creator';
            $viewUrl = route('creators.show', $match->creator);
        } else {
            $partnerName = $match->brand->brand_name;
            $partnerType = 'brand';
            $viewUrl = route('brands.show', $match->brand);
        }

        return (new MailMessage)
            ->subject("New High-Quality Match Found!")
            ->greeting("Great news!")
            ->line("We found a potential collaboration partner for you!")
            ->line("**{$partnerName}** is a {$score}/5.0 match based on:")
            ->line("- Audience alignment")
            ->line("- Category compatibility")
            ->line("- Geographic fit")
            ->line("- Quality metrics")
            ->action("View {$partnerType} Profile", $viewUrl)
            ->line("Start a conversation to explore this collaboration opportunity!");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'match_id' => $this->match->id,
            'total_score' => $this->match->total_score,
            'recipient_type' => $this->recipientType,
            'brand_id' => $this->match->brand_id,
            'creator_id' => $this->match->creator_id,
        ];
    }
}

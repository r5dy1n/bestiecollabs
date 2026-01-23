<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class ContactTest extends TestCase
{
    public function test_contact_form_submission_requires_all_fields(): void
    {
        $response = $this->post('/contact', []);

        $response->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
    }

    public function test_contact_form_requires_valid_email(): void
    {
        $response = $this->post('/contact', [
            'name' => 'Test User',
            'email' => 'invalid-email',
            'subject' => 'Test Subject',
            'message' => 'Test message content.',
        ]);

        $response->assertSessionHasErrors(['email']);
    }

    public function test_contact_form_can_be_submitted(): void
    {
        Log::shouldReceive('info')
            ->once()
            ->with('Contact form submission', [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'subject' => 'Test Subject',
                'message' => 'This is a test message.',
            ]);

        $response = $this->post('/contact', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'subject' => 'Test Subject',
            'message' => 'This is a test message.',
        ]);

        $response->assertRedirect('/contact');
        $response->assertSessionHas('success');
    }
}

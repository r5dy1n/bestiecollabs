<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(ContactRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Log the contact form submission for now
        // In production, you would send an email or store in database
        Log::info('Contact form submission', $validated);

        return redirect()
            ->route('contact')
            ->with('success', 'Thank you for your message. We\'ll get back to you soon!');
    }
}

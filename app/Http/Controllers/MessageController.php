<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Creator;
use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    /**
     * Display the user's message inbox with all conversations.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get all unique conversations (grouped by the other party)
        $conversations = Message::query()
            ->where(function ($query) use ($user) {
                $query->where('sender_id', $user->id)
                    ->where('sender_type', get_class($user))
                    ->orWhere(function ($q) use ($user) {
                        $q->where('recipient_id', $user->id)
                            ->where('recipient_type', get_class($user));
                    });
            })
            ->with(['sender', 'recipient'])
            ->latest()
            ->get()
            ->groupBy(function ($message) use ($user) {
                // Group by the "other" party in the conversation
                if ($message->sender_id === $user->id && $message->sender_type === get_class($user)) {
                    return $message->recipient_type.':'.$message->recipient_id;
                }

                return $message->sender_type.':'.$message->sender_id;
            })
            ->map(function ($messages) use ($user) {
                $latestMessage = $messages->first();

                // Determine the other party
                if ($latestMessage->sender_id === $user->id && $latestMessage->sender_type === get_class($user)) {
                    $otherParty = $latestMessage->recipient;
                } else {
                    $otherParty = $latestMessage->sender;
                }

                // Count unread messages from this conversation
                $unreadCount = $messages->where('recipient_id', $user->id)
                    ->where('recipient_type', get_class($user))
                    ->where('read_status', false)
                    ->count();

                return [
                    'other_party' => $otherParty,
                    'other_party_type' => get_class($otherParty),
                    'latest_message' => $latestMessage,
                    'unread_count' => $unreadCount,
                ];
            })
            ->values();

        return Inertia::render('Messages/Index', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * Display a conversation with a specific user.
     */
    public function show(Request $request, string $type, string $id): Response
    {
        $user = $request->user();

        // Load the other party
        $otherParty = $type === 'Brand' ? Brand::findOrFail($id) : Creator::findOrFail($id);

        // Get all messages in this conversation
        $messages = Message::query()
            ->where(function ($query) use ($user, $otherParty, $type) {
                $query->where('sender_id', $user->id)
                    ->where('sender_type', get_class($user))
                    ->where('recipient_id', $otherParty->id)
                    ->where('recipient_type', $type);
            })
            ->orWhere(function ($query) use ($user, $otherParty, $type) {
                $query->where('sender_id', $otherParty->id)
                    ->where('sender_type', $type)
                    ->where('recipient_id', $user->id)
                    ->where('recipient_type', get_class($user));
            })
            ->with(['sender', 'recipient'])
            ->oldest()
            ->get();

        // Mark messages as read
        Message::query()
            ->where('recipient_id', $user->id)
            ->where('recipient_type', get_class($user))
            ->where('sender_id', $otherParty->id)
            ->where('sender_type', $type)
            ->where('read_status', false)
            ->update(['read_status' => true]);

        return Inertia::render('Messages/Show', [
            'messages' => $messages,
            'otherParty' => $otherParty,
            'otherPartyType' => $type,
        ]);
    }

    /**
     * Send a new message.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'recipient_type' => ['required', 'in:Brand,Creator'],
            'recipient_id' => ['required', 'uuid'],
            'message_content' => ['required', 'string', 'max:5000'],
        ]);

        $user = $request->user();

        // Load recipient to verify it exists
        $recipient = $validated['recipient_type'] === 'Brand'
            ? Brand::findOrFail($validated['recipient_id'])
            : Creator::findOrFail($validated['recipient_id']);

        // Check if recipient can receive direct messages (7+ outreach attempts)
        if (! $recipient->canReceiveDirectMessages()) {
            return redirect()->back()->with('error', 'This contact must have 7+ outreach attempts before direct messaging is enabled.');
        }

        Message::create([
            'sender_id' => $user->id,
            'sender_type' => get_class($user),
            'recipient_id' => $recipient->id,
            'recipient_type' => $validated['recipient_type'],
            'message_content' => $validated['message_content'],
        ]);

        return redirect()->back()->with('success', 'Message sent successfully.');
    }
}

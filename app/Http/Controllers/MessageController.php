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
     * Resolve the current user's messaging identity (Brand or Creator).
     */
    private function resolveIdentity(Request $request): Brand|Creator|null
    {
        $user = $request->user();

        if ($user->isBrand()) {
            return $user->brand;
        }

        if ($user->isCreator()) {
            return $user->creator;
        }

        return null;
    }

    /**
     * Display the user's message inbox with all conversations.
     */
    public function index(Request $request): Response
    {
        $identity = $this->resolveIdentity($request);
        $identityType = $request->user()->isBrand() ? 'Brand' : 'Creator';

        if (! $identity) {
            return Inertia::render('Messages/Index', ['conversations' => []]);
        }

        $conversations = Message::query()
            ->where(function ($query) use ($identity, $identityType) {
                $query->where('sender_id', $identity->id)
                    ->where('sender_type', $identityType)
                    ->orWhere(function ($q) use ($identity, $identityType) {
                        $q->where('recipient_id', $identity->id)
                            ->where('recipient_type', $identityType);
                    });
            })
            ->with(['sender', 'recipient'])
            ->latest()
            ->get()
            ->groupBy(function ($message) use ($identity, $identityType) {
                if ($message->sender_id === $identity->id && $message->sender_type === $identityType) {
                    return $message->recipient_type.':'.$message->recipient_id;
                }

                return $message->sender_type.':'.$message->sender_id;
            })
            ->map(function ($messages) use ($identity, $identityType) {
                $latest = $messages->first();
                $isSender = $latest->sender_id === $identity->id && $latest->sender_type === $identityType;
                $otherParty = $isSender ? $latest->recipient : $latest->sender;
                $otherPartyType = $isSender ? $latest->recipient_type : $latest->sender_type;

                $unreadCount = $messages
                    ->where('recipient_id', $identity->id)
                    ->where('recipient_type', $identityType)
                    ->where('read_status', false)
                    ->count();

                return [
                    'other_party' => $otherParty,
                    'other_party_type' => $otherPartyType,
                    'latest_message' => $latest,
                    'unread_count' => $unreadCount,
                ];
            })
            ->values();

        return Inertia::render('Messages/Index', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * Display a conversation with a specific Brand or Creator.
     */
    public function show(Request $request, string $type, string $id): Response
    {
        $identity = $this->resolveIdentity($request);
        $identityType = $request->user()->isBrand() ? 'Brand' : 'Creator';

        if (! $identity) {
            abort(403, 'You need a brand or creator profile to view messages.');
        }

        $otherParty = $type === 'Brand' ? Brand::findOrFail($id) : Creator::findOrFail($id);

        $messages = Message::query()
            ->where(function ($query) use ($identity, $identityType, $otherParty, $type) {
                $query->where('sender_id', $identity->id)
                    ->where('sender_type', $identityType)
                    ->where('recipient_id', $otherParty->id)
                    ->where('recipient_type', $type);
            })
            ->orWhere(function ($query) use ($identity, $identityType, $otherParty, $type) {
                $query->where('sender_id', $otherParty->id)
                    ->where('sender_type', $type)
                    ->where('recipient_id', $identity->id)
                    ->where('recipient_type', $identityType);
            })
            ->with(['sender', 'recipient'])
            ->oldest()
            ->get();

        Message::query()
            ->where('recipient_id', $identity->id)
            ->where('recipient_type', $identityType)
            ->where('sender_id', $otherParty->id)
            ->where('sender_type', $type)
            ->where('read_status', false)
            ->update(['read_status' => true]);

        return Inertia::render('Messages/Show', [
            'messages' => $messages,
            'otherParty' => $otherParty,
            'otherPartyType' => $type,
            'currentIdentityId' => $identity->id,
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

        $identity = $this->resolveIdentity($request);

        if (! $identity) {
            return redirect()->back()->with('error', 'You need a brand or creator profile to send messages.');
        }

        $senderType = $request->user()->isBrand() ? 'Brand' : 'Creator';

        $recipient = $validated['recipient_type'] === 'Brand'
            ? Brand::findOrFail($validated['recipient_id'])
            : Creator::findOrFail($validated['recipient_id']);

        Message::create([
            'sender_id' => $identity->id,
            'sender_type' => $senderType,
            'recipient_id' => $recipient->id,
            'recipient_type' => $validated['recipient_type'],
            'message_content' => $validated['message_content'],
        ]);

        return redirect()->back()->with('success', 'Message sent successfully.');
    }
}

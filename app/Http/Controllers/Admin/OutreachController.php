<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Creator;
use App\Models\OutreachAttempt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OutreachController extends Controller
{
    public function index(Request $request): Response
    {
        $query = OutreachAttempt::query()
            ->with(['contactable', 'initiatedBy'])
            ->latest();

        if ($request->has('contactable_type')) {
            $query->where('contactable_type', $request->get('contactable_type'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        if ($request->has('channel')) {
            $query->where('channel', $request->get('channel'));
        }

        $attempts = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Outreach/Index', [
            'attempts' => $attempts,
            'filters' => [
                'contactable_type' => $request->get('contactable_type'),
                'status' => $request->get('status'),
                'channel' => $request->get('channel'),
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $contactableType = $request->get('type');
        $contactableId = $request->get('id');

        $contactable = null;
        if ($contactableType === 'Brand' && $contactableId) {
            $contactable = Brand::find($contactableId);
        } elseif ($contactableType === 'Creator' && $contactableId) {
            $contactable = Creator::find($contactableId);
        }

        return Inertia::render('Admin/Outreach/Create', [
            'contactable' => $contactable,
            'contactable_type' => $contactableType,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'contactable_type' => ['required', 'in:Brand,Creator'],
            'contactable_id' => ['required', 'uuid'],
            'channel' => ['required', 'in:email,instagram,tiktok'],
            'message_content' => ['required', 'string', 'max:5000'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        // Get the next attempt number for this contactable entity
        $attemptNumber = OutreachAttempt::where('contactable_type', $validated['contactable_type'])
            ->where('contactable_id', $validated['contactable_id'])
            ->max('attempt_number') + 1;

        OutreachAttempt::create([
            'contactable_type' => $validated['contactable_type'],
            'contactable_id' => $validated['contactable_id'],
            'initiated_by' => $request->user()->id,
            'channel' => $validated['channel'],
            'status' => 'pending',
            'attempt_number' => $attemptNumber,
            'message_content' => $validated['message_content'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('admin.outreach.index')->with('success', 'Outreach attempt created successfully.');
    }

    public function show(OutreachAttempt $outreach): Response
    {
        $outreach->load(['contactable', 'initiatedBy']);

        return Inertia::render('Admin/Outreach/Show', [
            'attempt' => $outreach,
        ]);
    }

    public function updateStatus(Request $request, OutreachAttempt $outreach): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,sent,responded,failed,bounced'],
            'response_content' => ['nullable', 'string', 'max:5000'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $updates = [
            'status' => $validated['status'],
        ];

        if ($validated['status'] === 'sent') {
            $updates['sent_at'] = now();
        } elseif ($validated['status'] === 'responded') {
            $updates['responded_at'] = now();
            $updates['response_content'] = $validated['response_content'] ?? null;
        }

        if (isset($validated['notes'])) {
            $updates['notes'] = $validated['notes'];
        }

        $outreach->update($updates);

        return redirect()->back()->with('success', 'Outreach status updated successfully.');
    }
}

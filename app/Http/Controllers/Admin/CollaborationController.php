<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Collaboration;
use App\Models\Creator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CollaborationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Collaboration::query()
            ->with(['brand', 'creator'])
            ->latest();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        // Filter by connection type
        if ($request->has('connection_type')) {
            $query->where('connection_type', $request->get('connection_type'));
        }

        // Filter by collaboration type
        if ($request->has('collaboration_type')) {
            $query->where('collaboration_type', $request->get('collaboration_type'));
        }

        // Filter by brand
        if ($request->has('brand_id')) {
            $query->where('brand_id', $request->get('brand_id'));
        }

        // Filter by creator
        if ($request->has('creator_id')) {
            $query->where('creator_id', $request->get('creator_id'));
        }

        $collaborations = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Collaborations/Index', [
            'collaborations' => $collaborations,
            'filters' => $request->only(['status', 'connection_type', 'collaboration_type', 'brand_id', 'creator_id']),
        ]);
    }

    public function create(Request $request): Response
    {
        $brands = Brand::orderBy('brand_name')->get(['id', 'brand_name']);
        $creators = Creator::orderBy('creator_name')->get(['id', 'creator_name']);

        // Pre-fill if brand_id or creator_id is provided
        $prefilledBrandId = $request->get('brand_id');
        $prefilledCreatorId = $request->get('creator_id');

        return Inertia::render('Admin/Collaborations/Create', [
            'brands' => $brands,
            'creators' => $creators,
            'prefilled_brand_id' => $prefilledBrandId,
            'prefilled_creator_id' => $prefilledCreatorId,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'brand_id' => ['required', 'uuid', 'exists:brands,id'],
            'creator_id' => ['required', 'uuid', 'exists:creators,id'],
            'status' => ['required', 'in:pending,active,completed,cancelled'],
            'connection_type' => ['required', 'in:connected,unconnected'],
            'collaboration_type' => ['required', 'in:paid,free,commission,product_exchange'],
            'commission_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'fixed_payment' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:3'],
            'agreement_template' => ['nullable', 'string'],
            'deliverables' => ['nullable', 'string'],
            'terms' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'posts_required' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
        ], [
            'brand_id.required' => 'Please select a brand.',
            'creator_id.required' => 'Please select a creator.',
            'end_date.after_or_equal' => 'End date must be after or equal to start date.',
            'commission_rate.max' => 'Commission rate cannot exceed 100%.',
        ]);

        // Check if collaboration already exists
        $existingCollaboration = Collaboration::where('brand_id', $validated['brand_id'])
            ->where('creator_id', $validated['creator_id'])
            ->first();

        if ($existingCollaboration) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'A collaboration already exists between this brand and creator.');
        }

        $collaboration = Collaboration::create($validated);

        return redirect()->route('admin.collaborations.show', $collaboration)
            ->with('success', 'Collaboration created successfully.');
    }

    public function show(Collaboration $collaboration): Response
    {
        $collaboration->load(['brand', 'creator']);

        return Inertia::render('Admin/Collaborations/Show', [
            'collaboration' => $collaboration,
        ]);
    }

    public function update(Request $request, Collaboration $collaboration): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'in:pending,active,completed,cancelled'],
            'connection_type' => ['sometimes', 'in:connected,unconnected'],
            'collaboration_type' => ['sometimes', 'in:paid,free,commission,product_exchange'],
            'commission_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'fixed_payment' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:3'],
            'agreement_template' => ['nullable', 'string'],
            'deliverables' => ['nullable', 'string'],
            'terms' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'posts_required' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $collaboration->update($validated);

        return redirect()->route('admin.collaborations.show', $collaboration)
            ->with('success', 'Collaboration updated successfully.');
    }

    public function updateStatus(Request $request, Collaboration $collaboration): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,active,completed,cancelled'],
        ]);

        // If marking as completed, set completed_at timestamp
        if ($validated['status'] === 'completed' && $collaboration->status !== 'completed') {
            $collaboration->markAsCompleted();
        } else {
            $collaboration->update($validated);
        }

        return redirect()->route('admin.collaborations.show', $collaboration)
            ->with('success', 'Collaboration status updated successfully.');
    }

    public function addPayment(Request $request, Collaboration $collaboration): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_date' => ['required', 'date'],
        ]);

        $collaboration->amount_paid += $validated['amount'];
        $collaboration->last_payment_date = $validated['payment_date'];

        // Update payment status based on amounts
        $totalOwed = $collaboration->collaboration_type === 'commission'
            ? $collaboration->commission_earned
            : $collaboration->fixed_payment;

        if ($totalOwed && $collaboration->amount_paid >= $totalOwed) {
            $collaboration->payment_status = 'paid';
        } elseif ($collaboration->amount_paid > 0) {
            $collaboration->payment_status = 'partial';
        }

        $collaboration->save();

        return redirect()->route('admin.collaborations.show', $collaboration)
            ->with('success', 'Payment recorded successfully.');
    }

    public function addRevenue(Request $request, Collaboration $collaboration): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
        ]);

        $collaboration->addRevenue($validated['amount']);

        return redirect()->route('admin.collaborations.show', $collaboration)
            ->with('success', 'Revenue added and commission calculated successfully.');
    }

    public function updateDeliverables(Request $request, Collaboration $collaboration): RedirectResponse
    {
        $validated = $request->validate([
            'posts_delivered' => ['required', 'integer', 'min:0'],
        ]);

        $collaboration->update($validated);

        return redirect()->route('admin.collaborations.show', $collaboration)
            ->with('success', 'Deliverables updated successfully.');
    }
}

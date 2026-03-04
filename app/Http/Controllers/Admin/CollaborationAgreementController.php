<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\CollaborationAgreement;
use App\Models\Creator;
use App\Services\AIScriptGenerator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CollaborationAgreementController extends Controller
{
    public function __construct(
        private AIScriptGenerator $scriptGenerator
    ) {}

    public function index(Request $request): Response
    {
        $query = CollaborationAgreement::with(['brand', 'creator'])
            ->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $agreements = $query->paginate(20);

        return Inertia::render('Admin/Agreements/Index', [
            'agreements' => $agreements,
            'filters' => $request->only(['status']),
        ]);
    }

    public function create(Request $request): Response
    {
        $brandId = $request->query('brand_id');
        $creatorId = $request->query('creator_id');

        return Inertia::render('Admin/Agreements/Create', [
            'brands' => Brand::select('id', 'brand_name')->get(),
            'creators' => Creator::select('id', 'creator_name')->get(),
            'preselectedBrand' => $brandId ? Brand::find($brandId) : null,
            'preselectedCreator' => $creatorId ? Creator::find($creatorId) : null,
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'brand_id' => 'required|uuid|exists:brands,id',
            'creator_id' => 'required|uuid|exists:creators,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'payment_type' => 'required|in:commission,fixed,hybrid',
            'commission_percentage' => 'nullable|numeric|min:0|max:100',
            'fixed_payment' => 'nullable|numeric|min:0',
            'content_deliverables' => 'required|integer|min:1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'terms' => 'nullable|array',
            'generate_script' => 'boolean',
        ]);

        $agreement = CollaborationAgreement::create($validated);

        if ($request->boolean('generate_script')) {
            $script = $this->scriptGenerator->generate($agreement);
            $agreement->update(['ai_generated_script' => $script]);
        }

        return redirect()
            ->route('admin.agreements.show', $agreement)
            ->with('success', 'Collaboration agreement created successfully.');
    }

    public function show(CollaborationAgreement $agreement): Response
    {
        $agreement->load(['brand', 'creator', 'payments']);

        return Inertia::render('Admin/Agreements/Show', [
            'agreement' => $agreement,
            'totalPaid' => $agreement->totalPaid(),
        ]);
    }

    public function edit(CollaborationAgreement $agreement): Response
    {
        $agreement->load(['brand', 'creator']);

        return Inertia::render('Admin/Agreements/Edit', [
            'agreement' => $agreement,
            'brands' => Brand::select('id', 'brand_name')->get(),
            'creators' => Creator::select('id', 'creator_name')->get(),
        ]);
    }

    public function update(Request $request, CollaborationAgreement $agreement): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:draft,pending,accepted,active,completed,cancelled',
            'payment_type' => 'required|in:commission,fixed,hybrid',
            'commission_percentage' => 'nullable|numeric|min:0|max:100',
            'fixed_payment' => 'nullable|numeric|min:0',
            'content_deliverables' => 'required|integer|min:1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'terms' => 'nullable|array',
        ]);

        $agreement->update($validated);

        return redirect()
            ->route('admin.agreements.show', $agreement)
            ->with('success', 'Agreement updated successfully.');
    }

    public function regenerateScript(CollaborationAgreement $agreement): \Illuminate\Http\RedirectResponse
    {
        $script = $this->scriptGenerator->generate($agreement);
        $agreement->update(['ai_generated_script' => $script]);

        return redirect()
            ->route('admin.agreements.show', $agreement)
            ->with('success', 'AI script regenerated successfully.');
    }

    public function destroy(CollaborationAgreement $agreement): \Illuminate\Http\RedirectResponse
    {
        $agreement->delete();

        return redirect()
            ->route('admin.agreements.index')
            ->with('success', 'Agreement deleted successfully.');
    }
}

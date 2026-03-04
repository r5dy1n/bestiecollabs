<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CollaborationAgreement;
use App\Models\CollaborationPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CollaborationPaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = CollaborationPayment::with(['agreement.brand', 'agreement.creator'])
            ->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $payments = $query->paginate(20);

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['status']),
        ]);
    }

    public function create(Request $request): Response
    {
        $agreementId = $request->query('agreement_id');
        $agreement = $agreementId ? CollaborationAgreement::with(['brand', 'creator'])->find($agreementId) : null;

        return Inertia::render('Admin/Payments/Create', [
            'agreements' => CollaborationAgreement::with(['brand', 'creator'])
                ->where('status', '!=', 'cancelled')
                ->get(),
            'preselectedAgreement' => $agreement,
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'agreement_id' => 'required|uuid|exists:collaboration_agreements,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|in:stripe,paypal,manual',
            'status' => 'required|in:pending,processing,completed,failed,refunded',
            'transaction_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validated['status'] === 'completed') {
            $validated['paid_at'] = now();
        }

        $payment = CollaborationPayment::create($validated);

        return redirect()
            ->route('admin.payments.show', $payment)
            ->with('success', 'Payment created successfully.');
    }

    public function show(CollaborationPayment $payment): Response
    {
        $payment->load(['agreement.brand', 'agreement.creator']);

        return Inertia::render('Admin/Payments/Show', [
            'payment' => $payment,
        ]);
    }

    public function edit(CollaborationPayment $payment): Response
    {
        $payment->load(['agreement.brand', 'agreement.creator']);

        return Inertia::render('Admin/Payments/Edit', [
            'payment' => $payment,
        ]);
    }

    public function update(Request $request, CollaborationPayment $payment): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'status' => 'required|in:pending,processing,completed,failed,refunded',
            'payment_method' => 'required|in:stripe,paypal,manual',
            'transaction_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validated['status'] === 'completed' && $payment->status !== 'completed') {
            $validated['paid_at'] = now();
        }

        $payment->update($validated);

        return redirect()
            ->route('admin.payments.show', $payment)
            ->with('success', 'Payment updated successfully.');
    }

    public function markAsPaid(Request $request, CollaborationPayment $payment): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'transaction_id' => 'nullable|string|max:255',
        ]);

        $payment->markAsPaid($validated['transaction_id'] ?? null);

        return redirect()
            ->route('admin.payments.show', $payment)
            ->with('success', 'Payment marked as paid.');
    }

    public function destroy(CollaborationPayment $payment): \Illuminate\Http\RedirectResponse
    {
        $payment->delete();

        return redirect()
            ->route('admin.payments.index')
            ->with('success', 'Payment deleted successfully.');
    }
}

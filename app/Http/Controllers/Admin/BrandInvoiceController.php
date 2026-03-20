<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BrandInvoice;
use App\Services\StripeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandInvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $query = BrandInvoice::with('brand')
            ->orderByDesc('billing_period_start');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('brand')) {
            $query->whereHas('brand', function ($q) use ($request): void {
                $q->where('brand_name', 'like', "%{$request->input('brand')}%");
            });
        }

        return Inertia::render('Admin/Invoices/Index', [
            'invoices' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only('status', 'brand'),
        ]);
    }

    public function show(BrandInvoice $invoice): Response
    {
        $invoice->load('brand', 'lineItems.collaboration');

        return Inertia::render('Admin/Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function charge(Request $request, BrandInvoice $invoice): RedirectResponse
    {
        abort_if($invoice->status !== 'open', 422, 'Invoice must be open to charge.');

        try {
            app(StripeService::class)->chargeInvoice($invoice);
        } catch (\RuntimeException $e) {
            return redirect()->back()->withErrors(['charge' => $e->getMessage()]);
        }

        return redirect()->back();
    }

    public function void(Request $request, BrandInvoice $invoice): RedirectResponse
    {
        abort_if(! in_array($invoice->status, ['open', 'failed']), 422, 'Invoice cannot be voided.');

        $invoice->update(['status' => 'void']);

        return redirect()->back();
    }
}

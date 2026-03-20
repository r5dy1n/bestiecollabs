<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ApproveEarningRequest;
use App\Http\Requests\Admin\ReverseEarningRequest;
use App\Models\CreatorEarning;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreatorEarningController extends Controller
{
    public function index(Request $request): Response
    {
        $query = CreatorEarning::with(['creator', 'collaboration.brand'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('creator')) {
            $query->whereHas('creator', function ($q) use ($request): void {
                $q->where('creator_name', 'like', "%{$request->input('creator')}%");
            });
        }

        return Inertia::render('Admin/Earnings/Index', [
            'earnings' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only('status', 'creator'),
        ]);
    }

    public function approve(ApproveEarningRequest $request, CreatorEarning $earning): RedirectResponse
    {
        $holdDays = $earning->creator->payoutAccount?->holdPeriodDaysForTier() ?? 15;

        $earning->update([
            'status' => 'held',
            'approved_at' => now(),
            'hold_until' => now()->addDays($holdDays),
        ]);

        return redirect()->back();
    }

    public function reverse(ReverseEarningRequest $request, CreatorEarning $earning): RedirectResponse
    {
        $earning->update([
            'status' => 'reversed',
            'reversed_at' => now(),
            'reversal_reason' => $request->input('reason'),
        ]);

        if ($earning->status === 'paid_out') {
            CreatorEarning::create([
                'creator_id' => $earning->creator_id,
                'collaboration_id' => $earning->collaboration_id,
                'amount' => -abs($earning->amount),
                'status' => 'pending_approval',
                'reversal_reason' => "Recovery for reversed earning #{$earning->id}",
            ]);
        }

        return redirect()->back();
    }
}

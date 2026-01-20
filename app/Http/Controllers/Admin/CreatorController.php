<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCreatorRequest;
use App\Http\Requests\UpdateCreatorRequest;
use App\Models\Creator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CreatorController extends Controller
{
    public function index(): Response
    {
        $creators = Creator::query()
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Creators/Index', [
            'creators' => $creators,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Creators/Create');
    }

    public function store(StoreCreatorRequest $request): RedirectResponse
    {
        Creator::create($request->validated());

        return redirect()
            ->route('admin.creators.index')
            ->with('success', 'Creator created successfully.');
    }

    public function show(Creator $creator): Response
    {
        $creator->load(['outreachAttempts' => function ($query) {
            $query->with('initiatedBy')->latest()->limit(10);
        }, 'collaborations' => function ($query) {
            $query->with('brand')->latest();
        }]);

        return Inertia::render('Admin/Creators/Show', [
            'creator' => $creator,
            'can_receive_messages' => $creator->canReceiveDirectMessages(),
        ]);
    }

    public function edit(Creator $creator): Response
    {
        return Inertia::render('Admin/Creators/Edit', [
            'creator' => $creator,
        ]);
    }

    public function update(UpdateCreatorRequest $request, Creator $creator): RedirectResponse
    {
        $creator->update($request->validated());

        return redirect()
            ->route('admin.creators.index')
            ->with('success', 'Creator updated successfully.');
    }

    public function destroy(Creator $creator): RedirectResponse
    {
        $creator->delete();

        return redirect()
            ->route('admin.creators.index')
            ->with('success', 'Creator deleted successfully.');
    }
}

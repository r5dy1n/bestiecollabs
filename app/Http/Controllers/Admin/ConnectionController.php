<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Connection;
use App\Models\Creator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConnectionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Connection::with('connectable')
            ->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('connectable_type', $request->type);
        }

        $connections = $query->paginate(20);

        return Inertia::render('Admin/Connections/Index', [
            'connections' => $connections,
            'filters' => $request->only(['status', 'type']),
        ]);
    }

    public function create(Request $request): Response
    {
        $type = $request->query('type', 'brand');
        $id = $request->query('id');

        $entity = null;
        if ($id) {
            $entity = $type === 'brand'
                ? Brand::find($id)
                : Creator::find($id);
        }

        return Inertia::render('Admin/Connections/Create', [
            'type' => $type,
            'entity' => $entity,
            'brands' => Brand::select('id', 'brand_name')->get(),
            'creators' => Creator::select('id', 'creator_name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'connectable_type' => 'required|in:App\Models\Brand,App\Models\Creator',
            'connectable_id' => 'required|uuid',
            'connection_type' => 'nullable|in:instagram,tiktok,email',
            'status' => 'required|in:pending,verified,rejected',
            'metadata' => 'nullable|array',
        ]);

        if ($validated['status'] === 'verified') {
            $validated['verified_at'] = now();
        }

        $connection = Connection::create($validated);

        return redirect()
            ->route('admin.connections.show', $connection)
            ->with('success', 'Connection created successfully.');
    }

    public function show(Connection $connection): Response
    {
        $connection->load('connectable');

        return Inertia::render('Admin/Connections/Show', [
            'connection' => $connection,
        ]);
    }

    public function updateStatus(Request $request, Connection $connection)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,verified,rejected',
        ]);

        if ($validated['status'] === 'verified' && $connection->status !== 'verified') {
            $connection->verify();
        } else {
            $connection->update($validated);
        }

        return redirect()
            ->route('admin.connections.show', $connection)
            ->with('success', 'Connection status updated.');
    }

    public function destroy(Connection $connection)
    {
        $connection->delete();

        return redirect()
            ->route('admin.connections.index')
            ->with('success', 'Connection deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Status;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    public function index()
    {
        return response()->json(Status::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        $status = Status::create($validated);
        return response()->json($status, 201);
    }

    public function show(Status $status)
    {
        return response()->json($status);
    }

    public function update(Request $request, Status $status)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
        ]);

        $status->update($validated);
        return response()->json($status);
    }

    public function destroy(Status $status)
    {
        $status->delete();
        return response()->json(null, 204);
    }

    public function getStatuses()
    {
        $statuses = Status::all(['id', 'name']);
        return response()->json($statuses);
    }
}

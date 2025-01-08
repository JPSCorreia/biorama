<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);

        $user = User::create($validated);
        return response()->json($user, 201);
    }

    public function show()
    {
        $user = Auth::user();
        $user->load('home_addresses');
        return Inertia::render('Profile', [
            'user' => $user,
        ]);
    }

    public function edit()
    {
        return Inertia::render('ProfileEdit', [
            'user' => Auth::user(),

        ]);
    }

    public function update(UserRequest $request)
    {
        $user = Auth::user();
        try {
            $data = $request->validated();
            if ($request->hasFile('photo')) {
                $photo = $request->file('photo');
                $photoName = 'user_' . $user->id . '.' . $photo->getClientOriginalExtension();
                $photoPath = $photo->storeAs('vendor_photos', $photoName, 'public');
                $data['photo'] = 'storage/' . $photoPath;
            }

            $user->update($data);

            return redirect()->route('profile')->with('success', 'Perfil atualizado com sucesso!');
        } catch (\Exception $e) {
            return back()->withErrors(['Erro ao atualizar perfil.'])->withInput();
        }
    }


    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
}

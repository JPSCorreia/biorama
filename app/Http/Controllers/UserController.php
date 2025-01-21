<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\Gender;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json($users);
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
            'nif' => 'required|string|max:9|',
            'gender' => 'required|string',
        ]);

        $user = User::create($validated);
        return response()->json($user, 201);
    }

    public function show()
    {
        $user = Auth::user();
        $user->load('home_addresses', 'gender');
        $genders = Gender::all();

        return Inertia::render('Profile', [
            'user' => $user,
            'genders' => $genders,
        ]);
    }

    public function edit()
    {
        return Inertia::render('ProfileEditModal', [
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

            return response()->json([
                'message' => 'Utilizador atualizado com sucesso',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            return back()->withErrors(['Erro ao atualizar perfil.'])->withInput();
        }
    }


    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }

    public function get_user()
    {
        $user = Auth::user();
        $user->load('home_addresses', 'gender');
        return response()->json($user);
    }
}

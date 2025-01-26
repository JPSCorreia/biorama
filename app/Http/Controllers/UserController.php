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

        return Inertia::render('Profile/Home', ['user' => $user, 'genders' => $genders]);
    }

    public function edit()
    {
        return Inertia::render('ProfileEditModal', [
            'user' => Auth::user(),
        ]);
    }

    public function update(UserRequest $request)
    {
        $user = Auth::user(); // Obtém o utilizador autenticado

        try {
            // Valida os dados enviados
            $data = $request->validated();

            // Verifica se uma imagem foi carregada
            if ($request->hasFile('image_profile')) {
                $photo = $request->file('image_profile');

                // Gera o nome do ficheiro com base no ID do utilizador
                $photoName = 'user_' . $user->id . '.' . $photo->getClientOriginalExtension();

                // Armazena a imagem no diretório "storage/app/public/User"
                $photoPath = $photo->storeAs('User', $photoName, 'public');

                // Armazena apenas o caminho relativo no campo "image_profile"
                $data['image_profile'] = 'storage/' . $photoPath;
            }

            // Verifica se o campo `image_profile` está presente no request
            if (!isset($data['image_profile']) && $user->image_profile) {
                // Mantém o valor atual se nenhum novo ficheiro ou string foi enviado
                $data['image_profile'] = $user->image_profile;
            }

            // Atualiza o perfil do utilizador
            $user->update($data);
            $user->save();

            // Carrega as relações necessárias
            $user->load('gender');

            // Retorna a resposta com sucesso
            return response()->json([
                'message' => 'Utilizador atualizado com sucesso',
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            // Em caso de erro, retorna uma resposta com erro
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

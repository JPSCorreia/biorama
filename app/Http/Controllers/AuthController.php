<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Criar o usuário
        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Fazer login automático
        Auth::login($user);

        // Regenerar a sessão
        $request->session()->regenerate();

        // Redirecionar com mensagem de sucesso
        return redirect()->route('home')
            ->with('success', 'Registro realizado com sucesso!');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            
            // Log para debug
            Log::info('User logged in:', ['user' => Auth::user()]);
            
            return redirect()->intended(route('home'));
        }

        return back()
            ->withErrors(['email' => 'The provided credentials do not match our records.'])
            ->withInput($request->except('password'));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()->route('home');
    }

    public function getUser()
    {
        // Log para debug
        Log::info('Getting user data:', ['user' => Auth::user()]);
        
        return Auth::user();
    }
}

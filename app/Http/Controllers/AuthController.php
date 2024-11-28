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

        // Create user
        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Auto login
        Auth::login($user);

        // Regenerate session
        $request->session()->regenerate();

        // Redirect with success message
        return redirect()->route('home')
            ->with('success', 'Registro realizado com sucesso!');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            
            Log::info('Login attempt:', [
                'user' => Auth::user()->email,
                'remember' => $remember,
                'via_remember' => Auth::viaRemember(),
                'session_id' => session()->getId(),
                'remember_token' => Auth::user()->remember_token,
                'cookies' => array_keys($request->cookies->all())
            ]);
            // Regenerate session
            $request->session()->regenerate();

            return redirect()->intended(route('home'));
        }

        return back()
            ->withErrors(['email' => 'The provided credentials do not match our records.'])
            ->withInput($request->except('password'));
    }

    public function logout(Request $request)
    {

        Log::info('Logout attempt:', [
            'user' => Auth::user()?->email,
            'via_remember' => Auth::viaRemember(),
            'cookies' => array_keys($request->cookies->all())
        ]);

        Auth::logout();
        
        $request->session()->invalidate();

        $request->session()->regenerateToken();
        
        return redirect()->route('home');
    }

}

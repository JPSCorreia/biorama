<?php

namespace App\Http\Controllers;

use App\Http\Requests\VendorRequest;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;

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
            ->with('message', 'Registro realizado com sucesso!')
            ->with('type', 'success');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            // Regenerate session
            $request->session()->regenerate();

            Log::info('Login attempt:', [
                'user' => Auth::user()->email,
                'remember' => $remember,
                'via_remember' => Auth::viaRemember(),
                'session_id' => session()->getId(),
                'is_authenticated' => Auth::check()
            ]);

            return redirect()
                ->intended(route('home'))
                ->with('message', 'Palavra-passe alterada com sucesso!')
                ->with('type', 'success');
        }

        return back()
            ->withErrors(['email' => 'The provided credentials do not match our records.'])
            ->withInput($request->except('password'));
    }

    public function logout(Request $request)
    {
        Log::info('Logout attempt:', [
            'user' => Auth::user()?->email
        ]);

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');

    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Não encontramos nenhuma conta com este email.'
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return back()->with('status', 'Link de recuperação enviado para o seu email!');
        }

        return back()->withErrors(['email' => __($status)]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:users',
            'password' => 'required|min:8|confirmed',
        ], [
            'email.exists' => 'Email inválido.',
            'password.confirmed' => 'As palavras-passe não coincidem.'
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ]);

                $user->save();

                event(new PasswordReset($user));

                Auth::login($user);
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            $response = redirect()
                ->route('home')
                ->with('message', 'Palavra-passe alterada com sucesso!')
                ->with('type', 'success');

            return $response;
        }

        return back()->withErrors(['email' => [__($status)]]);
    }

    public function vendorRegister(VendorRequest $request)
    {
        try {
            // Obter o utilizador autenticado
            $user = auth()->user();

            if (!$user) {
                return response()->json(['error' => 'Utilizador não autenticado'], 403);
            }

            // Validar os dados recebidos no request
            $validatedData = $request->validated();

            if (!isset($validatedData['phone'])) {
                return response()->json(['error' => 'O campo phone é obrigatório e não foi enviado'], 422);
            }

            // Adicionar o user_id manualmente ao array de dados validados
            $validatedData['user_id'] = $user->id;

            // Debug: Verificar os dados recebidos
            //dd($validatedData);

            // Se houver um ficheiro de foto do vendedor
            if ($request->hasFile('vendor_photo')) {
                $image = $request->file('vendor_photo');
                $imageName = 'vendor_' . $user->id . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('vendor_photos', $imageName, 'public');
                $validatedData['vendor_photo'] = 'storage/' . $imagePath;
            }

            // Criar o registro do vendedor na base de dados
            Vendor::create($validatedData);

            return redirect()->route('home')
                ->with('message', 'Vendedor criado com sucesso!')
                ->with('type', 'success');

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao criar o vendedor', 'details' => $e->getMessage()], 500);
        }
    }




}

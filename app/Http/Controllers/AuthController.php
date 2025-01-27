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
            'nif' => 'required|string|min:9|',
        ]);

        // Create user
        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'nif' => $validated['nif'],
        ]);

        $user->assignRole('user');

        // Send verification email
        $user->sendEmailVerificationNotification();

        return redirect()->route('login')
        ->with('message', 'Email de verificação enviado. Verifique a sua caixa de entrada.')
        ->with('type', 'info');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            $user = Auth::user();

            if (!$user->hasVerifiedEmail()) {
                Auth::logout();

                return back()
                    ->withErrors(['email' => 'O seu email ainda não foi verificado. Por favor, verifique o seu email.'])
                    ->withInput($request->except('password'))
                    ->with('message', 'Utilizador não verificado. Por favor, verifique o seu email.')
                    ->with('type', 'error');
            }

            $request->session()->regenerate();

            Log::info('Login attempt:', [
                'user' => $user->email,
                'remember' => $remember,
                'via_remember' => Auth::viaRemember(),
                'session_id' => session()->getId(),
                'is_authenticated' => Auth::check()
            ]);

            // Verificar se o login ocorreu após a verificação do email
            if ($request->session()->pull('email_verified', false)) {
                return redirect()
                    ->intended(route('home'))
                    ->with('message', 'Email verificado com sucesso! Login efetuado automaticamente.')
                    ->with('type', 'success');
            }

            return redirect()
                ->intended(route('home'))
                ->with('message', 'Login efetuado com sucesso!')
                ->with('type', 'success');
        }

        return back()
            ->withErrors(['email' => 'Credenciais inválidas.'])
            ->withInput($request->except('password'))
            ->with('message', 'Email ou palavra-passe incorretos.')
            ->with('type', 'error');
    }



    public function logout(Request $request)
    {
        Log::info('Logout attempt:', [
            'user' => Auth::user()?->email
        ]);

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');

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


    public function verifyEmail(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if ($user->created_at->addHour()->isPast()) {
            $user->delete();

            return redirect()
                ->route('register')
                ->with('message', 'O link de verificação expirou. Registe-se novamente.')
                ->with('type', 'error');
        }


        if (!hash_equals(sha1($user->email), $hash)) {
            return redirect()->route('login')->with('message', 'Link de verificação inválido ou expirado.')
                ->with('type', 'error');
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            Auth::login($user);
            session()->flash('email_verified', true);
        }

        return redirect()->route('home')->with([
            'message' => 'Email verificado com sucesso!',
            'type' => 'success',
        ]);
    }


}

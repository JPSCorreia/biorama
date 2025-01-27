<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class VerifyEmailNotification extends Notification
{
    use Queueable;

    protected $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify', // Definir rota de verificação
            now()->addMinutes(60), // Link válido por 60 minutos
            ['id' => $this->user->id, 'hash' => sha1($this->user->email)]
        );

        return (new MailMessage)
            ->subject('Verifique o seu endereço de email')
            ->greeting('Olá ' . $this->user->first_name . '!')
            ->line('Por favor, clique no botão abaixo para verificar o seu email.')
            ->action('Verificar Email', $verificationUrl)
            ->line('Se não se registou na nossa plataforma, ignore este email.')
            ->salutation('Cumprimentos, a equipa da Biorama.');
    }
}

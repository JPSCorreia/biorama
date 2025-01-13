<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvoiceEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Dados a serem enviados com o email.
     *
     * @var array
     */
    public $data;

    /**
     * Criar uma nova instância do mailable.
     *
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Construir a mensagem.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Fatura da Compra') // Título do email
                    ->view('pdf.invoice') // View para o corpo do email
                    ->attachData($this->data['pdf'], 'invoice.pdf', [ // Anexar o PDF
                        'mime' => 'application/pdf',
                    ]);
    }
}

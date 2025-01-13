<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Ajusta caso tenhas middleware adicional
    }

    public function rules(): array
    {
        return [
            'order.name' => 'required|string|max:255',
            'order.total' => 'required|numeric',
            'user.email' => 'required|email',
        ];
    }
}


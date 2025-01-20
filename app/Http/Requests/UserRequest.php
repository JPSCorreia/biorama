<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determina se o utilizador está autorizado a fazer esta requisição.
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Regras de validação para esta requisição.
     */
    public function rules()
    {
        return [
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:15',
            'nif' => 'required|string|max:9',
            'date_of_birth' => 'nullable|date',
            'image_profile' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ];
    }




    /**
     * Mensagens personalizáveis para erros de validação.
     */
    public function messages()
    {
        return [
            'first_name.required' => 'O primeiro nome é obrigatório.',
            'first_name.string' => 'O primeiro nome deve ser um texto.',
            'first_name.max' => 'O primeiro nome não pode ter mais de 100 caracteres.',

            'last_name.required' => 'O último nome é obrigatório.',
            'last_name.string' => 'O último nome deve ser um texto.',
            'last_name.max' => 'O último nome não pode ter mais de 100 caracteres.',

            'email.required' => 'O email é obrigatório.',
            'email.email' => 'O email deve ser um endereço de email válido.',
            'email.unique' => 'Este email já está registado.',

            'nis.required' => 'O NIF é obrigatório.',
            'nis.max' => 'O NIF não pode ter mais de 9 caracteres.',


            'phone.digits' => 'O número de telefone deve ter exatamente 9 dígitos.',

            'date_of_birth.date' => 'A data de nascimento deve ser uma data válida.',
            'date_of_birth.before' => 'A data de nascimento deve ser anterior a hoje.',

            'photo.file' => 'O ficheiro deve ser válido.',
            'photo.mimes' => 'A foto deve ser um ficheiro do tipo: jpeg, png, jpg.',
            'photo.max' => 'A foto não pode ter mais de 2MB.',

        ];
    }
}

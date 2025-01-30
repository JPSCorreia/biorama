<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VendorRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'user_id'       => 'required|exists:users,id', // Deve existir na tabela users
            'first_name'    => 'required|string|max:100',
            'last_name'     => 'required|string|max:100',
            'email'         => 'required|string|email|max:255|unique:vendors,email',
            'nif'           => 'required|string|max:20|unique:vendors,nif',
            'phone'         => 'required|string|min:9|max:15',
            'date_of_birth'    => 'nullable|date|', // Deve ser uma data válida e anterior a hoje
            'is_company'    => 'boolean', // Deve ser verdadeiro ou falso
            'iban'          => 'required|string|size:25', // IBAN tem 25 caracteres em Portugal
            'gender_id'     => 'nullable|exists:genders,id', // Deve existir na tabela genders ou ser nulo
        ];
    }

    public function messages()
    {
        return [
            'user_id.required'      => 'O campo User ID é obrigatório.',
            'user_id.exists'        => 'O User ID fornecido não existe.',

            'first_name.required'   => 'O primeiro nome é obrigatório.',
            'first_name.string'     => 'O primeiro nome deve ser um texto.',
            'first_name.max'        => 'O primeiro nome não pode ter mais de 100 caracteres.',

            'last_name.required'    => 'O apelido é obrigatório.',
            'last_name.string'      => 'O apelido deve ser um texto.',
            'last_name.max'         => 'O apelido não pode ter mais de 100 caracteres.',

            'email.required'        => 'O email é obrigatório.',
            'email.string'          => 'O email deve ser um texto.',
            'email.email'           => 'O email deve ser um endereço de email válido.',
            'email.max'             => 'O email não pode ter mais de 255 caracteres.',
            'email.unique'          => 'Este email já está registado.',

            'nif.required'          => 'O NIF é obrigatório.',
            'nif.string'            => 'O NIF deve ser um texto.',
            'nif.max'               => 'O NIF não pode ter mais de 20 caracteres.',
            'nif.unique'            => 'Este NIF já está registado.',

            'phone.required'        => 'O número de telemóvel é obrigatório.',
            'phone.string'          => 'O número de telemóvel deve ser um texto.',
            'phone.min'             => 'O número de telemóvel deve ter pelo menos 9 caracteres.',
            'phone.max'             => 'O número de telemóvel não pode ter mais de 15 caracteres.',

            'date_of_birth.date'    => 'A data de nascimento deve ser uma data válida.',

            'is_company.boolean'    => 'O campo "É empresa" deve ser verdadeiro ou falso.',

            'iban.required'         => 'O IBAN é obrigatório.',
            'iban.string'           => 'O IBAN deve ser um texto.',
            'iban.size'             => 'O IBAN deve ter exatamente 25 caracteres.',

            'gender_id.exists'      => 'O ID do género fornecido não existe.',
        ];
    }
}

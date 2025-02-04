<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HomeAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'address_name' => 'required|string|max:100',
            'number' => 'required|string|max:10',
            'phone_number' => 'nullable|string|max:15',
            'street_address' => 'required|string|max:255',
            'postal_code' => 'required|string|max:10',
            'city' => 'required|string|max:50',
            'is_primary' => 'nullable|boolean',
            'comment' => 'nullable|string',
            'longitude' => 'string|required',
            'latitude' => 'string|required',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */

    public function messages(): array    {
        return [
            'user_id.required' => 'O ID do utilizador é obrigatório',
            'user_id.exists' => 'O ID do utilizador é inválido',

            'address_name.required' => 'O nome da morada é obrigatório',
            'address_name.max' => 'O nome da morada deve ter no máximo :max caracteres',

            'number.required' => 'O número da morada é obrigatório',
            'number.max' => 'O número da morada deve ter no máximo :max caracteres',

            'phone_number.max' => 'O número de telefone deve ter no máximo :max caracteres',
            'street_address.required' => 'O nome da rua é obrigatório',

            'street_address.max' => 'O nome da rua deve ter no máximo :max caracteres',
            'postal_code.required' => 'O código postal é obrigatório',
            'postal_code.max' => 'O código postal deve ter no máximo :max caracteres',
            'city.required' => 'A cidade é obrigatória',
            'city.max' => 'A cidade deve ter no máximo :max caracteres',
            'is_primary.boolean' => 'O campo "is_primary" deve ser um booleano',
            'comment.string' => 'O comentário deve ser uma string',

            'longitude.required' => 'A longitude é obrigatória',
            'latitude.required' => 'A latitude é obrigatória',
        ];
    }
}

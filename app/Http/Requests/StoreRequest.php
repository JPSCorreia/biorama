<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
            'coordinates' => 'required|string|',
            'street_address' => 'required|string|max:255',
            'city' => 'required|string|max:50',
            'postal_code' => 'required|string|max:10',
            'comment' => 'nullable|string',
            'image_link' => 'nullable|array', // Aceita um array
            'image_link.*' => 'nullable|string',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array{
        return [
            'name.required' => 'O nome da loja é obrigatório',
            'name.string' => 'O nome da loja deve ser uma string',
            'name.max' => 'O nome da loja não pode ter mais de 255 caracteres',
            'phone_number.string' => 'O número de telefone deve ser uma string',
            'phone_number.max' => 'O número de telefone não pode ter mais de 15 caracteres',
            'email.email' => 'O email deve ser um email válido',
            'email.max' => 'O email não pode ter mais de 255 caracteres',
            'description.string' => 'A descrição deve ser uma string',
            'coordinates.required' => 'As coordenadas são obrigatórias',
            'coordinates.string' => 'As coordenadas devem ser uma string',
            'street_address.required' => 'O endereço é obrigatório',
            'street_address.string' => 'O endereço deve ser uma string',
            'street_address.max' => 'O endereço não pode ter mais de 255 caracteres',
            'city.required' => 'A cidade é obrigatória',
            'city.string' => 'A cidade deve ser uma string',
            'city.max' => 'A cidade não pode ter mais de 50 caracteres',
            'postal_code.required' => 'O código postal é obrigatório',
            'postal_code.string' => 'O código postal deve ser uma string',
            'postal_code.max' => 'O código postal não pode ter mais de 10 caracteres',
            'comment.string' => 'O comentário deve ser uma string',
            'image_link.array' => 'O link da imagem deve ser um array',
            'image_link.*.string' => 'Cada link da imagem deve ser uma string',
        ];
    }

}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VendorRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id|unique:vendors,user_id',
            'is_company' => 'boolean',

        ];
    }


    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array{

        return [
            'user_id.required' => 'O campo user_id é obrigatório',
            'user_id.exists' => 'O campo user_id deve existir na tabela users',
            'user_id.unique' => 'Já está registado com vendor',

            'is_company.boolean' => 'O campo is_company deve ser um boolean',

        ];
    }
}

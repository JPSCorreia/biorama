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
            'user_id' => 'required|exists:users,id',
            'nif' => 'required|max:20|unique:vendors',
            'phone' => 'required|string|max:25',
            'address' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'date_of_birth' => 'required|date',
            'iban' => 'required|string|max:25',
            'vendor_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'is_company' => 'required|boolean',
            'company_name' => 'nullable|string|max:255',
            'company_nif' => 'nullable|string|max:20',
            'company_address' => 'nullable|string|max:255',
            'company_city' => 'nullable|string|max:255',
            'company_postal_code' => 'nullable|string|max:10',
            'company_phone' => 'nullable|string|max:25',
            'company_email' => 'nullable|email',
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
            'user_id.exists' => 'O campo user_id deve ser um id válido',
            'nif.required' => 'O campo nif é obrigatório',
            'nif.max' => 'O campo nif deve ter no máximo 20 caracteres',
            'nif.unique' => 'O campo nif já está em uso',
            'phone.required' => 'O campo phone é obrigatório',
            'phone.string' => 'O campo phone deve ser uma string',
            'phone.max' => 'O campo phone deve ter no máximo 25 caracteres',
            'address.required' => 'O campo address é obrigatório',
            'address.string' => 'O campo address deve ser uma string',
            'address.max' => 'O campo address deve ter no máximo 255 caracteres',
            'city.string' => 'O campo city deve ser uma string',
            'city.max' => 'O campo city deve ter no máximo 255 caracteres',
            'postal_code.string' => 'O campo postal_code deve ser uma string',
            'postal_code.max' => 'O campo postal_code deve ter no máximo 10 caracteres',
            'date_of_birth.required' => 'O campo date_of_birth é obrigatório',
            'date_of_birth.date' => 'O campo date_of_birth deve ser uma data',
            'iban.required' => 'O campo iban é obrigatório',
            'iban.string' => 'O campo iban deve ser uma string',
            'iban.max' => 'O campo iban deve ter no máximo 25 caracteres',
            'vendor_photo.string' => 'O campo vendor_photo deve ser uma string',
            'is_company.required' => 'O campo is_company é obrigatório',
            'is_company.boolean' => 'O campo is_company deve ser um boolean',
            'company_name.string' => 'O campo company_name deve ser uma string',
            'company_name.max' => 'O campo company_name deve ter no máximo 255 caracteres',
            'company_nif.string' => 'O campo company_nif deve ser uma string',
            'company_nif.max' => 'O campo company_nif deve ter no máximo 20 caracteres',
            'company_address.string' => 'O campo company_address deve ser uma string',
            'company_address.max' => 'O campo company_address deve ter no máximo',
        ];
    }
}

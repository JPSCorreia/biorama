<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompanyRequest extends FormRequest
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
            'vendor_id'     => 'required|exists:vendors,id',
            'name'          => 'required|string|max:255',
            'nif'           => 'required|string|max:20|unique:companies,nif',
            'founded_at'    => 'nullable|date',
            'sector'        => 'nullable|string',
            'description'   => 'nullable|string',

            // Contatos
            'phone'         => 'required|string',
            'email'         => 'required|string|email|unique:company_contacts,email',
            'website'       => 'nullable|string',

            // Morada
            'street'        => 'required|string',
            'number'        => 'required|string',
            'postal_code'   => 'required|string',
            'district'      => 'required|string',
            'country'       => 'required|string',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'vendor_id.required' => 'O campo vendor_id é obrigatório',
            'vendor_id.exists' => 'O vendor_id fornecido não existe',
            'name.required' => 'O campo name é obrigatório',
            'name.string' => 'O campo name deve ser uma string',
            'name.max' => 'O campo name não pode ter mais de 255 caracteres',
            'nif.required' => 'O campo nif é obrigatório',
            'nif.string' => 'O campo nif deve ser uma string',
            'nif.max' => 'O campo nif não pode ter mais de 20 caracteres',
            'nif.unique' => 'O nif fornecido já existe',
            'founded_at.date' => 'O campo founded_at deve ser uma data',
            'sector.string' => 'O campo sector deve ser uma string',
            'description.string' => 'O campo description deve ser uma string',
            'phone.required' => 'O campo phone é obrigatório',
            'phone.string' => 'O campo phone deve ser uma string',
            'email.required' => 'O campo email é obrigatório',
            'email.string' => 'O campo email deve ser uma string',
            'email.email' => 'O campo email deve ser um email válido',
        ];
    }

}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
    public function rules()
    {
        return [
            'name' => 'required|string|max:100', // O nome é obrigatório, deve ser texto e ter no máximo 100 caracteres
            'description' => 'nullable|string', // A descrição é opcional e deve ser texto
            'sold_at_unit' => 'required|boolean', // Este campo é obrigatório e deve ser booleano (true ou false)
            'price' => 'required|numeric|min:0', // O preço é obrigatório, deve ser um número e não pode ser negativo
            'discount' => 'nullable|numeric|min:0|max:100', // O desconto é opcional, deve ser um número entre 0 e 100
            'stock' => 'required|integer|min:0', // O stock é obrigatório, deve ser um número inteiro e não pode ser negativo
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages()
{
        return [
            'name.required' => 'O nome do produto é obrigatório', // Mensagem de erro para o campo 'name' obrigatório
            'name.string' => 'O nome do produto deve ser uma string', // Mensagem de erro para o campo 'name' que deve ser texto
            'name.max' => 'O nome do produto não pode ter mais de 100 caracteres', // Mensagem de erro para o campo 'name' que não pode ter mais de 100 caracteres
            'description.string' => 'A descrição do produto deve ser uma string', // Mensagem de erro para o campo 'description' que deve ser texto
            'sold_at_unit.required' => 'O campo "sold_at_unit" é obrigatório', // Mensagem de erro para o campo 'sold_at_unit' obrigatório
            'sold_at_unit.boolean' => 'O campo "sold_at_unit" deve ser um booleano', // Mensagem de erro para o campo 'sold_at_unit' que deve ser booleano
            'price.required' => 'O preço do produto é obrigatório', // Mensagem de erro para o campo 'price' obrigatório
            'price.numeric' => 'O preço do produto deve ser um número', // Mensagem de erro para o campo 'price' que deve ser um número
            'price.min' => 'O preço do produto não pode ser negativo', // Mensagem de erro para o campo 'price' que não pode ser negativo
            'discount.numeric' => 'O desconto do produto deve ser um número', // Mensagem de erro para o campo 'discount' que deve ser um número
            'discount.min' => 'O desconto do produto não pode ser negativo', // Mensagem de erro para o campo 'discount' que não pode ser negativo
            'discount.max' => 'O desconto do produto não pode ser superior a 100', // Mensagem de erro para o campo 'discount' que não pode ser superior a 100
            'stock.required' => 'O stock do produto é obrigatório', // Mensagem de erro para o campo 'stock' obrigatório
            'stock.integer' => 'O stock do produto deve ser um número inteiro', // Mensagem de erro para o campo 'stock' que deve ser um número inteiro
            'stock.min' => 'O stock do produto não pode ser negativo', // Mensagem de erro para o campo 'stock' que não pode ser negativo
        ];
    }
}

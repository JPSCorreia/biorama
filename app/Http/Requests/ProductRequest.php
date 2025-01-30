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

    protected function prepareForValidation()
    {
        if ($this->has('data')) {
            $this->merge([
                $this->input('data'),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'sold_at_unit' => 'required|boolean',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'stock' => 'required|integer|min:0',

            'imagesProduct' => 'nullable|array',
            'imagesProduct.*' => 'image|mimes:jpg,png,jpeg|max:2048',

            'store_id' => 'required|exists:stores,id',
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
            'name.required' => 'O nome do produto é obrigatório',
            'name.string' => 'O nome do produto deve ser uma string',
            'name.max' => 'O nome do produto não pode ter mais de 100 caracteres',
            'description.string' => 'A descrição do produto deve ser uma string',
            'sold_at_unit.required' => 'O campo "sold_at_unit" é obrigatório',
            'sold_at_unit.boolean' => 'O campo "sold_at_unit" deve ser um booleano',
            'price.required' => 'O preço do produto é obrigatório',
            'price.numeric' => 'O preço do produto deve ser um número',
            'price.min' => 'O preço do produto não pode ser negativo',
            'discount.numeric' => 'O desconto do produto deve ser um número',
            'discount.min' => 'O desconto do produto não pode ser negativo',
            'discount.max' => 'O desconto do produto não pode ser superior a 100',
            'stock.required' => 'O stock do produto é obrigatório',
            'stock.integer' => 'O stock do produto deve ser um número inteiro',
            'stock.min' => 'O stock do produto não pode ser negativo',
        ];
    }
}

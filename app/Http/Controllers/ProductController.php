<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {

        return response()->json(Product::with('categories')->get());
    }

    public function store(Request $request)
    {
        $request->merge([
            'sold_at_unit' => filter_var($request->sold_at_unit, FILTER_VALIDATE_BOOLEAN),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'sold_at_unit' => 'boolean',
            'price' => 'required|numeric|min:0',
            'discount' => 'numeric|min:0',
            'stock' => 'integer|min:0',
            'imagesProduct' => 'nullable|array',
            'imagesProduct.*' => 'file|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Criar o produto
        $product = Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'sold_at_unit' => $validated['sold_at_unit'] ?? false,
            'price' => $validated['price'],
            'discount' => $validated['discount'] ?? 0.0,
            'stock' => $validated['stock'] ?? 0,
        ]);

        // Processar e armazenar as imagens
        if ($request->hasFile('imagesProduct')) {
            foreach ($request->file('imagesProduct') as $index => $imageFile) {
                // Criar nome do ficheiro
                $imageName = 'product_' . $product->id . '_img' . ($index + 1) . '.' . $imageFile->extension();

                // Guardar a imagem no storage (pasta public)
                $imagePath = $imageFile->storeAs('public/product', $imageName);

                // Guardar o link na tabela product_galleries
                ProductGallery::create([
                    'product_id' => $product->id,
                    'image_link' => Storage::url($imagePath), // Gera um caminho acessível
                ]);
            }
        }

        return response()->json(['message' => 'Produto criado com sucesso!', 'product' => $product], 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load('categories', 'storeProducts'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100|unique:products,name,' . $product->id,
            'image_link' => 'nullable|url',
            'sold_at_unit' => 'sometimes|boolean',
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(null, 204);
    }
}

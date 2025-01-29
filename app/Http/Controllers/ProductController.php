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

    public function store(ProductRequest $request)
    {
        $data = $request->validated();

        $product = Product::create(
            [
                'name' => $data['name'],
                'sold_at_unit' => $data['sold_at_unit'],
                'description' => $data['description'],
                'price' => $data['price'],
                'discount' => $data['discount'],
                'stock' => $data['stock'],
            ]
        );

        // Processar o campo image_link (array de imagens)
        $imageLinks = []; // Array para armazenar os caminhos das imagens
        if (!empty($validated['image_link'])) {
            foreach ($validated['image_link'] as $index => $base64Image) {
                // Decodifica a string base64 para conteúdo binário
                $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));

                // Gera o nome do ficheiro
                $imageName = 'product_' . $product->id . '_img' . ($index + 1) . '.jpg';

                // Salva a imagem no diretório "storage/app/public/store"
                $imagePath = 'product/' . $imageName;
                file_put_contents(storage_path('app/public/' . $imagePath), $imageData);

                // Adiciona o caminho ao array
                $imageLinks[] = 'storage/' . $imagePath;

                // Cria o registro na galeria
                $product->galleries()->create([
                    'image_link' => 'storage/' . $imagePath,
                ]);
            }
        }

        return response()->json([
            'product' => $product,
        ], 201);
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

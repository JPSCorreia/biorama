<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use App\Models\ProductGallery;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {

        return response()->json(Product::with('categories')->get());
    }

    public function store(Request $request, $store_id)
    {
        // Check if the store exists; if not, throw a 404 error.
        $store = Store::findOrFail($store_id);

        // Validate the product data coming from the request.
        $validated = $request->validate([
            'name'            => 'required|string|max:100',
            'description'     => 'nullable|string',
            'price'           => 'required|numeric|min:0',
            'discount'        => 'numeric|min:0',
            'stock'           => 'integer|min:0',
            'imagesProduct'   => 'nullable|array',
            'imagesProduct.*' => 'file|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Create the product using the validated data.
        $product = Product::create([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price'       => $validated['price'],
            'discount'    => $validated['discount'] ?? 0.0,
            'stock'       => $validated['stock'] ?? 0,
        ]);

        // Associate the product with the store using the many-to-many relationship.
        $product->stores()->attach($store->id);

        // Process and store the images if provided.
        if ($request->hasFile('imagesProduct')) {
            foreach ($request->file('imagesProduct') as $index => $imageFile) {
                // Create a unique filename for the image.
                $imageName = 'product_' . $product->id . '_img' . ($index + 1) . '.' . $imageFile->extension();

                // Define the directory path based on the store id and product id.
                $directory = '/store_products/store' . $store->id;

                // Store the image in the defined directory.
                $imagePath = $imageFile->storeAs($directory, $imageName, 'public');

                // Create a record in the product galleries table with the public URL of the image.
                ProductGallery::create([
                    'product_id' => $product->id,
                    'image_link' => Storage::url($imagePath),
                ]);
            }
        }

        // Load relationships that don't depend on custom formatting (e.g., the product gallery).
        $product->load('gallery');

        // Retrieve the formatted store data with selected fields and computed longitude and latitude.
        $formattedStore = Store::select(
            'id',
            'name',
            'description',
            'phone_number',
            'email',
            'rating',
            DB::raw('ST_X(coordinates) as longitude'),
            DB::raw('ST_Y(coordinates) as latitude')
        )
            ->where('id', $store->id)
            ->with(['addresses', 'products', 'reviews', 'galleries'])
            ->first();

        // Replace the product's "stores" relationship with the formatted store data.
        // This wraps the single store in a collection to maintain consistency.
        $product->setRelation('stores', collect([$formattedStore]));

        // Return a JSON response with a success message and the product data.
        return response()->json([
            'message' => 'Product created successfully!',
            'product' => $product,
        ], 201);
    }



    public function show(Product $product)
    {
        return response()->json($product->load('categories', 'storeProducts'));
    }

    public function update(Request $request, $product_id)
    {


        // Find the product and throw 404 if it doesn't exist.
        $product = Product::where('id', $product_id)->firstOrFail();

        // Validate the product data coming from the request.
        $validated = $request->validate([
            'name'            => 'required|string|max:100',
            'description'     => 'nullable|string',
            'price'           => 'required|numeric|min:0',
            'discount'        => 'numeric|min:0',
            'stock'           => 'integer|min:0',
            'newImages'       => 'nullable|array',  // Novas imagens para upload
            'newImages.*'     => 'file|mimes:jpg,jpeg,png|max:2048',
            'deleteImages'    => 'nullable|array',  // IDs de imagens a excluir
            'deleteImages.*'  => 'integer|exists:product_galleries,id',
        ]);

        // Atualiza os dados do produto
        $product->update([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price'       => $validated['price'],
            'discount'    => $validated['discount'] ?? 0.0,
            'stock'       => $validated['stock'] ?? 0,
        ]);

        // Processa imagens a excluir
        if (!empty($validated['deleteImages'])) {
            foreach ($validated['deleteImages'] as $imageId) {
                $image = ProductGallery::findOrFail($imageId);

                // Remove o arquivo do sistema de armazenamento
                if (Storage::exists('public/' . $image->image_link)) {
                    Storage::delete('public/' . $image->image_link);
                }

                // Exclui o registro da galeria
                $image->delete();
            }
        }

        // Processa novas imagens, se houver
        if ($request->hasFile('newImages')) {
            foreach ($request->file('newImages') as $index => $imageFile) {
                // Cria um nome único para a imagem
                $imageName = 'product_' . $product->id . '_img' . ($index + 1) . '.' . $imageFile->extension();

                // Define o diretório baseado no store ID e product ID
                $directory = '/store_products/store' . $store->id;

                // Armazena a imagem
                $imagePath = $imageFile->storeAs($directory, $imageName, 'public');

                // Cria o registro na tabela de galerias
                ProductGallery::create([
                    'product_id' => $product->id,
                    'image_link' => Storage::url($imagePath),
                ]);
            }
        }

        // Recarrega a relação da galeria
        $product->load('gallery');

        // Retorna uma resposta JSON com a mensagem de sucesso
        return response()->json([
            'message' => 'Produto atualizado com sucesso!',
            'product' => $product,
        ], 200);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(null, 204);
    }
}

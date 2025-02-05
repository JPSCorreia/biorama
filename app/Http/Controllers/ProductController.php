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
            'rating'
        )
            ->where('id', $store->id)
            ->with([
                'addresses' => function ($query) {
                    $query->select(
                        'id',
                        'store_id',
                        'street_address',
                        'city',
                        'postal_code',
                        DB::raw('ST_X(coordinates) as longitude'),
                        DB::raw('ST_Y(coordinates) as latitude')
                    );
                },
                'products',
                'reviews',
                'galleries'
            ])
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


        public function refreshProduct($product_id)
        {
            // Encontra o produto pelo ID, incluindo a galeria de imagens
            $product = Product::with('gallery')->findOrFail($product_id);

            // Retorna o produto com suas imagens associadas
            return response()->json([
                'message' => 'Produto carregado com sucesso!',
                'product' => $product,
            ], 200);
        }


    public function update(Request $request, $Store_id, $product_id)
    {
        // Verifica se o produto existe
        $product = Product::where('id', $product_id)->firstOrFail();

        // Valida os dados do produto
        $validated = $request->validate([
            'name'            => 'required|string|max:100',
            'description'     => 'nullable|string',
            'price'           => 'required|numeric|min:0',
            'discount'        => 'numeric|min:0',
            'stock'           => 'integer|min:0',
            'newImages'       => 'nullable|array',  // Imagens em Base64
            'newImages.*'     => 'nullable|string',  // Cada imagem deve ser uma string Base64
            'deleteImages'    => 'nullable|array',
            'deleteImages.*'  => 'integer|exists:product_galleries,id',
        ]);

        // Atualiza os dados básicos do produto
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

                // Remove o ficheiro do armazenamento
                if (Storage::exists('public/' . $image->image_link)) {
                    Storage::delete('public/' . $image->image_link);
                }

                // Exclui o registro da galeria
                $image->delete();
            }
        }

        // Processa imagens em Base64
        if (!empty($validated['newImages'])) {
            foreach ($validated['newImages'] as $base64Image) {
                // Decodifica a imagem Base64
                $imageData = explode(',', $base64Image);
                $imageContent = base64_decode(end($imageData));
                $extension = $this->getImageExtension($base64Image);

                // Gera um nome de ficheiro único
                $imageName = 'product_' . $product->id . '_' . uniqid() . '.' . $extension;
                $imagePath = "product/{$imageName}";

                // Armazena a imagem
                Storage::disk('public')->put($imagePath, $imageContent);

                // Cria o registro na galeria de produtos
                ProductGallery::create([
                    'product_id' => $product->id,
                    'image_link' => Storage::url($imagePath),
                ]);
            }
        }

        // Recarrega a relação da galeria
        $product->load('gallery');

        return response()->json([
            'message' => 'Produto atualizado com sucesso!',
            'product' => $product,
        ], 200);
    }

    /**
     * Retorna a extensão de uma imagem Base64
     */
    private function getImageExtension($base64Image)
    {
        if (str_contains($base64Image, 'image/jpeg')) {
            return 'jpg';
        } elseif (str_contains($base64Image, 'image/png')) {
            return 'png';
        }
        return 'jpg';  // Padrão
    }


    public function destroy(Product $product)
    {
        $product->load('gallery');

        // Apagar as associações na tabela pivot 'category_product'
        DB::table('category_product')->where('product_id', $product->id)->delete();

        // Apagar as imagens do armazenamento
        foreach ($product->gallery as $image) {
            $cleanPath = str_replace('/storage/', '', $image->image_link);
            if (Storage::disk('public')->exists($cleanPath)) {
                Storage::disk('public')->delete($cleanPath);
            }
        }

        // Apagar os registros da galeria
        ProductGallery::where('product_id', $product->id)->delete();

        // Apagar o produto
        $product->delete();

        return response()->json([
            'message' => 'Produto e suas imagens foram apagados com sucesso!',
        ], 200);
    }
}

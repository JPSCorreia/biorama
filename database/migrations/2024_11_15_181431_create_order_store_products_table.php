<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_store_products', function (Blueprint $table) {
            $table->id(); // auto increment primary key
            $table->timestamps(); // created_at and updated_at columns
            $table->softDeletes(); // deleted_at column

            $table->integer('quantity'); // quantity of products
            $table->decimal('price', 10, 2); // price of the product

            $table->foreignId('order_id')->constrained(); // foreign key to orders table
            $table->foreignId('store_product_id')->constrained(); // foreign key to store_products table

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_store_products');
    }
};

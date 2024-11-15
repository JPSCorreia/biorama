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
        Schema::create('store_products', function (Blueprint $table) {
            $table->id(); //Auto increment primary key
            $table->timestamps(); //Created_at and updated_at columns

            $table->foreignId('store_id')->constrained(); //Foreign key to stores table
            $table->foreignId('product_id')->constrained(); //Foreign key to products table

            $table->integer('stock'); //product stock
            $table->decimal('price', 8, 2); //Product price
            $table->string('description', 1000)->nullable(); //Product description
            $table->string('img_link', 250)->nullable(); //Product image

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_products');
    }
};

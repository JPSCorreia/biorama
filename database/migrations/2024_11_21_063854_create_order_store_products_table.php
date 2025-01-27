<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('order_store_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');

            // Definir store_id e product_id sem FK direta
            $table->foreignId('store_id')->constrained('store_products', 'store_id');
            $table->foreignId('product_id')->constrained('store_products', 'product_id');

            $table->decimal('price', 10, 2);
            $table->decimal('discount', 10, 2)->nullable();
            $table->integer('quantity');
            $table->decimal('discount_value', 10, 2)->nullable();
            $table->decimal('final_price', 10, 2);
            $table->decimal('original_price', 10, 2);

            $table->timestamps();
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

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
            $table->unsignedBigInteger('store_id');
            $table->unsignedBigInteger('product_id');

            // Definir FK composta para store_products
            $table->foreign(['store_id', 'product_id'])
                ->references(['store_id', 'product_id'])
                ->on('store_products');

            $table->decimal('price', 10, 2);
            $table->decimal('discount', 10, 2)->nullable();
            $table->integer('quantity');
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

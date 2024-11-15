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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->timestamps(); //created_at, updated_at
            $table->softDeletes(); //deleted_at

            $table->string('name', 50); //name of the product
            $table->boolean('is_unit'); //if the product is sold by unit
            $table->string('image_link', 500)->nullable(); //link to the image of the product

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

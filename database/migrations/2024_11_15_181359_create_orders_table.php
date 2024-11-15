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
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // auto increment primary key
            $table->timestamps(); // created_at and updated_at columns

            $table->decimal('total_price', 8, 2); // total price column

            $table->foreignId('user_id')->constrained(); // foreign key to users table
            $table->foreignId('order_status_id')->constrained(); // foreign key to order_statuses table
            $table->foreignId('store_id')->constrained(); // foreign key to stores table
            $table->foreignId('home_address_id')->constrained(); // foreign key to home address table

            $table->string('street_name', 300)->nullable(); // street name column
            $table->string('street_number', 10)->nullable(); // street number column
            $table->string('postal_code', 10)->nullable(); // postal code column
            $table->string('city', 100)->nullable(); // city column
            $table->string('costumer_name', 100)->nullable(); // costumer name column
            $table->string('costumer_phone', 9)->nullable(); // costumer phone column
            $table->string('costumer_nif', 9)->nullable(); // costumer nif column


            $table->string('comment', 500)->nullable(); // comment column



        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

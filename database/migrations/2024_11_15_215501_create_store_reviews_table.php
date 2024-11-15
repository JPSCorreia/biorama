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
        Schema::create('store_reviews', function (Blueprint $table) {
            $table->id(); //Auto increment primary key
            $table->timestamps(); //Created_at and updated_at columns

            $table->foreignId('store_id')->constrained(); //Foreign key to stores table
            $table->foreignId('user_id')->constrained(); //Foreign key to users table

            $table->integer('rating'); //Review rating
            $table->string('comment', 1000); //Review comment
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_reviews');
    }
};

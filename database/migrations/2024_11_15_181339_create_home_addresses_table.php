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
        Schema::create('home_addresses', function (Blueprint $table) {
            $table->id(); //autoincrement primary key
            $table->timestamps(); //created_at and updated_at
            $table->softDeletes(); //deleted_at

            $table->string('street_name', 100); //Name of the street
            $table->string('number', 10); //Number of the house
            $table->string('address_name', 50); //Name of the person's house
            $table->string('city', 50); //City of the address
            $table->string('zip_code', 9); //Zip code of the address
            $table->string('comment', 300)->nullable(); //Comment of the address

            $table->foreignId('user_id')->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_addresses');
    }
};

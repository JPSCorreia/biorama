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
        Schema::create('stores', function (Blueprint $table) {
            $table->id(); //Auto increment primary key
            $table->timestamps(); //Created_at and updated_at columns

            $table->foreignId('vendor_id')->constrained(); //Foreign key to vendors table

            $table->string('name'); //Store name
            $table->string('phone_number', 9); //Store phone number
            $table->string('email')->unique(); //Store email
            $table->string('address'); //Store address
            $table->string('city'); //Store city
            $table->string('zip_code', 9); //Store zip code
            $table->geography('coordinates', subtype: 'point', srid: 4326); //Store coordinates
            $table->string('img_link', 250)->nullable(); //Store image

            $table->spatialIndex('coordinates'); //Spatial index for coordinates
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};

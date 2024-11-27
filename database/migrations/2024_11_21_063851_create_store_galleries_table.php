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
        Schema::create('store_galleries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores');
            $table->string('image_link', 255);
            $table->string('image_name', 100);
            $table->timestamps();
            $table->softDeletes();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_galleries');
    }
};
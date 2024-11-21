<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendors')->onDelete('cascade');
            $table->string('name', 100)->unique();
            $table->string('phone_number', 15)->nullable();
            $table->string('email', 255)->nullable()->unique();
            $table->mediumText('description')->nullable();
            $table->string('image_link', 255)->nullable();
            $table->string('street_address', 255);
            $table->string('city', 50);
            $table->string('postal_code', 10);
            $table->decimal('rating', 3, 2)->default(0.0);
            // $table->point('coordinates')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Add the spatial column using raw SQL
        DB::statement('ALTER TABLE stores ADD coordinates POINT NOT NULL');
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};

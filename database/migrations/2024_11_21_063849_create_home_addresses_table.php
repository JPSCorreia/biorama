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
        Schema::create('home_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('address_name', 100);
            $table->string('phone_number', 15)->nullable();
            $table->string('street_address', 255);
            $table->string('postal_code', 10);
            $table->string('city', 50);
            $table->boolean('is_primary')->default(false);
            $table->mediumText('comment')->nullable();
            $table->timestamps();
            $table->softDeletes();
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

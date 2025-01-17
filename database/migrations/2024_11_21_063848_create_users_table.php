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
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('email')->unique();
            $table->string('nif', 20);
            $table->string('phone')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('image_profile')->nullable();
            $table->string('iban', 25)->nullable();
            $table->string('password');

            $table->foreignId('gender_id')->nullable()->constrained('genders')->onDelete('set null');

            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

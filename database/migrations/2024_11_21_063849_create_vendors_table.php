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
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users'); // Chave estrangeira para a tabela users
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('email')->unique();
            $table->string('nif', 20);
            $table->string('phone');
            $table->date('date_of_birth');
            $table->string('image_profile')->nullable();
            $table->boolean('is_company')->default(false); // Se oo vendedor é uma empresa

            $table->foreignId('gender_id')->nullable()->constrained('genders')->onDelete('set null');
            $table->timestamps(); // Campos padrão created_at e updated_at
            $table->softDeletes();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};

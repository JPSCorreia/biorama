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
            $table->foreignId('user_id')->constrained('users');
            $table->string('nif', 20)->nullable(); // NIF (máx. 20 caracteres)
            $table->string('phone', 25); // Telefone com suporte a formatos internacionais
            $table->string('address', 255); // Morada
            $table->string('city', 255); // Cidade opcional
            $table->string('postal_code', 10); // Código postal
            $table->date('date_of_birth'); // Data de nascimento
            $table->string('iban', 25); // IBAN com suporte a formatos internacionais
            $table->string('vendor_photo')->nullable(); // Foto do vendedor
            $table->boolean('is_company')->default(false); // Se oo vendedor é uma empresa

            $table->string('company_name', 255)->nullable(); // Nome da empresa
            $table->string('company_nif', 20)->nullable(); // NIF da empresa
            $table->string('company_address', 255)->nullable(); // Morada da empresa
            $table->string('company_city', 255)->nullable(); // Cidade da empresa
            $table->string('company_postal_code', 10)->nullable(); // Código postal da empresa
            $table->string('company_phone', 25)->nullable(); // Telefone da empresa
            $table->string('company_email',255)->nullable(); // Email da empresa

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

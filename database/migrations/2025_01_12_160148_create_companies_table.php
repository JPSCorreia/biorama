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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId('vendor_id')->constrained('vendors'); // Chave estrangeira para a tabela vendors

            $table->string('company_name', 255)->nullable(); // Nome da empresa
            $table->string('company_nif', 20)->nullable(); // NIF da empresa
            $table->string('company_address', 255)->nullable(); // Morada da empresa
            $table->string('company_city', 255)->nullable(); // Cidade da empresa
            $table->string('company_postal_code', 10)->nullable(); // Código postal da empresa
            $table->string('company_phone', 25)->nullable(); // Telefone da empresa
            $table->string('company_email',255)->nullable(); // Email da empresa


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};

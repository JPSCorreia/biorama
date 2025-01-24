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
            $table->softDeletes();

            $table->foreignId('vendor_id')->constrained('vendors'); // Chave estrangeira para a tabela vendors

            $table->string('name', 255); // Nome da empresa
            $table->string('nif', 20)->unique(); // NIF da empresa
            $table->date('founded_at')->nullable();
            $table->string('sector')->nullable();
            $table->text('description')->nullable();

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

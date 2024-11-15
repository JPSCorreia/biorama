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
        Schema::create('vendors', function (Blueprint $table) {
            $table->id(); //Auto increment primary key
            $table->timestamps(); //Created_at and updated_at columns
            $table->softDeletes(); //Deleted_at column for soft deletes

            $table->string('nif', 9)->unique(); //Unique NIF

            $table->foreignId('user_id')->constrained(); //Foreign key to users table
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

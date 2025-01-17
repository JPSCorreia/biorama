<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gender;

class GenderSeeder extends Seeder
{
    public function run()
    {
        $genders = ['Masculino', 'Feminino', 'Não-binário', 'Outro', 'Prefiro não dizer'];

        foreach ($genders as $gender) {
            Gender::create(['name' => $gender]);
        }
    }
}


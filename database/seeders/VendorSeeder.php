<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyAddress;
use App\Models\CompanyContact;
use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorReview;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;


class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {

        $faker = Faker::create();

        // Buscar utilizadores existentes para criar Vendors
        $users = User::whereHas('roles', function ($query) {
            $query->where('name', 'vendor');
        })->get();

        // Criar Vendors associados aos Users
        $vendors = $users->map(function ($user) use ($faker) {
            $createdAt = $faker->dateTimeBetween($user->created_at, 'now');

            return Vendor::create([
                'user_id'    => $user->id,
                'first_name' => $user->first_name,
                'last_name'  => $user->last_name,
                'email'      => $user->email,
                'nif'        => $user->nif,
                'phone'      => $user->phone,
                'date_of_birth' => $user->date_of_birth,
                'iban'       => $user->iban,
                'gender_id'  => $user->gender_id,
                'is_company' => true,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
        });

        // Criar empresas associadas aos Vendors
        foreach ($vendors as $vendor) {
            $company = Company::create([
                'vendor_id'  => $vendor->id,
                'name'       => $faker->company,
                'nif'        => $faker->randomNumber(9),
                'founded_at' => $faker->date(),
                'sector'     => $faker->word,
                'description'=> $faker->sentence(),
                'created_at' => $vendor->created_at,
                'updated_at' => $vendor->created_at,
            ]);

            CompanyContact::create([
                'company_id' => $company->id,
                'phone'      => $faker->phoneNumber,
                'email'      => $faker->companyEmail,
                'website'    => $faker->url,
                'created_at' => $vendor->created_at,
                'updated_at' => $vendor->created_at,
            ]);

            CompanyAddress::create([
                'company_id' => $company->id,
                'street'     => $faker->streetName,
                'number'     => $faker->buildingNumber,
                'postal_code'=> $faker->postcode,
                'district'   => $faker->city,
                'country'    => 'Portugal',
                'created_at' => $vendor->created_at,
                'updated_at' => $vendor->created_at,
            ]);
        }
    }
}

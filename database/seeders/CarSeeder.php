<?php

namespace Database\Seeders;

use App\Models\Car;
use Illuminate\Database\Seeder;

class CarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cars = [];

        foreach ($cars as $car) {
            Car::updateOrCreate(['car_code' => $car['car_code']], $car);
        }
    }
}

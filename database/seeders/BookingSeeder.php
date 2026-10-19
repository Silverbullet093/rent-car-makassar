<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Car;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $car = Car::first();
        $carId = $car ? $car->id : 1;

        Booking::updateOrCreate(
            ['customer_phone' => '082196984912', 'customer_name' => 'Irfan'],
            [
                'booking_code' => 'RCM-89A12B',
                'car_id' => $carId,
                'customer_name' => 'Irfan',
                'customer_phone' => '082196984912',
                'event_type' => 'Sewa Harian / Operasional',
                'start_date' => '2026-10-13',
                'end_date' => '2026-10-30',
                'with_driver' => true,
                'total_price' => 9900000,
                'status' => 'confirmed',
                'notes' => 'Pemesanan dengan supir',
            ]
        );
    }
}

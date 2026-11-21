<?php

namespace Database\Seeders;

use App\Models\Car;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cars = [
            [
                'id' => 1,
                'car_code' => 'RCM-LC300',
                'brand' => 'Toyota',
                'model' => 'Land Cruiser (LC300)',
                'year' => '2022',
                'category' => 'VIP Luxury',
                'seats' => 7,
                'transmission' => 'Matic (AT)',
                'fuel' => 'Diesel',
                'luggage' => '4 Koper',
                'price_normal' => 7000000,
                'price_holiday' => 7500000,
                'driver_fee' => 50000,
                'rental_option' => 'both',
                'status' => 'ready',
                'image' => '/Land Cruser (1).png',
                'description' => 'Toyota Land Cruiser LC300 Flagship VIP dengan kenyamanan maksimal dan ketangguhan legendaris.',
            ],
            [
                'id' => 2,
                'car_code' => 'RCM-AG4',
                'brand' => 'Toyota',
                'model' => 'Alphard Gen 4',
                'year' => '2023',
                'category' => 'VIP Luxury',
                'seats' => 7,
                'transmission' => 'Matic (AT)',
                'fuel' => 'Bensin',
                'luggage' => '4 Koper',
                'price_normal' => 2700000,
                'price_holiday' => 3000000,
                'driver_fee' => 50000,
                'rental_option' => 'both',
                'status' => 'ready',
                'image' => '/Alphard Gen 4 (1).png',
                'description' => 'Toyota Alphard Generasi ke-4 dengan kabin eksekutif super senyap dan captain seat mewah.',
            ],
            [
                'id' => 3,
                'car_code' => 'RCM-AG3',
                'brand' => 'Toyota',
                'model' => 'Alphard Gen 3',
                'year' => '2018',
                'category' => 'VIP Luxury',
                'seats' => 7,
                'transmission' => 'Matic (AT)',
                'fuel' => 'Bensin',
                'luggage' => '4 Koper',
                'price_normal' => 2200000,
                'price_holiday' => 2500000,
                'driver_fee' => 50000,
                'rental_option' => 'both',
                'status' => 'ready',
                'image' => '/Alphard Gen 3 (1).png',
                'description' => 'Toyota Alphard Gen 3 favorit untuk perjalanan dinas eksekutif dan acara pernikahan bergengsi.',
            ],
            [
                'id' => 4,
                'car_code' => 'RCM-FGR',
                'brand' => 'Toyota',
                'model' => 'Fortuner GR',
                'year' => '2021',
                'category' => 'SUV',
                'seats' => 7,
                'transmission' => 'Manual',
                'fuel' => 'Diesel',
                'luggage' => '3 Koper',
                'price_normal' => 1300000,
                'price_holiday' => 1500000,
                'driver_fee' => 50000,
                'rental_option' => 'both',
                'status' => 'ready',
                'image' => '/Fortuner GR (1).png',
                'description' => 'SUV tangguh bertenaga besar untuk perjalanan dalam kota maupun medan luar kota di Sulawesi.',
            ],
            [
                'id' => 5,
                'car_code' => 'RCM-ZXQ',
                'brand' => 'Toyota',
                'model' => 'Innova Zenix Q Hybrid',
                'year' => '2022',
                'category' => 'MPV',
                'seats' => 7,
                'transmission' => 'Matic (AT)',
                'fuel' => 'Bensin',
                'luggage' => '3 Koper',
                'price_normal' => 1100000,
                'price_holiday' => 1300000,
                'driver_fee' => 50000,
                'rental_option' => 'both',
                'status' => 'ready',
                'image' => '/Zenix Q (2).png',
                'description' => 'Innova Zenix tipe Q Modellista Hybrid dengan fitur ottoman seat dan kenyamanan berkendara maksimal.',
            ],
            [
                'id' => 6,
                'car_code' => 'RCM-ZXV',
                'brand' => 'Toyota',
                'model' => 'Innova Zenix V Hybrid',
                'year' => '2022',
                'category' => 'MPV',
                'seats' => 7,
                'transmission' => 'Matic (AT)',
                'fuel' => 'Bensin',
                'luggage' => '3 Koper',
                'price_normal' => 900000,
                'price_holiday' => 1050000,
                'driver_fee' => 50000,
                'rental_option' => 'both',
                'status' => 'ready',
                'image' => '/Zenix V Hybrid (1).png',
                'description' => 'Kombinasi efisiensi bahan bakar hybrid dan kenyamanan suspensi TNGA yang halus.',
            ],
            [
                'id' => 7,
                'car_code' => 'RCM-ZXG',
                'brand' => 'Toyota',
                'model' => 'Innova Zenix G Hybrid',
                'year' => '2022',
                'category' => 'MPV',
                'seats' => 7,
                'transmission' => 'Matic (AT)',
                'fuel' => 'Bensin',
                'luggage' => '3 Koper',
                'price_normal' => 850000,
                'price_holiday' => 950000,
                'driver_fee' => 50000,
                'rental_option' => 'both',
                'status' => 'ready',
                'image' => '/Zenix G Hybrid (2).png',
                'description' => 'Unit keluarga modern yang lapang, nyaman, dan lincah untuk keliling kota Makassar.',
            ],
            [
                'id' => 8,
                'car_code' => 'RCM-INVR',
                'brand' => 'Toyota',
                'model' => 'Innova Reborn',
                'year' => '2015',
                'category' => 'MPV',
                'seats' => 7,
                'transmission' => 'Matic (AT)',
                'fuel' => 'Bensin',
                'luggage' => '3 Koper',
                'price_normal' => 750000,
                'price_holiday' => 850000,
                'driver_fee' => 50000,
                'rental_option' => 'both',
                'status' => 'ready',
                'image' => '/Innova Reborn (1).png',
                'description' => 'Legenda MPV Indonesia dengan kabin luas, AC dingin, dan kenyamanan perjalanan terpercaya.',
            ],
            [
                'id' => 9,
                'car_code' => 'RCM-XPD',
                'brand' => 'Mitsubishi',
                'model' => 'Xpander',
                'year' => '2017',
                'category' => 'MPV',
                'seats' => 7,
                'transmission' => 'Manual',
                'fuel' => 'Bensin',
                'luggage' => '3 Koper',
                'price_normal' => 600000,
                'price_holiday' => 700000,
                'driver_fee' => 50000,
                'rental_option' => 'both',
                'status' => 'ready',
                'image' => '/Xpander (3).png',
                'description' => 'Desain stylish, suspensi sangat empuk dan peredaman suara kabin yang luar biasa.',
            ],
            [
                'id' => 10,
                'car_code' => 'RCM-AVZ',
                'brand' => 'Toyota',
                'model' => 'Avanza',
                'year' => '2021',
                'category' => 'MPV',
                'seats' => 7,
                'transmission' => 'Manual',
                'fuel' => 'Bensin',
                'luggage' => '2-3 Koper',
                'price_normal' => 600000,
                'price_holiday' => 700000,
                'driver_fee' => 50000,
                'rental_option' => 'both',
                'status' => 'ready',
                'image' => '/Avanza (1).png',
                'description' => 'Pilihan paling populer dan ekonomis untuk perjalanan dinas harian maupun liburan keluarga.',
            ],
        ];

        DB::statement('SET FOREIGN_KEY_CHECKS = 0;');
        
        // Bersihkan tabel cars lama
        Car::truncate();

        // Masukkan 10 armada mobil baru sesuai dokumen
        foreach ($cars as $car) {
            Car::create($car);
        }

        // Remap relasi booking yang sudah ada agar terhubung ke unit yang tepat
        // Booking ID 1, 2, 3, 5, 30001, 30002 sebelumnya car_id 8 (alphar/alphard) -> diarahkan ke ID 2 (Alphard Gen 4)
        // Booking ID 4 sebelumnya car_id 16 (zenix) -> diarahkan ke ID 6 (Innova Zenix V Hybrid)
        DB::table('bookings')->whereNotIn('car_id', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])->update(['car_id' => 2]);

        DB::statement('SET FOREIGN_KEY_CHECKS = 1;');
    }
}

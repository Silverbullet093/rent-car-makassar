<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reviews = [
            [
                'name' => 'Alex Pratama',
                'rating' => 5,
                'car_name' => 'Toyota Innova Zenix',
                'comment' => 'Pelayanan Garuda Rent Car sangat memuaskan! Mobil Innova Zenix-nya sangat bersih, wangi, dan mesin halus. Driver juga ramah dan tepat waktu saat penjemputan di Bandara.',
                'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                'status' => 'approved',
            ],
            [
                'name' => 'Sofia Lestari',
                'rating' => 5,
                'car_name' => 'Honda HRV SE',
                'comment' => 'Sewa lepas kunci di sini sangat praktis & cepat proses syaratnya. Mobil HRV matic kondisi mulus 100%. Pasti bakal langganan setiap kali kunjungan dinas ke luar kota!',
                'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                'status' => 'approved',
            ],
            [
                'name' => 'Daniel Kuncoro',
                'rating' => 5,
                'car_name' => 'Toyota Fortuner GR',
                'comment' => 'Pengalaman sewa Fortuner untuk acara pernikahan keluarga luar biasa mantap. Harga transparan tanpa biaya tersembunyi. Admin fast respon dan sangat membantu!',
                'avatar' => 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
                'status' => 'approved',
            ],
        ];

        foreach ($reviews as $rev) {
            Review::create($rev);
        }
    }
}

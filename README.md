# Rent Car Makassar (RCM) — Web Application

Sistem Aplikasi Rental Mobil berbasis **Laravel 12** dengan arsitektur REST API & antarmuka responsif modern.

---

## 📁 Struktur Direktori Bersih & Terstandarisasi

Proyek ini telah dirapikan mengikuti standar resmi framework Laravel sehingga tidak ada file duplikat, alur navigasi jelas, dan pengelolaan kode mudah dipahami:

```text
rcm/
├── app/
│   ├── Http/Controllers/Api/   # Controller REST API (Car, Booking, Review, OwnerConfig)
│   └── Models/                 # Model Eloquent (Car, Booking, Review, OwnerConfig)
├── database/
│   └── migrations/             # Struktur skema tabel database
├── public/                     # Direktori Publik (Satu-satunya tempat aset web)
│   ├── css/
│   │   └── style.css           # Styling utama web & responsif desktop/mobile
│   ├── js/
│   │   ├── app.js              # Logika frontend pelanggan & pemesanan WA
│   │   ├── admin.js            # Logika dashboard owner / admin
│   │   └── data.js             # Data fallback default
│   ├── hero_full_banner.jpg    # Banner gambar tampilan utama
│   ├── hero_studio_car.jpg     # Foto studio unit display
│   ├── logo.png                # Logo resmi Rent Car Makassar
│   └── index.php               # Entrypoint resmi Laravel
├── resources/
│   └── views/                  # Template Tampilan (Blade Views)
│       ├── index.blade.php     # Halaman utama pelanggan (Katalog mobil, booking, review)
│       └── admin.blade.php     # Portal dashboard manajemen owner
└── routes/
    ├── web.php                 # Routing halaman web (/ dan /admin)
    └── api.php                 # Endpoint API (/api/cars, /api/bookings, dll.)
```

---

## 🚀 Alur Kerja Aplikasi (Application Flow)

1. **Halaman Pelanggan (`/`)**:
   - URL: `http://127.0.0.1:8000/`
   - File View: `resources/views/index.blade.php`
   - Asset: `public/css/style.css` & `public/js/app.js`
   - Fungsi: Menampilkan katalog mobil, kalkulasi tarif libur/normal, formulir booking langsung ke WhatsApp owner, serta submit testimoni/ulasan.

2. **Portal Dashboard Owner / Admin (`/admin`)**:
   - URL: `http://127.0.0.1:8000/admin`
   - File View: `resources/views/admin.blade.php`
   - Asset: `public/css/style.css` & `public/js/admin.js`
   - Fungsi: Login owner (default: `admin` / `admin123`), manajemen ketersediaan unit mobil, input pemesanan manual, moderasi review pelanggan, pengaturan tarif peak season, dan konfigurasi kontak owner.

3. **Backend API (`/api/...`)**:
   - `GET|POST|PUT|DELETE /api/cars` → Kelola unit armada
   - `GET|POST|PATCH /api/bookings` → Data pemesanan
   - `GET|POST|PATCH /api/reviews` → Moderasi testimoni pelanggan
   - `GET|PUT /api/owner-config` → Konfigurasi nomor WhatsApp & tarif libur

---

## 💻 Cara Menjalankan Aplikasi

1. **Menjalankan Server Lokal**:
   ```bash
   php artisan serve
   ```
2. **Akses di Browser**:
   - Halaman Utama: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - Portal Admin Owner: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)

3. **Menjalankan Pengujian / Test**:
   ```bash
   php artisan test
   ```

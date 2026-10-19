<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rent Car Makassar — Rental Mobil Profesional & Terpercaya</title>
    <meta name="description" content="Layanan rental mobil lepas kunci & dengan supir di Makassar. Armada terawat, harga transparan, pemesanan langsung via WhatsApp.">
    
    <!-- Custom Red Crimson Vanilla CSS -->
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>

    <!-- ANNOUNCEMENT BANNER: TARIF LIBUR / PEAK SEASON (JIKA AKTIF) -->
    <div id="holidayAlertBanner" class="hidden" style="background-color: var(--clr-primary); color: white; font-size: 0.75rem; padding: 0.5rem 1rem; text-align: center; font-weight: 700;">
        <span id="holidayBannerText">Mode Tarif Hari Libur / Peak Season Sedang Aktif</span>
    </div>

    <!-- NAVBAR GLASSMORPHISM -->
    <header class="header-glass">
        <div class="container-fluid header-inner">
            
            <!-- BRAND LOGO -->
            <a href="#home" class="flex items-center gap-2">
                <img src="{{ asset('logo.png') }}" alt="Rent Car Makassar" style="width: 2.5rem; height: 2.5rem; object-fit: contain; border-radius: var(--radius-md); background: var(--clr-primary); padding: 2px; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);">
                <div>
                    <span style="font-size: 1.15rem; font-weight: 800; color: var(--clr-text-main);" class="brand-title">Rent Car Makassar</span>
                    <span style="font-size: 0.7rem; color: var(--clr-primary); font-weight: 700; margin-left: 0.5rem; padding-left: 0.5rem; border-left: 1px solid var(--clr-border);">Makassar</span>
                </div>
            </a>

            <!-- NAVIGATION -->
            <nav class="flex items-center gap-1" style="display: flex;">
                <a href="#home" class="nav-link">Beranda</a>
                <a href="#katalog" class="nav-link">Armada Mobil</a>
                <a href="#jangkauan" class="nav-link">Jangkauan</a>
                <a href="#layanan" class="nav-link">Layanan</a>
                <a href="#reviews" class="nav-link">Ulasan</a>
                <a href="#kontak" class="nav-link">Kontak</a>
            </nav>

            <!-- RIGHT ACTIONS -->
            <div class="flex items-center gap-2">
                <a href="{{ url('/admin') }}" class="btn btn-outline btn-sm">
                    <svg style="width: 0.875rem; height: 0.875rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span>Portal Owner</span>
                </a>

                <a href="#katalog" class="btn btn-primary btn-sm">
                    <span>Pilih Unit</span>
                    <svg style="width: 0.875rem; height: 0.875rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
            </div>
        </div>
    </header>

    <main class="flex-1">
        
        <!-- ==================================================== -->
        <!-- HERO SECTION (FULL-BLEED STUDIO CAR DISPLAY)         -->
        <!-- ==================================================== -->
        <section id="home" class="hero-fullscreen-laptop" style="position: relative; padding: 4.5rem 0 3rem 0; background: linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.2) 75%), url('{{ asset('hero_full_banner.jpg') }}') no-repeat center right / cover; min-height: 520px; border-bottom: 1px solid var(--clr-border);">
            <div class="container-fluid">
                <div class="grid md:grid-cols-2 gap-8 items-center hero-main-grid" style="min-height: 360px;">
                    
                    <!-- Left Hero Text Content -->
                    <div>
                        <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.85rem; border-radius: var(--radius-full); background: rgba(220, 38, 38, 0.08); color: var(--clr-primary); font-size: 0.75rem; font-weight: 800; margin-bottom: 1.25rem; border: 1px solid var(--clr-primary-border); backdrop-filter: blur(8px);">
                            <span style="width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--clr-primary);"></span>
                            <span>Rental Mobil Resmi Wilayah Makassar</span>
                        </div>

                        <h1 style="font-size: 2.85rem; font-weight: 800; color: var(--clr-text-main); line-height: 1.18; letter-spacing: -0.025em; margin-bottom: 1.25rem;">
                            Sewa Mobil Nyaman. <br>
                            <span style="color: var(--clr-primary);">Di Mana Pun Perjalanan Anda.</span>
                        </h1>

                        <p class="brand-desc" style="font-size: 1.025rem; color: #475569; line-height: 1.6; margin-bottom: 2rem; max-width: 35rem; font-weight: 500;">
                            Penyedia jasa rental mobil profesional melayani sewa <strong>Lepas Kunci</strong> (berkendara sendiri) maupun <strong>Dengan Supir</strong> berpengalaman untuk keperluan wisata, dinas bisnis, pernikahan, mudik, dan perjalanan keluarga.
                        </p>

                        <!-- Call to Action Buttons -->
                        <div class="flex items-center gap-3" style="margin-bottom: 1.5rem; flex-wrap: wrap;">
                            <a href="#katalog" class="btn btn-primary btn-lg">
                                <span>Eksplor Armada Mobil</span>
                                <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </a>
                            <a href="#kontak" class="btn btn-outline btn-lg" style="background: rgba(255,255,255,0.85); backdrop-filter: blur(8px);">
                                Hubungi Owner WA
                            </a>
                        </div>
                    </div>

                    <!-- Right Hero Area with Studio Background -->
                    <div style="position: relative; min-height: 300px; display: flex; align-items: flex-end; justify-content: flex-end;">
                    </div>

                </div>

                <!-- HORIZONTAL QUICK SPEC METRIC BAR -->
                <div class="hero-metric-bar">
                    <div class="metric-item">
                        <div class="metric-icon" style="color: var(--clr-primary);">
                            <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                        </div>
                        <div>
                            <div class="metric-title">10+ Unit</div>
                            <div class="metric-sub">Armada Prima & Steril</div>
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-icon" style="color: var(--clr-primary);">
                            <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <div>
                            <div class="metric-title">Makassar</div>
                            <div class="metric-sub">Cakupan Wilayah Makassar</div>
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-icon" style="color: var(--clr-primary);">
                            <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 2-2 2m-1.5 1.5L14 9.5M8 15a5 5 0 1 1 7.07-7.07l1.43-1.43a1 1 0 0 1 1.41 0l.71.71a1 1 0 0 1 0 1.41L17.2 10.1A5 5 0 0 1 8 15z"/></svg>
                        </div>
                        <div>
                            <div class="metric-title">Lepas Kunci</div>
                            <div class="metric-sub">Opsi Berkendara Mandiri</div>
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-icon" style="color: var(--clr-primary);">
                            <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <div>
                            <div class="metric-title">Dengan Supir</div>
                            <div class="metric-sub">Driver Ramah & Berpengalaman</div>
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-icon" style="color: var(--clr-primary);">
                            <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        </div>
                        <div>
                            <div class="metric-title">Fast WA Order</div>
                            <div class="metric-sub">Konfirmasi Instan 24 Jam</div>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- ==================================================== -->
        <!-- KATALOG MOBIL (OUR LINEUP - BUILT FOR EVERY JOURNEY) -->
        <!-- ==================================================== -->
        <section id="katalog" style="padding: 5rem 0; background: var(--clr-bg);">
            <div class="container">
                
                <!-- Section Header -->
                <div style="text-align: center; max-width: 36rem; margin: 0 auto 2.5rem auto;">
                    <span style="font-size: 0.75rem; font-weight: 800; color: var(--clr-primary); text-transform: uppercase; letter-spacing: 0.08em;">Katalog Armada</span>
                    <h2 style="font-size: 2rem; font-weight: 800; color: var(--clr-text-main); margin-top: 0.25rem;">Pilihan Mobil Terbaik Perjalanan Anda</h2>
                    <p style="font-size: 0.875rem; color: var(--clr-text-muted); margin-top: 0.5rem;">Seluruh unit terawat dengan inspeksi berkala. Pilih unit dan isi formulir pemesanan langsung via WhatsApp.</p>
                </div>

                <!-- Filter & Search Bar -->
                <div style="background: #ffffff; padding: 0.6rem; border-radius: var(--radius-xl); border: 1px solid var(--clr-border); margin-bottom: 2.5rem; display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; box-shadow: var(--shadow-sm);">
                    
                    <!-- Kategori Tab -->
                    <div class="flex items-center gap-1" style="overflow-x: auto; padding: 0.25rem;">
                        <button onclick="setCategoryFilter('all', this)" class="cat-filter-btn btn btn-primary btn-sm">
                            Semua Tipe
                        </button>
                        <button onclick="setCategoryFilter('MPV', this)" class="cat-filter-btn btn btn-outline btn-sm">
                            MPV Keluarga
                        </button>
                        <button onclick="setCategoryFilter('SUV', this)" class="cat-filter-btn btn btn-outline btn-sm">
                            SUV Gagah
                        </button>
                        <button onclick="setCategoryFilter('City Car', this)" class="cat-filter-btn btn btn-outline btn-sm">
                            City Car Lincah
                        </button>
                        <button onclick="setCategoryFilter('Mewah', this)" class="cat-filter-btn btn btn-outline btn-sm">
                            VIP / Mewah
                        </button>
                    </div>

                    <!-- Search Input -->
                    <div style="width: 16rem; padding: 0.25rem;">
                        <input 
                            type="text" 
                            id="carSearchInput" 
                            placeholder="Cari merek / tipe mobil..." 
                            class="form-input"
                            style="padding: 0.45rem 0.85rem; font-size: 0.8125rem;"
                        />
                    </div>
                </div>

                <!-- CARS GRID (Injected by app.js) -->
                <div id="carsGrid" class="grid md:grid-cols-3 gap-6">
                    <!-- Cards populated dynamically -->
                </div>

            </div>
        </section>

        <!-- ==================================================== -->
        <!-- CAKUPAN WILAYAH INDONESIA & PILIHAN SEWA              -->
        <!-- ==================================================== -->
        <section id="jangkauan" style="padding: 4.5rem 0; background: #ffffff; border-top: 1px solid var(--clr-border);">
            <div class="container">
                <div class="grid md:grid-cols-2 gap-8 items-center">
                    
                    <div>
                        <span style="font-size: 0.75rem; font-weight: 800; color: var(--clr-primary); text-transform: uppercase; letter-spacing: 0.08em;">Cakupan Layanan</span>
                        <h2 style="font-size: 1.85rem; font-weight: 800; color: var(--clr-text-main); margin-top: 0.25rem; margin-bottom: 1rem;">
                            Melayani Sewa Mobil Wilayah Makassar
                        </h2>
                        <p style="font-size: 0.875rem; color: var(--clr-text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
                            Kami hadir melayani kebutuhan transportasi terbaik di Kota Makassar dan sekitarnya (Maros, Gowa, Bandara Sultan Hasanuddin, dan destinasi Sulawesi Selatan).
                        </p>

                        <div class="flex flex-col gap-3">
                            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid var(--clr-border);">
                                <div style="color: var(--clr-primary); flex-shrink: 0;">
                                    <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 2-2 2m-1.5 1.5L14 9.5M8 15a5 5 0 1 1 7.07-7.07l1.43-1.43a1 1 0 0 1 1.41 0l.71.71a1 1 0 0 1 0 1.41L17.2 10.1A5 5 0 0 1 8 15z"/></svg>
                                </div>
                                <div>
                                    <div style="font-weight: 800; color: var(--clr-text-main); font-size: 0.875rem;">Opsi 1: Sewa Lepas Kunci</div>
                                    <div style="font-size: 0.75rem; color: var(--clr-text-muted);">Kebebasan berkendara mandiri dengan privasi penuh bagi perjalanan Anda.</div>
                                </div>
                            </div>

                            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid var(--clr-border);">
                                <div style="color: var(--clr-primary); flex-shrink: 0;">
                                    <svg style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                </div>
                                <div>
                                    <div style="font-weight: 800; color: var(--clr-text-main); font-size: 0.875rem;">Opsi 2: Sewa Dengan Supir</div>
                                    <div style="font-size: 0.75rem; color: var(--clr-text-muted);">Nikmati perjalanan santai dengan pengemudi ramah dan paham rute lokasi.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="grid sm:grid-cols-2 gap-4">
                            <div style="padding: 1.5rem; border-radius: var(--radius-xl); background: #f8fafc; border: 1px solid var(--clr-border);">
                                <div style="color: var(--clr-primary); margin-bottom: 0.5rem;">
                                    <svg style="width: 1.75rem; height: 1.75rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                                </div>
                                <h3 style="font-size: 1rem; font-weight: 800; color: var(--clr-text-main); margin-bottom: 0.25rem;">Wisata & Liburan</h3>
                                <p style="font-size: 0.75rem; color: var(--clr-text-muted); line-height: 1.5;">Perjalanan keliling tempat wisata favorit bersama keluarga dan rombongan.</p>
                            </div>

                            <div style="padding: 1.5rem; border-radius: var(--radius-xl); background: #f8fafc; border: 1px solid var(--clr-border);">
                                <div style="color: var(--clr-primary); margin-bottom: 0.5rem;">
                                    <svg style="width: 1.75rem; height: 1.75rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                </div>
                                <h3 style="font-size: 1rem; font-weight: 800; color: var(--clr-text-main); margin-bottom: 0.25rem;">Dinas Kantor & Bisnis</h3>
                                <p style="font-size: 0.75rem; color: var(--clr-text-muted); line-height: 1.5;">Layanan profesional tepat waktu untuk kunjungan kerja dan pertemuan eksekutif.</p>
                            </div>

                            <div style="padding: 1.5rem; border-radius: var(--radius-xl); background: #f8fafc; border: 1px solid var(--clr-border);">
                                <div style="color: var(--clr-primary); margin-bottom: 0.5rem;">
                                    <svg style="width: 1.75rem; height: 1.75rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                                </div>
                                <h3 style="font-size: 1rem; font-weight: 800; color: var(--clr-text-main); margin-bottom: 0.25rem;">Pernikahan / Wedding</h3>
                                <p style="font-size: 0.75rem; color: var(--clr-text-muted); line-height: 1.5;">Mobil pengantin VIP mewah dan iring-iringan keluarga di hari istimewa.</p>
                            </div>

                            <div style="padding: 1.5rem; border-radius: var(--radius-xl); background: #f8fafc; border: 1px solid var(--clr-border);">
                                <div style="color: var(--clr-primary); margin-bottom: 0.5rem;">
                                    <svg style="width: 1.75rem; height: 1.75rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.7 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>
                                </div>
                                <h3 style="font-size: 1rem; font-weight: 800; color: var(--clr-text-main); margin-bottom: 0.25rem;">Antar Jemput Bandara</h3>
                                <p style="font-size: 0.75rem; color: var(--clr-text-muted); line-height: 1.5;">Penjemputan tepat waktu dari bandara langsung menuju hotel atau lokasi tujuan.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- ==================================================== -->
        <!-- TESTIMONI & REVIEWS PELANGGAN SECTION               -->
        <!-- ==================================================== -->
        <section id="reviews" style="padding: 4.5rem 0; background: #ffffff; border-top: 1px solid var(--clr-border);">
            <div class="container">
                
                <!-- Section Header -->
                <div style="display: flex; flex-direction: column; md:flex-row; align-items: center; justify-content: space-between; gap: 1.5rem; margin-bottom: 3rem; text-align: center;">
                    <div style="margin: 0 auto; max-width: 36rem;">
                        <span style="color: #22c55e; font-weight: 800; font-size: 0.8125rem; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">
                            WHAT DRIVERS SAY
                        </span>
                        <h2 style="font-size: 2.25rem; font-weight: 800; color: var(--clr-text-main); margin-bottom: 0.75rem; letter-spacing: -0.02em;">
                            Real Stories. Real Drivers.
                        </h2>
                        <p style="font-size: 0.9375rem; color: var(--clr-text-muted); line-height: 1.6;">
                            Ulasan & pengalaman jujur dari pelanggan kami. Kepuasan dan kenyamanan Anda adalah prioritas utama kami.
                        </p>
                    </div>
                    <div style="margin-top: 1rem;">
                        <button onclick="openReviewModal()" class="btn btn-emerald btn-lg" style="box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.4); display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 800;">
                            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            <span>Tulis Ulasan Anda</span>
                        </button>
                    </div>
                </div>

                <!-- Container Grid Cards Review -->
                <div id="reviewsContainer" class="grid md:grid-cols-3 gap-6">
                    <!-- Dynamic review cards rendered by JS -->
                </div>

            </div>
        </section>

    </main>

    <!-- ==================================================== -->
    <!-- MODAL DETAIL MOBIL & FORMULIR PEMESANAN              -->
    <!-- ==================================================== -->
    <div id="bookingModal" class="modal-backdrop hidden">
        <div class="modal-box max-w-3xl">
            
            <!-- Header Modal -->
            <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <div id="modalCarCategory" style="font-size: 0.7rem; font-weight: 800; color: var(--clr-primary); text-transform: uppercase;">MPV</div>
                    <h3 id="modalCarTitle" style="font-size: 1.25rem; font-weight: 800; color: var(--clr-text-main);">Toyota Avanza Veloz</h3>
                </div>
                <button onclick="closeBookingModal()" class="btn btn-outline btn-sm" style="padding: 0.35rem 0.6rem;">
                    ✕
                </button>
            </div>

            <!-- Isi Modal -->
            <div style="padding: 1.5rem; max-height: 80vh; overflow-y: auto;">
                
                <!-- Detail Mobil & Foto -->
                <div class="grid sm:grid-cols-2 gap-5" style="padding-bottom: 1rem; border-bottom: 1px solid var(--clr-border); margin-bottom: 1.5rem;">
                    <div>
                        <div style="border-radius: var(--radius-md); overflow: hidden; height: 11rem; background: #f1f5f9; border: 1px solid var(--clr-border);">
                            <img id="modalCarImage" src="" alt="Mobil" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                    <div>
                        <div id="modalCarStatus" style="margin-bottom: 0.5rem;"></div>
                        <p id="modalCarDesc" style="font-size: 0.8125rem; color: var(--clr-text-muted); line-height: 1.5; margin-bottom: 0.75rem;"></p>
                        
                        <!-- Spesifikasi Ringkas -->
                        <div class="grid sm:grid-cols-2 gap-2" style="font-size: 0.75rem;">
                            <div style="background: #f8fafc; padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid #f1f5f9;">
                                <span style="color: var(--clr-text-subtle); font-size: 0.65rem; display: block;">Kapasitas</span>
                                <span id="modalCarSeats" style="font-weight: 800; color: var(--clr-text-main);">7 Kursi</span>
                            </div>
                            <div style="background: #f8fafc; padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid #f1f5f9;">
                                <span style="color: var(--clr-text-subtle); font-size: 0.65rem; display: block;">Transmisi</span>
                                <span id="modalCarTrans" style="font-weight: 800; color: var(--clr-text-main);">Otomatis (AT)</span>
                            </div>
                            <div style="background: #f8fafc; padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid #f1f5f9;">
                                <span style="color: var(--clr-text-subtle); font-size: 0.65rem; display: block;">Bahan Bakar</span>
                                <span id="modalCarFuel" style="font-weight: 800; color: var(--clr-text-main);">Bensin</span>
                            </div>
                            <div style="background: #f8fafc; padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid #f1f5f9;">
                                <span style="color: var(--clr-text-subtle); font-size: 0.65rem; display: block;">Bagasi</span>
                                <span id="modalCarLuggage" style="font-weight: 800; color: var(--clr-text-main);">3 Koper</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FORMULIR PEMESANAN -->
                <form id="bookingForm" onsubmit="submitBookingWhatsApp(event)" class="flex flex-col gap-4">
                    
                    <div style="font-size: 0.875rem; font-weight: 800; color: var(--clr-text-main); padding-bottom: 0.35rem; border-bottom: 1px solid var(--clr-border);">
                        Formulir Pemesanan Unit & Waktu Pemakaian
                    </div>

                    <!-- Nama Pengorder & WA -->
                    <div class="grid sm:grid-cols-2 gap-3">
                        <div class="form-group">
                            <label class="form-label">Nama Pengorder <span style="color: var(--clr-rose);">*</span></label>
                            <input 
                                type="text" 
                                id="bookCustName" 
                                required 
                                placeholder="Masukkan nama lengkap pengorder" 
                                class="form-input"
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nomor WhatsApp <span style="color: var(--clr-rose);">*</span></label>
                            <input 
                                type="tel" 
                                id="bookCustPhone" 
                                required 
                                placeholder="Contoh: 08123456789" 
                                class="form-input"
                            />
                        </div>
                    </div>

                    <!-- Nama Event / Keperluan -->
                    <div class="form-group">
                        <label class="form-label">Nama Event / Keperluan Acara <span style="color: var(--clr-rose);">*</span></label>
                        <select id="bookEvent" name="bookEvent" required class="form-select">
                            <option value="" disabled selected>-- Pilih Jenis Event / Keperluan Acara --</option>
                            <option value="Wisata / Liburan">🏖️ Wisata / Liburan Keluarga</option>
                            <option value="Acara Pernikahan (Wedding)">💍 Acara Pernikahan / Iring-iringan</option>
                            <option value="Dinas Kantor / Bisnis">💼 Kunjungan Bisnis / Perjalanan Dinas</option>
                            <option value="Antar Jemput Bandara">✈️ Antar / Jemput Bandara</option>
                            <option value="Mudik / Pulang Kampung">🏡 Mudik / Pulang Kampung</option>
                            <option value="Acara Keluarga / Hajatan">👨‍👩‍👧‍👦 Acara Keluarga / Hajatan</option>
                            <option value="Lainnya">✨ Keperluan Lainnya</option>
                        </select>
                    </div>

                    <!-- Waktu Pemakaian -->
                    <div class="grid sm:grid-cols-2 gap-3">
                        <div class="form-group">
                            <label class="form-label">Waktu Pemakaian (Tanggal Mulai) <span style="color: var(--clr-rose);">*</span></label>
                            <input type="date" id="bookStartDate" required class="form-input" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Waktu Pemakaian (Tanggal Selesai) <span style="color: var(--clr-rose);">*</span></label>
                            <input type="date" id="bookEndDate" required class="form-input" />
                        </div>
                    </div>

                    <!-- Notifikasi Jadwal yang Sudah Dikonfirmasi -->
                    <div id="confirmedDatesNotice" class="hidden" style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: var(--radius-md); padding: 0.75rem 1rem; font-size: 0.75rem; color: #9f1239;">
                        <div style="font-weight: 700; display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.25rem;">
                            <span>⚠️</span> Jadwal Terisi & Sudah Dikonfirmasi:
                        </div>
                        <div id="confirmedDatesList"></div>
                    </div>

                    <!-- Peringatan Bentrok Tanggal -->
                    <div id="dateConflictAlert" class="hidden" style="background: #fef2f2; border: 1px solid #ef4444; border-radius: var(--radius-md); padding: 0.75rem 1rem; font-size: 0.75rem; color: #b91c1c; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🚫</span>
                        <div>Maaf, mobil ini sudah dikonfirmasi dipesan untuk tanggal yang Anda pilih. Pelanggan lain tidak dapat booking di tanggal tersebut. Silakan pilih tanggal lain!</div>
                    </div>

                    <!-- Pilihan Sewa -->
                    <div class="form-group">
                        <label class="form-label">Pilihan Jenis Sewa <span style="color: var(--clr-rose);">*</span></label>
                        <div class="grid sm:grid-cols-2 gap-2">
                            <label style="display: flex; align-items: center; padding: 0.75rem; border: 1px solid var(--clr-border); border-radius: var(--radius-md); cursor: pointer; background: #f8fafc;">
                                <input type="radio" name="driverOption" value="self" checked style="margin-right: 0.5rem;" />
                                <div>
                                    <div style="font-size: 0.8125rem; font-weight: 800; color: var(--clr-text-main);">Lepas Kunci (Berkendara Sendiri)</div>
                                    <div style="font-size: 0.7rem; color: var(--clr-text-subtle);">Tanpa biaya pengemudi</div>
                                </div>
                            </label>

                            <label style="display: flex; align-items: center; padding: 0.75rem; border: 1px solid var(--clr-border); border-radius: var(--radius-md); cursor: pointer; background: #f8fafc;">
                                <input type="radio" name="driverOption" value="driver" style="margin-right: 0.5rem;" />
                                <div>
                                    <div style="font-size: 0.8125rem; font-weight: 800; color: var(--clr-text-main);">Pakai Supir (Driver)</div>
                                    <div style="font-size: 0.7rem; color: var(--clr-emerald); font-weight: 700;" id="modalCarDriverFeeText">+ Rp 150.000 / hari</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Upload Foto KTP -->
                    <div class="form-group">
                        <label class="form-label">Foto Identitas / KTP Penyewa <span style="color: var(--clr-rose);">*</span></label>
                        
                        <div class="upload-dropzone">
                            <input type="file" id="bookKtpInput" accept="image/*" class="hidden" />

                            <div id="ktpUploadPrompt" onclick="document.getElementById('bookKtpInput').click()">
                                <div style="font-size: 0.8125rem; font-weight: 800; color: var(--clr-text-main);">Klik di sini untuk memilih foto KTP</div>
                                <div style="font-size: 0.7rem; color: var(--clr-text-subtle); margin-top: 0.2rem;">Format JPG, PNG, atau JPEG (Maksimal 5MB)</div>
                            </div>

                            <div id="ktpPreviewContainer" class="hidden" style="text-align: left;">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span style="font-size: 0.75rem; font-weight: 800; color: var(--clr-emerald);">✓ Foto KTP terpilih</span>
                                    <button type="button" onclick="resetKtpPreview()" class="btn btn-rose btn-sm">Ganti</button>
                                </div>
                                <div style="height: 10rem; width: 100%; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--clr-border); background: white; display: flex; align-items: center; justify-content: center;">
                                    <img id="ktpPreviewImg" src="" alt="Preview KTP" style="max-height: 100%; max-width: 100%; object-fit: contain;">
                                </div>
                                <div id="ktpFileName" style="font-size: 0.7rem; color: var(--clr-text-subtle); margin-top: 0.35rem; font-family: monospace;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Catatan Tambahan -->
                    <div class="form-group">
                        <label class="form-label">Catatan Tambahan (Opsional)</label>
                        <input type="text" id="bookCustNotes" placeholder="Contoh: Lokasi penjemputan di Stasiun / Bandara..." class="form-input" />
                    </div>

                    <!-- KALKULATOR RINCIAN HARGA OTOMATIS -->
                    <div style="background: #0f172a; border-radius: var(--radius-lg); padding: 1.25rem; color: white;">
                        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid #1e293b; margin-bottom: 0.75rem;">
                            <span style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Rincian Estimasi Biaya</span>
                            <span id="calcRateTypeLabel" style="font-size: 0.7rem; background: #1e293b; color: #fca5a5; padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); font-weight: 700;">Tarif Normal</span>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.8125rem;">
                            <div style="display: flex; justify-content: space-between; color: #94a3b8;">
                                <span>Durasi Sewa:</span>
                                <span id="calcDaysLabel" style="color: white; font-weight: 700;">1 Hari</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; color: #94a3b8;">
                                <span>Tarif Unit:</span>
                                <span id="calcDailyRate" style="color: white; font-weight: 700;">Rp 400.000 / hari</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; color: #94a3b8;">
                                <span>Subtotal Unit:</span>
                                <span id="calcCarTotal" style="color: white; font-weight: 700;">Rp 400.000</span>
                            </div>
                            <div id="calcDriverRow" class="hidden" style="display: flex; justify-content: space-between; color: #94a3b8;">
                                <span>Biaya Supir (<span id="calcDriverRate"></span>):</span>
                                <span id="calcDriverTotal" style="color: #34d399; font-weight: 700;">Rp 0</span>
                            </div>
                        </div>

                        <div style="padding-top: 0.75rem; margin-top: 0.75rem; border-top: 1px solid #1e293b; display: flex; align-items: baseline; justify-content: space-between;">
                            <span style="font-size: 0.8125rem; color: #94a3b8;">Total Biaya:</span>
                            <span id="calcGrandTotal" style="font-size: 1.5rem; font-weight: 800; color: white;">Rp 400.000</span>
                        </div>
                    </div>

                    <!-- TOMBOL KIRIM WHATSAPP -->
                    <div style="padding-top: 0.5rem;">
                        <button type="submit" id="bookingSubmitBtn" class="btn btn-emerald btn-lg" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;">
                            <span class="submit-label">Kirim Form Pemesanan ke WhatsApp Owner</span>
                            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                        <p style="font-size: 0.7rem; color: var(--clr-text-subtle); text-align: center; margin-top: 0.5rem;">
                            Formulir akan otomatis memformat data pengorder, waktu pemakaian, unit, dan mengirimkannya langsung ke WA Owner.
                        </p>
                    </div>

                </form>
            </div>
        </div>
    </div>

    <!-- ==================================================== -->
    <!-- MODAL UPLOAD REVIEW PELANGGAN                        -->
    <!-- ==================================================== -->
    <div id="reviewModal" class="modal-backdrop hidden">
        <div class="modal-box max-w-lg">
            
            <!-- Header Modal -->
            <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <svg style="width: 1.25rem; height: 1.25rem; fill: #eab308; stroke: #eab308;" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--clr-text-main);">Tulis Ulasan & Pengalaman Anda</h3>
                </div>
                <button onclick="closeReviewModal()" class="btn btn-outline btn-sm" style="padding: 0.35rem 0.6rem;">
                    ✕
                </button>
            </div>

            <!-- Body Modal -->
            <div style="padding: 1.5rem; max-height: 80vh; overflow-y: auto;">
                <form id="reviewForm" onsubmit="handleReviewSubmit(event)" class="flex flex-col gap-4">
                    
                    <!-- Rating Picker -->
                    <div class="form-group">
                        <label class="form-label" style="font-weight: 700;">Berapa Bintang Penilaian Anda?</label>
                        <div style="display: flex; gap: 0.5rem; font-size: 2rem; cursor: pointer; justify-content: center; padding: 0.5rem 0; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid var(--clr-border);">
                            <button type="button" class="star-picker-btn" onclick="setReviewRating(1)" style="background: none; border: none; cursor: pointer; padding: 0; color: #22c55e;">★</button>
                            <button type="button" class="star-picker-btn" onclick="setReviewRating(2)" style="background: none; border: none; cursor: pointer; padding: 0; color: #22c55e;">★</button>
                            <button type="button" class="star-picker-btn" onclick="setReviewRating(3)" style="background: none; border: none; cursor: pointer; padding: 0; color: #22c55e;">★</button>
                            <button type="button" class="star-picker-btn" onclick="setReviewRating(4)" style="background: none; border: none; cursor: pointer; padding: 0; color: #22c55e;">★</button>
                            <button type="button" class="star-picker-btn" onclick="setReviewRating(5)" style="background: none; border: none; cursor: pointer; padding: 0; color: #22c55e;">★</button>
                        </div>
                        <input type="hidden" id="reviewRatingInput" value="5">
                    </div>

                    <!-- Nama Lengkap -->
                    <div class="form-group">
                        <label class="form-label">Nama Lengkap Anda <span style="color: var(--clr-rose);">*</span></label>
                        <input type="text" id="reviewName" required placeholder="Contoh: Budi Santoso" class="form-input">
                    </div>

                    <!-- Mobil yang Disewa -->
                    <div class="form-group">
                        <label class="form-label">Unit Mobil yang Disewa (Opsional)</label>
                        <input type="text" id="reviewCarName" placeholder="Contoh: Toyota Innova Zenix / Honda HRV" class="form-input">
                    </div>

                    <!-- Isi Ulasan -->
                    <div class="form-group">
                        <label class="form-label">Ulasan & Pengalaman Layanan <span style="color: var(--clr-rose);">*</span></label>
                        <textarea id="reviewComment" required rows="4" placeholder="Ceritakan pengalaman Anda menyewa mobil di tempat kami..." class="form-textarea"></textarea>
                    </div>

                    <!-- Upload Foto / Avatar -->
                    <div class="form-group">
                        <label class="form-label">Upload Foto / Avatar (Opsional)</label>
                        <input type="file" id="reviewAvatarInput" accept="image/*" class="form-input" style="padding: 0.5rem;">
                        <div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.75rem;">
                            <img id="reviewAvatarPreview" class="hidden" style="width: 3.5rem; height: 3.5rem; border-radius: 50%; object-fit: cover; border: 2px solid #22c55e;" />
                        </div>
                    </div>

                    <!-- Notice Verification -->
                    <div style="padding: 0.75rem; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-md); font-size: 0.75rem; color: #1e40af; line-height: 1.5; display: flex; items-center; gap: 0.5rem;">
                        <svg style="width: 1rem; height: 1rem; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        <span><strong>Informasi Verifikasi:</strong> Ulasan Anda akan terlebih dahulu diverifikasi oleh Admin sebelum dipublikasikan di website demi menjaga kenyamanan bersama.</span>
                    </div>

                    <!-- Submit Button -->
                    <div style="padding-top: 0.5rem;">
                        <button type="submit" class="btn btn-emerald btn-lg" style="width: 100%; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;">
                            <span>Kirim Ulasan Pelanggan</span>
                            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                    </div>

                </form>
            </div>

        </div>
    </div>

    <!-- FOOTER & KONTAK OWNER -->
    <footer id="kontak" style="background: #ffffff; border-top: 1px solid var(--clr-border); padding-top: 3.5rem; padding-bottom: 2rem; font-size: 0.8125rem; color: var(--clr-text-muted);">
        <div class="container">
            <div class="grid md:grid-cols-12 gap-8" style="padding-bottom: 2.5rem; border-bottom: 1px solid #f1f5f9;">
                
                <!-- Profil Perusahaan -->
                <div class="md:col-span-5" style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <div class="flex items-center gap-2">
                        <img src="{{ asset('logo.png') }}" alt="Rent Car Makassar" style="width: 2.25rem; height: 2.25rem; object-fit: contain; border-radius: var(--radius-md); background: var(--clr-primary); padding: 2px;">
                        <span style="font-weight: 800; color: var(--clr-text-main); font-size: 1.1rem;" class="brand-title">Rent Car Makassar</span>
                    </div>
                    <p class="brand-tagline" style="line-height: 1.6; max-width: 26rem;">
                        Layanan Sewa Mobil Terpercaya di Makassar. Melayani lepas kunci dan dengan supir berpengalaman untuk kenyamanan perjalanan Anda.
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.8125rem;">
                        <div class="flex items-center gap-2">
                            <svg style="width: 1rem; height: 1rem; color: var(--clr-primary);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span class="owner-address">Jl. Urip Sumoharjo No. 88, Makassar</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg style="width: 1rem; height: 1rem; color: var(--clr-primary);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span class="owner-hours">Buka 24 Jam Setiap Hari</span>
                        </div>
                    </div>
                </div>

                <!-- Kontak Owner -->
                <div class="md:col-span-4" style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <div style="font-weight: 800; color: var(--clr-text-main); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">Kontak Resmi</div>
                    <div>WhatsApp Admin: <a href="#" target="_blank" class="owner-whatsapp" style="font-weight: 800; color: var(--clr-primary);">+6281234567890</a></div>
                    <div>Telepon Kantor: <a href="#" class="owner-phone" style="font-weight: 700; color: var(--clr-text-main);">0812-3456-7890</a></div>
                    <div>Email Resmi: <a href="#" class="owner-email" style="font-weight: 700; color: var(--clr-text-main);">kontak@garudarentcar.com</a></div>
                </div>

                <!-- Media Sosial & Portal Owner -->
                <div class="md:col-span-3" style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <div style="font-weight: 800; color: var(--clr-text-main); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">Media Sosial</div>
                    <div class="flex items-center gap-2" style="flex-wrap: wrap;">
                        <a id="footerIg" href="#" target="_blank" class="btn btn-outline btn-sm">Instagram</a>
                        <a id="footerFb" href="#" target="_blank" class="btn btn-outline btn-sm">Facebook</a>
                        <a id="footerTiktok" href="#" target="_blank" class="btn btn-outline btn-sm">TikTok</a>
                    </div>
                    <div style="padding-top: 0.5rem;">
                        <a href="{{ url('/admin') }}" style="color: var(--clr-primary); font-weight: 700; text-decoration: underline; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                            <svg style="width: 0.875rem; height: 0.875rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <span>Portal Dashboard Owner (Atur Harga Libur)</span>
                        </a>
                    </div>
                </div>

            </div>

            <div style="padding-top: 1.5rem; display: flex; flex-direction: row; align-items: center; justify-content: space-between; color: var(--clr-text-subtle); font-size: 0.75rem;">
                <div>&copy; 2026 <span class="brand-title">Rent Car Makassar</span>. All rights reserved.</div>
                <div>Cakupan Layanan Wilayah Makassar</div>
            </div>
        </div>
    </footer>

    <!-- FLOATING WHATSAPP BUTTON -->
    <a 
        href="#" 
        target="_blank" 
        class="owner-whatsapp floating-wa-clean"
        title="Chat WhatsApp dengan Owner">
        <svg style="width: 1.1rem; height: 1.1rem; fill: currentColor;" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
        <span>Chat Owner WA</span>
    </a>

    <!-- Application Scripts -->
    <script src="{{ asset('js/data.js') }}"></script>
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>

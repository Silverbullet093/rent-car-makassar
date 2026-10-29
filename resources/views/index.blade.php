<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rent Car Makassar — Rental Mobil Profesional & Terpercaya</title>
    <meta name="description" content="Layanan rental mobil lepas kunci & dengan supir di Makassar. Armada terawat, harga transparan, pemesanan langsung via WhatsApp.">
    
    <!-- Plus Jakarta Sans Google Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

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
            <a href="#home" class="flex items-center gap-3">
                <div style="width: 2.75rem; height: 2.75rem; background: var(--clr-primary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25); overflow: hidden;">
                    <img src="{{ asset('logo_rpm_red.png') }}" alt="RPM Rent Car" style="width: 100%; height: 100%; object-fit: contain; transform: scale(1.35);">
                </div>
                <div>
                    <span class="brand-title" data-custom-brand="rpm" style="font-size: 1.25rem; font-weight: 800; color: var(--clr-text-main); line-height: 1.1; display: block; font-family: 'Plus Jakarta Sans', sans-serif;">
                        RPM <span style="color: var(--clr-primary);">Rent Car</span>
                    </span>
                    <span style="font-size: 0.65rem; font-weight: 800; color: #64748b; letter-spacing: 0.15em; text-transform: uppercase; display: block; margin-top: 2px;">
                        MAKASSAR
                    </span>
                </div>
            </a>

            <!-- DESKTOP NAVIGATION -->
            <nav class="nav-desktop flex items-center gap-1">
                <a href="#home" class="nav-link">Beranda</a>
                <a href="#katalog" class="nav-link">Armada Mobil</a>
                <a href="#jangkauan" class="nav-link">Jangkauan</a>
                <a href="#layanan" class="nav-link">Layanan</a>
                <a href="#reviews" class="nav-link">Ulasan</a>
                <a href="#kontak" class="nav-link">Kontak</a>
            </nav>

            <!-- RIGHT ACTIONS -->
            <div class="flex items-center gap-2">
                <a href="#katalog" class="btn btn-primary btn-sm nav-cta-desktop" style="border-radius: 9999px; padding: 0.5rem 1.35rem; font-weight: 700;">
                    <span>Pilih Unit</span>
                    <i class="fa-solid fa-arrow-right" style="font-size: 0.75rem; margin-left: 0.35rem;"></i>
                </a>
                
                <!-- Hamburger Button (Mobile & Tablet) -->
                <button 
                    id="mobileMenuToggle" 
                    class="mobile-menu-btn" 
                    aria-label="Buka Menu Navigasi" 
                    onclick="toggleMobileMenu()"
                >
                    <i class="fa-solid fa-bars" id="menuIconBars"></i>
                    <i class="fa-solid fa-xmark hidden" id="menuIconClose"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- MOBILE NAVIGATION DRAWER OVERLAY -->
    <div id="mobileDrawerBackdrop" class="mobile-drawer-backdrop hidden" onclick="toggleMobileMenu()"></div>
    <div id="mobileDrawer" class="mobile-drawer">
        <div class="mobile-drawer-header">
            <div class="flex items-center gap-2.5">
                <div style="width: 2.25rem; height: 2.25rem; background: var(--clr-primary); border-radius: 0.65rem; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <img src="{{ asset('logo_rpm_red.png') }}" alt="RPM" style="width: 100%; height: 100%; object-fit: contain; transform: scale(1.35);">
                </div>
                <div>
                    <span style="font-weight: 800; font-size: 1.05rem; color: #0f172a; display: block; line-height: 1.1;">RPM <span style="color: var(--clr-primary);">Rent Car</span></span>
                    <span style="font-size: 0.6rem; font-weight: 700; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase;">Makassar</span>
                </div>
            </div>
            <button onclick="toggleMobileMenu()" class="btn-close-drawer" aria-label="Tutup Menu">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <nav class="mobile-drawer-nav">
            <a href="#home" class="mobile-nav-item" onclick="closeMobileMenu()">
                <i class="fa-solid fa-house"></i>
                <span>Beranda</span>
            </a>
            <a href="#katalog" class="mobile-nav-item" onclick="closeMobileMenu()">
                <i class="fa-solid fa-car-side"></i>
                <span>Armada Mobil</span>
            </a>
            <a href="#jangkauan" class="mobile-nav-item" onclick="closeMobileMenu()">
                <i class="fa-solid fa-map-location-dot"></i>
                <span>Jangkauan Wilayah</span>
            </a>
            <a href="#layanan" class="mobile-nav-item" onclick="closeMobileMenu()">
                <i class="fa-solid fa-briefcase"></i>
                <span>Layanan Kami</span>
            </a>
            <a href="#reviews" class="mobile-nav-item" onclick="closeMobileMenu()">
                <i class="fa-solid fa-comments"></i>
                <span>Ulasan Pelanggan</span>
            </a>
            <a href="#kontak" class="mobile-nav-item" onclick="closeMobileMenu()">
                <i class="fa-solid fa-phone"></i>
                <span>Kontak &amp; Lokasi</span>
            </a>
        </nav>

        <div class="mobile-drawer-footer">
            <a href="https://wa.me/6281234567890?text=Halo%20RPM%20Rent%20Car,%20saya%20ingin%20konsultasi%20sewa%20mobil." target="_blank" class="btn btn-emerald btn-lg w-full flex items-center justify-center gap-2" style="border-radius: 0.85rem; font-weight: 800; font-size: 0.95rem;">
                <i class="fa-brands fa-whatsapp" style="font-size: 1.25rem;"></i>
                <span>Konsultasi Cepat WA</span>
            </a>
            <div style="text-align: center; margin-top: 1rem; font-size: 0.72rem; color: #94a3b8;">
                Buka 24 Jam Setiap Hari • Makassar
            </div>
        </div>
    </div>

    <main class="flex-1">
        
        <!-- ==================================================== -->
        <!-- HERO SECTION (FULL-BLEED STUDIO CAR DISPLAY)         -->
        <!-- ==================================================== -->
        <!-- ==================================================== -->
        <!-- HERO SECTION (FULL-BLEED STUDIO CAR DISPLAY)         -->
        <!-- ==================================================== -->
        <section id="home" class="hero-fullscreen-laptop" style="position: relative; padding: 4.5rem 0 3rem 0; background-color: #ffffff; border-bottom: 1px solid var(--clr-border); overflow: hidden;">
            
            <!-- Background Car Graphic (White Alphard) with Gradient Fade -->
            <div class="hero-alphard-bg">
                <div class="hero-alphard-overlay"></div>
            </div>

            <div class="container-fluid" style="position: relative; z-index: 2;">
                <div class="grid md:grid-cols-2 gap-8 items-center hero-main-grid" style="min-height: 380px;">
                    
                    <!-- Left Hero Text Content -->
                    <div class="reveal-on-scroll" style="max-width: 42rem;">
                        <!-- Capsule Badge -->
                        <div class="hero-capsule-badge" style="display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.5rem 1.25rem; border-radius: 9999px; background: #fef2f2; border: 1px solid rgba(220, 38, 38, 0.25); color: #dc2626; font-size: 0.85rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 1.25rem; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.08);">
                            <i class="fa-solid fa-shield-halved"></i>
                            <span>RENTAL MOBIL RESMI MAKASSAR &amp; SULAWESI</span>
                        </div>

                        <!-- Main Heading -->
                        <h1 class="hero-main-title" style="font-size: clamp(2.85rem, 4.8vw, 4rem); font-weight: 800; color: #0f172a; line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 1.35rem; font-family: 'Plus Jakarta Sans', sans-serif;">
                            Sewa Mobil Nyaman. <br>
                            <span style="color: var(--clr-primary);">Di Mana Pun Perjalanan Anda.</span>
                        </h1>

                        <!-- Description -->
                        <p class="brand-desc hero-description" style="font-size: 1.2rem; color: #475569; line-height: 1.75; margin-bottom: 2rem; max-width: 40rem; font-weight: 400; font-family: 'Plus Jakarta Sans', sans-serif;">
                            RPM Rent Car Makassar menyediakan armada prima dengan layanan supir berpengalaman &amp; opsi lepas kunci untuk keperluan wisata, dinas bisnis, pernikahan, dan perjalanan keluarga Anda.
                        </p>

                        <!-- Call to Action Buttons -->
                        <div class="flex items-center gap-3" style="margin-bottom: 1.75rem; flex-wrap: wrap;">
                            <a href="#katalog" class="btn btn-primary btn-lg" style="border-radius: 0.875rem; font-weight: 700; padding: 0.95rem 1.85rem; font-size: 1rem; box-shadow: 0 10px 20px -3px rgba(220, 38, 38, 0.35); display: inline-flex; align-items: center; gap: 0.6rem;">
                                <i class="fa-solid fa-car"></i>
                                <span>Eksplor Armada Mobil</span>
                            </a>
                            <a href="https://wa.me/6281234567890?text=Halo%20RPM%20Rent%20Car,%20saya%20ingin%20berkonsultasi%20mengenai%20sewa%20mobil." target="_blank" class="btn btn-outline btn-lg hero-wa-link" style="border-radius: 0.875rem; font-weight: 700; padding: 0.95rem 1.85rem; font-size: 1rem; background: #ffffff; border: 2px solid #e2e8f0; color: #1e293b; display: inline-flex; align-items: center; gap: 0.6rem;">
                                <i class="fa-brands fa-whatsapp" style="color: #10b981; font-size: 1.25rem;"></i>
                                <span>Hubungi Admin WA</span>
                            </a>
                        </div>

                        <!-- Trust Badges Row -->
                        <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                            <span class="trust-badge-pill" style="font-size: 0.85rem; font-weight: 600; padding: 0.45rem 0.95rem;">
                                <i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Unit Bersih &amp; Steril
                            </span>
                            <span class="trust-badge-pill" style="font-size: 0.85rem; font-weight: 600; padding: 0.45rem 0.95rem;">
                                <i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Harga Transparan
                            </span>
                            <span class="trust-badge-pill" style="font-size: 0.85rem; font-weight: 600; padding: 0.45rem 0.95rem;">
                                <i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Driver Berpengalaman
                            </span>
                        </div>
                    </div>

                    <!-- Right Hero Area with Studio Background -->
                    <div style="position: relative; min-height: 300px;">
                    </div>

                </div>

                <!-- HORIZONTAL QUICK SPEC METRIC BAR (5 CARDS) -->
                <div class="hero-metric-bar reveal-on-scroll">
                    <div class="metric-item">
                        <div class="metric-icon">
                            <i class="fa-solid fa-car"></i>
                        </div>
                        <div>
                            <div class="metric-title">50+ Unit</div>
                            <div class="metric-sub">Armada Prima</div>
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-icon">
                            <i class="fa-solid fa-map-location-dot"></i>
                        </div>
                        <div>
                            <div class="metric-title">Makassar</div>
                            <div class="metric-sub">Sulawesi &amp; Nasional</div>
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-icon">
                            <i class="fa-solid fa-key"></i>
                        </div>
                        <div>
                            <div class="metric-title">Lepas Kunci</div>
                            <div class="metric-sub">Bisa Setir Mandiri</div>
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-icon">
                            <i class="fa-solid fa-user-tie"></i>
                        </div>
                        <div>
                            <div class="metric-title">Dengan Supir</div>
                            <div class="metric-sub">Driver Profesional</div>
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-icon">
                            <i class="fa-brands fa-whatsapp"></i>
                        </div>
                        <div>
                            <div class="metric-title">Fast Order</div>
                            <div class="metric-sub">Konfirmasi 24 Jam</div>
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
        <!-- CAKUPAN NASIONAL & WILAYAH OPERASIONAL               -->
        <!-- ==================================================== -->
        <section id="jangkauan" class="section-dark-coverage">
            <div class="container" style="position: relative; z-index: 2;">
                <div class="grid md:grid-cols-12 gap-8 items-center reveal-on-scroll">
                    
                    <!-- Left Text Column -->
                    <div class="md:col-span-5 text-left">
                        <div style="display: inline-block; padding: 0.35rem 0.85rem; border-radius: 0.5rem; background: #221718; border: 1px solid rgba(239, 68, 68, 0.35); color: #ef4444; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 1.25rem;">
                            CAKUPAN NASIONAL
                        </div>
                        <h2 style="font-size: 2.25rem; font-weight: 800; color: #ffffff; line-height: 1.25; letter-spacing: -0.025em; margin-bottom: 1.25rem; font-family: 'Plus Jakarta Sans', sans-serif;">
                            Melayani Perjalanan Di <br>Seluruh Wilayah Indonesia
                        </h2>
                        <p style="font-size: 0.925rem; color: #94a3b8; line-height: 1.65; margin-bottom: 1.75rem;">
                            Dari Sabang sampai Merauke, RPM Rent Car siap menemani mobilitas Anda. Didukung jaringan mitra luas di kota-kota besar seperti Makassar, Jakarta, Surabaya, Bali, Medan, Balikpapan, dan puluhan kota lainnya.
                        </p>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.875rem;">
                            <div style="background: #161f33; padding: 1.15rem; border-radius: 1rem; border: 1px solid #1e293b;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; color: #ef4444; font-weight: 800; font-size: 1.05rem; margin-bottom: 0.25rem;">
                                    <i class="fa-solid fa-city"></i> 34+ Provinsi
                                </div>
                                <p style="font-size: 0.75rem; color: #94a3b8; margin: 0; line-height: 1.4;">Antar jemput bandara &amp; hotel terdekat.</p>
                            </div>
                            <div style="background: #161f33; padding: 1.15rem; border-radius: 1rem; border: 1px solid #1e293b;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; color: #ef4444; font-weight: 800; font-size: 1.05rem; margin-bottom: 0.25rem;">
                                    <i class="fa-solid fa-headset"></i> 24/7 Layanan
                                </div>
                                <p style="font-size: 0.75rem; color: #94a3b8; margin: 0; line-height: 1.4;">Bantuan darurat di jalan kapanpun.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Right Card Column -->
                    <div class="md:col-span-7">
                        <div style="background: #131b2e; padding: 2rem; border-radius: 1.5rem; border: 1px solid #1e293b; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; color: #f8fafc;">
                                <i class="fa-solid fa-location-dot" style="color: #ef4444;"></i>
                                <span>Wilayah Utama Operasional</span>
                            </h3>
                            <div class="cities-grid">
                                <div class="city-box">Jabodetabek</div>
                                <div class="city-box">Surabaya &amp; Malang</div>
                                <div class="city-box">Bali &amp; Lombok</div>
                                <div class="city-box">Medan &amp; Sumatera</div>
                                <div class="city-box active-city">Makassar &amp; Sulawesi</div>
                                <div class="city-box">Kalimantan &amp; Lainnya</div>
                            </div>
                            <div style="padding-top: 1rem; border-top: 1px solid rgba(30, 41, 59, 0.8); text-align: center;">
                                <p style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.85rem;">Butuh sewa di kota lain di luar daftar di atas?</p>
                                <a href="https://wa.me/6281234567890?text=Halo%20RPM%20Rent%20Car,%20saya%20ingin%20menanyakan%20ketersediaan%20unit%20di%20kota..." target="_blank" class="city-wa-cta">
                                    <i class="fa-brands fa-whatsapp" style="font-size: 1.1rem;"></i>
                                    <span>TANYAKAN KETERSEDIAAN KOTA</span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- ==================================================== -->
        <!-- LAYANAN KAMI SECTION                                -->
        <!-- ==================================================== -->
        <section id="layanan" style="padding: 5rem 0; background: #ffffff; border-top: 1px solid var(--clr-border);">
            <div class="container">
                <!-- Section Header -->
                <div style="text-align: center; max-width: 48rem; margin: 0 auto 3.5rem auto;">
                    <div style="display: inline-block; padding: 0.35rem 1rem; border-radius: 9999px; background: #fef2f2; border: 1px solid rgba(220, 38, 38, 0.2); color: #dc2626; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.85rem;">
                        LAYANAN KAMI
                    </div>
                    <h2 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; letter-spacing: -0.025em; margin-bottom: 0.75rem; font-family: 'Plus Jakarta Sans', sans-serif;">
                        Solusi Transportasi Profesional
                    </h2>
                    <p style="font-size: 0.95rem; color: #64748b; line-height: 1.6; margin: 0;">
                        Pilihan paket fleksibel untuk keperluan pribadi, korporat, hingga acara penting Anda.
                    </p>
                </div>

                <!-- Cards Grid -->
                <div class="grid md:grid-cols-3 gap-6 reveal-on-scroll">
                    
                    <!-- Card 1: Dinas & Bisnis -->
                    <div class="service-card">
                        <div class="service-icon-box">
                            <i class="fa-solid fa-briefcase"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.65rem;">
                            Dinas &amp; Bisnis
                        </h3>
                        <p style="font-size: 0.875rem; color: #64748b; line-height: 1.65; margin: 0;">
                            Antar jemput klien VIP, tamu instansi, dan mobilitas operasional kantor dengan faktur resmi &amp; supir berseragam rapi.
                        </p>
                    </div>

                    <!-- Card 2: Wisata & Liburan -->
                    <div class="service-card">
                        <div class="service-icon-box">
                            <i class="fa-solid fa-umbrella-beach"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.65rem;">
                            Wisata &amp; Liburan
                        </h3>
                        <p style="font-size: 0.875rem; color: #64748b; line-height: 1.65; margin: 0;">
                            Jelajahi destinasi eksotis Makassar, Toraja, Bira, dan sekitarnya bersama supir lokal berpengalaman &amp; ramah.
                        </p>
                    </div>

                    <!-- Card 3: Wedding & VIP Car -->
                    <div class="service-card">
                        <div class="service-icon-box">
                            <i class="fa-solid fa-ring"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.65rem;">
                            Wedding &amp; VIP Car
                        </h3>
                        <p style="font-size: 0.875rem; color: #64748b; line-height: 1.65; margin: 0;">
                            Mobil pengantin mewah seperti Alphard Gen 4 dan Land Cruiser berhias pita istimewa untuk momen terindah Anda.
                        </p>
                    </div>

                </div>
            </div>
        </section>

        <!-- ==================================================== -->
        <!-- TESTIMONI & REVIEWS PELANGGAN SECTION (1 ROW SCROLLER) -->
        <!-- ==================================================== -->
        <section id="reviews" style="padding: 4.5rem 0; background: #ffffff; border-top: 1px solid var(--clr-border);">
            <div class="container">
                
                <!-- Section Header -->
                <div style="display: flex; flex-direction: column; md:flex-row; align-items: center; justify-content: space-between; gap: 1.5rem; margin-bottom: 2rem;">
                    <div style="text-align: left; max-width: 38rem;">
                        <span style="color: #22c55e; font-weight: 800; font-size: 0.8125rem; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">
                            WHAT DRIVERS SAY
                        </span>
                        <h2 style="font-size: 2.25rem; font-weight: 800; color: var(--clr-text-main); margin-bottom: 0.5rem; letter-spacing: -0.02em;">
                            Real Stories. Real Drivers.
                        </h2>
                        <p style="font-size: 0.9375rem; color: var(--clr-text-muted); line-height: 1.6; margin: 0;">
                            Ulasan &amp; pengalaman jujur pelanggan kami. Kepuasan dan kenyamanan Anda adalah prioritas utama kami.
                        </p>
                    </div>
                    <div>
                        <button onclick="openReviewModal()" class="btn btn-emerald btn-lg" style="box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.4); display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 800; padding: 0.75rem 1.35rem; font-size: 0.9rem;">
                            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            <span>Tulis Ulasan Anda</span>
                        </button>
                    </div>
                </div>

                <!-- 1 ROW REVIEWS CAROUSEL WITH LEFT & RIGHT EDGE ARROWS -->
                <div class="reviews-carousel-outer reveal-on-scroll">
                    <!-- Tombol Panah Kiri di Samping Kiri Ujung Komentar -->
                    <button id="reviewsPrevBtn" class="carousel-edge-btn edge-btn-left" aria-label="Ulasan Sebelumnya" title="Sebelumnya">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>

                    <div class="horizontal-slider-wrapper">
                        <div id="reviewsContainer" class="reviews-slider-track">
                            <!-- Dynamic review cards rendered by JS in 1 single row -->
                        </div>
                    </div>

                    <!-- Tombol Panah Kanan di Samping Kanan Ujung Komentar -->
                    <button id="reviewsNextBtn" class="carousel-edge-btn edge-btn-right" aria-label="Ulasan Berikutnya" title="Berikutnya">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
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
                        <div class="form-group" style="position: relative;">
                            <label class="form-label">Waktu Pemakaian (Tanggal Mulai) <span style="color: var(--clr-rose);">*</span></label>
                            <div style="position: relative;">
                                <input 
                                    type="text" 
                                    id="bookStartDate" 
                                    readonly 
                                    onclick="toggleBookingCalendar('start')" 
                                    placeholder="Pilih Tanggal Mulai" 
                                    required 
                                    class="form-input" 
                                    style="padding-left: 2.5rem; cursor: pointer;"
                                />
                                <i class="fa-solid fa-calendar-day" style="position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none;"></i>
                            </div>

                            <!-- Dropdown Kalender Kustom Start -->
                            <div id="calendar-start" class="hidden custom-calendar-popup">
                                <div class="cal-header">
                                    <button type="button" onclick="changeBookingMonth(-1, 'start')" class="cal-nav-btn"><i class="fa-solid fa-chevron-left"></i></button>
                                    <span id="cal-month-year-start" class="cal-month-title"></span>
                                    <button type="button" onclick="changeBookingMonth(1, 'start')" class="cal-nav-btn"><i class="fa-solid fa-chevron-right"></i></button>
                                </div>
                                <div class="cal-weekdays">
                                    <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
                                </div>
                                <div id="cal-days-start" class="cal-days-grid"></div>
                                <div class="cal-footer">
                                    <span class="cal-legend-item"><span class="cal-dot cal-dot-booked"></span> Dibooking</span>
                                    <span class="cal-legend-item"><span class="cal-dot cal-dot-finish"></span> Selesai Peminjaman</span>
                                    <button type="button" onclick="closeBookingCalendars()" class="cal-close-btn">Tutup</button>
                                </div>
                            </div>
                        </div>

                        <div class="form-group" style="position: relative;">
                            <label class="form-label">Waktu Pemakaian (Tanggal Selesai) <span style="color: var(--clr-rose);">*</span></label>
                            <div style="position: relative;">
                                <input 
                                    type="text" 
                                    id="bookEndDate" 
                                    readonly 
                                    onclick="toggleBookingCalendar('end')" 
                                    placeholder="Pilih Tanggal Selesai" 
                                    required 
                                    class="form-input" 
                                    style="padding-left: 2.5rem; cursor: pointer;"
                                />
                                <i class="fa-solid fa-calendar-check" style="position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none;"></i>
                            </div>

                            <!-- Dropdown Kalender Kustom End -->
                            <div id="calendar-end" class="hidden custom-calendar-popup">
                                <div class="cal-header">
                                    <button type="button" onclick="changeBookingMonth(-1, 'end')" class="cal-nav-btn"><i class="fa-solid fa-chevron-left"></i></button>
                                    <span id="cal-month-year-end" class="cal-month-title"></span>
                                    <button type="button" onclick="changeBookingMonth(1, 'end')" class="cal-nav-btn"><i class="fa-solid fa-chevron-right"></i></button>
                                </div>
                                <div class="cal-weekdays">
                                    <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
                                </div>
                                <div id="cal-days-end" class="cal-days-grid"></div>
                                <div class="cal-footer">
                                    <span class="cal-legend-item"><span class="cal-dot cal-dot-booked"></span> Dibooking</span>
                                    <span class="cal-legend-item"><span class="cal-dot cal-dot-finish"></span> Selesai Peminjaman</span>
                                    <button type="button" onclick="closeBookingCalendars()" class="cal-close-btn">Tutup</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Jam Peminjaman & Pengembalian -->
                    <div class="grid sm:grid-cols-2 gap-3" style="margin-top: 0.5rem;">
                        <div class="form-group">
                            <label class="form-label">Jam Peminjaman / Ambil <span style="color: var(--clr-rose);">*</span></label>
                            <div style="position: relative;">
                                <input 
                                    type="time" 
                                    id="bookStartTime" 
                                    value="09:00" 
                                    required 
                                    class="form-input" 
                                    style="padding-left: 2.5rem;"
                                />
                                <i class="fa-solid fa-clock" style="position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none;"></i>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Jam Selesai / Pengembalian <span style="color: var(--clr-rose);">*</span></label>
                            <div style="position: relative;">
                                <input 
                                    type="time" 
                                    id="bookEndTime" 
                                    value="09:00" 
                                    required 
                                    class="form-input" 
                                    style="padding-left: 2.5rem;"
                                />
                                <i class="fa-solid fa-clock-rotate-left" style="position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none;"></i>
                            </div>
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

    <!-- ==================================================== -->
    <!-- FOOTER & KONTAK OWNER (HITAM & MERAH - SAMA SEPERTI MELAYANI) -->
    <!-- ==================================================== -->
    <footer id="kontak" class="footer-dark-coverage">
        <div class="container" style="position: relative; z-index: 2;">
            <div class="grid md:grid-cols-12 gap-8" style="padding-bottom: 2.75rem; border-bottom: 1px solid #1e293b;">
                
                <!-- Profil Perusahaan -->
                <div class="md:col-span-5" style="display: flex; flex-direction: column; gap: 1rem;">
                    <div class="flex items-center gap-3">
                        <div style="width: 2.75rem; height: 2.75rem; background: #dc2626; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.45); overflow: hidden;">
                            <img src="{{ asset('logo_rpm_red.png') }}" alt="RPM Rent Car" style="width: 100%; height: 100%; object-fit: contain; transform: scale(1.35);">
                        </div>
                        <div>
                            <span class="brand-title" data-custom-brand="rpm" style="font-size: 1.25rem; font-weight: 800; color: #ffffff; line-height: 1.1; display: block; font-family: 'Plus Jakarta Sans', sans-serif;">
                                RPM <span style="color: #ef4444;">Rent Car</span>
                            </span>
                            <span style="font-size: 0.65rem; font-weight: 800; color: #ef4444; letter-spacing: 0.15em; text-transform: uppercase; display: block; margin-top: 2px;">
                                MAKASSAR
                            </span>
                        </div>
                    </div>
                    <p class="brand-tagline" style="color: #94a3b8; font-size: 0.875rem; line-height: 1.65; max-width: 26rem; margin: 0;">
                        Layanan Sewa Mobil Terpercaya di Makassar. Melayani lepas kunci dan dengan supir berpengalaman untuk kenyamanan perjalanan Anda.
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.8125rem;">
                        <div class="flex items-center gap-2.5">
                            <i class="fa-solid fa-location-dot" style="color: #ef4444; font-size: 0.95rem; width: 1.1rem; text-align: center;"></i>
                            <a href="https://maps.google.com/?q=Jl.+Perintis+Kemerdekaan+No.+10,+Makassar,+Sulawesi+Selatan" target="_blank" class="owner-gps-link" style="color: #cbd5e1; text-decoration: none; transition: color 0.2s ease;">
                                <span class="owner-address">Jl. Perintis Kemerdekaan No. 10, Makassar, Sulawesi Selatan</span>
                            </a>
                        </div>
                        <div class="flex items-center gap-2.5">
                            <i class="fa-solid fa-clock" style="color: #ef4444; font-size: 0.95rem; width: 1.1rem; text-align: center;"></i>
                            <span class="owner-hours" style="color: #cbd5e1;">Buka 24 Jam Setiap Hari</span>
                        </div>
                        
                        <!-- Tombol Buka Petunjuk Arah GPS (Google Maps) -->
                        <div style="padding-top: 0.25rem;">
                            <a 
                                id="ownerGpsBtn" 
                                href="https://maps.google.com/?q=Jl.+Perintis+Kemerdekaan+No.+10,+Makassar,+Sulawesi+Selatan" 
                                target="_blank" 
                                class="owner-gps-link footer-gps-btn"
                                style="display: inline-flex; align-items: center; gap: 0.5rem; background: #221718; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); padding: 0.45rem 0.9rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-decoration: none; transition: all 0.2s ease;"
                            >
                                <i class="fa-solid fa-location-crosshairs" style="color: #ef4444; font-size: 0.85rem;"></i>
                                <span>Buka Lokasi GPS (Google Maps)</span>
                                <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.65rem; opacity: 0.8;"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Kontak Owner -->
                <div class="md:col-span-4" style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.75rem; border-radius: 0.5rem; background: #221718; border: 1px solid rgba(239, 68, 68, 0.35); color: #ef4444; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; width: fit-content;">
                        <i class="fa-solid fa-headset"></i> KONTAK RESMI
                    </div>
                    <div style="color: #94a3b8; font-size: 0.8125rem;">
                        <span>WhatsApp Admin:</span><br>
                        <a href="https://wa.me/6281234567890" target="_blank" class="owner-whatsapp footer-red-link" style="font-weight: 800; color: #ef4444; font-size: 1.05rem; display: inline-flex; align-items: center; gap: 0.35rem; margin-top: 0.2rem;">
                            <i class="fa-brands fa-whatsapp" style="font-size: 1.15rem;"></i> +6281234567890
                        </a>
                    </div>
                    <div style="color: #94a3b8; font-size: 0.8125rem;">
                        <span>Telepon Kantor:</span>
                        <a href="tel:081234567890" class="owner-phone footer-light-link" style="font-weight: 700; color: #f8fafc; margin-left: 0.35rem;">0812-3456-7890</a>
                    </div>
                    <div style="color: #94a3b8; font-size: 0.8125rem;">
                        <span>Email Resmi:</span>
                        <a href="mailto:kontak@garudarentcar.com" class="owner-email footer-light-link" style="font-weight: 700; color: #f8fafc; margin-left: 0.35rem;">kontak@garudarentcar.com</a>
                    </div>
                </div>

                <!-- Media Sosial & Portal Owner -->
                <div class="md:col-span-3" style="display: flex; flex-direction: column; gap: 0.85rem;">
                    <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.75rem; border-radius: 0.5rem; background: #221718; border: 1px solid rgba(239, 68, 68, 0.35); color: #ef4444; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; width: fit-content;">
                        <i class="fa-solid fa-share-nodes"></i> MEDIA SOSIAL
                    </div>
                    <div class="flex items-center gap-2" style="flex-wrap: wrap;">
                        <a id="footerIg" href="#" target="_blank" class="footer-social-pill">
                            <i class="fa-brands fa-instagram" style="color: #ef4444;"></i>
                            <span class="medsos-text">Instagram</span>
                        </a>
                        <a id="footerFb" href="#" target="_blank" class="footer-social-pill">
                            <i class="fa-brands fa-facebook" style="color: #ef4444;"></i>
                            <span class="medsos-text">Facebook</span>
                        </a>
                        <a id="footerTiktok" href="#" target="_blank" class="footer-social-pill">
                            <i class="fa-brands fa-tiktok" style="color: #ef4444;"></i>
                            <span class="medsos-text">TikTok</span>
                        </a>
                    </div>
                </div>

            </div>

            <!-- Footer Bottom Bar -->
            <div style="padding-top: 1.5rem; display: flex; flex-direction: row; align-items: center; justify-content: space-between; color: #64748b; font-size: 0.75rem; flex-wrap: wrap; gap: 0.75rem;">
                <div>&copy; 2026 <span class="brand-title" style="color: #cbd5e1; font-weight: 700;">Rent Car Makassar</span>. All rights reserved.</div>
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #94a3b8;">
                    <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 8px #ef4444;"></span>
                    <span>Cakupan Layanan Wilayah Makassar &amp; Seluruh Indonesia</span>
                </div>
            </div>
        </div>
    </footer>

    <!-- FLOATING WHATSAPP BUTTON (LOGO ONLY) -->
    <aside aria-label="Kontak Cepat WhatsApp" style="position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;">
        <a 
            href="https://wa.me/6281234567890?text=Halo%20RPM%20Rent%20Car%20Makassar,%20saya%20ingin%20bertanya%20mengenai%20rental%20mobil." 
            target="_blank" 
            class="floating-wa-clean wa-icon-only"
            id="floatingWaBtn"
            title="Chat WhatsApp dengan Admin"
            aria-label="Chat WhatsApp Admin">
            <i class="fa-brands fa-whatsapp"></i>
        </a>
    </aside>

    <!-- BACK TO TOP BUTTON -->
    <button 
        id="backToTopBtn" 
        class="back-to-top-btn hidden" 
        onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" 
        title="Kembali ke atas"
        aria-label="Kembali ke atas"
    >
        <i class="fa-solid fa-arrow-up"></i>
    </button>

    <!-- Application Scripts -->
    <script src="{{ asset('js/data.js') }}"></script>
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>

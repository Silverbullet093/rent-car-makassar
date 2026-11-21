<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Owner — Rent Car Makassar</title>
    
    <!-- Plus Jakarta Sans Google Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Custom Vanilla CSS -->
    <!-- Cache Busting Headers -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">

    <link rel="stylesheet" href="/css/style.css?v={{ file_exists(public_path('css/style.css')) ? filemtime(public_path('css/style.css')) : time() }}">
    <!-- Mobile Responsive Patch -->
    <link rel="stylesheet" href="/css/responsive-mobile.css?v={{ file_exists(public_path('css/responsive-mobile.css')) ? filemtime(public_path('css/responsive-mobile.css')) : time() }}">
</head>
<body style="background-color: var(--clr-bg); color: var(--clr-text-main);">

    <!-- ==================================================== -->
    <!-- VIEW 1: LAYAR LOGIN ADMIN (JIKA BELUM LOGIN)        -->
    <!-- ==================================================== -->
    <div id="loginSection" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; background-color: #f1f5f9;">
        <div style="max-width: 26rem; width: 100%; background: #ffffff; border-radius: var(--radius-xl); padding: 2rem; border: 1px solid var(--clr-border); box-shadow: var(--shadow-xl);">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="width: 4.5rem; height: 4.5rem; background: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.45); overflow: hidden; margin: 0 auto 0.75rem auto;">
                    <img src="/logo_rpm_red.png" alt="RPM Rent Car Makassar" style="width: 100%; height: 100%; object-fit: contain; transform: scale(1.35);">
                </div>
                <h1 style="font-size: 1.25rem; font-weight: 800; color: var(--clr-text-main);">Portal Dashboard Owner</h1>
                <p style="font-size: 0.75rem; color: var(--clr-text-muted); margin-top: 0.25rem;">Masuk untuk mengelola tarif libur, ketersediaan mobil, dan kontak bisnis.</p>
            </div>

            <div id="loginErrorMessage" class="hidden" style="margin-bottom: 1rem; padding: 0.75rem; background-color: #fff1f2; border: 1px solid #fecdd3; color: #e11d48; font-size: 0.75rem; border-radius: var(--radius-md); font-weight: 600;"></div>

            <form onsubmit="handleAdminLogin(event)" class="flex flex-col gap-4">
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Username</label>
                    <input 
                        type="text" 
                        id="loginUsername" 
                        required 
                        placeholder="admin" 
                        class="form-input"
                    />
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Password</label>
                    <input 
                        type="password" 
                        id="loginPassword" 
                        required 
                        placeholder="••••••••" 
                        class="form-input"
                    />
                </div>

                <button 
                    type="submit" 
                    class="btn btn-primary btn-lg" style="width: 100%; margin-top: 0.5rem;">
                    Masuk ke Dashboard
                </button>

                <div style="padding-top: 0.75rem; text-align: center; border-top: 1px solid #f1f5f9; margin-top: 0.5rem;">
                    <a href="{{ url('/rcm-makassar') }}" style="font-size: 0.75rem; color: var(--clr-text-muted); font-weight: 600;">
                        ← Kembali ke Halaman Utama Website
                    </a>
                </div>
            </form>
        </div>
    </div>

    <!-- ==================================================== -->
    <!-- VIEW 2: DASHBOARD LENGKAP OWNER (SETELAH LOGIN)      -->
    <!-- ==================================================== -->
    <div id="dashboardSection" class="dashboard-layout hidden">
        
        <!-- SIDEBAR NAVIGASI -->
        <aside class="sidebar">
            <!-- Brand Header -->
            <div class="sidebar-header">
                <div class="flex items-center" style="gap: 1.15rem;">
                    <div style="width: 2.65rem; height: 2.65rem; background: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.45); overflow: hidden; flex-shrink: 0;">
                        <img src="/logo_rpm_red.png" alt="RPM Rent Car" style="width: 100%; height: 100%; object-fit: contain; transform: scale(1.35);">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.15rem;">
                        <div style="font-size: 0.95rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;" class="brand-title">RPM <span style="color: #ef4444; font-weight: 800; margin-left: 0.25rem;">Rent Car</span></div>
                        <div style="font-size: 0.625rem; color: #94a3b8; letter-spacing: 0.08em; font-weight: 700; text-transform: uppercase;">Makassar • Owner</div>
                    </div>
                </div>
            </div>

            <!-- Menu Sidebar -->
            <nav class="sidebar-nav">
                <button onclick="switchTab('overview')" id="nav-overview" class="tab-nav-btn active">
                    <svg style="width: 1.1rem; height: 1.1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                    <span>Ringkasan Bisnis</span>
                </button>

                <button onclick="switchTab('bookings')" id="nav-bookings" class="tab-nav-btn" style="justify-content: space-between;">
                    <span style="display: inline-flex; align-items: center; gap: 0.75rem;">
                        <svg style="width: 1.1rem; height: 1.1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        <span>Data Booking & Pesanan</span>
                    </span>
                    <span id="sidebarActiveBookingCount" style="font-size: 0.65rem; font-weight: 800; padding: 0.1rem 0.45rem; border-radius: 999px; background: rgba(16, 185, 129, 0.2); color: #6ee7b7;">0</span>
                </button>

                <button onclick="switchTab('cars')" id="nav-cars" class="tab-nav-btn">
                    <svg style="width: 1.1rem; height: 1.1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                    <span>Kelola Armada Mobil</span>
                </button>

                <button onclick="switchTab('reviews')" id="nav-reviews" class="tab-nav-btn">
                    <svg style="width: 1.1rem; height: 1.1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span>Moderasi Review Pelanggan</span>
                </button>

                <button onclick="switchTab('pricing')" id="nav-pricing" class="tab-nav-btn">
                    <svg style="width: 1.1rem; height: 1.1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span>Tarif & Waktu Libur</span>
                </button>

                <button onclick="switchTab('contact')" id="nav-contact" class="tab-nav-btn">
                    <svg style="width: 1.1rem; height: 1.1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>Kontak & No WhatsApp</span>
                </button>

            </nav>

            <!-- Bottom Action: View Live Site & Logout -->
            <div style="padding: 1rem; border-top: 1px solid #1e293b; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.75rem;">
                <a 
                    href="{{ url('/rcm-makassar') }}" 
                    target="_blank" 
                    style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border-radius: var(--radius-md); background: rgba(255, 255, 255, 0.05); color: #cbd5e1; font-weight: 600;">
                    <span class="flex items-center gap-2">
                        <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        <span>Lihat Website</span>
                    </span>
                    <span style="font-size: 0.7rem; color: #64748b;">↗</span>
                </a>

                <button 
                    onclick="handleAdminLogout()" 
                    style="width: 100%; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border-radius: var(--radius-md); color: #f43f5e; background: transparent; border: none; cursor: pointer; font-weight: 600;">
                    <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    <span>Keluar (Logout)</span>
                </button>
            </div>
        </aside>

        <!-- MAIN AREA KONTEN DASHBOARD (SCROLLABLE INDEPENDENT DARI HEADER & SIDEBAR) -->
        <div class="flex-1 flex flex-col" style="min-width: 0; height: 100vh; max-height: 100vh; overflow: hidden;">
            
            <!-- Top Header Bar (Menetap / Fixed Sticky) -->
            <header class="admin-fixed-header">
                <div class="flex items-center gap-3">
                    <button 
                        id="adminSidebarToggle" 
                        class="admin-mobile-toggle" 
                        onclick="toggleAdminSidebar()" 
                        aria-label="Buka Menu Sidebar"
                    >
                        <i class="fa-solid fa-bars"></i>
                    </button>
                    <div>
                        <h2 id="pageTitle" style="font-size: 1rem; font-weight: 800; color: var(--clr-text-main);">Ringkasan Bisnis & Armada</h2>
                        <p id="pageSubtitle" style="font-size: 0.75rem; color: var(--clr-text-subtle);">Pantau ketersediaan armada dan status operasional hari ini.</p>
                    </div>
                </div>

                <!-- Live Status Badge -->
                <div class="flex items-center gap-3">
                    <div id="topPricingModeBadge" class="status-pill-ready">
                        <span class="dot-indicator" style="background-color: var(--clr-emerald);"></span>
                        <span id="topPricingModeText">Tarif Normal Aktif</span>
                    </div>

                    <div style="height: 1.5rem; width: 1px; background: var(--clr-border);"></div>

                    <div style="font-size: 0.75rem; color: var(--clr-text-muted); font-weight: 600;">
                        Admin Owner
                    </div>
                </div>
            </header>

            <!-- MAIN TAB CONTENTS -->
            <main class="admin-main-scroll flex flex-col gap-6">

                <!-- ==================================================== -->
                <!-- TAB 1: OVERVIEW (RINGKASAN)                          -->
                <!-- ==================================================== -->
                <div id="tab-content-overview" class="tab-pane flex flex-col gap-6">
                    
                    <!-- Alert Status Banner -->
                    <div id="overviewHolidayBanner" class="banner-alert" style="background: #ffffff; border: 1px solid var(--clr-border); border-left: 3.5px solid #059669; border-radius: var(--radius-md); padding: 0.85rem 1.15rem;">
                        <div class="flex items-center gap-3">
                            <div id="bannerIconBox" style="width: 2.25rem; height: 2.25rem; border-radius: var(--radius-md); background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 1rem;">
                                <i class="fa-solid fa-calendar-check"></i>
                            </div>
                            <div>
                                <h3 id="bannerTitle" style="font-size: 0.875rem; font-weight: 800; color: #0f172a; margin: 0;">Tarif Normal Sedang Diberlakukan</h3>
                                <p id="bannerDesc" style="font-size: 0.75rem; margin-top: 0.1rem; color: #64748b;">Pengunjung yang melakukan pemesanan saat ini dikenakan harga sewa normal harian.</p>
                            </div>
                        </div>
                        <button onclick="switchTab('pricing')" class="btn btn-outline btn-sm">
                            Atur Tarif Libur →
                        </button>
                    </div>

                    <!-- 4 Kartu Metrik Utama Bisnis & Omzet -->
                    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <!-- Total Pendapatan Sesuai Periode -->
                        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); box-shadow: var(--shadow-xs);">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;" id="statRevenueTitle">Pendapatan Bulan Ini</div>
                                <i class="fa-solid fa-wallet" style="color: #94a3b8; font-size: 0.875rem;"></i>
                            </div>
                            <div style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-top: 0.4rem;" id="statTotalRevenue">Rp 0</div>
                            <div style="display: flex; align-items: center; gap: 0.35rem; margin-top: 0.35rem;">
                                <span id="statRevenueGrowthBadge" style="font-size: 0.65rem; font-weight: 800; padding: 0.1rem 0.4rem; border-radius: 4px; background: #ecfdf5; color: #047857;">+0%</span>
                                <span style="font-size: 0.7rem; color: #64748b;" id="statRevenueComparisonText">vs bulan lalu</span>
                            </div>
                        </div>

                        <!-- Unit Ready -->
                        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); box-shadow: var(--shadow-xs);">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">Unit Ready (Tersedia)</div>
                                <i class="fa-solid fa-car" style="color: #94a3b8; font-size: 0.875rem;"></i>
                            </div>
                            <div style="font-size: 1.5rem; font-weight: 800; color: #059669; margin-top: 0.4rem;" id="statReadyCars">0 Unit</div>
                            <div style="font-size: 0.7rem; color: #64748b; margin-top: 0.35rem;">Dari <span id="statTotalCars">0</span> total armada katalog</div>
                        </div>

                        <!-- Sedang Digunakan -->
                        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); box-shadow: var(--shadow-xs);">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">Sedang Disewa (In Use)</div>
                                <i class="fa-solid fa-clock" style="color: #94a3b8; font-size: 0.875rem;"></i>
                            </div>
                            <div style="font-size: 1.5rem; font-weight: 800; color: #d97706; margin-top: 0.4rem;" id="statInUseCars">0 Unit</div>
                            <div style="font-size: 0.7rem; color: #64748b; margin-top: 0.35rem;">Operasional rental aktif</div>
                        </div>

                        <!-- Total Transaksi Booking Sesuai Periode -->
                        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); box-shadow: var(--shadow-xs);">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;" id="statBookingsTitle">Total Order Masuk</div>
                                <i class="fa-solid fa-receipt" style="color: #94a3b8; font-size: 0.875rem;"></i>
                            </div>
                            <div style="font-size: 1.5rem; font-weight: 800; color: #2563eb; margin-top: 0.4rem;" id="statTotalBookingsCount">0 Order</div>
                            <div style="font-size: 0.7rem; color: #64748b; margin-top: 0.35rem;" id="statTotalSalesAllTime">Total omzet terverifikasi</div>
                        </div>
                    </div>

                    <!-- ======================================================== -->
                    <!-- GRAFIK PENDAPATAN & ANALISIS TREN (MINGGU / BULAN / TAHUN) -->
                    <!-- ======================================================== -->
                    <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); padding: 1.5rem; box-shadow: var(--shadow-xs);">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3" style="margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
                            <div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fa-solid fa-chart-simple" style="color: #dc2626; font-size: 1rem;"></i>
                                    <h3 style="font-size: 0.95rem; font-weight: 800; color: var(--clr-text-main);">Grafik Pendapatan</h3>
                                </div>
                                <p style="font-size: 0.75rem; color: var(--clr-text-subtle); margin-top: 0.15rem;">
                                    Perbandingan omzet rental berdasarkan periode terpilih.
                                </p>
                            </div>

                            <!-- Filter Rentang Waktu (Mingguan, Bulanan, Tahunan) -->
                            <div style="display: flex; align-items: center; background: #f1f5f9; padding: 0.25rem; border-radius: 999px; gap: 0.25rem; border: 1px solid #e2e8f0;">
                                <button onclick="setRevenueChartTimeframe('week', this)" id="btnTimeframeWeek" class="revenue-tf-btn" style="border: none; padding: 0.4rem 0.85rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; background: transparent; color: #64748b;">
                                    Per Minggu
                                </button>
                                <button onclick="setRevenueChartTimeframe('month', this)" id="btnTimeframeMonth" class="revenue-tf-btn active" style="border: none; padding: 0.4rem 0.85rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; background: #dc2626; color: #ffffff;">
                                    Per Bulan
                                </button>
                                <button onclick="setRevenueChartTimeframe('year', this)" id="btnTimeframeYear" class="revenue-tf-btn" style="border: none; padding: 0.4rem 0.85rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; background: transparent; color: #64748b;">
                                    Per Tahun
                                </button>
                            </div>
                        </div>

                        <!-- Ringkasan Perbandingan Naik / Turun -->
                        <div class="grid sm:grid-cols-3 gap-3" style="margin-bottom: 1.5rem;">
                            <!-- Perbandingan Bulan Ini vs Bulan Lalu -->
                            <div style="padding: 0.85rem 1rem; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid var(--clr-border);">
                                <div style="font-size: 0.7rem; color: #64748b; font-weight: 600;">Perbandingan Bulanan (MoM)</div>
                                <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-top: 0.2rem;">
                                    <span style="font-size: 1.15rem; font-weight: 800; color: var(--clr-text-main);" id="cmpMonthCurrent">Rp 0</span>
                                    <span id="cmpMonthDiffBadge" style="font-size: 0.75rem; font-weight: 800;">+0%</span>
                                </div>
                                <div style="font-size: 0.65rem; color: #94a3b8; margin-top: 0.2rem;" id="cmpMonthSub">Bln ini vs bln lalu (Rp 0)</div>
                            </div>

                            <!-- Perbandingan Tahun Ini vs Tahun Lalu -->
                            <div style="padding: 0.85rem 1rem; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid var(--clr-border);">
                                <div style="font-size: 0.7rem; color: #64748b; font-weight: 600;">Perbandingan Tahunan (YoY)</div>
                                <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-top: 0.2rem;">
                                    <span style="font-size: 1.15rem; font-weight: 800; color: var(--clr-text-main);" id="cmpYearCurrent">Rp 0</span>
                                    <span id="cmpYearDiffBadge" style="font-size: 0.75rem; font-weight: 800;">+0%</span>
                                </div>
                                <div style="font-size: 0.65rem; color: #94a3b8; margin-top: 0.2rem;" id="cmpYearSub">Thn ini vs thn lalu (Rp 0)</div>
                            </div>

                            <!-- Rata-rata per Rental -->
                            <div style="padding: 0.85rem 1rem; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid var(--clr-border);">
                                <div style="font-size: 0.7rem; color: #64748b; font-weight: 600;">Rata-rata Nilai Sewa / Transaksi</div>
                                <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-top: 0.2rem;">
                                    <span style="font-size: 1.15rem; font-weight: 800; color: #059669;" id="cmpAvgOrder">Rp 0</span>
                                </div>
                                <div style="font-size: 0.65rem; color: #94a3b8; margin-top: 0.2rem;">Rerata omzet per pesanan rental</div>
                            </div>
                        </div>

                        <!-- Canvas / SVG Visual Interactive Bar & Area Chart Container -->
                        <div style="background: #ffffff; border: 1px solid #f1f5f9; border-radius: var(--radius-md); padding: 1.25rem 1rem 0.5rem 1rem;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                                <div style="font-size: 0.8rem; font-weight: 800; color: var(--clr-text-main);" id="chartViewTitle">Grafik Pendapatan 7 Hari Terakhir (Mingguan)</div>
                                <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.7rem; color: #64748b;">
                                    <span style="display: inline-flex; align-items: center; gap: 0.35rem;">
                                        <span style="width: 0.65rem; height: 0.65rem; background: #dc2626; border-radius: 2px;"></span>
                                        <span>Pendapatan Terverifikasi</span>
                                    </span>
                                </div>
                            </div>

                            <!-- Dynamic SVG Bar / Line Chart -->
                            <div id="revenueChartContainer" style="width: 100%; min-height: 220px; position: relative;">
                                <!-- Populated dynamically by renderRevenueAnalytics() in admin.js -->
                            </div>
                        </div>
                    </div>

                    <!-- Preview Cepat Status Mobil -->
                    <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); padding: 1.5rem; box-shadow: var(--shadow-xs);">
                        <div class="flex items-center justify-between" style="margin-bottom: 1rem;">
                            <div>
                                <h3 style="font-size: 0.875rem; font-weight: 800; color: var(--clr-text-main);">Status Ketersediaan Armada Hari Ini</h3>
                                <p style="font-size: 0.75rem; color: var(--clr-text-subtle);">Ubah status unit dengan satu kali klik tanpa reload halaman.</p>
                            </div>
                            <button onclick="switchTab('cars')" class="btn btn-outline btn-sm">
                                Buka Semua Mobil →
                            </button>
                        </div>

                        <div id="overviewCarsGrid" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <!-- Quick car cards rendered here -->
                        </div>
                    </div>

                </div>

                <!-- ==================================================== -->
                <!-- TAB 2: KELOLA ARMADA MOBIL                          -->
                <!-- ==================================================== -->
                <div id="tab-content-cars" class="tab-pane hidden flex flex-col gap-6">
                    
                    <div class="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
                        <div class="flex items-center gap-2">
                            <button onclick="openAddCarModal()" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem;">
                                <i class="fa-solid fa-plus"></i>
                                <span>Tambah Unit Baru</span>
                            </button>
                        </div>
                    </div>

                    <!-- Tabel Manajemen Mobil -->
                    <div class="table-container">
                        <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
                            <input 
                                type="text" 
                                id="adminSearchInput" 
                                oninput="handleAdminSearch(event)" 
                                placeholder="Cari unit mobil berdasarkan merek atau model..." 
                                class="form-input"
                                style="max-width: 22rem; padding: 0.35rem 0.75rem; font-size: 0.75rem;"
                            />
                            <div style="font-size: 0.7rem; color: var(--clr-text-subtle); font-weight: 600;">
                                Menampilkan seluruh armada yang aktif
                            </div>
                        </div>

                        <div class="admin-table-scroll" style="border-radius: 0 0 var(--radius-lg) var(--radius-lg);">
                        <table class="data-table" style="min-width: 640px;">
                            <thead>
                                <tr>
                                    <th>Mobil & Kategori</th>
                                    <th style="text-align: center;">Status Unit</th>
                                    <th>Harga Normal</th>
                                    <th style="color: var(--clr-rose);">Harga Libur</th>
                                    <th>Biaya Supir</th>
                                    <th style="text-align: right;">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="carsTableBody">
                                <!-- Populated by JS -->
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>

                <!-- ==================================================== -->
                <!-- TAB 2: DATA BOOKING & PESANAN (AKTIF)                -->
                <!-- ==================================================== -->
                <div id="tab-content-bookings" class="tab-pane hidden flex flex-col gap-6">
                    
                    <!-- Header Actions & Filters -->
                    <div style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end; gap: 0.65rem; flex-wrap: wrap;">
                        <button type="button" onclick="openBookingHistoryModal()" class="btn-history-switch" title="Buka Pop Up Riwayat Pemesanan Pembayaran Lunas">
                            <i class="fa-solid fa-circle-check" style="color: #34d399;"></i>
                            <span>Riwayat Pemesanan (Lunas)</span>
                            <span id="headerHistoryCount" style="background: rgba(255,255,255,0.18); color: #ffffff; font-size: 0.7rem; font-weight: 800; padding: 0.1rem 0.5rem; border-radius: 999px;">0</span>
                        </button>

                        <button type="button" onclick="openAdminBookingModal()" class="btn" style="background-color: #dc2626; color: #ffffff; font-weight: 700; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.25rem; border-radius: var(--radius-md); border: none; cursor: pointer; box-shadow: var(--shadow-sm);">
                            <span style="font-size: 1.1rem; line-height: 1;">+</span>
                            <span>Input Booking Manual</span>
                        </button>
                    </div>

                    <!-- Search & Filter Controls -->
                    <div style="background: #ffffff; padding: 1rem; border-radius: var(--radius-xl); border: 1px solid var(--clr-border); display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between; box-shadow: var(--shadow-xs);">
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 240px;">
                            <input type="text" id="adminBookingSearch" oninput="filterBookingsTable()" placeholder="Cari nama pelanggan, HP, kode booking, atau armada..." class="form-input" style="font-size: 0.8125rem;">
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                            <!-- Filter Periode Real-Time -->
                            <div style="display: flex; align-items: center; gap: 0.4rem;">
                                <span style="font-size: 0.75rem; color: var(--clr-text-muted); font-weight: 600;">Periode:</span>
                                <select id="adminBookingFilterPeriod" onchange="filterBookingsTable()" class="form-select" style="font-size: 0.8125rem; width: auto; padding-right: 2rem; font-weight: 700; color: #dc2626; border-color: #fca5a5;">
                                    <option value="month" selected>Per Bulan (Bulan Ini)</option>
                                    <option value="week">Per Minggu (7 Hari Terakhir)</option>
                                    <option value="year">Per Tahun (Tahun Ini)</option>
                                    <option value="all">Semua Waktu</option>
                                </select>
                            </div>

                            <!-- Filter Status -->
                            <div style="display: flex; align-items: center; gap: 0.4rem;">
                                <span style="font-size: 0.75rem; color: var(--clr-text-muted); font-weight: 600;">Status:</span>
                                <select id="adminBookingFilterStatus" onchange="filterBookingsTable()" class="form-select" style="font-size: 0.8125rem; width: auto; padding-right: 2rem;">
                                    <option value="all">Semua Status</option>
                                    <option value="confirmed">Verifikasi</option>
                                    <option value="confirmed_pending">Verifikasi + Menunggu Pembayaran</option>
                                    <option value="pending">Menunggu</option>
                                    <option value="cancelled">Dibatalkan</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Table Card -->
                    <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--clr-border); box-shadow: var(--shadow-sm); overflow: hidden;">
                        <div class="admin-table-scroll">
                            <table class="data-table" style="width: 100%; min-width: 880px; border-collapse: collapse; font-size: 0.8125rem; text-align: left;">
                                <thead style="background: #f8fafc; border-bottom: 1px solid var(--clr-border); color: #64748b; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
                                    <tr>
                                        <th style="padding: 0.875rem 1.25rem;">KODE BOOKING</th>
                                        <th style="padding: 0.875rem 1.25rem;">PELANGGAN</th>
                                        <th style="padding: 0.875rem 1.25rem;">ARMADA MOBIL</th>
                                        <th style="padding: 0.875rem 1.25rem;">TANGGAL SEWA</th>
                                        <th style="padding: 0.875rem 1.25rem;">LOKAL/SUPIR</th>
                                        <th style="padding: 0.875rem 1.25rem;">TOTAL BIAYA</th>
                                        <th style="padding: 0.875rem 1.25rem;">JAM PEMAKAIAN</th>
                                        <th style="padding: 0.875rem 1.25rem;">STATUS</th>
                                        <th style="padding: 0.875rem 1.25rem; text-align: center;">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody id="adminBookingsTableBody">
                                    <!-- Dynamic rows populated by JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                <!-- ==================================================== -->
                <!-- TAB MODERASI REVIEW PELANGGAN                         -->
                <!-- ==================================================== -->
                <div id="tab-content-reviews" class="tab-pane hidden flex flex-col gap-6">
                    
                    <!-- Header Actions & Segmented Filters -->
                    <div class="rev-toolbar">
                        <div class="rev-filter-bar" role="tablist" aria-label="Filter status ulasan">
                            <button type="button" onclick="setAdminReviewFilter('all', this)" class="review-filter-btn rev-filter-tab active">
                                <span>Semua</span>
                                <span id="reviewStatTotal" class="rev-filter-count">0</span>
                            </button>
                            <button type="button" onclick="setAdminReviewFilter('pending', this)" class="review-filter-btn rev-filter-tab">
                                <span class="rev-status-dot" style="background: #f59e0b;"></span>
                                <span>Menunggu</span>
                                <span id="reviewStatPending" class="rev-filter-count">0</span>
                            </button>
                            <button type="button" onclick="setAdminReviewFilter('approved', this)" class="review-filter-btn rev-filter-tab">
                                <span class="rev-status-dot" style="background: #16a34a;"></span>
                                <span>Disetujui</span>
                                <span id="reviewStatApproved" class="rev-filter-count">0</span>
                            </button>
                            <button type="button" onclick="setAdminReviewFilter('rejected', this)" class="review-filter-btn rev-filter-tab">
                                <span class="rev-status-dot" style="background: #ef4444;"></span>
                                <span>Ditolak</span>
                                <span id="reviewStatRejected" class="rev-filter-count">0</span>
                            </button>
                        </div>

                        <div>
                            <button type="button" onclick="openAdminAddReviewModal()" class="rev-add-btn">
                                <i class="fa-solid fa-plus"></i>
                                <span>Tambah Review Manual</span>
                            </button>
                        </div>
                    </div>

                    <!-- Tabel Moderasi Review -->
                    <div style="background: white; border-radius: var(--radius-xl); border: 1px solid var(--clr-border); overflow: hidden; box-shadow: var(--shadow-sm);">
                        <div class="admin-table-scroll">
                            <table class="data-table" style="width: 100%; min-width: 820px; border-collapse: collapse; text-align: left;">
                                <thead style="background: #f8fafc; border-bottom: 1px solid var(--clr-border); font-size: 0.72rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em;">
                                    <tr>
                                        <th style="padding: 0.85rem 1rem;">Pelanggan &amp; Unit</th>
                                        <th style="padding: 0.85rem 1rem;">Rating</th>
                                        <th style="padding: 0.85rem 1rem;">Ulasan / Testimoni</th>
                                        <th style="padding: 0.85rem 1rem; text-align: center;">Media Story</th>
                                        <th style="padding: 0.85rem 1rem;">Kategori</th>
                                        <th style="padding: 0.85rem 1rem;">Status</th>
                                        <th style="padding: 0.85rem 1rem; text-align: right;">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="reviewsTableBody">
                                    <!-- Rendered dynamically by JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                <!-- ==================================================== -->
                <!-- TAB 3: TARIF & WAKTU LIBUR (HOLIDAY PRICING)         -->
                <!-- ==================================================== -->
                <div id="tab-content-pricing" class="tab-pane hidden flex flex-col gap-6">
                    
                    <!-- Kartu Pengaturan Mode Libur Sederhana & Lengkap -->
                    <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); padding: 1.5rem; box-shadow: var(--shadow-xs);">
                        <div style="max-width: 40rem;">
                            <div class="flex items-center gap-2" style="margin-bottom: 0.25rem;">
                                <i class="fa-solid fa-calendar-day" style="color: #dc2626; font-size: 1.125rem;"></i>
                                <h3 style="font-size: 1rem; font-weight: 800; color: var(--clr-text-main);">Pengaturan Tarif Waktu Libur (Peak Season)</h3>
                            </div>
                            <p style="font-size: 0.75rem; color: var(--clr-text-muted); line-height: 1.5; margin-bottom: 1.5rem;">
                                Fitur ini memudahkan Anda menaikkan tarif sewa mobil di waktu-waktu khusus (seperti Libur Hari Raya Idul Fitri, Libur Natal, Tahun Baru, atau Libur Sekolah) secara otomatis tanpa perlu mengubah harga mobil satu per satu.
                            </p>

                            <!-- Sakelar Toggle Mode Libur -->
                            <div style="padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--clr-border); background: #f8fafc; margin-bottom: 1.5rem;" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--clr-text-main); margin-bottom: 0.25rem;">Status Mode Tarif Libur Saat Ini:</div>
                                    <div id="holidayToggleStatusText" style="font-size: 0.875rem; font-weight: 800; color: var(--clr-text-muted);">
                                        <span style="display:inline-flex;align-items:center;gap:0.4rem;"><i class="fa-solid fa-circle-dot" style="color:#94a3b8;"></i> <b>NONAKTIF</b> — Pelanggan melihat &amp; memesan dengan Tarif Normal</span>
                                    </div>
                                    <div style="font-size: 0.7rem; color: var(--clr-text-subtle); margin-top: 0.25rem;">Geser sakelar di samping untuk mengaktifkan tarif musim liburan.</div>
                                </div>

                                <label style="display: inline-flex; align-items: center; cursor: pointer; flex-shrink: 0;">
                                    <input type="checkbox" id="mainHolidayToggle" onchange="toggleHolidayMode(event)" style="width: 1.25rem; height: 1.25rem; cursor: pointer;">
                                    <span style="margin-left: 0.5rem; font-size: 0.75rem; font-weight: 700;">Aktifkan Mode Libur</span>
                                </label>
                            </div>

                            <!-- Catatan Liburan -->
                            <div class="form-group" style="margin-bottom: 1.5rem;">
                                <label class="form-label">Nama / Keterangan Musim Liburan (Ditampilkan ke Pelanggan)</label>
                                <div class="flex gap-2">
                                    <input 
                                        type="text" 
                                        id="holidayNotesInput" 
                                        placeholder="Contoh: Libur Hari Raya Idul Fitri / Libur Akhir Tahun" 
                                        class="form-input"
                                        style="flex: 1;"
                                    />
                                    <button onclick="saveHolidayNotes()" class="btn btn-primary btn-sm">
                                        Simpan Catatan
                                    </button>
                                </div>
                                <p style="font-size: 0.7rem; color: var(--clr-text-subtle); margin-top: 0.25rem;">Keterangan musim liburan yang tersimpan di pengaturan sistem.</p>
                            </div>
                        </div>

                        <!-- Perbandingan Tarif Normal vs Libur -->
                        <div style="padding-top: 1.5rem; border-top: 1px solid #f1f5f9;">
                            <h4 style="font-size: 0.75rem; font-weight: 800; color: var(--clr-text-main); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Tabel Perbandingan Tarif Normal vs Tarif Libur</h4>
                            <div class="table-container">
                                <div class="admin-table-scroll" style="border-radius: 0 0 var(--radius-lg) var(--radius-lg);">
                                    <table class="data-table" style="min-width: 640px;">
                                        <thead>
                                            <tr>
                                                <th>Unit Mobil</th>
                                                <th>Tarif Normal (Per Hari)</th>
                                                <th style="color: var(--clr-rose);">Tarif Libur (Per Hari)</th>
                                                <th>Selisih Kenaikan</th>
                                                <th style="text-align: right;">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody id="pricingComparisonTable">
                                            <!-- Rendered by JS -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- ==================================================== -->
                <!-- TAB 4: KONTAK & WHATSAPP OWNER                       -->
                <!-- ==================================================== -->
                <div id="tab-content-contact" class="tab-pane hidden flex flex-col gap-6">
                    
                    <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--clr-border); padding: 1.75rem 2rem; box-shadow: var(--shadow-sm); width: 100%; box-sizing: border-box;">
                        <div style="margin-bottom: 1.25rem;">
                            <h3 style="font-size: 1rem; font-weight: 800; color: var(--clr-text-main);">Informasi Kontak & Tujuan Pemesanan WhatsApp</h3>
                            <p style="font-size: 0.75rem; color: var(--clr-text-subtle); margin-top: 0.25rem;">Ubah nomor WhatsApp tujuan ke mana pesan pemesanan pelanggan akan otomatis terkirim.</p>
                        </div>

                        <div style="padding: 0.75rem 1rem; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #2563eb; border-radius: var(--radius-md); font-size: 0.75rem; color: #334155; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fa-solid fa-circle-info" style="color: #2563eb; font-size: 0.875rem;"></i>
                            <span>Masukkan nomor WhatsApp diawali dengan kode negara <strong>62</strong> tanpa tanda plus (+) atau spasi. Contoh: <strong>6281234567890</strong>.</span>
                        </div>

                        <form onsubmit="saveContactSettings(event)" class="flex flex-col gap-4">
                            <div class="grid sm:grid-cols-2 gap-4">
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label class="form-label">Nama Usaha / Rental</label>
                                    <input type="text" id="ownerBusinessName" required class="form-input">
                                </div>
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label class="form-label">Nomor WhatsApp Owner (62xxx)</label>
                                    <input type="text" id="ownerWhatsapp" required placeholder="6281234567890" class="form-input" style="font-family: monospace;">
                                </div>
                            </div>

                            <div class="grid sm:grid-cols-2 gap-4">
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label class="form-label">Nomor Telepon Kantor</label>
                                    <input type="text" id="ownerPhone" class="form-input">
                                </div>
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label class="form-label">Email Resmi</label>
                                    <input type="email" id="ownerEmail" class="form-input">
                                </div>
                            </div>

                            <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label">Alamat Kantor / Pool Mobil</label>
                                <input type="text" id="ownerAddress" class="form-input">
                            </div>

                            <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label">Tautan Google Maps / Titik Lokasi GPS</label>
                                <input type="text" id="ownerMapsUrl" placeholder="https://maps.google.com/?q=..." class="form-input">
                            </div>

                            <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label">Jam Operasional</label>
                                <input type="text" id="ownerHours" class="form-input">
                            </div>

                            <div style="padding-top: 1rem; border-top: 1px solid #f1f5f9; margin-top: 0.5rem;">
                                <h4 style="font-weight: 700; color: var(--clr-text-main); font-size: 0.8125rem; margin-bottom: 0.75rem;">Tautan Media Sosial</h4>
                                <div class="grid sm:grid-cols-3 gap-3">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label class="form-label">Instagram</label>
                                        <input type="text" id="ownerIg" placeholder="@rentcarmakassar_id" class="form-input">
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label class="form-label">Facebook</label>
                                        <input type="text" id="ownerFb" placeholder="Rent Car Makassar Official" class="form-input">
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label class="form-label">TikTok</label>
                                        <input type="text" id="ownerTiktok" placeholder="@rentcarmakassar" class="form-input">
                                    </div>
                                </div>
                            </div>

                            <div style="padding-top: 1rem; border-top: 1px solid #e2e8f0; margin-top: 0.5rem;">
                                <button type="submit" class="btn btn-primary btn-md">
                                    Simpan Perubahan Kontak Usaha
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Kredensial Login Admin (Ubah Username & Password) -->
                    <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--clr-border); padding: 1.75rem 2rem; box-shadow: var(--shadow-sm); width: 100%; box-sizing: border-box;">
                        <div style="margin-bottom: 1.25rem;">
                            <h3 style="font-size: 1rem; font-weight: 800; color: var(--clr-text-main);">Kredensial Login Admin</h3>
                            <p style="font-size: 0.75rem; color: var(--clr-text-subtle); margin-top: 0.25rem;">Ubah username dan password akun untuk mengakses portal dashboard.</p>
                        </div>

                        <form onsubmit="handleUpdateAdminCredentials(event)" class="flex flex-col gap-4">
                            <div class="grid sm:grid-cols-3 gap-4">
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label class="form-label">Username</label>
                                    <input type="text" id="adminNewUsername" required class="form-input" placeholder="admin">
                                </div>
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label class="form-label">Password Baru</label>
                                    <input type="password" id="adminNewPassword" required minlength="4" class="form-input" placeholder="Minimal 4 karakter">
                                </div>
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label class="form-label">Konfirmasi Password</label>
                                    <input type="password" id="adminConfirmPassword" required minlength="4" class="form-input" placeholder="Ulangi password baru">
                                </div>
                            </div>

                            <div id="credErrorMessage" class="hidden" style="padding: 0.65rem 0.85rem; background: #fff1f2; border: 1px solid #fecdd3; color: #e11d48; font-size: 0.75rem; border-radius: var(--radius-md); font-weight: 600;"></div>
                            <div id="credSuccessMessage" class="hidden" style="padding: 0.65rem 0.85rem; background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 0.75rem; border-radius: var(--radius-md); font-weight: 600;"></div>

                            <div style="padding-top: 0.5rem;">
                                <button type="submit" class="btn btn-primary btn-md">
                                    Simpan Username & Password
                                </button>
                            </div>
                        </form>
                    </div>

                </div>

            </main>
        </div>
    </div>

    <!-- ==================================================== -->
    <!-- MODAL POPUP FORM TAMBAH / EDIT MOBIL (REDESIGNED)   -->
    <!-- ==================================================== -->
    <div id="carModal" class="modal-backdrop hidden" onclick="if(event.target === this) closeCarModal()">
        <div class="modal-box" style="max-width: 48rem; width: 100%; max-height: 90vh; overflow-y: auto; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; transform: translateZ(0); padding: 2rem; background: #ffffff; border-radius: 1.25rem; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.3); border: 1px solid #e2e8f0;" onclick="event.stopPropagation()">
            
            <!-- Modal Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1.15rem; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0;">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                    <div style="width: 2.5rem; height: 2.5rem; border-radius: 0.65rem; background: #f8fafc; border: 1px solid #e2e8f0; color: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
                        <i class="fa-solid fa-car-side"></i>
                    </div>
                    <div>
                        <h3 id="carModalTitle" style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.2;">Tambah Unit Mobil Baru</h3>
                        <p style="font-size: 0.75rem; color: #64748b; margin: 0.2rem 0 0 0;">Kelola spesifikasi, ketersediaan, ketentuan sewa, dan tarif armada.</p>
                    </div>
                </div>
                <button type="button" onclick="closeCarModal()" style="width: 2.25rem; height: 2.25rem; border-radius: 50%; border: 1px solid #e2e8f0; background: #ffffff; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; transition: all 0.2s ease;" onmouseover="this.style.background='#f1f5f9'; this.style.color='#0f172a';" onmouseout="this.style.background='#ffffff'; this.style.color='#64748b';" title="Tutup">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <form id="carForm" onsubmit="handleSaveCar(event)" class="flex flex-col gap-4">
                <input type="hidden" id="carIdInput">

                <!-- 1. Merek & Model -->
                <div class="grid sm:grid-cols-2 gap-4">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.825rem; margin-bottom: 0.4rem; display: block;">Merek Mobil <span style="color: #dc2626;">*</span></label>
                        <input type="text" id="carBrand" required placeholder="Contoh: Toyota, Mitsubishi, Honda..." class="form-input">
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.825rem; margin-bottom: 0.4rem; display: block;">Model / Tipe Mobil <span style="color: #dc2626;">*</span></label>
                        <input type="text" id="carModel" required placeholder="Contoh: Alphard Gen 4, Innova Zenix..." class="form-input">
                    </div>
                </div>

                <!-- 2. Tahun, Kategori, Status Ketersediaan -->
                <div class="grid sm:grid-cols-3 gap-4">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.825rem; margin-bottom: 0.4rem; display: block;">Tahun Produksi <span style="color: #dc2626;">*</span></label>
                        <input type="number" id="carYear" required value="2023" min="2000" max="2030" class="form-input">
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.825rem; margin-bottom: 0.4rem; display: block;">Kategori Armada <span style="color: #dc2626;">*</span></label>
                        <select id="carCategory" class="form-select" required>
                            <option value="MPV">MPV Keluarga</option>
                            <option value="SUV">SUV Gagah</option>
                            <option value="City Car">City Car Lincah</option>
                            <option value="VIP Luxury">VIP Luxury / Mewah</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.825rem; margin-bottom: 0.4rem; display: block;">Status Ketersediaan <span style="color: #dc2626;">*</span></label>
                        <select id="carStatus" class="form-select" style="font-weight: 600;">
                            <option value="ready">Ready (Tersedia)</option>
                            <option value="in_use">Sedang Digunakan</option>
                            <option value="maintenance">Perawatan / Bengkel</option>
                        </select>
                    </div>
                </div>

                <!-- 3. Ketentuan Layanan Sewa (Custom Modern Dropdown Card) -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.875rem; padding: 1.15rem; display: flex; flex-direction: column; gap: 0.65rem;">
                    <div>
                        <label class="form-label" style="font-weight: 700; color: #1e293b; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.825rem;">
                            <i class="fa-solid fa-sliders" style="color: #64748b;"></i>
                            Ketentuan Layanan Sewa Armada <span style="color: #dc2626;">*</span>
                        </label>
                        
                        <div class="custom-rentopt-wrapper" style="position: relative;">
                            <button type="button" id="rentOptDropdownBtn" class="custom-rentopt-trigger-btn" onclick="toggleRentOptDropdown()" aria-haspopup="listbox" aria-expanded="false">
                                <div style="display: flex; align-items: center; gap: 0.65rem; overflow: hidden;">
                                    <span id="rentOptSelectedIcon" class="rentopt-icon-badge"><i class="fa-solid fa-key"></i></span>
                                    <div style="text-align: left;">
                                        <div id="rentOptSelectedTitle" class="rentopt-item-title">Keduanya (Bisa Lepas Kunci &amp; Pakai Supir)</div>
                                        <div id="rentOptSelectedDesc" class="rentopt-item-desc">Pelanggan dapat memilih menyewa lepas kunci atau pakai supir</div>
                                    </div>
                                </div>
                                <i class="fa-solid fa-chevron-down rentopt-chevron" id="rentOptChevron"></i>
                            </button>

                            <div id="rentOptDropdownMenu" class="custom-rentopt-dropdown-menu hidden" role="listbox">
                                <div class="rentopt-dropdown-item active" id="rentOptItem_both" onclick="selectRentOption('both')">
                                    <div style="display: flex; align-items: center; gap: 0.65rem;">
                                        <span class="rentopt-item-icon"><i class="fa-solid fa-key"></i></span>
                                        <div>
                                            <div class="rentopt-item-title">Keduanya (Bisa Lepas Kunci &amp; Pakai Supir)</div>
                                            <div class="rentopt-item-desc">Pelanggan bebas memilih opsi lepas kunci atau paket supir</div>
                                        </div>
                                    </div>
                                    <i class="fa-solid fa-circle-check rentopt-check-icon"></i>
                                </div>
                                <div class="rentopt-dropdown-item" id="rentOptItem_driver_only" onclick="selectRentOption('driver_only')">
                                    <div style="display: flex; align-items: center; gap: 0.65rem;">
                                        <span class="rentopt-item-icon"><i class="fa-solid fa-user-tie"></i></span>
                                        <div>
                                            <div class="rentopt-item-title">Hanya Bisa Sewa Pakai Supir (Wajib Driver)</div>
                                            <div class="rentopt-item-desc">Opsi lepas kunci otomatis dinonaktifkan untuk armada ini</div>
                                        </div>
                                    </div>
                                    <i class="fa-solid fa-circle-check rentopt-check-icon"></i>
                                </div>
                            </div>

                            <select id="carRentalOption" class="hidden" style="display: none;">
                                <option value="both" selected>Keduanya (Bisa Lepas Kunci &amp; Pakai Supir)</option>
                                <option value="driver_only">Hanya Bisa Sewa Pakai Supir (Wajib Driver)</option>
                            </select>
                        </div>
                    </div>
                    <div style="display: flex; align-items: flex-start; gap: 0.45rem; font-size: 0.75rem; color: #64748b; line-height: 1.45;">
                        <i class="fa-solid fa-circle-info" style="color: #94a3b8; margin-top: 2px; flex-shrink: 0;"></i>
                        <span><b>Aturan Sewa:</b> Jika diset <i>Hanya Pakai Supir</i>, opsi Lepas Kunci otomatis dinonaktifkan untuk pelanggan pada unit ini.</span>
                    </div>
                </div>

                <!-- 4. Kursi, Transmisi, Bahan Bakar (Strictly Bensin & Diesel) -->
                <div class="grid sm:grid-cols-3 gap-4">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.825rem; margin-bottom: 0.4rem; display: block;">Kapasitas Kursi <span style="color: #dc2626;">*</span></label>
                        <div style="position: relative;">
                            <input type="number" id="carSeats" required value="7" min="1" max="30" class="form-input">
                            <span style="position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%); font-size: 0.75rem; color: #94a3b8; pointer-events: none; font-weight: 600;">Kursi</span>
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.825rem; margin-bottom: 0.4rem; display: block;">Tipe Transmisi <span style="color: #dc2626;">*</span></label>
                        <select id="carTrans" class="form-select" required>
                            <option value="Matic (AT)">Matic (AT)</option>
                            <option value="Manual">Manual</option>
                            <option value="Matic & Manual">Matic &amp; Manual</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.825rem; margin-bottom: 0.4rem; display: block;">Bahan Bakar <span style="color: #dc2626;">*</span></label>
                        <select id="carFuel" class="form-select" required>
                            <option value="Bensin">Bensin</option>
                            <option value="Diesel">Diesel</option>
                        </select>
                    </div>
                </div>

                <!-- 5. Tarif Sewa Per Hari (Modern Pricing Box) -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.875rem; padding: 1.15rem;">
                    <div style="font-size: 0.825rem; font-weight: 700; color: #1e293b; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.45rem;">
                        <i class="fa-solid fa-money-bill-wave" style="color: #64748b;"></i>
                        <span>Pengaturan Tarif Sewa Harian</span>
                    </div>
                    <div class="grid sm:grid-cols-3 gap-3">
                        <div>
                            <label class="form-label" style="font-weight: 700; color: #334155; font-size: 0.775rem; margin-bottom: 0.35rem; display: block;">Harga Normal / Hari <span style="color: #dc2626;">*</span></label>
                            <div class="admin-currency-group">
                                <span class="admin-currency-badge">Rp</span>
                                <input type="number" id="carPriceNormal" required value="400000" class="form-input admin-currency-input" placeholder="0">
                            </div>
                        </div>
                        <div>
                            <label class="form-label" style="font-weight: 700; color: #dc2626; font-size: 0.775rem; margin-bottom: 0.35rem; display: block;">Harga Waktu Libur <span style="color: #dc2626;">*</span></label>
                            <div class="admin-currency-group">
                                <span class="admin-currency-badge badge-holiday">Rp</span>
                                <input type="number" id="carPriceHoliday" required value="550000" class="form-input admin-currency-input input-holiday" placeholder="0">
                            </div>
                        </div>
                        <div>
                            <label class="form-label" style="font-weight: 700; color: #334155; font-size: 0.775rem; margin-bottom: 0.35rem; display: block;">Biaya Supir / Hari <span style="color: #dc2626;">*</span></label>
                            <div class="admin-currency-group">
                                <span class="admin-currency-badge">Rp</span>
                                <input type="number" id="carDriverFee" required value="50000" class="form-input admin-currency-input" placeholder="0">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 6. Upload Foto Mobil & Preview (Modern Drag & Drop Zone) -->
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.825rem; margin-bottom: 0.4rem; display: flex; align-items: center; justify-content: space-between;">
                        <span>Foto Armada Mobil</span>
                        <span style="font-size: 0.72rem; color: #64748b; font-weight: 500;">Format: PNG, JPG, WEBP (Latar Putih/Transparan Disarankan)</span>
                    </label>
                    <div id="carImageDropZone" ondragover="handleCarImageDragOver(event)" ondragleave="handleCarImageDragLeave(event)" ondrop="handleCarImageDrop(event)" style="border: 2px dashed #cbd5e1; border-radius: 0.875rem; padding: 1.25rem; background: #f8fafc; text-align: center; transition: all 0.2s ease;">
                        <div id="carImageEmptyState" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                            <div style="width: 3rem; height: 3rem; border-radius: 50%; background: #ffffff; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #dc2626; font-size: 1.25rem; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                            </div>
                            <div style="font-size: 0.8125rem; color: #334155; font-weight: 600;">
                                Tarik &amp; lepas foto mobil ke sini, atau <label for="carImageFile" style="color: #dc2626; cursor: pointer; text-decoration: underline; font-weight: 700;">Pilih Berkas</label>
                            </div>
                            <span style="font-size: 0.725rem; color: #94a3b8;">Ukuran maksimal file 5 MB</span>
                            <input type="file" id="carImageFile" accept="image/*" style="display: none;" onchange="handleCarImageFileUpload(event)">
                        </div>
                        <input type="hidden" id="carImage">
                        <div id="carImagePreviewBox" style="margin-top: 0.25rem; display: none; flex-direction: column; align-items: center; gap: 0.65rem;">
                            <div style="position: relative; display: inline-block;">
                                <img id="carImagePreview" src="" alt="Preview Foto" style="max-height: 150px; max-width: 100%; border-radius: 0.75rem; border: 1px solid #e2e8f0; background: #ffffff; object-fit: contain; padding: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                                <button type="button" onclick="removeCarImage()" style="position: absolute; top: -8px; right: -8px; width: 24px; height: 24px; border-radius: 50%; background: #dc2626; color: #ffffff; border: 2px solid #ffffff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; box-shadow: 0 2px 6px rgba(0,0,0,0.2);" title="Hapus Foto">✕</button>
                            </div>
                            <label for="carImageFile" class="btn btn-outline btn-sm" style="font-size: 0.75rem; padding: 0.35rem 0.85rem; border-radius: 9999px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;">
                                <i class="fa-solid fa-arrows-rotate"></i> Ganti Foto Lain
                            </label>
                        </div>
                    </div>
                </div>

                <!-- 7. Deskripsi Ringkas -->
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.825rem; margin-bottom: 0.4rem; display: block;">Deskripsi Ringkas Unit</label>
                    <textarea id="carDesc" rows="2" placeholder="Catatan fasilitas, keunggulan, atau kelengkapan unit..." class="form-textarea" style="resize: vertical;"></textarea>
                </div>

                <!-- Footer Actions -->
                <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; margin-top: 0.5rem;">
                    <button type="button" onclick="closeCarModal()" class="btn btn-outline" style="border-radius: 0.75rem; font-weight: 700; padding: 0.65rem 1.35rem; font-size: 0.875rem;">
                        Batal
                    </button>
                    <button type="submit" class="btn btn-primary" style="border-radius: 0.75rem; font-weight: 700; padding: 0.65rem 1.65rem; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 0.5rem; box-shadow: 0 6px 16px rgba(220, 38, 38, 0.25);">
                        <i class="fa-solid fa-floppy-disk"></i>
                        <span>Simpan Unit Armada</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODAL TAMBAH REVIEW MANUAL BY ADMIN -->
    <div id="adminReviewModal" class="modal-backdrop hidden" onclick="if(event.target === this) closeAdminAddReviewModal()">
        <div class="modal-box rev-modal-box" onclick="event.stopPropagation()">
            <div class="rev-modal-header">
                <div class="rev-modal-header-left">
                    <div class="rev-modal-icon-badge">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </div>
                    <div>
                        <h3 id="adminReviewModalTitle" style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.25;">Tambah Review Pelanggan</h3>
                        <p id="adminReviewModalSubtitle" style="font-size: 0.74rem; color: #64748b; margin: 0.15rem 0 0 0;">Buat ulasan &amp; galeri story pelanggan secara manual</p>
                    </div>
                </div>
                <button type="button" onclick="closeAdminAddReviewModal()" class="rev-modal-close-btn" aria-label="Tutup Modal">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <form id="adminReviewForm" onsubmit="handleAdminAddReviewSubmit(event)" class="rev-modal-form">
                <input type="hidden" id="adminRevId">

                <div class="rev-modal-body">
                    <!-- LEFT COLUMN: STRUCTURED FORM FIELDS -->
                    <div class="rev-modal-left">
                        <div class="rev-field-row">
                            <div class="form-group">
                                <label class="form-label" for="adminRevName">Nama Pelanggan <span style="color: #dc2626;">*</span></label>
                                <input type="text" id="adminRevName" required placeholder="Contoh: Sofia Lestari" class="form-input" oninput="updateAdminReviewLivePreview()">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="adminRevCar">Armada Mobil <span style="font-size: 0.72rem; color: #64748b; font-weight: 600;">(Ketersediaan Unit)</span></label>
                                <select id="adminRevCar" class="form-select" onchange="updateAdminReviewLivePreview()" style="font-weight: 600;">
                                    <option value="">-- Pilih Armada Mobil (Ketersediaan) --</option>
                                </select>
                            </div>
                        </div>

                        <!-- Kategori Pelanggan (Reguler vs Artis / VIP) -->
                        <div class="form-group">
                            <label class="form-label">Kategori Kartu &amp; Story</label>
                            <div class="rev-type-grid">
                                <div id="adminRevTypeCardRegular" onclick="setAdminReviewUserType('regular')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();setAdminReviewUserType('regular');}" class="rev-type-card is-active" role="button" tabindex="0">
                                    <input type="radio" name="adminRevUserTypeRadio" id="adminRevTypeRegular" value="regular" checked style="display: none;">
                                    <div class="rev-type-card-icon">
                                        <i class="fa-regular fa-user"></i>
                                    </div>
                                    <div>
                                        <div class="rev-type-card-title">Reguler</div>
                                        <div class="rev-type-card-sub">Kartu putih standar</div>
                                    </div>
                                </div>
                                <div id="adminRevTypeCardArtis" onclick="setAdminReviewUserType('artis')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();setAdminReviewUserType('artis');}" class="rev-type-card" role="button" tabindex="0">
                                    <input type="radio" name="adminRevUserTypeRadio" id="adminRevTypeArtis" value="artis" style="display: none;">
                                    <div class="rev-type-card-icon">
                                        <i class="fa-solid fa-crown"></i>
                                    </div>
                                    <div>
                                        <div class="rev-type-card-title">Artis / VIP</div>
                                        <div class="rev-type-card-sub">Mahkota &amp; aksen hijau</div>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" id="adminRevUserType" value="regular">
                        </div>

                        <!-- Interactive Star Rating Picker -->
                        <div class="form-group">
                            <label class="form-label">Rating Kepuasan</label>
                            <div class="rev-star-picker-bar">
                                <div class="rev-star-buttons" id="adminRevStarPicker">
                                    <button type="button" class="rev-star-btn is-filled" data-star="1" onclick="setAdminReviewRating(1)" aria-label="1 Bintang">
                                        <svg style="width:1.45rem;height:1.45rem;" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    </button>
                                    <button type="button" class="rev-star-btn is-filled" data-star="2" onclick="setAdminReviewRating(2)" aria-label="2 Bintang">
                                        <svg style="width:1.45rem;height:1.45rem;" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    </button>
                                    <button type="button" class="rev-star-btn is-filled" data-star="3" onclick="setAdminReviewRating(3)" aria-label="3 Bintang">
                                        <svg style="width:1.45rem;height:1.45rem;" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    </button>
                                    <button type="button" class="rev-star-btn is-filled" data-star="4" onclick="setAdminReviewRating(4)" aria-label="4 Bintang">
                                        <svg style="width:1.45rem;height:1.45rem;" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    </button>
                                    <button type="button" class="rev-star-btn is-filled" data-star="5" onclick="setAdminReviewRating(5)" aria-label="5 Bintang">
                                        <svg style="width:1.45rem;height:1.45rem;" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    </button>
                                </div>
                                <span id="adminRevRatingLabel" class="rev-rating-readout">5.0 • Sempurna</span>
                            </div>
                            <input type="hidden" id="adminRevRating" value="5">
                        </div>

                        <!-- Isi Ulasan -->
                        <div class="form-group">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
                                <label class="form-label" for="adminRevComment" style="margin-bottom: 0;">Isi Ulasan <span style="color: #dc2626;">*</span></label>
                                <span id="adminRevCommentCount" style="font-size: 0.68rem; color: #94a3b8; font-weight: 600;">0 karakter</span>
                            </div>
                            <textarea id="adminRevComment" required rows="4" placeholder="Tuliskan pengalaman pelanggan menggunakan unit dan layanan..." class="form-textarea" style="resize: vertical; min-height: 5.75rem;" oninput="updateAdminReviewLivePreview()"></textarea>
                        </div>

                        <!-- Custom Avatar Dropzone -->
                        <div class="form-group">
                            <label class="form-label">Foto Profil Pelanggan (Opsional)</label>
                            <div id="adminRevAvatarDropZone" class="rev-avatar-uploader" ondragover="handleAdminRevAvatarDragOver(event)" ondragleave="handleAdminRevAvatarDragLeave(event)" ondrop="handleAdminRevAvatarDrop(event)">
                                <input type="file" id="adminRevAvatarFile" accept="image/*" style="display: none;" onchange="handleAdminRevAvatarFile(event)">
                                <input type="hidden" id="adminRevAvatar">

                                <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0;">
                                    <div id="adminRevAvatarPlaceholder" style="width: 2.85rem; height: 2.85rem; border-radius: 50%; background: #e2e8f0; color: #64748b; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.95rem;">
                                        <i class="fa-regular fa-user"></i>
                                    </div>
                                    <div id="adminRevAvatarPreviewBox" style="display: none; align-items: center; flex-shrink: 0;">
                                        <img id="adminRevAvatarPreview" src="" alt="Preview Avatar" class="rev-avatar-preview-thumb has-avatar">
                                    </div>
                                    <div style="min-width: 0;">
                                        <div id="adminRevAvatarStatusTitle" style="font-size: 0.78rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Belum ada foto profil</div>
                                        <div style="font-size: 0.69rem; color: #64748b;">Tarik &amp; lepas atau pilih file (maks. 5MB)</div>
                                    </div>
                                </div>

                                <div style="display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0;">
                                    <button type="button" onclick="document.getElementById('adminRevAvatarFile').click()" class="rev-upload-action-btn">
                                        <i class="fa-solid fa-upload" style="margin-right: 0.3rem; font-size: 0.68rem;"></i>Pilih Foto
                                    </button>
                                    <button type="button" id="adminRevAvatarRemoveBtn" onclick="removeAdminRevAvatar()" class="rev-upload-action-btn" style="display: none; color: #dc2626; border-color: #fecaca;" title="Hapus Foto Profil">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: LIVE CARD PREVIEW & MEDIA STORY GALLERY -->
                    <div class="rev-modal-right">
                        <!-- Live Card Preview -->
                        <div>
                            <div class="rev-preview-section-head">
                                <span class="rev-live-tag">
                                    <span class="rev-live-dot"></span>
                                    Preview Kartu Website
                                </span>
                                <span id="adminRevLiveModeBadge" class="rev-reg-pill">Reguler</span>
                            </div>

                            <div id="adminRevLiveCard" class="rev-live-preview-card">
                                <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                                    <div class="rev-preview-avatar-wrap">
                                        <span id="adminRevLiveCrown" class="rev-preview-crown hidden">
                                            <svg viewBox="0 0 24 24"><defs><linearGradient id="adminCrownGradLive" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#dc2626"/><stop offset="50%" stop-color="#ef4444"/><stop offset="100%" stop-color="#f97316"/></linearGradient></defs><path fill="url(#adminCrownGradLive)" d="M2 19h20v2H2v-2zm1.5-2L2 7l6 4 4-7 4 7 6-4-1.5 10h-17z"/></svg>
                                        </span>
                                        <div class="rev-preview-ring">
                                            <img id="adminRevLiveAvatar" src="https://ui-avatars.com/api/?name=P&background=64748b&color=fff&bold=true" alt="Preview" class="rev-preview-avatar">
                                        </div>
                                    </div>
                                    <div id="adminRevLiveName" style="font-size: 0.9rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem;">Nama Pelanggan</div>
                                    <div id="adminRevLiveStars" style="display: flex; align-items: center; gap: 0.18rem; margin-bottom: 0.65rem; color: #22c55e;"></div>
                                </div>
                                <p id="adminRevLiveComment" style="font-size: 0.78rem; color: #475569; line-height: 1.5; margin-bottom: 0.85rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                                    Ulasan pelanggan akan tampil di sini secara langsung saat Anda mengetik...
                                </p>
                                <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.4rem; border-top: 1px solid #f1f5f9;">
                                    <span id="adminRevLiveCar" style="font-size: 0.69rem; font-weight: 600; color: #64748b; display: inline-flex; align-items: center; gap: 0.28rem;">
                                        <i class="fa-solid fa-car-side"></i>
                                        <span>Unit Rental</span>
                                    </span>
                                    <span id="adminRevLiveAction" style="font-size: 0.74rem; font-weight: 700; color: #0f172a; display: inline-flex; align-items: center; gap: 0.3rem;">
                                        <span>review</span>
                                        <span id="adminRevLiveMediaBadge" style="display: none; font-size: 0.64rem; font-weight: 800; padding: 0.08rem 0.4rem; border-radius: 9999px; background: #f1f5f9; color: #475569;"></span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Galeri Media Story (Multi Upload) -->
                        <div class="form-group">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.45rem;">
                                <label class="form-label" style="margin-bottom: 0;">Galeri Media Story</label>
                                <span id="adminRevMediaCountBadge" style="font-size: 0.68rem; font-weight: 700; background: #e2e8f0; color: #475569; padding: 0.15rem 0.55rem; border-radius: 9999px;">0 Media</span>
                            </div>

                            <input type="file" id="adminRevMediaFile" accept="image/*,video/*" multiple style="display: none;" onchange="handleAdminRevMediaFile(event)">

                            <div id="adminRevMediaDropZone" class="rev-media-dropzone" onclick="document.getElementById('adminRevMediaFile').click()" ondragover="handleAdminRevMediaDragOver(event)" ondragleave="handleAdminRevMediaDragLeave(event)" ondrop="handleAdminRevMediaDrop(event)">
                                <div style="width: 2.3rem; height: 2.3rem; border-radius: 0.65rem; background: #f1f5f9; color: #475569; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.45rem; font-size: 0.95rem;">
                                    <i class="fa-solid fa-photo-film"></i>
                                </div>
                                <div style="font-size: 0.78rem; font-weight: 700; color: #0f172a;">Tambah Foto atau Video Story</div>
                                <div style="font-size: 0.69rem; color: #64748b; margin-top: 0.15rem;">Klik atau tarik banyak file sekaligus (JPG, PNG, MP4)</div>
                            </div>

                            <!-- Preview Grid Multi-Media Story -->
                            <div id="adminRevMediaPreviewBox" class="rev-media-grid-wrap">
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <span style="font-size: 0.72rem; font-weight: 700; color: #334155;">Media Terlampir</span>
                                    <button type="button" onclick="removeAdminRevMedia()" style="background: none; border: none; color: #dc2626; font-size: 0.7rem; font-weight: 700; cursor: pointer;">Hapus Semua</button>
                                </div>
                                <div id="adminRevMediaPreviewGrid" class="rev-media-grid"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rev-modal-footer">
                    <div style="font-size: 0.72rem; color: #64748b; display: inline-flex; align-items: center; gap: 0.4rem;">
                        <i class="fa-solid fa-circle-check" style="color: #16a34a;"></i>
                        <span>Langsung disetujui &amp; tampil di halaman utama</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                        <button type="button" onclick="closeAdminAddReviewModal()" class="btn btn-outline btn-sm" style="padding: 0.58rem 1.05rem; border-radius: 0.65rem;">
                            Batal
                        </button>
                        <button type="submit" id="adminRevSubmitBtn" class="rev-modal-submit-btn">
                            <i class="fa-solid fa-check"></i>
                            <span>Simpan &amp; Publikasikan</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- ==================================================== -->
    <!-- MODAL POPUP RIWAYAT PEMESANAN (PEMBAYARAN LUNAS)     -->
    <!-- ==================================================== -->
    <div id="bookingHistoryModal" class="modal-backdrop hidden" style="z-index: 9990;">
        <div class="modal-box" style="max-width: 74rem; width: 95%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; background: #ffffff; border-radius: var(--radius-xl); box-shadow: var(--shadow-xl);">
            
            <!-- Modal Header -->
            <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; background: #ffffff; flex-shrink: 0;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
                        <i class="fa-solid fa-clipboard-check"></i>
                    </div>
                    <div>
                        <h3 style="font-size: 1.125rem; font-weight: 800; color: var(--clr-text-main); margin: 0;">
                            Riwayat Pemesanan (Pembayaran Lunas)
                        </h3>
                        <p style="font-size: 0.75rem; color: var(--clr-text-subtle); margin: 0.15rem 0 0 0;">
                            Daftar pemesanan yang telah menyelesaikan pembayaran lunas & terverifikasi.
                        </p>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button type="button" onclick="exportBookingHistoryExcel()" class="btn-excel-export" title="Download Riwayat Pemesanan ke File Microsoft Excel (.xlsx)">
                        <i class="fa-solid fa-file-excel" style="font-size: 0.95rem;"></i>
                        <span>Download Excel</span>
                    </button>
                    <button type="button" onclick="closeBookingHistoryModal()" class="btn btn-outline btn-sm" style="padding: 0.4rem 0.7rem; border-radius: var(--radius-md); font-size: 0.85rem;" title="Tutup">
                        ✕
                    </button>
                </div>
            </div>

            <!-- Modal Body (Scrollable) -->
            <div style="flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; transform: translateZ(0); padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
                
                <!-- Summary Stats Bar -->
                <div>
                    <div style="background: #f8fafc; padding: 0.85rem 1.15rem; border-radius: var(--radius-md); border: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <div style="font-size: 0.7rem; font-weight: 700; color: #64748b;">Total Pesanan Lunas</div>
                            <div id="historyTotalCountStat" style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-top: 0.1rem;">0 Pesanan</div>
                        </div>
                        <div style="width: 2.35rem; height: 2.35rem; border-radius: 0.65rem; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1rem;">
                            <i class="fa-solid fa-box-archive"></i>
                        </div>
                    </div>
                </div>

                <!-- Search & Filter Controls -->
                <div style="background: #f8fafc; padding: 0.75rem 1rem; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); display: flex; flex-wrap: wrap; gap: 0.65rem; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 220px;">
                        <input type="text" id="adminHistorySearch" oninput="filterHistoryTable()" placeholder="Cari nama pelanggan, HP, kode booking, atau armada..." class="form-input" style="font-size: 0.8125rem; background: #ffffff;">
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                        <!-- Filter Periode Real-Time -->
                        <div style="display: flex; align-items: center; gap: 0.4rem;">
                            <span style="font-size: 0.75rem; color: var(--clr-text-muted); font-weight: 600;">Periode:</span>
                            <select id="adminHistoryFilterPeriod" onchange="filterHistoryTable()" class="form-select" style="font-size: 0.8125rem; width: auto; padding-right: 2rem; background: #ffffff; font-weight: 700; color: #059669; border-color: #a7f3d0;">
                                <option value="all">Semua Waktu</option>
                                <option value="week">Per Minggu (7 Hari Terakhir)</option>
                                <option value="month">Per Bulan (Bulan Ini)</option>
                                <option value="year">Per Tahun (Tahun Ini)</option>
                            </select>
                        </div>

                        <!-- Filter Status -->
                        <div style="display: flex; align-items: center; gap: 0.4rem;">
                            <span style="font-size: 0.75rem; color: var(--clr-text-muted); font-weight: 600;">Status:</span>
                            <select id="adminHistoryFilterStatus" onchange="filterHistoryTable()" class="form-select" style="font-size: 0.8125rem; width: auto; padding-right: 2rem; background: #ffffff;">
                                <option value="lunas" selected>✓ Pembayaran Lunas (Terverifikasi)</option>
                                <option value="all">Semua Riwayat (Termasuk Pending/Batal)</option>
                                <option value="confirmed">Verifikasi</option>
                                <option value="confirmed_pending">Verifikasi + Menunggu Pembayaran</option>
                                <option value="pending">Menunggu</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Table Card -->
                <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); box-shadow: var(--shadow-xs); overflow: hidden;">
                    <div class="admin-table-scroll">
                        <table class="data-table" style="width: 100%; min-width: 880px; border-collapse: collapse; font-size: 0.8125rem; text-align: left;">
                            <thead style="background: #f8fafc; border-bottom: 1px solid var(--clr-border); color: #64748b; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
                                <tr>
                                    <th style="padding: 0.875rem 1.25rem;">KODE BOOKING</th>
                                    <th style="padding: 0.875rem 1.25rem;">PELANGGAN</th>
                                    <th style="padding: 0.875rem 1.25rem;">ARMADA MOBIL</th>
                                    <th style="padding: 0.875rem 1.25rem;">TANGGAL SEWA</th>
                                    <th style="padding: 0.875rem 1.25rem;">LOKAL/SUPIR</th>
                                    <th style="padding: 0.875rem 1.25rem;">TOTAL BIAYA</th>
                                    <th style="padding: 0.875rem 1.25rem;">JAM PEMAKAIAN</th>
                                    <th style="padding: 0.875rem 1.25rem;">STATUS</th>
                                    <th style="padding: 0.875rem 1.25rem; text-align: center;">AKSI</th>
                                </tr>
                            </thead>
                            <tbody id="adminHistoryTableBody">
                                <!-- Dynamic history rows populated by JS -->
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <!-- Modal Footer -->
            <div style="padding: 0.85rem 1.5rem; border-top: 1px solid var(--clr-border); background: #f8fafc; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;">
                <span id="historyModalFooterInfo" style="font-size: 0.75rem; color: #64748b; font-weight: 600;">
                    Menampilkan daftar pesanan pembayaran lunas
                </span>
                <button type="button" onclick="closeBookingHistoryModal()" class="btn btn-outline btn-sm" style="font-weight: 700; padding: 0.45rem 1.15rem;">
                    Tutup
                </button>
            </div>
        </div>
    </div>

    <!-- MODAL INPUT / EDIT BOOKING BY ADMIN -->
    <div id="adminBookingModal" class="modal-backdrop hidden" style="z-index: 9999;" onclick="if(event.target === this) closeAdminBookingModal()">
        <div class="modal-box book-modal-box" onclick="event.stopPropagation()">
            <div class="rev-modal-header">
                <div class="rev-modal-header-left">
                    <div id="adminBookingModalIcon" class="rev-modal-icon-badge">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </div>
                    <div>
                        <h3 id="adminBookingModalTitle" style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.25;">
                            <span id="adminBookingModalTitleText">Edit Data Booking</span>
                        </h3>
                        <p id="adminBookingModalSubtitle" style="font-size: 0.74rem; color: #64748b; margin: 0.15rem 0 0 0;">Lengkapi data penyewa, jadwal sewa, dan skema pembayaran</p>
                    </div>
                </div>
                <button type="button" onclick="closeAdminBookingModal()" class="rev-modal-close-btn" aria-label="Tutup Modal">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <form onsubmit="handleSaveAdminBooking(event)" class="rev-modal-form">
                <input type="hidden" id="abBookingId" value="">

                <div class="book-modal-body">
                    <!-- LEFT COLUMN: PELANGGAN, ARMADA & JADWAL -->
                    <div class="book-modal-left">
                        <!-- Section: Pelanggan & Armada -->
                        <div class="book-section-card">
                            <div class="book-section-head">
                                <span class="book-section-title">
                                    <i class="fa-regular fa-user" style="color: #16a34a;"></i>
                                    <span>Data Pelanggan &amp; Armada</span>
                                </span>
                            </div>

                            <div class="rev-field-row">
                                <div class="form-group">
                                    <label class="form-label" for="abCustomerName">Nama Pelanggan <span style="color: #dc2626;">*</span></label>
                                    <input type="text" id="abCustomerName" required placeholder="Contoh: Irfan Pratama" class="form-input" oninput="updateAdminBookingSummary()">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="abCustomerPhone">No. WhatsApp / HP <span style="color: #dc2626;">*</span></label>
                                    <input type="tel" id="abCustomerPhone" required placeholder="Contoh: 082196984912" class="form-input">
                                </div>
                            </div>

                            <div class="rev-field-row">
                                <div class="form-group">
                                    <label class="form-label" for="abCarId">Armada Mobil <span style="color: #dc2626;">*</span></label>
                                    <select id="abCarId" required class="form-select" onchange="calculateAdminBookingPrice()">
                                        <!-- Dynamic options -->
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="abEventType">Keperluan Acara / Event</label>
                                    <select id="abEventType" class="form-select">
                                        <option value="Wisata / Liburan Keluarga" selected>Wisata / Liburan Keluarga</option>
                                        <option value="Acara Pernikahan / Iring-iringan">Acara Pernikahan / Iring-iringan</option>
                                        <option value="Kunjungan Bisnis / Perjalanan Dinas">Kunjungan Bisnis / Perjalanan Dinas</option>
                                        <option value="Antar / Jemput Bandara">Antar / Jemput Bandara</option>
                                        <option value="Mudik / Pulang Kampung">Mudik / Pulang Kampung</option>
                                        <option value="Acara Keluarga / Hajatan">Acara Keluarga / Hajatan</option>
                                        <option value="Keperluan Lainnya">Keperluan Lainnya</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Section: Jadwal Sewa & Layanan -->
                        <div class="book-section-card">
                            <div class="book-section-head">
                                <span class="book-section-title">
                                    <i class="fa-regular fa-calendar" style="color: #16a34a;"></i>
                                    <span>Jadwal Sewa &amp; Layanan</span>
                                </span>
                                <span id="abDurationBadge" class="book-duration-pill">1 Hari</span>
                            </div>

                            <div class="rev-field-row">
                                <div class="form-group">
                                    <label class="form-label" for="abStartDate">Tanggal Mulai <span style="color: #dc2626;">*</span></label>
                                    <div class="booking-date-input-wrap">
                                        <div class="date-input-icon-box">
                                            <i class="fa-solid fa-calendar-day"></i>
                                        </div>
                                        <input type="date" id="abStartDate" required class="form-input booking-date-input" onchange="handleAdminStartDateChange()">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="abEndDate">Tanggal Selesai <span style="color: #dc2626;">*</span></label>
                                    <div class="booking-date-input-wrap">
                                        <div class="date-input-icon-box">
                                            <i class="fa-solid fa-calendar-check"></i>
                                        </div>
                                        <input type="date" id="abEndDate" required class="form-input booking-date-input" onchange="calculateAdminBookingPrice()">
                                    </div>
                                </div>
                            </div>

                            <div class="rev-field-row">
                                <div class="form-group">
                                    <label class="form-label" for="abStartTime">Jam Ambil / Mulai <span style="color: #dc2626;">*</span></label>
                                    <input type="time" id="abStartTime" value="09:00" required class="form-input">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="abEndTime">Jam Kembali / Selesai <span style="color: #dc2626;">*</span></label>
                                    <input type="time" id="abEndTime" value="09:00" required class="form-input">
                                </div>
                            </div>

                            <div class="rev-field-row">
                                <div class="form-group">
                                    <label class="form-label" for="abDriverOption">Pilihan Layanan Supir</label>
                                    <select id="abDriverOption" class="form-select" onchange="calculateAdminBookingPrice()">
                                        <option value="with_driver" selected>+Supir (Dalam Kota)</option>
                                        <option value="without_driver">Tanpa Supir (Lepas Kunci)</option>
                                        <option value="luar_kota">+Supir (Luar Kota)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="abStatus">Status Verifikasi</label>
                                    <select id="abStatus" class="form-select" onchange="updateAdminBookingSummary()">
                                        <option value="confirmed" selected>Verifikasi</option>
                                        <option value="confirmed_pending">Verifikasi + Menunggu Pembayaran</option>
                                        <option value="pending">Menunggu</option>
                                        <option value="cancelled">Dibatalkan</option>
                                    </select>
                                    <span id="abStatusLockedHint" class="book-lock-badge hidden">
                                        <i class="fa-solid fa-lock" style="font-size: 0.62rem;"></i>
                                        <span>Terverifikasi &amp; terkunci</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: RINGKASAN BIAYA, PEMBAYARAN & CATATAN -->
                    <div class="book-modal-right">
                        <!-- Live Ringkasan Order -->
                        <div class="book-summary-card">
                            <div class="book-summary-top">
                                <div>
                                    <div style="font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8;">Ringkasan Pesanan</div>
                                    <div id="abSummaryCar" class="book-summary-car">Pilih Armada Mobil</div>
                                    <div id="abSummaryMeta" class="book-summary-meta">1 Hari • +Supir (Dalam Kota)</div>
                                </div>
                                <span id="abSummaryDurationPill" style="font-size: 0.68rem; font-weight: 800; padding: 0.18rem 0.55rem; border-radius: 9999px; background: rgba(74, 222, 128, 0.15); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.25); white-space: nowrap;">1 Hari</span>
                            </div>
                            <div class="book-summary-price-row">
                                <span style="font-size: 0.72rem; color: #cbd5e1; font-weight: 600;">Total Tagihan</span>
                                <span id="abSummaryTotal" class="book-summary-total">Rp 0</span>
                            </div>
                        </div>

                        <!-- Input Total Biaya -->
                        <div class="form-group">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
                                <label class="form-label" for="abTotalPrice" style="margin-bottom: 0;">Total Biaya Rental <span style="color: #dc2626;">*</span></label>
                                <span id="abPriceFormattedHint" style="font-size: 0.7rem; font-weight: 700; color: #15803d;">Rp 0</span>
                            </div>
                            <div class="book-currency-wrap">
                                <span class="book-currency-prefix">Rp</span>
                                <input type="number" id="abTotalPrice" required placeholder="Contoh: 2850000" class="form-input book-currency-input" oninput="handleAdminBookingPaymentTypeChange()">
                            </div>
                        </div>

                        <!-- Skema Pembayaran -->
                        <div class="form-group">
                            <label class="form-label">Skema Pembayaran Pelanggan</label>
                            <div class="book-pay-grid" id="abPaymentTypeCards">
                                <label class="book-pay-card is-active" id="abPayCard_lunas_awal">
                                    <div class="book-pay-card-top">
                                        <input type="radio" name="ab_pay_choice" value="lunas_awal" checked onchange="setAdminPaymentType('lunas_awal')">
                                        <span>Lunas Awal</span>
                                    </div>
                                    <span class="book-pay-card-sub">Bayar 100% penuh</span>
                                </label>

                                <label class="book-pay-card" id="abPayCard_dp">
                                    <div class="book-pay-card-top">
                                        <input type="radio" name="ab_pay_choice" value="dp" onchange="setAdminPaymentType('dp')">
                                        <span>DP</span>
                                    </div>
                                    <span class="book-pay-card-sub">Uang muka awal</span>
                                </label>

                                <label class="book-pay-card" id="abPayCard_bayar_akhir">
                                    <div class="book-pay-card-top">
                                        <input type="radio" name="ab_pay_choice" value="bayar_akhir" onchange="setAdminPaymentType('bayar_akhir')">
                                        <span>Bayar Akhir</span>
                                    </div>
                                    <span class="book-pay-card-sub">Pelunasan selesai</span>
                                </label>
                            </div>
                            <input type="hidden" id="abPaymentType" value="lunas_awal">
                        </div>

                        <!-- Nominal DP (Muncul jika DP dipilih) -->
                        <div id="abDpAmountWrap" class="book-dp-panel hidden">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.45rem; gap: 0.5rem;">
                                <div>
                                    <label class="form-label" for="abDpAmount" style="margin-bottom: 0; color: #15803d;">Nominal DP / Uang Muka</label>
                                    <div id="abDpFormattedHint" style="font-size: 0.68rem; color: #64748b; font-weight: 600;">Rp 0</div>
                                </div>
                                <div style="display: flex; gap: 0.35rem;">
                                    <button type="button" onclick="setAdminQuickDp(0.3)" class="book-quick-chip">30%</button>
                                    <button type="button" onclick="setAdminQuickDp(0.5)" class="book-quick-chip">50%</button>
                                </div>
                            </div>
                            <div class="book-currency-wrap">
                                <span class="book-currency-prefix">Rp</span>
                                <input type="number" id="abDpAmount" placeholder="Contoh: 500000" class="form-input book-currency-input" oninput="updateAdminBookingSummary()">
                            </div>
                        </div>

                        <!-- Catatan / Alamat Jemput -->
                        <div class="form-group">
                            <label class="form-label" for="abNotes">Catatan / Alamat Jemput</label>
                            <textarea id="abNotes" rows="3" placeholder="Lokasi penjemputan, permintaan khusus, atau keterangan tambahan..." class="form-textarea" style="resize: vertical; min-height: 4.5rem;"></textarea>
                        </div>
                    </div>
                </div>

                <div class="rev-modal-footer">
                    <div id="abFooterSummary" style="font-size: 0.72rem; color: #64748b; font-weight: 600;">
                        Verifikasi • Lunas di Awal
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                        <button type="button" onclick="closeAdminBookingModal()" class="btn btn-outline btn-sm" style="padding: 0.58rem 1.05rem; border-radius: 0.65rem;">
                            Batal
                        </button>
                        <button type="submit" id="abSubmitBtn" class="rev-modal-submit-btn">
                            <i class="fa-solid fa-check"></i>
                            <span>Simpan Perubahan</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- ==================================================== -->
    <!-- MODAL POPUP LIHAT DOKUMEN KTP & BUKTI PEMBAYARAN      -->
    <!-- ==================================================== -->
    <div id="documentViewModal" class="modal-backdrop hidden" style="z-index: 10000;">
        <div class="modal-box max-w-lg" style="background: #ffffff; border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); border: 1px solid var(--clr-border); width: 100%; max-width: 38rem; max-height: 90vh; overflow-y: auto;">
            
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--clr-border); position: sticky; top: 0; background: #ffffff; z-index: 5;">
                <div style="display: flex; align-items: center; gap: 0.65rem;">
                    <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--radius-md); background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1rem; border: 1px solid #bfdbfe;">
                        <i class="fa-solid fa-file-invoice"></i>
                    </div>
                    <div>
                        <h3 id="docModalTitle" style="font-size: 1.05rem; font-weight: 800; color: var(--clr-text-main); margin: 0;">Dokumen KTP & Bukti Pembayaran</h3>
                        <p id="docModalSubtitle" style="font-size: 0.75rem; color: var(--clr-text-subtle); margin: 0;">Verifikasi identitas dan konfirmasi bukti pembayaran sewa.</p>
                    </div>
                </div>
                <button type="button" onclick="closeDocumentViewModal()" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.6rem; border-radius: var(--radius-sm);">✕</button>
            </div>

            <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.15rem;">
                <!-- Ringkasan Info Booking & Pembayaran -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 0.875rem; font-size: 0.8125rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;">
                    <div>
                        <span style="color: #64748b; font-size: 0.7rem; display: block;">Nama Pelanggan:</span>
                        <strong id="docCustomerName" style="color: #0f172a;">-</strong>
                    </div>
                    <div>
                        <span style="color: #64748b; font-size: 0.7rem; display: block;">No. WhatsApp:</span>
                        <strong id="docCustomerPhone" style="color: #0f172a;">-</strong>
                    </div>
                    <div>
                        <span style="color: #64748b; font-size: 0.7rem; display: block;">Armada Mobil:</span>
                        <strong id="docCarName" style="color: #0f172a;">-</strong>
                    </div>
                    <div>
                        <span style="color: #64748b; font-size: 0.7rem; display: block;">Kode Booking:</span>
                        <strong id="docBookingCode" style="color: #2563eb; font-family: monospace;">-</strong>
                    </div>
                    <div>
                        <span style="color: #64748b; font-size: 0.7rem; display: block;">Jadwal Pemakaian:</span>
                        <div id="docBookingDates" style="color: #0f172a; margin-top: 0.15rem;">-</div>
                    </div>
                    <div>
                        <span style="color: #64748b; font-size: 0.7rem; display: block;">Layanan Supir:</span>
                        <strong id="docDriverService" style="color: #059669;">-</strong>
                    </div>
                    <div>
                        <span style="color: #64748b; font-size: 0.7rem; display: block;">Skema Pembayaran:</span>
                        <strong id="docPaymentType" style="color: #dc2626;">-</strong>
                    </div>
                    <div>
                        <span style="color: #64748b; font-size: 0.7rem; display: block;">Metode & Tagihan:</span>
                        <strong id="docPaymentDetail" style="color: #047857;">-</strong>
                    </div>
                </div>

                <!-- Kotak Keterangan & Tombol Permintaan Pembayaran via WhatsApp (Tunggal & Bersih) -->
                <div id="docPaymentWaSection" style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 3.5px solid #16a34a; border-radius: var(--radius-md); padding: 0.9rem 1.15rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
                    <div style="flex: 1; min-width: 14rem;">
                        <div style="font-size: 0.8rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.4rem;">
                            <i class="fa-brands fa-whatsapp" style="color: #16a34a; font-size: 1rem;"></i>
                            <span>Permintaan Pembayaran via WhatsApp</span>
                        </div>
                        <div id="docPaymentWaNote" style="font-size: 0.72rem; color: #64748b; margin-top: 0.15rem; line-height: 1.4;">
                            Kirim rincian tagihan beserta info nomor rekening &amp; QRIS resmi langsung ke nomor WhatsApp pelanggan.
                        </div>
                    </div>
                    <a id="docRequestPaymentWaBtn" href="#" target="_blank" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.95rem; background: #16a34a; color: #ffffff; border-radius: var(--radius-md); font-size: 0.75rem; font-weight: 700; text-decoration: none; white-space: nowrap;">
                        <i class="fa-brands fa-whatsapp" style="font-size: 0.95rem;"></i>
                        <span>Kirim Permintaan Bayar WA</span>
                    </a>
                </div>

                <!-- Preview & Upload Bukti Pembayaran Pelanggan (Bagian 1: Bukti DP Awal / Lunas) -->
                <div id="docPaymentProofSection">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.35rem;">
                        <label id="docPaymentProofLabel" style="font-size: 0.75rem; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 0.35rem;">
                            <i class="fa-solid fa-credit-card" style="color: #64748b; font-size: 0.85rem;"></i>
                            <span id="docPaymentProofTitle">Bukti Pembayaran (DP / Lunas / Transaksi Langsung):</span>
                            <span id="docPaymentProofBadge" style="font-size: 0.68rem; font-weight: 800; padding: 0.1rem 0.4rem; border-radius: 4px;" class="hidden"></span>
                        </label>
                        <div style="display: flex; gap: 0.35rem;">
                            <input type="file" id="adminDocPaymentProofFileInput" accept="image/*" class="hidden" onchange="handleAdminUploadPaymentProof(event)">
                            <button type="button" onclick="document.getElementById('adminDocPaymentProofFileInput').click()" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.6rem; font-size: 0.7rem; display: inline-flex; align-items: center; gap: 0.35rem; border-color: #2563eb; color: #2563eb; font-weight: 700;">
                                <i class="fa-solid fa-upload"></i>
                                <span id="docUploadProofBtnText">Upload Bukti Bayar (Admin)</span>
                            </button>
                            <a id="docOpenProofFullBtn" href="#" onclick="openDocumentImagePreview(this); return false;" class="btn btn-outline btn-sm hidden" style="padding: 0.25rem 0.55rem; font-size: 0.7rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                                <i class="fa-solid fa-expand"></i>
                                <span>Lihat Penuh</span>
                            </a>
                        </div>
                    </div>

                    <div id="docPaymentProofWrapper" style="border: 1px dashed #cbd5e1; border-radius: var(--radius-lg); background: #f8fafc; min-height: 11rem; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 0.5rem; position: relative;">
                        <img id="docPaymentProofImage" src="" alt="Bukti Pembayaran" onclick="openDocumentImagePreview(this)" class="hidden" style="max-height: 18rem; max-width: 100%; object-fit: contain; border-radius: var(--radius-sm); cursor: pointer;" title="Klik untuk memperbesar" />
                        <div id="docNoPaymentProofMsg" style="text-align: center; color: #94a3b8; padding: 1.5rem;">
                            <i class="fa-solid fa-receipt" style="font-size: 1.75rem; color: #cbd5e1; display: block; margin-bottom: 0.35rem;"></i>
                            <div id="docNoProofTitle" style="font-weight: 700; font-size: 0.85rem; color: #475569;">Bukti Pembayaran Belum Diunggah</div>
                            <div id="docNoProofDesc" style="font-size: 0.72rem; margin-top: 0.2rem; max-width: 24rem; margin-left: auto; margin-right: auto; color: #64748b;">
                                Pelanggan belum mengunggah bukti transfer/QRIS pada form, atau melakukan pembayaran langsung ke rekening Admin.
                            </div>
                            <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 0.75rem; flex-wrap: wrap;">
                                <button type="button" onclick="document.getElementById('adminDocPaymentProofFileInput').click()" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.45rem 1rem;">
                                    <i class="fa-solid fa-upload"></i>
                                    <span id="docUploadProofInnerBtnText">Upload Bukti Pembayaran</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Preview & Upload Bukti Pelunasan (Bagian 2: Khusus jika Skema Pembayaran DP) -->
                <div id="docSettlementProofSection" class="hidden">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.35rem;">
                        <label style="font-size: 0.75rem; font-weight: 700; color: #047857; display: flex; align-items: center; gap: 0.35rem;">
                            <i class="fa-solid fa-check-double" style="color: #059669;"></i>
                            <span>Bukti Pembayaran Pelunasan:</span>
                            <span id="docSettlementAmountBadge" style="font-size: 0.68rem; font-weight: 800; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 0.1rem 0.4rem; border-radius: 4px;"></span>
                        </label>
                        <div style="display: flex; gap: 0.35rem;">
                            <input type="file" id="adminDocSettlementProofFileInput" accept="image/*" class="hidden" onchange="handleAdminUploadSettlementProof(event)">
                            <button type="button" onclick="document.getElementById('adminDocSettlementProofFileInput').click()" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.6rem; font-size: 0.7rem; display: inline-flex; align-items: center; gap: 0.25rem; border-color: #059669; color: #059669; font-weight: 700;">
                                <i class="fa-solid fa-upload"></i>
                                <span>Upload Bukti Pelunasan (Admin)</span>
                            </button>
                            <a id="docOpenSettlementProofFullBtn" href="#" onclick="openDocumentImagePreview(this); return false;" class="btn btn-outline btn-sm hidden" style="padding: 0.25rem 0.55rem; font-size: 0.7rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                                <i class="fa-solid fa-expand"></i>
                                <span>Lihat Penuh</span>
                            </a>
                        </div>
                    </div>

                    <div id="docSettlementProofWrapper" style="border: 1px dashed #a7f3d0; border-radius: var(--radius-lg); background: #f0fdf4; min-height: 11rem; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 0.5rem; position: relative;">
                        <img id="docSettlementProofImage" src="" alt="Bukti Pelunasan" onclick="openDocumentImagePreview(this)" class="hidden" style="max-height: 18rem; max-width: 100%; object-fit: contain; border-radius: var(--radius-sm); cursor: pointer;" title="Klik untuk memperbesar" />
                        <div id="docNoSettlementProofMsg" style="text-align: center; color: #065f46; padding: 1.5rem;">
                            <i class="fa-solid fa-flag-checkered" style="font-size: 1.75rem; color: #059669; display: block; margin-bottom: 0.35rem;"></i>
                            <div id="docNoSettlementTitle" style="font-weight: 700; font-size: 0.85rem; color: #065f46;">Bukti Pelunasan Belum Diunggah</div>
                            <div id="docNoSettlementDesc" style="font-size: 0.72rem; margin-top: 0.2rem; max-width: 24rem; margin-left: auto; margin-right: auto; color: #047857;">
                                Pelanggan baru membayar DP dan belum melunasi sisa tagihan sewa. Unggah foto struk/transfer pelunasan saat pelunasan diterima.
                            </div>
                            <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 0.75rem; flex-wrap: wrap;">
                                <button type="button" onclick="document.getElementById('adminDocSettlementProofFileInput').click()" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.45rem 1rem; background: #059669; border: none;">
                                    <i class="fa-solid fa-upload"></i>
                                    <span>Upload Bukti Pelunasan</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Preview Bukti Pembayaran Denda Keterlambatan (Hanya Muncul saat Melewati Jam Batas Pemakaian) -->
                <div id="docPenaltyProofSection" class="hidden" style="border-top: 1px dashed #fecaca; padding-top: 0.85rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.35rem;">
                        <label style="font-size: 0.75rem; font-weight: 700; color: #dc2626; display: flex; align-items: center; gap: 0.35rem;">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <span>Bukti Pembayaran Denda Keterlambatan:</span>
                            <span id="docPenaltyAmountBadge" style="font-size: 0.68rem; font-weight: 800; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 0.1rem 0.4rem; border-radius: 4px;">Denda: Rp 0</span>
                        </label>
                        <div style="display: flex; gap: 0.35rem; align-items: center;">
                            <input type="file" id="adminDocPenaltyProofFileInput" accept="image/*" class="hidden" onchange="handleAdminUploadPenaltyProof(event)">
                            <button type="button" onclick="document.getElementById('adminDocPenaltyProofFileInput').click()" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.6rem; font-size: 0.7rem; display: inline-flex; align-items: center; gap: 0.25rem; border-color: #dc2626; color: #dc2626; font-weight: 700;">
                                <i class="fa-solid fa-upload"></i>
                                <span id="docUploadPenaltyBtnText">Upload Bukti Denda (Admin)</span>
                            </button>
                            <a id="docOpenPenaltyProofFullBtn" href="#" onclick="openDocumentImagePreview(this); return false;" class="btn btn-outline btn-sm hidden" style="padding: 0.25rem 0.55rem; font-size: 0.7rem; border-color: #dc2626; color: #dc2626; display: inline-flex; align-items: center; gap: 0.25rem;">
                                <i class="fa-solid fa-expand"></i>
                                <span>Lihat Penuh</span>
                            </a>
                        </div>
                    </div>

                    <div id="docPenaltyProofWrapper" style="border: 1px dashed #fca5a5; border-radius: var(--radius-lg); background: #fff5f5; min-height: 10rem; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 0.5rem; position: relative;">
                        <img id="docPenaltyProofImage" src="" alt="Bukti Pembayaran Denda" onclick="openDocumentImagePreview(this)" class="hidden" style="max-height: 18rem; max-width: 100%; object-fit: contain; border-radius: var(--radius-sm); cursor: pointer;" title="Klik untuk memperbesar" />
                        <div id="docNoPenaltyProofMsg" style="text-align: center; color: #991b1b; padding: 1.25rem;">
                            <i class="fa-solid fa-circle-exclamation" style="font-size: 1.75rem; color: #dc2626; display: block; margin-bottom: 0.35rem;"></i>
                            <div id="docNoPenaltyTitle" style="font-weight: 700; font-size: 0.85rem; color: #991b1b;">Bukti Pembayaran Denda Belum Diunggah</div>
                            <div id="docNoPenaltyDesc" style="font-size: 0.72rem; margin-top: 0.2rem; max-width: 24rem; margin-left: auto; margin-right: auto; color: #b91c1c;">
                                Keterlambatan pengembalian unit dikenakan denda Rp 50.000/jam. Unggah foto bukti transfer/pelunasan denda di sini untuk memverifikasi.
                            </div>
                            <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 0.75rem; flex-wrap: wrap;">
                                <button type="button" onclick="document.getElementById('adminDocPenaltyProofFileInput').click()" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.45rem 1rem; background: #dc2626; border: none;">
                                    <i class="fa-solid fa-upload"></i>
                                    <span>Upload Bukti Denda</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Preview Dokumen KTP (Disembunyikan otomatis jika dilihat dari Riwayat Pemesanan) -->
                <div id="docKtpSectionWrapper">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.35rem;">
                        <label style="font-size: 0.75rem; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 0.35rem;">
                            <i class="fa-solid fa-id-card" style="color: #2563eb;"></i>
                            <span>Foto KTP / Kartu Identitas Pelanggan:</span>
                        </label>
                        <div style="display: flex; gap: 0.35rem; align-items: center;">
                            <input type="file" id="adminDocKtpFileInput" accept="image/*" class="hidden" onchange="handleAdminUploadKtp(event)">
                            <button type="button" onclick="document.getElementById('adminDocKtpFileInput').click()" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.6rem; font-size: 0.7rem; display: inline-flex; align-items: center; gap: 0.35rem; border-color: #2563eb; color: #2563eb; font-weight: 700;">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                                <span>Upload / Ganti KTP (Admin)</span>
                            </button>
                            <a id="docOpenFullBtn" href="#" onclick="openDocumentImagePreview(this); return false;" class="btn btn-outline btn-sm hidden" style="padding: 0.25rem 0.6rem; font-size: 0.7rem; display: inline-flex; align-items: center; gap: 0.35rem; border-color: #2563eb; color: #2563eb; font-weight: 700;">
                                <i class="fa-solid fa-magnifying-glass"></i>
                                <span>Lihat KTP Penuh</span>
                            </a>
                        </div>
                    </div>

                    <div id="docImageWrapper" style="border: 2px dashed #cbd5e1; border-radius: var(--radius-lg); background: #f8fafc; min-height: 12rem; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 0.5rem; position: relative;">
                        <img id="docKtpImage" src="" alt="Foto KTP" onclick="openDocumentImagePreview(this)" style="max-height: 18rem; max-width: 100%; object-fit: contain; border-radius: var(--radius-sm); cursor: pointer;" title="Klik untuk membuka ukuran penuh" />
                        <div id="docNoImageMsg" class="hidden" style="text-align: center; color: #94a3b8; padding: 1.5rem;">
                            <i class="fa-solid fa-address-card" style="font-size: 2.25rem; display: block; margin-bottom: 0.5rem; color: #cbd5e1;"></i>
                            <div style="font-weight: 700; font-size: 0.85rem; color: #475569;">Dokumen KTP Belum Diunggah di Web</div>
                            <div style="font-size: 0.72rem; margin-top: 0.2rem; max-width: 22rem; margin-left: auto; margin-right: auto;">Pelanggan belum melampirkan foto KTP di formulir web, atau mengirimkannya secara langsung ke Admin.</div>
                            <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 0.75rem; flex-wrap: wrap;">
                                <button type="button" onclick="document.getElementById('adminDocKtpFileInput').click()" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1.15rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-size: 0.8125rem; font-weight: 800; cursor: pointer; box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);">
                                    <i class="fa-solid fa-cloud-arrow-up" style="font-size: 0.95rem;"></i>
                                    <span>Upload Foto KTP Sekarang</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Aksi Bawah -->
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; padding-top: 0.75rem; align-items: center; border-top: 1px solid var(--clr-border);">
                    <button type="button" onclick="closeDocumentViewModal()" class="btn btn-outline btn-sm" style="padding: 0.5rem 1.15rem; font-weight: 600;">
                        Batal
                    </button>
                    <button type="button" id="docSubmitAllBtn" onclick="submitAllDocuments()" class="btn btn-primary btn-sm" style="padding: 0.5rem 1.35rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                        <i class="fa-solid fa-floppy-disk"></i>
                        <span id="docSubmitAllBtnText">Submit & Simpan Semua Dokumen</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile Sidebar Backdrop -->
    <div id="adminSidebarBackdrop" class="admin-sidebar-backdrop hidden" onclick="toggleAdminSidebar()"></div>

    <!-- Admin Floating Toast Notification Container -->
    <div id="adminToastContainer" class="admin-toast-container"></div>

    <!-- Scripts -->
    <script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js" defer></script>
    <script src="/js/data.js?v={{ file_exists(public_path('js/data.js')) ? filemtime(public_path('js/data.js')) : time() }}"></script>
    <script src="/js/admin.js?v={{ file_exists(public_path('js/admin.js')) ? filemtime(public_path('js/admin.js')) : time() }}"></script>
</body>
</html>

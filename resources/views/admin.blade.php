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
    <link rel="stylesheet" href="/css/style.css">
</head>
<body style="background-color: var(--clr-bg); color: var(--clr-text-main);">

    <!-- ==================================================== -->
    <!-- VIEW 1: LAYAR LOGIN ADMIN (JIKA BELUM LOGIN)        -->
    <!-- ==================================================== -->
    <div id="loginSection" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; background-color: #f1f5f9;">
        <div style="max-width: 26rem; width: 100%; background: #ffffff; border-radius: var(--radius-xl); padding: 2rem; border: 1px solid var(--clr-border); box-shadow: var(--shadow-xl);">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="width: 4.5rem; height: 4.5rem; background: #dc2626; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.45); overflow: hidden; margin: 0 auto 0.75rem auto;">
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
                    <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--clr-text-subtle); margin-top: 0.35rem;">
                        <span>Kredensial Default: admin / admin123</span>
                    </div>
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
                <div class="flex items-center gap-2.5">
                    <div style="width: 2.5rem; height: 2.5rem; background: #dc2626; border-radius: 0.65rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 12px rgba(220, 38, 38, 0.45); overflow: hidden; flex-shrink: 0;">
                        <img src="/logo_rpm_red.png" alt="RPM Rent Car" style="width: 100%; height: 100%; object-fit: contain; transform: scale(1.35);">
                    </div>
                    <div>
                        <div style="font-size: 0.875rem; font-weight: 800; color: #ffffff;" class="brand-title">RPM <span style="color: #ef4444;">Rent Car</span></div>
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

                <button onclick="switchTab('bookings')" id="nav-bookings" class="tab-nav-btn">
                    <svg style="width: 1.1rem; height: 1.1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <span>Data Booking & Pesanan</span>
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
            <main style="flex: 1; padding: 1.5rem; overflow-y: auto;" class="flex flex-col gap-6">

                <!-- ==================================================== -->
                <!-- TAB 1: OVERVIEW (RINGKASAN)                          -->
                <!-- ==================================================== -->
                <div id="tab-content-overview" class="tab-pane flex flex-col gap-6">
                    
                    <!-- Alert Status Banner -->
                    <div id="overviewHolidayBanner" class="banner-alert">
                        <div class="flex items-center gap-3">
                            <div id="bannerIconBox" style="width: 2.5rem; height: 2.5rem; border-radius: var(--radius-md); background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                                🌱
                            </div>
                            <div>
                                <h3 id="bannerTitle" style="font-size: 0.875rem; font-weight: 800;">Tarif Normal Sedang Diberlakukan</h3>
                                <p id="bannerDesc" style="font-size: 0.75rem; margin-top: 0.1rem;">Pengunjung yang melakukan pemesanan saat ini akan dikenakan harga sewa normal.</p>
                            </div>
                        </div>
                        <button onclick="switchTab('pricing')" class="btn btn-outline btn-sm">
                            Atur Tarif Libur →
                        </button>
                    </div>

                    <!-- 4 Kartu Metrik Utama -->
                    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); box-shadow: var(--shadow-xs);">
                            <div style="font-size: 0.75rem; font-weight: 600; color: var(--clr-text-subtle);">Total Armada Mobil</div>
                            <div style="font-size: 1.75rem; font-weight: 800; color: var(--clr-text-main); margin-top: 0.35rem;" id="statTotalCars">6</div>
                            <div style="font-size: 0.7rem; color: var(--clr-text-muted); margin-top: 0.2rem;">Terdaftar dalam katalog</div>
                        </div>

                        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); box-shadow: var(--shadow-xs);">
                            <div style="font-size: 0.75rem; font-weight: 600; color: var(--clr-emerald);">Unit Ready (Tersedia)</div>
                            <div style="font-size: 1.75rem; font-weight: 800; color: var(--clr-emerald); margin-top: 0.35rem;" id="statReadyCars">4</div>
                            <div style="font-size: 0.7rem; color: var(--clr-text-muted); margin-top: 0.2rem;">Siap disewa langsung</div>
                        </div>

                        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); box-shadow: var(--shadow-xs);">
                            <div style="font-size: 0.75rem; font-weight: 600; color: #d97706;">Sedang Digunakan</div>
                            <div style="font-size: 1.75rem; font-weight: 800; color: #d97706; margin-top: 0.35rem;" id="statInUseCars">2</div>
                            <div style="font-size: 0.7rem; color: var(--clr-text-muted); margin-top: 0.2rem;">Sedang disewa pelanggan</div>
                        </div>

                        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); box-shadow: var(--shadow-xs);">
                            <div style="font-size: 0.75rem; font-weight: 600; color: var(--clr-text-subtle);">Tujuan WhatsApp</div>
                            <div style="font-size: 1rem; font-weight: 800; color: var(--clr-text-main); margin-top: 0.5rem; font-family: monospace;" class="truncate" id="statWaNumber">6281234567890</div>
                            <div style="font-size: 0.7rem; color: var(--clr-text-muted); margin-top: 0.2rem;">Nomor penerima pesanan</div>
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
                    
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 style="font-size: 0.875rem; font-weight: 800; color: var(--clr-text-main);">Daftar Lengkap Armada Mobil</h3>
                            <p style="font-size: 0.75rem; color: var(--clr-text-subtle);">Klik tombol status untuk mengubah unit menjadi Ready atau Digunakan.</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="openAddCarModal()" class="btn btn-primary btn-sm">
                                <span>➕</span>
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

                        <table class="data-table">
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

                <!-- ==================================================== -->
                <!-- TAB 2: DATA BOOKING & PESANAN                       -->
                <!-- ==================================================== -->
                <div id="tab-content-bookings" class="tab-pane hidden flex flex-col gap-6">
                    
                    <!-- Header Actions & Filters -->
                    <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                        <div>
                            <h3 style="font-size: 1.125rem; font-weight: 800; color: var(--clr-text-main);">Kelola Data Booking & Pesanan</h3>
                            <p style="font-size: 0.75rem; color: var(--clr-text-subtle); margin-top: 0.15rem;">Pantau pesanan masuk, verifikasi status sewa, dan input booking manual.</p>
                        </div>
                        
                        <button onclick="openAdminBookingModal()" class="btn" style="background-color: #dc2626; color: #ffffff; font-weight: 700; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.25rem; border-radius: var(--radius-md); border: none; cursor: pointer; box-shadow: var(--shadow-sm);">
                            <span style="font-size: 1.1rem; line-height: 1;">+</span>
                            <span>Input Booking Manual</span>
                        </button>
                    </div>

                    <!-- Search & Filter Controls -->
                    <div style="background: #ffffff; padding: 1rem; border-radius: var(--radius-xl); border: 1px solid var(--clr-border); display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between; box-shadow: var(--shadow-xs);">
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 240px;">
                            <input type="text" id="adminBookingSearch" oninput="filterBookingsTable()" placeholder="Cari nama pelanggan, HP, atau armada..." class="form-input" style="font-size: 0.8125rem;">
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="font-size: 0.75rem; color: var(--clr-text-muted); font-weight: 600;">Filter Status:</span>
                            <select id="adminBookingFilterStatus" onchange="filterBookingsTable()" class="form-select" style="font-size: 0.8125rem; width: auto; padding-right: 2rem;">
                                <option value="all">Semua Status</option>
                                <option value="confirmed">Verifikasi</option>
                                <option value="pending">Menunggu Pembayaran</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                        </div>
                    </div>

                    <!-- Table Card -->
                    <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--clr-border); box-shadow: var(--shadow-sm); overflow: hidden;">
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.8125rem; text-align: left;">
                                <thead style="background: #f8fafc; border-bottom: 1px solid var(--clr-border); color: #64748b; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
                                    <tr>
                                        <th style="padding: 0.875rem 1.25rem;">PELANGGAN</th>
                                        <th style="padding: 0.875rem 1.25rem;">ARMADA MOBIL</th>
                                        <th style="padding: 0.875rem 1.25rem;">TANGGAL SEWA</th>
                                        <th style="padding: 0.875rem 1.25rem;">LOKAL/SUPIR</th>
                                        <th style="padding: 0.875rem 1.25rem;">TOTAL BIAYA</th>
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
                    
                    <!-- Header Actions & Filters -->
                    <div style="background: white; border-radius: var(--radius-xl); border: 1px solid var(--clr-border); padding: 1.25rem 1.5rem; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <button onclick="setAdminReviewFilter('all', this)" class="review-filter-btn btn btn-primary btn-sm">
                                Semua (<span id="reviewStatTotal">0</span>)
                            </button>
                            <button onclick="setAdminReviewFilter('pending', this)" class="review-filter-btn btn btn-outline btn-sm">
                                ⏳ Menunggu Verifikasi (<span id="reviewStatPending">0</span>)
                            </button>
                            <button onclick="setAdminReviewFilter('approved', this)" class="review-filter-btn btn btn-outline btn-sm">
                                ✔️ Disetujui / Uploaded (<span id="reviewStatApproved">0</span>)
                            </button>
                            <button onclick="setAdminReviewFilter('rejected', this)" class="review-filter-btn btn btn-outline btn-sm">
                                🚫 Ditolak (<span id="reviewStatRejected">0</span>)
                            </button>
                        </div>

                        <div>
                            <button onclick="openAdminAddReviewModal()" class="btn btn-emerald btn-sm" style="font-weight: 700;">
                                + Tambah Review Manual
                            </button>
                        </div>
                    </div>

                    <!-- Tabel Moderasi Review -->
                    <div style="background: white; border-radius: var(--radius-xl); border: 1px solid var(--clr-border); overflow: hidden; box-shadow: var(--shadow-sm);">
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                <thead style="background: #f8fafc; border-bottom: 1px solid var(--clr-border); font-size: 0.75rem; color: var(--clr-text-subtle); text-transform: uppercase;">
                                    <tr>
                                        <th style="padding: 0.85rem 1rem;">Pelanggan & Unit</th>
                                        <th style="padding: 0.85rem 1rem;">Rating</th>
                                        <th style="padding: 0.85rem 1rem;">Ulasan / Testimoni</th>
                                        <th style="padding: 0.85rem 1rem;">Status</th>
                                        <th style="padding: 0.85rem 1rem; text-align: right;">Aksi Verifikasi & Publish</th>
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
                                <span style="font-size: 1.125rem;">🏖️</span>
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
                                        🌱 NONAKTIF — Pelanggan melihat & memesan dengan Tarif Normal
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
                                <p style="font-size: 0.7rem; color: var(--clr-text-subtle); margin-top: 0.25rem;">Catatan ini akan muncul di spanduk pengumuman bagian atas website pelanggan saat mode libur aktif.</p>
                            </div>
                        </div>

                        <!-- Perbandingan Tarif Normal vs Libur -->
                        <div style="padding-top: 1.5rem; border-top: 1px solid #f1f5f9;">
                            <h4 style="font-size: 0.75rem; font-weight: 800; color: var(--clr-text-main); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Tabel Perbandingan Tarif Normal vs Tarif Libur</h4>
                            <div class="table-container">
                                <table class="data-table">
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

                <!-- ==================================================== -->
                <!-- TAB 4: KONTAK & WHATSAPP OWNER                       -->
                <!-- ==================================================== -->
                <div id="tab-content-contact" class="tab-pane hidden flex flex-col gap-6">
                    
                    <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); padding: 1.5rem; box-shadow: var(--shadow-xs); max-width: 42rem;">
                        <div style="margin-bottom: 1.25rem;">
                            <h3 style="font-size: 0.875rem; font-weight: 800; color: var(--clr-text-main);">Informasi Kontak & Tujuan Pemesanan WhatsApp</h3>
                            <p style="font-size: 0.75rem; color: var(--clr-text-subtle); margin-top: 0.25rem;">Ubah nomor WhatsApp tujuan ke mana pesan pemesanan pelanggan akan otomatis terkirim.</p>
                        </div>

                        <div style="padding: 0.875rem; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-md); font-size: 0.75rem; color: #1e3a8a; margin-bottom: 1.25rem; line-height: 1.5;">
                            💡 <strong>Penting:</strong> Masukkan nomor WhatsApp diawali dengan kode negara <strong>62</strong> tanpa tanda plus (+) atau spasi. Contoh: <strong>6281234567890</strong>.
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

                            <div style="padding-top: 0.75rem; border-top: 1px solid #f1f5f9;">
                                <h4 style="font-weight: 700; color: var(--clr-text-main); font-size: 0.8125rem; margin-bottom: 0.75rem;">Tautan Media Sosial</h4>
                                <div class="grid sm:grid-cols-3 gap-3">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label class="form-label">Instagram</label>
                                        <input type="text" id="ownerIg" placeholder="@garudarentcar_id" class="form-input">
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label class="form-label">Facebook</label>
                                        <input type="text" id="ownerFb" placeholder="Garuda Rent Car Official" class="form-input">
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label class="form-label">TikTok</label>
                                        <input type="text" id="ownerTiktok" placeholder="@garudarentcar" class="form-input">
                                    </div>
                                </div>
                            </div>

                            <div style="padding-top: 0.5rem;">
                                <button type="submit" class="btn btn-primary btn-md">
                                    Simpan Perubahan Kontak
                                </button>
                            </div>
                        </form>
                    </div>

                </div>

            </main>
        </div>
    </div>

    <!-- ==================================================== -->
    <!-- MODAL POPUP FORM TAMBAH / EDIT MOBIL                 -->
    <!-- ==================================================== -->
    <div id="carModal" class="modal-backdrop hidden">
        <div class="modal-box max-w-lg" style="padding: 1.5rem; background: #ffffff; border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); border: 1px solid var(--clr-border);">
            
            <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.875rem; margin-bottom: 1rem; border-bottom: 1px solid var(--clr-border);">
                <div>
                    <h3 id="carModalTitle" style="font-size: 1rem; font-weight: 800; color: var(--clr-text-main);">Tambah Unit Mobil Baru</h3>
                    <p style="font-size: 0.75rem; color: var(--clr-text-subtle); margin-top: 0.1rem;">Isi spesifikasi & informasi ketersediaan armada.</p>
                </div>
                <button type="button" onclick="closeCarModal()" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.6rem; border-radius: var(--radius-sm);">✕</button>
            </div>

            <form id="carForm" onsubmit="handleSaveCar(event)" class="flex flex-col gap-3">
                <input type="hidden" id="carIdInput">

                <!-- Merek & Model -->
                <div class="grid sm:grid-cols-2 gap-3">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Merek Mobil</label>
                        <input type="text" id="carBrand" required placeholder="Toyota" class="form-input">
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Model / Tipe</label>
                        <input type="text" id="carModel" required placeholder="Avanza Veloz" class="form-input">
                    </div>
                </div>

                <!-- Tahun, Kategori, Status -->
                <div class="grid sm:grid-cols-3 gap-3">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Tahun</label>
                        <input type="text" id="carYear" required value="2023" class="form-input">
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Kategori</label>
                        <select id="carCategory" class="form-select">
                            <option value="MPV">MPV</option>
                            <option value="SUV">SUV</option>
                            <option value="City Car">City Car</option>
                            <option value="Mewah">VIP / Mewah</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Status Ketersediaan</label>
                        <select id="carStatus" class="form-select" style="font-weight: 700; color: var(--clr-emerald);">
                            <option value="ready">Ready (Tersedia)</option>
                            <option value="in_use">Sedang Digunakan</option>
                        </select>
                    </div>
                </div>

                <!-- Kursi, Transmisi, Bahan Bakar -->
                <div class="grid sm:grid-cols-3 gap-3">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Kapasitas Kursi</label>
                        <input type="number" id="carSeats" required value="7" class="form-input">
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Transmisi</label>
                        <select id="carTrans" class="form-select">
                            <option value="Otomatis (AT)">Otomatis (AT)</option>
                            <option value="Otomatis (CVT)">Otomatis (CVT)</option>
                            <option value="Manual (MT)">Manual (MT)</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Bahan Bakar</label>
                        <select id="carFuel" class="form-select">
                            <option value="Bensin">Bensin</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>

                <!-- Input Tarif Normal vs Libur -->
                <div style="padding: 0.75rem; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid var(--clr-border);" class="grid sm:grid-cols-3 gap-3">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Harga Normal / Hari</label>
                        <input type="number" id="carPriceNormal" required value="400000" class="form-input" style="font-weight: 700;">
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="color: var(--clr-rose);">Harga Waktu Libur</label>
                        <input type="number" id="carPriceHoliday" required value="550000" class="form-input" style="font-weight: 700; color: var(--clr-rose);">
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Biaya Supir / Hari</label>
                        <input type="number" id="carDriverFee" required value="150000" class="form-input" style="font-weight: 700;">
                    </div>
                </div>

                <!-- Upload Foto Mobil Input & Preview -->
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Foto Mobil</label>
                    <div id="carImageDropZone" ondragover="handleCarImageDragOver(event)" ondragleave="handleCarImageDragLeave(event)" ondrop="handleCarImageDrop(event)" style="display: flex; flex-direction: column; gap: 0.5rem; background: #f8fafc; border: 2px dashed var(--clr-border); padding: 0.85rem; border-radius: var(--radius-md); transition: all 0.2s ease;">
                        <input type="file" id="carImageFile" accept="image/*" class="form-input" style="padding: 0.35rem 0.5rem; font-size: 0.75rem; background: white;" onchange="handleCarImageFileUpload(event)">
                        <span style="font-size: 0.75rem; color: #64748b; text-align: center; font-weight: 500;">💡 Klik <b>Choose File</b> atau <b>Tarik & Lepas (Drag & Drop)</b> file foto dari laptop ke area ini</span>
                        <!-- Hidden text field to store photo data/URL without showing raw base64 string -->
                        <input type="hidden" id="carImage">
                        <div id="carImagePreviewBox" style="margin-top: 0.25rem; display: none; text-align: center;">
                            <img id="carImagePreview" src="" alt="Preview Foto" style="max-height: 140px; border-radius: var(--radius-md); border: 1px solid var(--clr-border); object-fit: cover; display: inline-block;">
                        </div>
                    </div>
                </div>

                <!-- Deskripsi Ringkas -->
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Deskripsi Ringkas</label>
                    <textarea id="carDesc" rows="2" placeholder="Catatan atau keunggulan unit..." class="form-textarea"></textarea>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-end gap-2" style="padding-top: 0.5rem; border-top: 1px solid var(--clr-border);">
                    <button type="button" onclick="closeCarModal()" class="btn btn-outline btn-sm">
                        Batal
                    </button>
                    <button type="submit" class="btn btn-primary btn-sm">
                        Simpan Unit
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODAL TAMBAH REVIEW MANUAL BY ADMIN -->
    <div id="adminReviewModal" class="modal-backdrop hidden">
        <div class="modal-box max-w-lg">
            <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: space-between;">
                <h3 id="adminReviewModalTitle" style="font-size: 1.15rem; font-weight: 800; color: var(--clr-text-main);">Tambah Review Pelanggan Manual</h3>
                <button onclick="closeAdminAddReviewModal()" class="btn btn-outline btn-sm" style="padding: 0.35rem 0.6rem;">✕</button>
            </div>
            <div style="padding: 1.5rem;">
                <form id="adminReviewForm" onsubmit="handleAdminAddReviewSubmit(event)" class="flex flex-col gap-4">
                    <input type="hidden" id="adminRevId">
                    <div class="form-group">
                        <label class="form-label">Nama Pelanggan <span style="color: var(--clr-rose);">*</span></label>
                        <input type="text" id="adminRevName" required placeholder="Contoh: Ahmad Yani" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Rating (1-5)</label>
                        <select id="adminRevRating" class="form-select">
                            <option value="5" selected>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                            <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
                            <option value="3">⭐⭐⭐ (3 Bintang)</option>
                            <option value="2">⭐⭐ (2 Bintang)</option>
                            <option value="1">⭐ (1 Bintang)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Armada Mobil</label>
                        <input type="text" id="adminRevCar" placeholder="Contoh: Toyota Avanza Veloz" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Isi Ulasan <span style="color: var(--clr-rose);">*</span></label>
                        <textarea id="adminRevComment" required rows="3" placeholder="Isi ulasan pelanggan..." class="form-textarea"></textarea>
                    </div>

                    <!-- Upload Foto Pelanggan / Avatar -->
                    <div class="form-group">
                        <label class="form-label">Foto / Avatar Pelanggan (Opsional)</label>
                        <div id="adminRevAvatarDropZone" ondragover="handleAdminRevAvatarDragOver(event)" ondragleave="handleAdminRevAvatarDragLeave(event)" ondrop="handleAdminRevAvatarDrop(event)" style="display: flex; flex-direction: column; gap: 0.5rem; background: #f8fafc; border: 2px dashed var(--clr-border); padding: 0.85rem; border-radius: var(--radius-md); transition: all 0.2s ease;">
                            <input type="file" id="adminRevAvatarFile" accept="image/*" class="form-input" style="padding: 0.35rem 0.5rem; font-size: 0.75rem; background: white;" onchange="handleAdminRevAvatarFile(event)">
                            <span style="font-size: 0.75rem; color: #64748b; text-align: center; font-weight: 500;">💡 Klik <b>Choose File</b> atau <b>Tarik & Lepas (Drag & Drop)</b> foto pelanggan</span>
                            <input type="hidden" id="adminRevAvatar">
                            <div id="adminRevAvatarPreviewBox" style="margin-top: 0.25rem; display: none; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.6rem 0.75rem; background: #ffffff; border-radius: var(--radius-md); border: 1px solid var(--clr-border);">
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <img id="adminRevAvatarPreview" src="" alt="Preview Foto Pelanggan" style="width: 3.25rem; height: 3.25rem; border-radius: 50%; object-fit: cover; border: 2px solid #22c55e;">
                                    <div>
                                        <div style="font-size: 0.8rem; font-weight: 700; color: #166534;">Foto Berhasil Dipilih</div>
                                        <div style="font-size: 0.7rem; color: var(--clr-text-muted);">Foto akan tampil di review website</div>
                                    </div>
                                </div>
                                <button type="button" onclick="removeAdminRevAvatar()" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: var(--clr-rose); border-color: #fecdd3;" title="Hapus Foto">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style="padding-top: 0.5rem;">
                        <button type="submit" id="adminRevSubmitBtn" class="btn btn-emerald btn-lg" style="width: 100%; font-weight: 800;">
                            Simpan & Publikasikan Ulasan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- MODAL INPUT BOOKING MANUAL BY ADMIN -->
    <div id="adminBookingModal" class="modal-backdrop hidden">
        <div class="modal-box max-w-lg">
            <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: space-between; background: #ffffff;">
                <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--clr-text-main); display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: #dc2626;">+</span> Input Booking Manual
                </h3>
                <button onclick="closeAdminBookingModal()" class="btn btn-outline btn-sm" style="padding: 0.35rem 0.6rem; border-radius: var(--radius-md);">✕</button>
            </div>
            <div style="padding: 1.5rem;">
                <form onsubmit="handleSaveAdminBooking(event)" class="flex flex-col gap-4">
                    <div class="grid sm:grid-cols-2 gap-4">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Nama Pelanggan <span style="color: var(--clr-rose);">*</span></label>
                            <input type="text" id="abCustomerName" required placeholder="Contoh: Irfan" class="form-input">
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">No. WhatsApp / HP <span style="color: var(--clr-rose);">*</span></label>
                            <input type="tel" id="abCustomerPhone" required placeholder="Contoh: 082196984912" class="form-input">
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Armada Mobil <span style="color: var(--clr-rose);">*</span></label>
                        <select id="abCarId" required class="form-select" onchange="calculateAdminBookingPrice()">
                            <!-- Dynamic options -->
                        </select>
                    </div>

                    <div class="grid sm:grid-cols-2 gap-4">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Tanggal Mulai <span style="color: var(--clr-rose);">*</span></label>
                            <input type="date" id="abStartDate" required class="form-input" onchange="calculateAdminBookingPrice()">
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Tanggal Selesai <span style="color: var(--clr-rose);">*</span></label>
                            <input type="date" id="abEndDate" required class="form-input" onchange="calculateAdminBookingPrice()">
                        </div>
                    </div>

                    <div class="grid sm:grid-cols-2 gap-4">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Jam Ambil / Mulai <span style="color: var(--clr-rose);">*</span></label>
                            <input type="time" id="abStartTime" value="09:00" required class="form-input">
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Jam Kembali / Selesai <span style="color: var(--clr-rose);">*</span></label>
                            <input type="time" id="abEndTime" value="09:00" required class="form-input">
                        </div>
                    </div>

                    <div class="grid sm:grid-cols-2 gap-4">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Layanan Supir</label>
                            <select id="abDriverOption" class="form-select" onchange="calculateAdminBookingPrice()">
                                <option value="with_driver" selected>+Supir</option>
                                <option value="without_driver">Tanpa Supir (Lepas Kunci)</option>
                                <option value="luar_kota">+Supir (Luar Kota)</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Status Awalan</label>
                            <select id="abStatus" class="form-select">
                                <option value="confirmed" selected>Verifikasi</option>
                                <option value="pending">Menunggu Pembayaran</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Total Biaya (Rp) <span style="color: var(--clr-rose);">*</span></label>
                        <input type="number" id="abTotalPrice" required placeholder="Contoh: 9900000" class="form-input">
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Catatan Tambahan</label>
                        <textarea id="abNotes" rows="2" placeholder="Catatan lokasi jemput atau keterangan lain..." class="form-textarea"></textarea>
                    </div>

                    <div style="padding-top: 0.5rem; display: flex; gap: 0.75rem;">
                        <button type="button" onclick="closeAdminBookingModal()" class="btn btn-outline" style="flex: 1;">Batal</button>
                        <button type="submit" class="btn" style="flex: 2; background-color: #dc2626; color: #ffffff; font-weight: 800; border: none; padding: 0.75rem; border-radius: var(--radius-md); cursor: pointer;">Simpan Booking</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- ==================================================== -->
    <!-- MODAL POPUP LIHAT DOKUMEN / KTP PELANGGAN            -->
    <!-- ==================================================== -->
    <div id="documentViewModal" class="modal-backdrop hidden">
        <div class="modal-box max-w-lg" style="background: #ffffff; border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); border: 1px solid var(--clr-border); width: 100%; max-width: 34rem; overflow: hidden;">
            
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--clr-border);">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.25rem;">📄</span>
                    <div>
                        <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--clr-text-main); margin: 0;">Dokumen & Identitas KTP</h3>
                        <p style="font-size: 0.75rem; color: var(--clr-text-subtle); margin: 0;">Verifikasi identitas pemesan armada</p>
                    </div>
                </div>
                <button type="button" onclick="closeDocumentViewModal()" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.6rem; border-radius: var(--radius-sm);">✕</button>
            </div>

            <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
                <!-- Ringkasan Info Booking -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 0.875rem; font-size: 0.8125rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
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
                </div>

                <!-- Preview Dokumen KTP -->
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
                        <label style="font-size: 0.75rem; font-weight: 700; color: #475569;">
                            Foto KTP / Kartu Identitas:
                        </label>
                        <input type="file" id="adminDocKtpFileInput" accept="image/*" class="hidden" onchange="handleAdminUploadKtp(event)">
                        <button type="button" onclick="document.getElementById('adminDocKtpFileInput').click()" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.7rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                            <span>📷</span>
                            <span>Upload / Ganti KTP</span>
                        </button>
                    </div>

                    <div id="docImageWrapper" style="border: 2px dashed #cbd5e1; border-radius: var(--radius-lg); background: #f8fafc; min-height: 14rem; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 0.5rem; position: relative;">
                        <img id="docKtpImage" src="" alt="Foto KTP" style="max-height: 20rem; max-width: 100%; object-fit: contain; border-radius: var(--radius-sm);" />
                        <div id="docNoImageMsg" class="hidden" style="text-align: center; color: #94a3b8; padding: 2rem;">
                            <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">📇</span>
                            <div style="font-weight: 700; font-size: 0.875rem; color: #475569;">Dokumen Belum Diunggah di Web</div>
                            <div style="font-size: 0.75rem; margin-top: 0.25rem; max-width: 22rem; margin-left: auto; margin-right: auto;">Pelanggan belum melampirkan foto KTP di formulir web, atau mengirimkannya langsung lewat chat WA.</div>
                            <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 0.75rem; flex-wrap: wrap;">
                                <button type="button" onclick="document.getElementById('adminDocKtpFileInput').click()" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; background: #2563eb; color: white; border: none; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                                    📷 Upload KTP Sekarang
                                </button>
                                <a id="docChatWaBtn" href="#" target="_blank" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; background: #10b981; color: white; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 700; text-decoration: none;">
                                    💬 Minta KTP via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Aksi Bawah -->
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; padding-top: 0.5rem; align-items: center;">
                    <a id="docOpenFullBtn" href="#" target="_blank" class="btn btn-outline btn-sm hidden" style="padding: 0.5rem 0.85rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                        <span>🔍</span>
                        <span>Buka Ukuran Penuh</span>
                    </a>
                    <button type="button" onclick="closeDocumentViewModal()" class="btn btn-primary btn-sm" style="padding: 0.5rem 1.25rem;">
                        Tutup
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
    <script src="/js/data.js"></script>
    <script src="/js/admin.js"></script>
</body>
</html>

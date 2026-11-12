/**
 * Dashboard Admin Owner - Logika Lengkap, Database Sync & Upload Foto Mobil
 */

let adminState = {
    cars: [],
    ownerConfig: {},
    reviews: [],
    editingReviewStories: [],
    bookings: [],
    currentTab: 'overview',
    searchQuery: '',
    reviewsFilter: 'all',
    bookingFilterStatus: 'all',
    bookingSearchQuery: '',
    historyFilterStatus: 'all',
    historySearchQuery: '',
    isLoggedIn: false
};

// Helper generator sample bookings untuk berbagai rentang waktu real-time
function getRelativeDateStr(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getTodayLocalStr() {
    return getRelativeDateStr(0);
}

// Cek apakah booking sudah berstatus 'completed' (hanya masuk Riwayat Pemesanan jika diselesaikan via tombol checklist oleh Admin)
function isBookingExpired(b) {
    if (!b) return false;
    const st = String(b.status || '').toLowerCase();
    return st === 'completed';
}

// Helper parsing tanggal & jam sewa
function parseBookingDateTime(dateStr, timeStr, defaultTime = '23:59:00') {
    if (!dateStr) return null;
    const cleanDate = String(dateStr).split('T')[0];
    let cleanTime = String(timeStr || defaultTime).trim();
    if (cleanTime.length === 5) cleanTime += ':00';
    if (!cleanTime) cleanTime = defaultTime;

    const isoStr = `${cleanDate}T${cleanTime}`;
    const parsed = new Date(isoStr);
    if (!isNaN(parsed.getTime())) {
        return parsed;
    }
    const dParts = cleanDate.split('-');
    const tParts = cleanTime.split(':');
    if (dParts.length === 3) {
        return new Date(
            parseInt(dParts[0], 10),
            parseInt(dParts[1], 10) - 1,
            parseInt(dParts[2], 10),
            parseInt(tParts[0] || 0, 10),
            parseInt(tParts[1] || 0, 10),
            parseInt(tParts[2] || 0, 10)
        );
    }
    return null;
}

// Hitung status sisa jam pemakaian real-time dan denda keterlambatan (Rp 50.000/jam jika lewat >= 1 jam)
function getBookingRentalTimerInfo(b) {
    if (!b || !b.end_date) {
        return {
            hasEnd: false,
            isStarted: false,
            isOverdue: false,
            overdueSeconds: 0,
            overdueHours: 0,
            hasPenalty: false,
            penaltyAmount: 0,
            countdownText: '-',
            isPenaltyPaid: false
        };
    }

    const startDateTime = parseBookingDateTime(b.start_date, b.start_time || '09:00', '00:00:00');
    const endDateTime = parseBookingDateTime(b.end_date, b.end_time || b.start_time, '23:59:00');
    if (!endDateTime) {
        return {
            hasEnd: false,
            isStarted: false,
            isOverdue: false,
            overdueSeconds: 0,
            overdueHours: 0,
            hasPenalty: false,
            penaltyAmount: 0,
            countdownText: '-',
            isPenaltyPaid: false
        };
    }

    const now = Date.now();

    // 1. Cek apakah jam & tanggal pemakaian sudah dimulai secara real-time
    // "dia akan nyala jika jam tanggal sewanya mulai"
    const isStarted = !startDateTime || (now >= startDateTime.getTime());

    if (!isStarted) {
        return {
            hasEnd: true,
            isStarted: false,
            isOverdue: false,
            overdueSeconds: 0,
            overdueHours: 0,
            hasPenalty: false,
            penaltyAmount: 0,
            countdownText: 'Belum Mulai',
            isPenaltyPaid: false
        };
    }

    // 2. Jika waktu sewa telah mulai ("nyala"): hitung countdown ke batas pengembalian
    const diffMs = endDateTime.getTime() - now;
    const isOverdue = diffMs <= 0;
    const absSeconds = Math.floor(Math.abs(diffMs) / 1000);

    const d = Math.floor(absSeconds / 86400);
    const h = Math.floor((absSeconds % 86400) / 3600);
    const m = Math.floor((absSeconds % 3600) / 60);
    const s = absSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    let timeFormatted = '';
    if (d > 0) {
        timeFormatted = `${d} hari ${pad(h)}:${pad(m)}:${pad(s)}`;
    } else {
        timeFormatted = `${pad(h)}:${pad(m)}:${pad(s)}`;
    }

    if (isOverdue) {
        timeFormatted = `-${timeFormatted}`;
    }

    const overdueSeconds = isOverdue ? absSeconds : 0;
    const overdueHours = Math.floor(overdueSeconds / 3600);
    // Melewati 1 jam dari jam pengembalian dikenakan denda Rp 50.000 / jam
    const hasPenalty = overdueHours >= 1;
    let penaltyAmount = hasPenalty ? overdueHours * 50000 : 0;
    if (b.penalty_amount && parseFloat(b.penalty_amount) > penaltyAmount) {
        penaltyAmount = parseFloat(b.penalty_amount);
    }

    const isPenaltyPaid = Boolean(b.penalty_proof && String(b.penalty_proof).length > 20);

    // Ketika pembayaran denda telah selesai/diverifikasi -> jam berhenti (freeze)
    if (isPenaltyPaid) {
        if (!b.penalty_stopped_time) {
            b.penalty_stopped_time = timeFormatted;
        } else {
            timeFormatted = b.penalty_stopped_time;
        }
    }

    return {
        hasEnd: true,
        isStarted: true,
        diffMs,
        isOverdue,
        overdueSeconds,
        overdueHours,
        hasPenalty,
        penaltyAmount,
        countdownText: timeFormatted,
        isPenaltyPaid
    };
}

// Cek apakah pembayaran booking sudah diverifikasi (hanya yang terverifikasi yang menaikkan Pendapatan)
function isBookingVerified(b) {
    if (!b) return false;
    const st = String(b.status || '').toLowerCase();
    return st === 'confirmed' || st === 'verifikasi' || st === 'terverifikasi' || st === 'dikonfirmasi' || st === 'completed';
}

// Data booking dikosongkan (tanpa seeder/dummy data) sesuai instruksi pengguna
const DEFAULT_BOOKINGS = [];

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Floating Toast Notification System
function showAdminToast(title, message, type = 'success') {
    let container = document.getElementById('adminToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'adminToastContainer';
        container.className = 'admin-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `admin-toast toast-${type}`;

    let iconHtml = '<i class="fa-solid fa-check"></i>';
    if (type === 'warning') iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';
    if (type === 'error') iconHtml = '<i class="fa-solid fa-xmark"></i>';
    if (type === 'info') iconHtml = '<i class="fa-solid fa-circle-info"></i>';

    toast.innerHTML = `
        <div class="admin-toast-icon">
            ${iconHtml}
        </div>
        <div class="admin-toast-content">
            <div class="admin-toast-title">${escapeHtml(title)}</div>
            ${message ? `<div class="admin-toast-desc">${escapeHtml(message)}</div>` : ''}
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 350);
    }, 3200);
}

// Mobile Admin Sidebar Toggle
function toggleAdminSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('adminSidebarBackdrop');
    if (!sidebar) return;

    const isOpen = sidebar.classList.contains('mobile-open');
    if (isOpen) {
        sidebar.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.add('hidden');
    } else {
        sidebar.classList.add('mobile-open');
        if (backdrop) backdrop.classList.remove('hidden');
    }
}

function closeAdminSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('adminSidebarBackdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.add('hidden');
}

// Inisialisasi Data
async function initAdmin() {
    // Bersihkan cache lama (garuda_ keys)
    ['garuda_rent_cars','garuda_rent_config','garuda_rent_reviews','garuda_rent_bookings'].forEach(k => localStorage.removeItem(k));
    if (localStorage.getItem('rcm_cars_v_rev') !== '4') {
        localStorage.removeItem('rcm_rent_cars');
        localStorage.removeItem('rcm_rent_config');
        localStorage.removeItem('rcm_rent_reviews');
        localStorage.removeItem('rcm_rent_bookings');
        localStorage.setItem('rcm_cars_v_rev', '4');
    }

    const savedConfig = localStorage.getItem('rcm_rent_config');
    if (savedConfig) {
        try {
            adminState.ownerConfig = JSON.parse(savedConfig);
        } catch (e) {
            adminState.ownerConfig = { ...DEFAULT_OWNER_CONFIG };
        }
    } else {
        adminState.ownerConfig = { ...DEFAULT_OWNER_CONFIG };
        localStorage.setItem('rcm_rent_config', JSON.stringify(adminState.ownerConfig));
    }

    // Load Owner Config, Cars, Reviews & Bookings from Database API
    await fetchAdminOwnerConfig();
    await fetchAdminCars();
    await fetchAdminReviews();
    await fetchAdminBookings();

    adminState.isLoggedIn = sessionStorage.getItem('rcm_admin_logged') === 'true';
    checkAuthView();
}

// Fetch Owner Config dari Database API Laravel
async function fetchAdminOwnerConfig() {
    try {
        const res = await fetch('/api/owner-config');
        if (res.ok) {
            const result = await res.json();
            if (result.data) {
                const c = result.data;
                adminState.ownerConfig = {
                    businessName: c.business_name || 'Rent Car Makassar',
                    tagline: c.tagline || '',
                    description: c.description || '',
                    whatsappNumber: c.whatsapp_number || '62137560263',
                    phone: c.phone || '0821-3756-0263',
                    email: c.email || 'kontak@rentcarmakassar.com',
                    address: c.address || 'Jl. Perintis Kemerdekaan No. 10, Makassar, Sulawesi Selatan',
                    mapsUrl: c.maps_url || 'https://maps.google.com/?q=Jl.+Perintis+Kemerdekaan+No.+10,+Makassar,+Sulawesi+Selatan',
                    operatingHours: c.operating_hours || 'Buka 24 Jam Setiap Hari',
                    socialMedia: {
                        instagram: c.instagram || '@rentcarmakassar',
                        facebook: c.facebook || 'Rent Car makassar Makassar',
                        tiktok: c.tiktok || '@rentcarmakassar'
                    },
                    isHolidayPricingActive: Boolean(c.is_holiday_pricing_active),
                    holidayNotes: c.holiday_notes || 'Tarif Musim Libur & Hari Besar Nasional (Peak Season)',
                    bankName: c.bank_name || adminState.ownerConfig.bankName || 'BCA',
                    bankAccountNumber: c.bank_account_number || adminState.ownerConfig.bankAccountNumber || '7890123456',
                    bankAccountHolder: c.bank_account_holder || adminState.ownerConfig.bankAccountHolder || 'RPM Rent Car Makassar',
                    qrisImage: c.qris_image !== undefined ? (c.qris_image || '') : (adminState.ownerConfig.qrisImage || '')
                };
                saveConfigData();
            }
        }
    } catch (err) {
        console.error("Error fetching owner config API:", err);
    }
}

// Fetch Armada Mobil dari Database API Laravel
async function fetchAdminCars() {
    const savedCars = localStorage.getItem('rcm_rent_cars');
    if (savedCars) {
        try {
            adminState.cars = JSON.parse(savedCars);
        } catch (e) {
            adminState.cars = [...(typeof DEFAULT_CARS !== 'undefined' ? DEFAULT_CARS : [])];
        }
    }
    if (!adminState.cars || adminState.cars.length === 0) {
        adminState.cars = [...(typeof DEFAULT_CARS !== 'undefined' ? DEFAULT_CARS : [])];
    }

    try {
        const res = await fetch('/api/cars');
        if (res.ok) {
            const result = await res.json();
            if (result.data && result.data.length > 0) {
                adminState.cars = result.data.map(c => ({
                    id: c.id.toString(),
                    carCode: c.car_code,
                    brand: c.brand,
                    model: c.model,
                    year: c.year,
                    category: c.category,
                    seats: c.seats,
                    transmission: c.transmission,
                    fuel: c.fuel,
                    luggage: c.luggage,
                    priceNormal: parseFloat(c.price_normal),
                    priceHoliday: parseFloat(c.price_holiday),
                    driverFee: parseFloat(c.driver_fee || 150000),
                    status: c.status,
                    image: c.image || '',
                    description: c.description
                }));
                saveCarsData();
            } else if ((!adminState.cars || adminState.cars.length === 0) && typeof DEFAULT_CARS !== 'undefined') {
                adminState.cars = [...DEFAULT_CARS];
                saveCarsData();
            }
        }
    } catch (err) {
        if ((!adminState.cars || adminState.cars.length === 0) && typeof DEFAULT_CARS !== 'undefined') {
            adminState.cars = [...DEFAULT_CARS];
            saveCarsData();
        }
    }
}

// Fetch Reviews for Admin Moderation
async function fetchAdminReviews() {
    const savedReviews = localStorage.getItem('rcm_rent_reviews');
    if (savedReviews) {
        try {
            adminState.reviews = JSON.parse(savedReviews);
        } catch (e) {
            adminState.reviews = [...DEFAULT_REVIEWS];
        }
    } else {
        adminState.reviews = [...DEFAULT_REVIEWS];
        localStorage.setItem('rcm_rent_reviews', JSON.stringify(adminState.reviews));
    }

    try {
        const res = await fetch('/api/reviews?status=all');
        if (res.ok) {
            const result = await res.json();
            if (result.data) {
                adminState.reviews = result.data;
                localStorage.setItem('rcm_rent_reviews', JSON.stringify(adminState.reviews));
            }
        }
    } catch (err) {
        // Fallback to localStorage
    }
}

function saveCarsData() {
    localStorage.setItem('rcm_rent_cars', JSON.stringify(adminState.cars));
}

function saveConfigData() {
    localStorage.setItem('rcm_rent_config', JSON.stringify(adminState.ownerConfig));
}

function saveReviewsData() {
    localStorage.setItem('rcm_rent_reviews', JSON.stringify(adminState.reviews));
}

// Tampilan Auth vs Dashboard
function checkAuthView() {
    const loginSec = document.getElementById('loginSection');
    const dashSec = document.getElementById('dashboardSection');

    if (adminState.isLoggedIn) {
        if (loginSec) loginSec.classList.add('hidden');
        if (dashSec) dashSec.classList.remove('hidden');
        renderAllDashboard();
    } else {
        if (loginSec) loginSec.classList.remove('hidden');
        if (dashSec) dashSec.classList.add('hidden');
    }
}

// Handler Login
function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('loginUsername').value.trim();
    const pass = document.getElementById('loginPassword').value.trim();

    if ((user === 'admin' && pass === 'admin123') || (user === 'owner' && pass === 'owner123')) {
        adminState.isLoggedIn = true;
        sessionStorage.setItem('rcm_admin_logged', 'true');
        const err = document.getElementById('loginErrorMessage');
        if (err) err.classList.add('hidden');
        checkAuthView();
    } else {
        const err = document.getElementById('loginErrorMessage');
        if (err) {
            err.textContent = 'Username atau password salah. (Default: admin / admin123)';
            err.classList.remove('hidden');
        }
    }
}

// Handler Logout
function handleAdminLogout() {
    if (confirm('Apakah Anda yakin ingin keluar dari Dashboard Owner?')) {
        adminState.isLoggedIn = false;
        sessionStorage.removeItem('rcm_admin_logged');
        checkAuthView();
    }
}

// Ganti Tab Halaman
function switchTab(tabName) {
    if (tabName === 'history') {
        openBookingHistoryModal();
        return;
    }

    adminState.currentTab = tabName;
    closeAdminSidebar();
    if (typeof closeStatusDropdownPortal === 'function') {
        closeStatusDropdownPortal();
    }

    // Sembunyikan semua tab pane
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));

    // Tampilkan tab aktif
    const activePane = document.getElementById(`tab-content-${tabName}`);
    if (activePane) activePane.classList.remove('hidden');

    // Update style tombol sidebar
    document.querySelectorAll('.tab-nav-btn').forEach(b => {
        b.classList.remove('active');
    });

    const activeBtn = document.getElementById(`nav-${tabName}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Update Judul Header
    const titles = {
        overview: { title: 'Ringkasan Bisnis & Armada', subtitle: 'Pantau ketersediaan armada dan pendapatan terverifikasi hari ini.' },
        bookings: { title: 'Kelola Data Booking & Pesanan Aktif', subtitle: 'Pantau pesanan aktif, verifikasi pembayaran, dan input booking manual.' },
        cars: { title: 'Kelola Seluruh Unit Armada Mobil', subtitle: 'Atur ketersediaan unit (Ready/Digunakan), tarif normal, dan tarif libur.' },
        reviews: { title: 'Moderasi & Verifikasi Ulasan Pelanggan', subtitle: 'Verifikasi ulasan dari pelanggan untuk ditampilkan di halaman utama website.' },
        pricing: { title: 'Pengaturan Tarif Khusus Musim Liburan', subtitle: 'Aktifkan atau nonaktifkan harga libur secara serentak dengan satu sakelar.' },
        contact: { title: 'Pengaturan Kontak & Tujuan WhatsApp', subtitle: 'Atur nomor WhatsApp penerima pesanan serta informasi kontak resmi.' }
    };

    if (titles[tabName]) {
        const titleEl = document.getElementById('pageTitle');
        const subTitleEl = document.getElementById('pageSubtitle');
        if (titleEl) titleEl.textContent = titles[tabName].title;
        if (subTitleEl) subTitleEl.textContent = titles[tabName].subtitle;
    }

    // Render ulang konten tab spesifik
    if (tabName === 'bookings') {
        renderBookingsTable();
        renderHistoryTable();
        fetchAdminBookings().then(() => {
            renderBookingsTable();
            renderHistoryTable();
            renderOverviewMetrics();
        });
    }
    if (tabName === 'cars') renderCarsTable();
    if (tabName === 'reviews') renderReviewsTable();
    if (tabName === 'pricing') renderPricingTab();
    if (tabName === 'contact') renderContactForm();
}

// Render Semua Komponen Dashboard
function renderAllDashboard() {
    renderTopStatus();
    renderOverviewMetrics();
    renderOverviewQuickCars();
    renderBookingsTable();
    renderHistoryTable();
    renderCarsTable();
    renderReviewsTable();
    renderPricingTab();
    renderContactForm();
}

// Render Status Mode Libur di Top Bar & Overview
function renderTopStatus() {
    const isHoliday = adminState.ownerConfig.isHolidayPricingActive;
    const topBadge = document.getElementById('topPricingModeBadge');

    if (topBadge) {
        if (isHoliday) {
            topBadge.className = 'status-pill-used';
            topBadge.innerHTML = '<span class="dot-indicator" style="background-color: var(--clr-rose);"></span> <span>Mode Libur Aktif</span>';
        } else {
            topBadge.className = 'status-pill-ready';
            topBadge.innerHTML = '<span class="dot-indicator" style="background-color: var(--clr-emerald);"></span> <span>Tarif Normal Aktif</span>';
        }
    }

    // Overview Banner
    const banner = document.getElementById('overviewHolidayBanner');
    const bannerIcon = document.getElementById('bannerIconBox');
    const bannerTitle = document.getElementById('bannerTitle');
    const bannerDesc = document.getElementById('bannerDesc');

    if (banner) {
        if (isHoliday) {
            banner.className = 'banner-alert holiday-active';
            if (bannerIcon) bannerIcon.textContent = '🏖️';
            if (bannerTitle) bannerTitle.textContent = `Mode Tarif Libur Aktif: ${adminState.ownerConfig.holidayNotes || 'Peak Season'}`;
            if (bannerDesc) bannerDesc.textContent = 'Seluruh harga di halaman pengunjung saat ini otomatis memakai harga waktu liburan.';
        } else {
            banner.className = 'banner-alert';
            if (bannerIcon) bannerIcon.textContent = '🌱';
            if (bannerTitle) bannerTitle.textContent = 'Tarif Normal Sedang Diberlakukan';
            if (bannerDesc) bannerDesc.textContent = 'Pengunjung yang melakukan pemesanan saat ini dikenakan harga sewa normal harian.';
        }
    }
}

let currentRevenueTimeframe = 'week';

// Switch Timeframe (Minggu, Bulan, Tahun)
function setRevenueChartTimeframe(tf, btnEl) {
    currentRevenueTimeframe = tf;

    document.querySelectorAll('.revenue-tf-btn').forEach(btn => {
        btn.style.background = 'transparent';
        btn.style.color = '#64748b';
    });

    if (btnEl) {
        btnEl.style.background = '#dc2626';
        btnEl.style.color = '#ffffff';
    }

    renderRevenueAnalytics();
}

// Render Pendapatan, Metrik, Analisis Naik/Turun & Grafik
function renderOverviewMetrics() {
    const total = adminState.cars.length;
    const ready = adminState.cars.filter(c => c.status === 'ready').length;
    const inUse = adminState.cars.filter(c => c.status === 'in_use').length;

    const totalEl = document.getElementById('statTotalCars');
    const readyEl = document.getElementById('statReadyCars');
    const inUseEl = document.getElementById('statInUseCars');

    if (totalEl) totalEl.textContent = total;
    if (readyEl) readyEl.textContent = `${ready} Unit`;
    if (inUseEl) inUseEl.textContent = `${inUse} Unit`;

    renderRevenueAnalytics();
}

// Hitung & Render Statistik Analisis Pendapatan (Hanya Menghitung Pembayaran yang Sudah Diverifikasi)
function renderRevenueAnalytics() {
    const bookings = adminState.bookings || [];
    const verifiedBookings = bookings.filter(isBookingVerified);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // 1. Hitung Pendapatan Berdasarkan Waktu (Hanya Pesanan Terverifikasi)
    let totalAllTime = 0;
    let thisMonthRevenue = 0;
    let lastMonthRevenue = 0;
    let thisYearRevenue = 0;
    let lastYearRevenue = 0;

    verifiedBookings.forEach(b => {
        const price = parseFloat(b.total_price) || 0;
        totalAllTime += price;

        if (b.start_date) {
            const parts = String(b.start_date).split('T')[0].split('-');
            const bYear = parts.length === 3 ? parseInt(parts[0], 10) : new Date(b.start_date).getFullYear();
            const bMonth = parts.length === 3 ? (parseInt(parts[1], 10) - 1) : new Date(b.start_date).getMonth();

            // Cek Tahun Ini vs Tahun Lalu
            if (bYear === currentYear) {
                thisYearRevenue += price;
            } else if (bYear === currentYear - 1) {
                lastYearRevenue += price;
            }

            // Cek Bulan Ini vs Bulan Lalu
            if (bYear === currentYear && bMonth === currentMonth) {
                thisMonthRevenue += price;
            } else {
                // Bulan lalu (handle crossing year, misal Januari vs Desember tahun lalu)
                const isLastMonth = (currentMonth === 0 && bYear === currentYear - 1 && bMonth === 11) ||
                                    (bYear === currentYear && bMonth === currentMonth - 1);
                if (isLastMonth) {
                    lastMonthRevenue += price;
                }
            }
        }
    });

    // 2. Tampilkan di Kartu Metrik Utama
    const totalRevEl = document.getElementById('statTotalRevenue');
    if (totalRevEl) totalRevEl.textContent = formatRupiah(thisMonthRevenue);

    const totalCountEl = document.getElementById('statTotalBookingsCount');
    if (totalCountEl) totalCountEl.textContent = `${bookings.length} Order`;

    const totalSalesAllEl = document.getElementById('statTotalSalesAllTime');
    if (totalSalesAllEl) totalSalesAllEl.textContent = `Terverifikasi (${verifiedBookings.length}): ${formatRupiah(totalAllTime)}`;

    // 3. Hitung Persentase Naik/Turun MoM (Month over Month)
    let momGrowth = 0;
    let isMomUp = true;
    if (lastMonthRevenue > 0) {
        momGrowth = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        isMomUp = momGrowth >= 0;
    } else if (thisMonthRevenue > 0) {
        momGrowth = 100;
        isMomUp = true;
    }

    const growthBadge = document.getElementById('statRevenueGrowthBadge');
    if (growthBadge) {
        growthBadge.textContent = `${isMomUp ? '▲ +' : '▼ -'}${Math.abs(momGrowth).toFixed(1)}%`;
        growthBadge.style.background = isMomUp ? '#ecfdf5' : '#fef2f2';
        growthBadge.style.color = isMomUp ? '#047857' : '#b91c1c';
    }

    // 4. Hitung Persentase Naik/Turun YoY (Year over Year)
    let yoyGrowth = 0;
    let isYoyUp = true;
    if (lastYearRevenue > 0) {
        yoyGrowth = ((thisYearRevenue - lastYearRevenue) / lastYearRevenue) * 100;
        isYoyUp = yoyGrowth >= 0;
    } else if (thisYearRevenue > 0) {
        yoyGrowth = 100;
        isYoyUp = true;
    }

    // Update Baris Perbandingan MoM & YoY
    const cmpMonthCurrent = document.getElementById('cmpMonthCurrent');
    const cmpMonthDiffBadge = document.getElementById('cmpMonthDiffBadge');
    const cmpMonthSub = document.getElementById('cmpMonthSub');
    if (cmpMonthCurrent) cmpMonthCurrent.textContent = formatRupiah(thisMonthRevenue);
    if (cmpMonthDiffBadge) {
        cmpMonthDiffBadge.textContent = `${isMomUp ? '▲ +' : '▼ -'}${Math.abs(momGrowth).toFixed(1)}%`;
        cmpMonthDiffBadge.style.color = isMomUp ? '#047857' : '#dc2626';
    }
    if (cmpMonthSub) cmpMonthSub.textContent = `vs bln lalu (${formatRupiah(lastMonthRevenue)})`;

    const cmpYearCurrent = document.getElementById('cmpYearCurrent');
    const cmpYearDiffBadge = document.getElementById('cmpYearDiffBadge');
    const cmpYearSub = document.getElementById('cmpYearSub');
    if (cmpYearCurrent) cmpYearCurrent.textContent = formatRupiah(thisYearRevenue);
    if (cmpYearDiffBadge) {
        cmpYearDiffBadge.textContent = `${isYoyUp ? '▲ +' : '▼ -'}${Math.abs(yoyGrowth).toFixed(1)}%`;
        cmpYearDiffBadge.style.color = isYoyUp ? '#047857' : '#dc2626';
    }
    if (cmpYearSub) cmpYearSub.textContent = `vs thn lalu (${formatRupiah(lastYearRevenue)})`;

    // Rata-rata per order terverifikasi
    const avgOrder = verifiedBookings.length > 0 ? (totalAllTime / verifiedBookings.length) : 0;
    const avgOrderEl = document.getElementById('cmpAvgOrder');
    if (avgOrderEl) avgOrderEl.textContent = formatRupiah(avgOrder);

    // 5. Render Grafik Interaktif (Minggu / Bulan / Tahun) hanya dari pesanan terverifikasi
    renderDynamicRevenueChart(verifiedBookings, currentRevenueTimeframe);
}

// Visualisasi Grafik Bar / Area Dinamis Berdasarkan Timeframe (Hanya Pesanan Terverifikasi)
function renderDynamicRevenueChart(bookings, timeframe) {
    const container = document.getElementById('revenueChartContainer');
    const titleEl = document.getElementById('chartViewTitle');
    if (!container) return;

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    let dataPoints = [];

    if (timeframe === 'week') {
        if (titleEl) titleEl.textContent = 'Grafik Pendapatan Terverifikasi 7 Hari Terakhir (Mingguan)';
        // 7 Hari terakhir (tanggal lokal akurat)
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
            const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });

            const dayTotal = bookings
                .filter(b => b.start_date && String(b.start_date).split('T')[0] === dateStr)
                .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

            dataPoints.push({ label, amount: dayTotal, rawDate: dateStr });
        }
    } else if (timeframe === 'month') {
        if (titleEl) titleEl.textContent = `Grafik Pendapatan Terverifikasi 12 Bulan (${now.getFullYear()})`;
        // 12 Bulan di tahun berjalan
        const monthShorts = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        for (let m = 0; m < 12; m++) {
            const monthTotal = bookings
                .filter(b => {
                    if (!b.start_date) return false;
                    const parts = String(b.start_date).split('T')[0].split('-');
                    const bY = parts.length === 3 ? parseInt(parts[0], 10) : new Date(b.start_date).getFullYear();
                    const bM = parts.length === 3 ? (parseInt(parts[1], 10) - 1) : new Date(b.start_date).getMonth();
                    return bY === now.getFullYear() && bM === m;
                })
                .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

            dataPoints.push({ label: monthShorts[m], amount: monthTotal });
        }
    } else if (timeframe === 'year') {
        if (titleEl) titleEl.textContent = 'Grafik Perbandingan Pendapatan Terverifikasi 5 Tahun Terakhir';
        // 5 Tahun terakhir (e.g. 2022 s/d 2026)
        const curY = now.getFullYear();
        for (let y = curY - 4; y <= curY; y++) {
            const yearTotal = bookings
                .filter(b => {
                    if (!b.start_date) return false;
                    const parts = String(b.start_date).split('T')[0].split('-');
                    const bY = parts.length === 3 ? parseInt(parts[0], 10) : new Date(b.start_date).getFullYear();
                    return bY === y;
                })
                .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

            dataPoints.push({ label: String(y), amount: yearTotal });
        }
    }

    // Tentukan Nilai Tertinggi untuk Normalisasi Tinggi Bar
    const maxVal = Math.max(...dataPoints.map(d => d.amount), 5000000);

    // Bangun HTML Bar Chart Responsif
    let chartHtml = `
        <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 180px; gap: 0.5rem; padding: 1rem 0.5rem 0.5rem 0.5rem; border-bottom: 2px solid #e2e8f0;">
    `;

    dataPoints.forEach(point => {
        const heightPct = Math.max(Math.round((point.amount / maxVal) * 100), 4);
        const isCurrentPoint = point.amount > 0;
        const formattedAmt = formatRupiah(point.amount);

        chartHtml += `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; position: relative; min-width: 0;" class="chart-col-hover" title="${point.label}: ${formattedAmt}">
                <div style="font-size: 0.65rem; font-weight: 800; color: #dc2626; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
                    ${point.amount > 0 ? (point.amount >= 1000000 ? (point.amount/1000000).toFixed(1) + 'jt' : (point.amount/1000) + 'k') : ''}
                </div>
                <div style="width: 100%; max-width: 2.5rem; height: ${heightPct}%; background: ${isCurrentPoint ? 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)' : '#e2e8f0'}; border-radius: 6px 6px 0 0; transition: height 0.4s ease, background 0.2s; box-shadow: ${isCurrentPoint ? '0 4px 10px rgba(220, 38, 38, 0.25)' : 'none'}; cursor: pointer;"></div>
                <div style="font-size: 0.7rem; font-weight: 700; color: #64748b; margin-top: 0.45rem; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">
                    ${point.label}
                </div>
            </div>
        `;
    });

    chartHtml += `</div>`;
    container.innerHTML = chartHtml;
}

// Render List Cepat Mobil di Tab Overview
function renderOverviewQuickCars() {
    const grid = document.getElementById('overviewCarsGrid');
    if (!grid) return;

    if (adminState.cars.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; color: var(--clr-text-muted); font-size: 0.8125rem;">Belum ada armada mobil di database. Klik tombol "Tambah Unit Baru".</div>';
        return;
    }

    grid.innerHTML = adminState.cars.map(car => {
        const isReady = car.status === 'ready';
        const carImg = car.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=150&q=80';
        return `
            <div style="padding: 0.75rem; background: #f8fafc; border: 1px solid var(--clr-border); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.625rem; overflow: hidden;">
                    <img src="${carImg}" alt="${car.model}" style="width: 2.5rem; height: 2rem; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--clr-border); flex-shrink: 0;">
                    <div class="truncate">
                        <div style="font-weight: 700; font-size: 0.75rem; color: var(--clr-text-main);" class="truncate">${car.brand} ${car.model}</div>
                        <div style="font-size: 0.65rem; color: var(--clr-text-subtle);">${car.transmission} • ${formatRupiah(car.priceNormal)}/hr</div>
                    </div>
                </div>
                <button
                    onclick="toggleCarStatus('${car.id}')"
                    class="${isReady ? 'status-pill-ready' : 'status-pill-used'}" style="cursor: pointer; flex-shrink: 0;">
                    ${isReady ? '● Ready' : '● Digunakan'}
                </button>
            </div>
        `;
    }).join('');
}

// Render Tabel Lengkap di Tab Kelola Mobil
function renderCarsTable() {
    const tbody = document.getElementById('carsTableBody');
    if (!tbody) return;

    let cars = adminState.cars;
    if (adminState.searchQuery.trim() !== '') {
        const q = adminState.searchQuery.toLowerCase();
        cars = cars.filter(c => c.brand.toLowerCase().includes(q) || c.model.toLowerCase().includes(q));
    }

    if (cars.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="padding: 3rem; text-align: center; color: var(--clr-text-muted);">
                    Belum ada unit mobil ditemukan di database.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = cars.map(car => {
        const isReady = car.status === 'ready';
        const carImg = car.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=150&q=80';
        return `
            <tr style="border-bottom: 1px solid var(--clr-border);">
                <td style="padding: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <img src="${carImg}" alt="${car.model}" style="width: 3.5rem; height: 2.5rem; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--clr-border);">
                        <div>
                            <div style="font-weight: 800; font-size: 0.875rem; color: var(--clr-text-main);">${car.brand} ${car.model}</div>
                            <div style="font-size: 0.7rem; color: var(--clr-text-muted);">${car.year || ''} • ${car.category}</div>
                        </div>
                    </div>
                </td>
                <td style="padding: 1rem; font-size: 0.8125rem;">
                    <div>${car.seats} Kursi</div>
                    <div style="font-size: 0.7rem; color: var(--clr-text-subtle);">${car.transmission} • ${car.fuel}</div>
                </td>
                <td style="padding: 1rem; font-weight: 700; font-size: 0.875rem; color: var(--clr-text-main);">
                    ${formatRupiah(car.priceNormal)}
                </td>
                <td style="padding: 1rem; font-weight: 700; font-size: 0.875rem; color: var(--clr-primary);">
                    ${formatRupiah(car.priceHoliday)}
                </td>
                <td style="padding: 1rem; font-size: 0.8125rem; color: var(--clr-emerald); font-weight: 700;">
                    ${formatRupiah(car.driverFee || 150000)}
                </td>
                <td style="padding: 1rem;">
                    <button
                        onclick="toggleCarStatus('${car.id}')"
                        class="${isReady ? 'status-pill-ready' : 'status-pill-used'}" style="cursor: pointer;">
                        ${isReady ? '● Ready' : '● Sedang Digunakan'}
                    </button>
                </td>
                <td style="padding: 1rem; text-align: right;">
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem;">
                        <button onclick="openEditCarModal('${car.id}')" class="btn btn-outline btn-sm" style="padding: 0.35rem 0.6rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                            <svg style="width:0.75rem;height:0.75rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            <span>Edit</span>
                        </button>
                        <button onclick="deleteCar('${car.id}')" class="btn btn-outline btn-sm" style="padding: 0.35rem 0.6rem; color: var(--clr-rose); border-color: #fecdd3; display: inline-flex; align-items: center; gap: 0.25rem;">
                            <svg style="width:0.75rem;height:0.75rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            <span>Hapus</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Toggle Status Mobil (Ready <-> In Use)
function toggleCarStatus(carId) {
    const car = adminState.cars.find(c => c.id === carId);
    if (!car) return;

    car.status = car.status === 'ready' ? 'in_use' : 'ready';

    // Sync with API if possible
    fetch(`/api/cars/${car.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: car.status })
    }).catch(() => {});

    saveCarsData();
    renderAllDashboard();
}

function isArtistReviewAdmin(rev) {
    const ut = String(rev?.user_type || '').toLowerCase().trim();
    return ut === 'artis' || ut === 'artist' || ut === 'vip';
}

function isVideoUrlAdmin(url) {
    if (!url) return false;
    const lower = String(url).toLowerCase();
    return lower.startsWith('data:video/') || /\.(mp4|webm|mov|avi|mkv|m4v)(\?|$)/.test(lower);
}

function getAdminReviewStories(rev) {
    if (!rev) return [];
    let list = [];
    if (Array.isArray(rev.stories)) {
        list = rev.stories;
    } else if (typeof rev.stories === 'string' && rev.stories.trim()) {
        try {
            const parsed = JSON.parse(rev.stories);
            if (Array.isArray(parsed)) list = parsed;
        } catch (e) {}
    }

    const normalized = list
        .filter(item => item && item.url)
        .map((item, idx) => ({
            id: `existing_${idx}_${Date.now()}`,
            url: String(item.url),
            type: item.type === 'video' || isVideoUrlAdmin(item.url) ? 'video' : 'image',
            file: null
        }));

    if (normalized.length > 0) return normalized;

    if (rev.media) {
        const type = rev.media_type === 'video' || isVideoUrlAdmin(rev.media) ? 'video' : 'image';
        return [{ id: `legacy_${Date.now()}`, url: String(rev.media), type, file: null }];
    }

    return [];
}

function compressAdminImageToBase64(file, maxDim = 1080, quality = 0.84) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (evt) {
            const img = new Image();
            img.onload = function () {
                let width = img.width;
                let height = img.height;
                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = () => resolve(evt.target.result);
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Render Tabel & Moderasi Review Pelanggan
function renderReviewsTable() {
    const tbody = document.getElementById('reviewsTableBody');
    if (!tbody) return;

    const totalCount = adminState.reviews.length;
    const pendingCount = adminState.reviews.filter(r => r.status === 'pending').length;
    const approvedCount = adminState.reviews.filter(r => r.status === 'approved' || !r.status).length;
    const rejectedCount = adminState.reviews.filter(r => r.status === 'rejected').length;

    const badgeTotal = document.getElementById('reviewStatTotal');
    const badgePending = document.getElementById('reviewStatPending');
    const badgeApproved = document.getElementById('reviewStatApproved');
    const badgeRejected = document.getElementById('reviewStatRejected');

    if (badgeTotal) badgeTotal.textContent = totalCount;
    if (badgePending) badgePending.textContent = pendingCount;
    if (badgeApproved) badgeApproved.textContent = approvedCount;
    if (badgeRejected) badgeRejected.textContent = rejectedCount;

    let filtered = adminState.reviews;
    if (adminState.reviewsFilter !== 'all') {
        filtered = filtered.filter(r => {
            if (adminState.reviewsFilter === 'approved') return r.status === 'approved' || !r.status;
            return r.status === adminState.reviewsFilter;
        });
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="padding: 3rem; text-align: center; color: var(--clr-text-muted);">
                    Tidak ada ulasan dalam kategori ini.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(rev => {
        const isArtis = isArtistReviewAdmin(rev);
        const stories = getAdminReviewStories(rev);
        const rating = Math.max(1, Math.min(5, parseInt(rev.rating || 5)));
        const safeName = escapeHtml(rev.name || 'Pelanggan');
        const safeCar = escapeHtml(rev.car_name || 'Mobil Rental');
        const safeComment = escapeHtml(rev.comment || '');
        const starsHtml = Array.from({ length: 5 }, (_, i) =>
            `<svg style="width:0.875rem;height:0.875rem;fill:${i < rating ? '#22c55e' : '#e2e8f0'};stroke:${i < rating ? '#22c55e' : '#e2e8f0'}" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
        ).join('');

        const status = rev.status || 'approved';
        let statusBadge = '';

        if (status === 'pending') {
            statusBadge = `<span class="rev-status-pill is-pending"><span class="rev-status-dot" style="background:#f59e0b;"></span>Menunggu</span>`;
        } else if (status === 'approved') {
            statusBadge = `<span class="rev-status-pill is-approved"><span class="rev-status-dot" style="background:#16a34a;"></span>Disetujui</span>`;
        } else {
            statusBadge = `<span class="rev-status-pill is-rejected"><span class="rev-status-dot" style="background:#ef4444;"></span>Ditolak</span>`;
        }

        const avatarSrc = rev.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name || 'P')}&background=${isArtis ? '16a34a' : '64748b'}&color=fff&bold=true`;

        let mediaPreviewHtml = '<span style="color: #94a3b8; font-size: 0.78rem;">—</span>';
        if (stories.length > 0) {
            const firstItem = stories[0];
            const photoCount = stories.filter(s => s.type !== 'video').length;
            const videoCount = stories.filter(s => s.type === 'video').length;
            const countLabels = [];
            if (photoCount > 0) countLabels.push(`${photoCount} Foto`);
            if (videoCount > 0) countLabels.push(`${videoCount} Video`);

            mediaPreviewHtml = `
                <div style="display: inline-flex; flex-direction: column; align-items: center; gap: 0.3rem;">
                    <div style="position: relative; display: inline-flex;">
                        ${firstItem.type === 'video'
                            ? `<video src="${firstItem.url}" muted style="width: 2.65rem; height: 2.65rem; border-radius: 0.55rem; object-fit: cover; border: 1px solid #cbd5e1; background: #0f172a;"></video>`
                            : `<img src="${firstItem.url}" alt="Story" style="width: 2.65rem; height: 2.65rem; border-radius: 0.55rem; object-fit: cover; border: 1px solid #cbd5e1;">`
                        }
                        ${stories.length > 1 ? `<span style="position:absolute; top:-5px; right:-5px; background:#0f172a; color:#fff; font-size:0.6rem; font-weight:800; padding:1px 5px; border-radius:999px; border:1.5px solid #fff;">+${stories.length - 1}</span>` : ''}
                    </div>
                    <span style="font-size: 0.65rem; font-weight: 700; color: #475569; white-space: nowrap;">${countLabels.join(' · ')}</span>
                </div>
            `;
        }

        const categoryBadge = isArtis
            ? `<span class="rev-vip-pill"><i class="fa-solid fa-crown" style="font-size:0.58rem;"></i>VIP / Artis</span>`
            : `<span class="rev-reg-pill">Reguler</span>`;

        return `
            <tr class="rev-table-row">
                <td style="padding: 0.95rem 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <img src="${avatarSrc}" alt="${safeName}" style="width: 2.5rem; height: 2.5rem; border-radius: 50%; object-fit: cover; border: 2px solid ${isArtis ? '#22c55e' : '#e2e8f0'}; flex-shrink: 0;">
                        <div>
                            <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
                                <span style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">${safeName}</span>
                                ${categoryBadge}
                            </div>
                            <div style="font-size: 0.72rem; color: #64748b; font-weight: 600; margin-top: 0.1rem;">${safeCar}</div>
                        </div>
                    </div>
                </td>
                <td style="padding: 0.95rem 1rem; white-space: nowrap;">
                    <div style="display: inline-flex; align-items: center; gap: 0.35rem;">
                        <div style="display: inline-flex; gap: 0.1rem; align-items: center;">${starsHtml}</div>
                        <span style="font-size: 0.72rem; font-weight: 700; color: #475569; font-variant-numeric: tabular-nums;">${rating}.0</span>
                    </div>
                </td>
                <td style="padding: 0.95rem 1rem; font-size: 0.8125rem; color: #334155; max-width: 24rem; line-height: 1.55;">
                    ${safeComment}
                </td>
                <td style="padding: 0.95rem 1rem; text-align: center;">
                    ${mediaPreviewHtml}
                </td>
                <td style="padding: 0.95rem 1rem;">
                    ${statusBadge}
                </td>
                <td style="padding: 0.95rem 1rem; text-align: right;">
                    <div style="display: inline-flex; align-items: center; justify-content: flex-end; gap: 0.4rem;">
                        <button type="button" onclick="toggleAdminReviewUserType('${rev.id}')" class="rev-type-toggle-btn ${isArtis ? 'is-vip' : ''}" title="${isArtis ? 'Ubah ke Kategori Reguler' : 'Jadikan Kategori VIP / Artis'}">
                            <i class="${isArtis ? 'fa-regular fa-user' : 'fa-solid fa-crown'}" style="font-size:0.7rem;"></i>
                            <span>${isArtis ? 'Set Reguler' : 'Set VIP'}</span>
                        </button>
                        ${status !== 'approved' ? `
                            <button type="button" onclick="approveReview('${rev.id}')" class="booking-action-icon-btn btn-icon-complete" title="Setujui &amp; Publikasikan">
                                <i class="fa-solid fa-check"></i>
                            </button>
                        ` : ''}
                        ${status !== 'rejected' ? `
                            <button type="button" onclick="rejectReview('${rev.id}')" class="booking-action-icon-btn btn-icon-edit" title="Sembunyikan / Tolak">
                                <i class="fa-solid fa-ban"></i>
                            </button>
                        ` : ''}
                        <button type="button" onclick="openAdminEditReviewModal('${rev.id}')" class="booking-action-icon-btn btn-icon-doc" title="Edit Ulasan &amp; Media Story">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button type="button" onclick="deleteReview('${rev.id}')" class="booking-action-icon-btn btn-icon-delete" title="Hapus Ulasan">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Toggle 1-Klik Kategori Artis <-> Reguler dari Tabel Admin
async function toggleAdminReviewUserType(reviewId) {
    const rev = adminState.reviews.find(r => r.id == reviewId);
    if (!rev) return;

    const nextType = isArtistReviewAdmin(rev) ? 'regular' : 'artis';
    rev.user_type = nextType;

    try {
        await fetch(`/api/reviews/${reviewId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ user_type: nextType })
        });
    } catch (e) {}

    saveReviewsData();
    renderReviewsTable();
    if (typeof showAdminToast === 'function') {
        showAdminToast(
            nextType === 'artis' ? 'Kategori Diubah ke VIP' : 'Kategori Diubah ke Reguler',
            nextType === 'artis'
                ? `"${rev.name}" kini tampil dengan mahkota & aksen hijau VIP.`
                : `"${rev.name}" kini menggunakan tampilan kartu reguler.`,
            'success'
        );
    }
}

// Pilih Kategori di Modal Tambah/Edit Review
function setAdminReviewUserType(type) {
    const isArtis = type === 'artis';
    const hiddenInput = document.getElementById('adminRevUserType');
    const radioReg = document.getElementById('adminRevTypeRegular');
    const radioArt = document.getElementById('adminRevTypeArtis');
    const cardReg = document.getElementById('adminRevTypeCardRegular');
    const cardArt = document.getElementById('adminRevTypeCardArtis');

    if (hiddenInput) hiddenInput.value = isArtis ? 'artis' : 'regular';
    if (radioReg) radioReg.checked = !isArtis;
    if (radioArt) radioArt.checked = isArtis;

    if (cardReg) cardReg.classList.toggle('is-active', !isArtis);
    if (cardArt) cardArt.classList.toggle('is-active', isArtis);

    updateAdminReviewLivePreview();
}

function setAdminReviewRating(stars) {
    const rating = Math.max(1, Math.min(5, parseInt(stars) || 5));
    const ratingInput = document.getElementById('adminRevRating');
    if (ratingInput) ratingInput.value = String(rating);

    const labels = {
        5: '5.0 • Sempurna',
        4: '4.0 • Sangat Baik',
        3: '3.0 • Cukup Baik',
        2: '2.0 • Kurang',
        1: '1.0 • Buruk'
    };
    const labelEl = document.getElementById('adminRevRatingLabel');
    if (labelEl) labelEl.textContent = labels[rating] || `${rating}.0`;

    document.querySelectorAll('#adminRevStarPicker .rev-star-btn').forEach(btn => {
        const val = parseInt(btn.getAttribute('data-star') || '0');
        btn.classList.toggle('is-filled', val <= rating);
    });

    updateAdminReviewLivePreview();
}

function updateAdminReviewLivePreview() {
    const nameInput = document.getElementById('adminRevName');
    const carInput = document.getElementById('adminRevCar');
    const commentInput = document.getElementById('adminRevComment');
    const userTypeInput = document.getElementById('adminRevUserType');
    const ratingInput = document.getElementById('adminRevRating');
    const avatarInput = document.getElementById('adminRevAvatar');

    const rawName = (nameInput?.value || '').trim();
    const rawCar = (carInput?.value || '').trim();
    const rawComment = (commentInput?.value || '').trim();
    const isArtis = (userTypeInput?.value || 'regular') === 'artis';
    const rating = Math.max(1, Math.min(5, parseInt(ratingInput?.value || '5')));
    const avatarVal = (avatarInput?.value || '').trim();

    const charCountEl = document.getElementById('adminRevCommentCount');
    if (charCountEl) {
        charCountEl.textContent = `${(commentInput?.value || '').length} karakter`;
    }

    const cardEl = document.getElementById('adminRevLiveCard');
    const crownEl = document.getElementById('adminRevLiveCrown');
    const modeBadgeEl = document.getElementById('adminRevLiveModeBadge');
    const avatarEl = document.getElementById('adminRevLiveAvatar');
    const liveNameEl = document.getElementById('adminRevLiveName');
    const liveStarsEl = document.getElementById('adminRevLiveStars');
    const liveCommentEl = document.getElementById('adminRevLiveComment');
    const liveCarEl = document.getElementById('adminRevLiveCar');
    const liveActionEl = document.getElementById('adminRevLiveAction');
    const liveMediaBadgeEl = document.getElementById('adminRevLiveMediaBadge');

    if (cardEl) cardEl.classList.toggle('is-vip', isArtis);
    if (crownEl) crownEl.classList.toggle('hidden', !isArtis);

    if (modeBadgeEl) {
        modeBadgeEl.className = isArtis ? 'rev-vip-pill' : 'rev-reg-pill';
        modeBadgeEl.innerHTML = isArtis
            ? '<i class="fa-solid fa-crown" style="font-size:0.58rem;"></i>VIP / Artis'
            : 'Reguler';
    }

    if (avatarEl) {
        const displayName = rawName || 'P';
        avatarEl.src = avatarVal || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=${isArtis ? '16a34a' : '64748b'}&color=fff&bold=true`;
    }
    if (liveNameEl) liveNameEl.textContent = rawName || 'Nama Pelanggan';
    if (liveCommentEl) {
        liveCommentEl.textContent = rawComment || 'Ulasan pelanggan akan tampil di sini secara langsung saat Anda mengetik...';
        liveCommentEl.style.color = rawComment ? '#334155' : '#94a3b8';
    }

    if (liveStarsEl) {
        liveStarsEl.innerHTML = Array.from({ length: 5 }, (_, i) =>
            `<svg style="width:1rem;height:1rem;fill:${i < rating ? '#22c55e' : '#e2e8f0'};" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
        ).join('');
    }

    if (liveCarEl) {
        liveCarEl.style.color = isArtis ? '#16a34a' : '#64748b';
        const span = liveCarEl.querySelector('span');
        if (span) span.textContent = rawCar || 'Unit Armada';
    }

    if (liveActionEl) {
        liveActionEl.style.color = isArtis ? '#16a34a' : '#0f172a';
    }

    if (liveMediaBadgeEl) {
        const count = (adminState.editingReviewStories || []).length;
        if (count > 0) {
            liveMediaBadgeEl.style.display = 'inline-block';
            liveMediaBadgeEl.textContent = `▶ ${count}`;
            liveMediaBadgeEl.style.background = isArtis ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' : '#f1f5f9';
            liveMediaBadgeEl.style.color = isArtis ? '#ffffff' : '#475569';
        } else {
            liveMediaBadgeEl.style.display = 'none';
        }
    }
}

// Filter Status Review Admin
function setAdminReviewFilter(status, btnEl) {
    adminState.reviewsFilter = status;

    document.querySelectorAll('.review-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (btnEl) {
        btnEl.classList.add('active');
    }

    renderReviewsTable();
}

// Verifikasi & Approve Review
async function approveReview(reviewId) {
    const rev = adminState.reviews.find(r => r.id == reviewId);
    if (!rev) return;

    rev.status = 'approved';

    try {
        await fetch(`/api/reviews/${reviewId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ status: 'approved' })
        });
    } catch (e) {}

    saveReviewsData();
    renderReviewsTable();
    if (typeof showAdminToast === 'function') {
        showAdminToast('Ulasan Disetujui', `Ulasan dari "${rev.name}" kini tampil di halaman utama.`, 'success');
    }
}

// Tolak / Sembunyikan Review
async function rejectReview(reviewId) {
    const rev = adminState.reviews.find(r => r.id == reviewId);
    if (!rev) return;

    rev.status = 'rejected';

    try {
        await fetch(`/api/reviews/${reviewId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ status: 'rejected' })
        });
    } catch (e) {}

    saveReviewsData();
    renderReviewsTable();
}

// Hapus Review
async function deleteReview(reviewId) {
    const rev = adminState.reviews.find(r => r.id == reviewId);
    if (!rev) return;

    if (confirm(`Apakah Anda yakin ingin menghapus ulasan dari "${rev.name}"?`)) {
        adminState.reviews = adminState.reviews.filter(r => r.id != reviewId);

        try {
            await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
        } catch (e) {}

        saveReviewsData();
        renderReviewsTable();
    }
}

// Modal Admin Manual Add Review
function openAdminAddReviewModal() {
    const modal = document.getElementById('adminReviewModal');
    if (modal) modal.classList.remove('hidden');
    const form = document.getElementById('adminReviewForm');
    if (form) form.reset();

    const titleEl = document.getElementById('adminReviewModalTitle');
    if (titleEl) titleEl.textContent = 'Tambah Review Pelanggan';

    const subtitleEl = document.getElementById('adminReviewModalSubtitle');
    if (subtitleEl) subtitleEl.textContent = 'Buat ulasan & galeri story pelanggan secara manual';

    const submitBtn = document.getElementById('adminRevSubmitBtn');
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Simpan &amp; Publikasikan</span>';

    const idEl = document.getElementById('adminRevId');
    if (idEl) idEl.value = '';

    setAdminReviewRating(5);
    setAdminReviewUserType('regular');

    removeAdminRevAvatar();

    adminState.editingReviewStories = [];
    const mediaFileInput = document.getElementById('adminRevMediaFile');
    if (mediaFileInput) mediaFileInput.value = '';
    renderAdminRevMediaGrid();
    updateAdminReviewLivePreview();
}

// Modal Admin Edit Review
function openAdminEditReviewModal(reviewId) {
    const rev = adminState.reviews.find(r => r.id == reviewId);
    if (!rev) return;

    const modal = document.getElementById('adminReviewModal');
    if (modal) modal.classList.remove('hidden');

    const titleEl = document.getElementById('adminReviewModalTitle');
    if (titleEl) titleEl.textContent = 'Edit Review Pelanggan';

    const subtitleEl = document.getElementById('adminReviewModalSubtitle');
    if (subtitleEl) subtitleEl.textContent = `Perbarui ulasan, kategori, dan media story milik ${rev.name || 'pelanggan'}`;

    const submitBtn = document.getElementById('adminRevSubmitBtn');
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Perbarui Ulasan</span>';

    document.getElementById('adminRevId').value = rev.id;
    document.getElementById('adminRevName').value = rev.name || '';
    document.getElementById('adminRevCar').value = rev.car_name || '';
    document.getElementById('adminRevComment').value = rev.comment || '';
    document.getElementById('adminRevAvatar').value = rev.avatar || '';

    setAdminReviewRating(rev.rating || 5);
    setAdminReviewUserType(isArtistReviewAdmin(rev) ? 'artis' : 'regular');

    const fileInput = document.getElementById('adminRevAvatarFile');
    if (fileInput) fileInput.value = '';

    const placeholder = document.getElementById('adminRevAvatarPlaceholder');
    const previewBox = document.getElementById('adminRevAvatarPreviewBox');
    const previewImg = document.getElementById('adminRevAvatarPreview');
    const statusTitle = document.getElementById('adminRevAvatarStatusTitle');
    const removeBtn = document.getElementById('adminRevAvatarRemoveBtn');

    if (rev.avatar) {
        if (previewImg) previewImg.src = rev.avatar;
        if (previewBox) previewBox.style.display = 'flex';
        if (placeholder) placeholder.style.display = 'none';
        if (statusTitle) statusTitle.textContent = 'Foto profil terpasang';
        if (removeBtn) removeBtn.style.display = 'inline-flex';
    } else {
        if (previewBox) previewBox.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
        if (statusTitle) statusTitle.textContent = 'Belum ada foto profil';
        if (removeBtn) removeBtn.style.display = 'none';
    }

    adminState.editingReviewStories = getAdminReviewStories(rev);
    const mediaFileInput = document.getElementById('adminRevMediaFile');
    if (mediaFileInput) mediaFileInput.value = '';
    renderAdminRevMediaGrid();
    updateAdminReviewLivePreview();
}

// Multi-Media Story Upload Handler (Banyak Foto / Video)
async function handleAdminRevMediaFile(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
        const isVideo = file.type.startsWith('video/');
        const maxSize = isVideo ? 50 * 1024 * 1024 : 15 * 1024 * 1024;
        if (file.size > maxSize) {
            alert(`File "${file.name}" terlalu besar. Maksimal ${isVideo ? '50MB untuk video' : '15MB untuk foto'}.`);
            continue;
        }

        const itemId = `adm_media_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

        if (isVideo) {
            const objectUrl = URL.createObjectURL(file);
            adminState.editingReviewStories.push({
                id: itemId,
                url: objectUrl,
                type: 'video',
                file: file
            });
        } else {
            const compressed = await compressAdminImageToBase64(file, 1080, 0.84);
            adminState.editingReviewStories.push({
                id: itemId,
                url: compressed,
                type: 'image',
                file: null
            });
        }
    }

    e.target.value = '';
    renderAdminRevMediaGrid();
}

function removeAdminRevMediaItem(itemId) {
    const target = adminState.editingReviewStories.find(item => item.id === itemId);
    if (target && target.type === 'video' && target.url && target.url.startsWith('blob:')) {
        URL.revokeObjectURL(target.url);
    }
    adminState.editingReviewStories = adminState.editingReviewStories.filter(item => item.id !== itemId);
    renderAdminRevMediaGrid();
}

function removeAdminRevMedia() {
    adminState.editingReviewStories.forEach(item => {
        if (item.type === 'video' && item.url && item.url.startsWith('blob:')) {
            URL.revokeObjectURL(item.url);
        }
    });
    adminState.editingReviewStories = [];
    const mediaFileInput = document.getElementById('adminRevMediaFile');
    if (mediaFileInput) mediaFileInput.value = '';
    renderAdminRevMediaGrid();
}

function renderAdminRevMediaGrid() {
    const previewBox = document.getElementById('adminRevMediaPreviewBox');
    const grid = document.getElementById('adminRevMediaPreviewGrid');
    const countBadge = document.getElementById('adminRevMediaCountBadge');
    const count = adminState.editingReviewStories.length;

    if (countBadge) {
        countBadge.textContent = `${count} Media`;
        countBadge.style.background = count > 0 ? '#ecfdf5' : '#e2e8f0';
        countBadge.style.color = count > 0 ? '#15803d' : '#475569';
    }

    updateAdminReviewLivePreview();

    if (!previewBox || !grid) return;

    if (count === 0) {
        previewBox.style.display = 'none';
        grid.innerHTML = '';
        return;
    }

    previewBox.style.display = 'flex';
    grid.innerHTML = adminState.editingReviewStories.map(item => `
        <div class="rev-media-tile">
            ${item.type === 'video'
                ? `<video src="${item.url}" muted playsinline style="width:100%; height:100%; object-fit:cover;"></video>
                   <span style="position:absolute; bottom:4px; left:4px; font-size:0.6rem; font-weight:700; background:rgba(15,23,42,0.78); color:#fff; padding:1px 5px; border-radius:4px;">Video</span>`
                : `<img src="${item.url}" alt="Story" style="width:100%; height:100%; object-fit:cover;" />
                   <span style="position:absolute; bottom:4px; left:4px; font-size:0.6rem; font-weight:700; background:rgba(15,23,42,0.78); color:#fff; padding:1px 5px; border-radius:4px;">Foto</span>`
            }
            <button type="button" onclick="removeAdminRevMediaItem('${item.id}')" class="rev-media-tile-remove" title="Hapus media ini">✕</button>
        </div>
    `).join('');
}

function handleAdminRevMediaDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const zone = document.getElementById('adminRevMediaDropZone');
    if (zone) zone.classList.add('is-dragover');
}

function handleAdminRevMediaDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const zone = document.getElementById('adminRevMediaDropZone');
    if (zone) zone.classList.remove('is-dragover');
}

function handleAdminRevMediaDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    handleAdminRevMediaDragLeave(e);
    const files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length > 0) {
        handleAdminRevMediaFile({ target: { files, value: '' } });
    }
}

function closeAdminAddReviewModal() {
    const modal = document.getElementById('adminReviewModal');
    if (modal) modal.classList.add('hidden');
}

// Upload & Drag-Drop Foto / Avatar Pelanggan Handler
function processAdminRevAvatarFile(file) {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran foto terlalu besar. Maksimal 5MB.");
        return;
    }

    compressAdminImageToBase64(file, 400, 0.85).then((base64) => {
        const avatarInput = document.getElementById('adminRevAvatar');
        if (avatarInput) avatarInput.value = base64;

        const placeholder = document.getElementById('adminRevAvatarPlaceholder');
        const previewBox = document.getElementById('adminRevAvatarPreviewBox');
        const previewImg = document.getElementById('adminRevAvatarPreview');
        const statusTitle = document.getElementById('adminRevAvatarStatusTitle');
        const removeBtn = document.getElementById('adminRevAvatarRemoveBtn');

        if (previewImg) previewImg.src = base64;
        if (previewBox) previewBox.style.display = 'flex';
        if (placeholder) placeholder.style.display = 'none';
        if (statusTitle) statusTitle.textContent = file.name || 'Foto profil terpasang';
        if (removeBtn) removeBtn.style.display = 'inline-flex';

        updateAdminReviewLivePreview();
    });
}

function handleAdminRevAvatarFile(e) {
    const file = e.target.files[0];
    if (file) processAdminRevAvatarFile(file);
}

function handleAdminRevAvatarDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const zone = document.getElementById('adminRevAvatarDropZone');
    if (zone) zone.classList.add('is-dragover');
}

function handleAdminRevAvatarDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const zone = document.getElementById('adminRevAvatarDropZone');
    if (zone) zone.classList.remove('is-dragover');
}

function handleAdminRevAvatarDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    handleAdminRevAvatarDragLeave(e);
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        const fileInput = document.getElementById('adminRevAvatarFile');
        if (fileInput) {
            fileInput.files = e.dataTransfer.files;
        }
        processAdminRevAvatarFile(file);
    }
}

function removeAdminRevAvatar() {
    const avatarInput = document.getElementById('adminRevAvatar');
    if (avatarInput) avatarInput.value = '';

    const fileInput = document.getElementById('adminRevAvatarFile');
    if (fileInput) fileInput.value = '';

    const placeholder = document.getElementById('adminRevAvatarPlaceholder');
    const previewBox = document.getElementById('adminRevAvatarPreviewBox');
    const statusTitle = document.getElementById('adminRevAvatarStatusTitle');
    const removeBtn = document.getElementById('adminRevAvatarRemoveBtn');

    if (previewBox) previewBox.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
    if (statusTitle) statusTitle.textContent = 'Belum ada foto profil';
    if (removeBtn) removeBtn.style.display = 'none';

    updateAdminReviewLivePreview();
}

async function handleAdminAddReviewSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('adminRevId').value;
    const name = document.getElementById('adminRevName').value.trim();
    const userType = document.getElementById('adminRevUserType') ? document.getElementById('adminRevUserType').value : 'regular';
    const rating = parseInt(document.getElementById('adminRevRating').value) || 5;
    const carName = document.getElementById('adminRevCar').value.trim();
    const comment = document.getElementById('adminRevComment').value.trim();
    const avatarVal = document.getElementById('adminRevAvatar').value.trim();
    const fileInput = document.getElementById('adminRevAvatarFile');

    if (!name || !comment) {
        alert("Nama dan ulasan wajib diisi.");
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('user_type', userType);
    formData.append('rating', rating);
    formData.append('car_name', carName);
    formData.append('comment', comment);

    if (avatarVal && avatarVal.startsWith('data:image')) {
        formData.append('avatar', avatarVal);
    } else if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append('avatar_file', fileInput.files[0]);
    } else if (avatarVal) {
        formData.append('avatar', avatarVal);
    } else if (!id) {
        formData.append('avatar', `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${userType === 'artis' ? '16a34a' : '64748b'}&color=fff&bold=true`);
    }

    const inlineStories = [];
    adminState.editingReviewStories.forEach(item => {
        if (item.file) {
            formData.append('story_files[]', item.file);
        } else if (item.url) {
            inlineStories.push({ url: item.url, type: item.type });
        }
    });
    formData.append('stories', JSON.stringify(inlineStories));

    const submitBtn = document.getElementById('adminRevSubmitBtn');
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Menyimpan...</span>';
    }

    let savedRev = null;

    try {
        let apiUrl = '/api/reviews';
        if (id) {
            apiUrl = `/api/reviews/${id}`;
            formData.append('_method', 'PUT');
        } else {
            formData.append('status', 'approved');
        }

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            if (data.data) {
                savedRev = data.data;
            }
        } else {
            const errData = await res.json().catch(() => ({}));
            alert(errData.message || 'Gagal menyimpan ulasan.');
        }
    } catch (err) {
        console.error("Error submitting review:", err);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
        }
    }

    if (id) {
        const idx = adminState.reviews.findIndex(r => r.id == id);
        if (idx !== -1) {
            if (savedRev) {
                adminState.reviews[idx] = savedRev;
            } else {
                adminState.reviews[idx] = {
                    ...adminState.reviews[idx],
                    name,
                    user_type: userType,
                    rating,
                    car_name: carName,
                    comment,
                    avatar: avatarVal || adminState.reviews[idx].avatar,
                    stories: inlineStories,
                    media: inlineStories[0]?.url || null,
                    media_type: inlineStories[0]?.type || null
                };
            }
        }
        if (typeof showAdminToast === 'function') {
            showAdminToast('Ulasan Diperbarui', `Ulasan milik "${name}" berhasil diperbarui.`, 'success');
        }
    } else {
        if (!savedRev) {
            savedRev = {
                id: Date.now(),
                name,
                user_type: userType,
                rating,
                car_name: carName,
                comment,
                status: 'approved',
                avatar: avatarVal || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${userType === 'artis' ? '16a34a' : '64748b'}&color=fff&bold=true`,
                stories: inlineStories,
                media: inlineStories[0]?.url || null,
                media_type: inlineStories[0]?.type || null,
                created_at: new Date().toISOString()
            };
        }
        adminState.reviews.unshift(savedRev);
        if (typeof showAdminToast === 'function') {
            showAdminToast('Ulasan Dipublikasikan', `Ulasan baru dari "${name}" berhasil ditambahkan.`, 'success');
        }
    }

    saveReviewsData();
    closeAdminAddReviewModal();
    renderReviewsTable();
}

// Render Tab Pricing Comparison
function renderPricingComparison() {
    const tbody = document.getElementById('pricingComparisonTable');
    const grid = document.getElementById('pricingComparisonGrid');

    if (tbody) {
        if (!adminState.cars || adminState.cars.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="padding: 2rem; text-align: center; color: var(--clr-text-muted);">
                        Belum ada unit mobil di database.
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = adminState.cars.map(car => {
                const diff = (car.priceHoliday || 0) - (car.priceNormal || 0);
                const diffFormatted = diff > 0 ? `+${formatRupiah(diff)}` : (diff < 0 ? formatRupiah(diff) : 'Rp 0');
                const carImg = car.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=150&q=80';
                return `
                    <tr style="border-bottom: 1px solid var(--clr-border);">
                        <td style="padding: 0.85rem 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <img src="${carImg}" alt="${car.model}" style="width: 2.5rem; height: 2rem; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--clr-border);">
                                <div>
                                    <div style="font-weight: 800; font-size: 0.85rem; color: var(--clr-text-main);">${car.brand} ${car.model}</div>
                                    <div style="font-size: 0.7rem; color: var(--clr-text-subtle);">${car.category}</div>
                                </div>
                            </div>
                        </td>
                        <td style="padding: 0.85rem 1rem; font-weight: 700; color: var(--clr-text-main);">
                            ${formatRupiah(car.priceNormal)}
                        </td>
                        <td style="padding: 0.85rem 1rem; font-weight: 800; color: var(--clr-rose);">
                            ${formatRupiah(car.priceHoliday)}
                        </td>
                        <td style="padding: 0.85rem 1rem; font-weight: 700; color: ${diff > 0 ? 'var(--clr-rose)' : 'var(--clr-emerald)'}; font-size: 0.8125rem;">
                            ${diffFormatted}
                        </td>
                        <td style="padding: 0.85rem 1rem; text-align: right;">
                            <button onclick="openEditCarModal('${car.id}')" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                ✏️ Edit Tarif
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    if (grid) {
        grid.innerHTML = adminState.cars.map(car => `
            <div style="padding: 1rem; background: #ffffff; border: 1px solid var(--clr-border); border-radius: var(--radius-md); font-size: 0.8125rem;">
                <div style="font-weight: 800; font-size: 0.9rem; color: var(--clr-text-main); margin-bottom: 0.5rem;">${car.brand} ${car.model}</div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                    <span style="color: var(--clr-text-muted);">Normal:</span>
                    <span style="font-weight: 700; color: var(--clr-text-main);">${formatRupiah(car.priceNormal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--clr-text-muted);">Peak Season / Libur:</span>
                    <span style="font-weight: 800; color: var(--clr-primary);">${formatRupiah(car.priceHoliday)}</span>
                </div>
            </div>
        `).join('');
    }
}

function renderPricingTab() {
    const isHoliday = adminState.ownerConfig.isHolidayPricingActive;
    const toggleInput = document.getElementById('mainHolidayToggle') || document.getElementById('holidayToggleSwitch');
    const notesInput = document.getElementById('holidayNotesInput');
    const statusText = document.getElementById('holidayToggleStatusText');

    if (toggleInput) toggleInput.checked = isHoliday;
    if (notesInput) notesInput.value = adminState.ownerConfig.holidayNotes || 'Tarif Musim Libur & Hari Besar Nasional (Peak Season)';
    if (statusText) {
        if (isHoliday) {
            statusText.style.color = 'var(--clr-rose, #e11d48)';
            statusText.innerHTML = '🏖️ <b>AKTIF</b> — Pelanggan melihat & memesan dengan Tarif Musim Liburan (Peak Season)';
        } else {
            statusText.style.color = 'var(--clr-text-muted, #64748b)';
            statusText.innerHTML = '🌱 <b>NONAKTIF</b> — Pelanggan melihat & memesan dengan Tarif Normal';
        }
    }

    renderPricingComparison();
}

// Toggle Switch Mode Libur
async function toggleHolidayMode(e) {
    const isActive = e ? e.target.checked : !adminState.ownerConfig.isHolidayPricingActive;
    adminState.ownerConfig.isHolidayPricingActive = isActive;
    saveConfigData();
    renderTopStatus();
    renderPricingTab();

    // API Call Database Update
    try {
        await fetch('/api/owner-config', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ is_holiday_pricing_active: isActive })
        });
    } catch (err) {
        console.error("Gagal update mode libur ke API:", err);
    }
}

function handleHolidayToggle(e) {
    toggleHolidayMode(e);
}

// Simpan Catatan Peak Season
async function saveHolidayNotes(e) {
    if (e && e.preventDefault) e.preventDefault();
    const notesInput = document.getElementById('holidayNotesInput');
    const notes = notesInput ? notesInput.value.trim() : '';

    adminState.ownerConfig.holidayNotes = notes;
    saveConfigData();

    // API Call Database Update
    try {
        await fetch('/api/owner-config', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ holiday_notes: notes })
        });
    } catch (err) {
        console.error("Gagal simpan catatan libur ke API:", err);
    }

    renderTopStatus();
    renderPricingTab();
    showAdminToast('Tarif Libur Disimpan', 'Catatan tarif libur berhasil disimpan ke database.', 'success');
}

// Render Form Kontak Owner
function renderContactForm() {
    const cfg = adminState.ownerConfig || {};
    const sm = cfg.socialMedia || {};

    const businessInput = document.getElementById('ownerBusinessName');
    const waInput = document.getElementById('ownerWhatsapp') || document.getElementById('ownerWaInput');
    const phoneInput = document.getElementById('ownerPhone') || document.getElementById('ownerPhoneInput');
    const emailInput = document.getElementById('ownerEmail') || document.getElementById('ownerEmailInput');
    const addressInput = document.getElementById('ownerAddress') || document.getElementById('ownerAddressInput');
    const mapsInput = document.getElementById('ownerMapsUrl');
    const hoursInput = document.getElementById('ownerHours');
    const igInput = document.getElementById('ownerIg');
    const fbInput = document.getElementById('ownerFb');
    const tiktokInput = document.getElementById('ownerTiktok');
    const bankNameInput = document.getElementById('ownerBankName');
    const bankNumberInput = document.getElementById('ownerBankNumber');
    const bankHolderInput = document.getElementById('ownerBankHolder');
    const qrisImageHidden = document.getElementById('ownerQrisImage');
    const qrisPreviewBox = document.getElementById('ownerQrisPreviewBox');
    const qrisPreviewImg = document.getElementById('ownerQrisPreviewImg');

    if (businessInput) businessInput.value = cfg.businessName || 'Rent Car Makassar';
    if (waInput) waInput.value = cfg.whatsappNumber || '6281234567890';
    if (phoneInput) phoneInput.value = cfg.phone || '0812-3456-7890';
    if (emailInput) emailInput.value = cfg.email || 'kontak@rentcarmakassar.com';
    if (addressInput) addressInput.value = cfg.address || 'Jl. Perintis Kemerdekaan No. 10, Makassar, Sulawesi Selatan';
    if (mapsInput) mapsInput.value = cfg.mapsUrl || cfg.maps_url || 'https://maps.google.com/?q=Jl.+Perintis+Kemerdekaan+No.+10,+Makassar,+Sulawesi+Selatan';
    if (hoursInput) hoursInput.value = cfg.operatingHours || 'Buka 24 Jam Setiap Hari';
    if (igInput) igInput.value = sm.instagram || cfg.instagram || '@rentcarmakassar_id';
    if (fbInput) fbInput.value = sm.facebook || cfg.facebook || 'Rent Car Makassar Official';
    if (tiktokInput) tiktokInput.value = sm.tiktok || cfg.tiktok || '@rentcarmakassar';
    if (bankNameInput) bankNameInput.value = cfg.bankName || 'BCA';
    if (bankNumberInput) bankNumberInput.value = cfg.bankAccountNumber || '7890123456';
    if (bankHolderInput) bankHolderInput.value = cfg.bankAccountHolder || 'RPM Rent Car Makassar';
    if (qrisImageHidden) qrisImageHidden.value = cfg.qrisImage || '';
    if (qrisPreviewBox && qrisPreviewImg) {
        if (cfg.qrisImage && cfg.qrisImage.length > 20) {
            qrisPreviewImg.src = cfg.qrisImage;
            qrisPreviewBox.classList.remove('hidden');
        } else {
            qrisPreviewImg.src = '';
            qrisPreviewBox.classList.add('hidden');
        }
    }
}

// Upload Gambar Barcode QRIS di Tab Kontak Admin
function handleOwnerQrisUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran gambar QRIS maksimal 10MB.');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const rawBase64 = e.target.result;
        const tempImg = new Image();
        tempImg.onload = function() {
            const canvas = document.createElement('canvas');
            let width = tempImg.width;
            let height = tempImg.height;
            const maxDim = 1000;
            if (width > maxDim || height > maxDim) {
                if (width > height) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                } else {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(tempImg, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.88);

            const qrisHidden = document.getElementById('ownerQrisImage');
            const qrisPreviewBox = document.getElementById('ownerQrisPreviewBox');
            const qrisPreviewImg = document.getElementById('ownerQrisPreviewImg');

            if (qrisHidden) qrisHidden.value = compressed;
            if (qrisPreviewImg) qrisPreviewImg.src = compressed;
            if (qrisPreviewBox) qrisPreviewBox.classList.remove('hidden');
        };
        tempImg.src = rawBase64;
    };
    reader.readAsDataURL(file);
}

function removeOwnerQrisImage() {
    const qrisHidden = document.getElementById('ownerQrisImage');
    const qrisFile = document.getElementById('ownerQrisFile');
    const qrisPreviewBox = document.getElementById('ownerQrisPreviewBox');
    const qrisPreviewImg = document.getElementById('ownerQrisPreviewImg');

    if (qrisHidden) qrisHidden.value = '';
    if (qrisFile) qrisFile.value = '';
    if (qrisPreviewImg) qrisPreviewImg.src = '';
    if (qrisPreviewBox) qrisPreviewBox.classList.add('hidden');
}

// Simpan Kontak Owner, Rekening Bank, QRIS & WhatsApp
async function saveContactSettings(e) {
    if (e && e.preventDefault) e.preventDefault();

    const businessName = document.getElementById('ownerBusinessName')?.value.trim() || 'Rent Car Makassar';
    const wa = (document.getElementById('ownerWhatsapp') || document.getElementById('ownerWaInput'))?.value.trim().replace(/[^0-9]/g, '') || '6281234567890';
    const phone = (document.getElementById('ownerPhone') || document.getElementById('ownerPhoneInput'))?.value.trim() || '';
    const email = (document.getElementById('ownerEmail') || document.getElementById('ownerEmailInput'))?.value.trim() || '';
    const address = (document.getElementById('ownerAddress') || document.getElementById('ownerAddressInput'))?.value.trim() || '';
    const mapsUrl = document.getElementById('ownerMapsUrl')?.value.trim() || '';
    const operatingHours = document.getElementById('ownerHours')?.value.trim() || 'Buka 24 Jam Every Day';
    const instagram = document.getElementById('ownerIg')?.value.trim() || '';
    const facebook = document.getElementById('ownerFb')?.value.trim() || '';
    const tiktok = document.getElementById('ownerTiktok')?.value.trim() || '';
    const bankName = document.getElementById('ownerBankName')?.value.trim() || 'BCA';
    const bankAccountNumber = document.getElementById('ownerBankNumber')?.value.trim() || '7890123456';
    const bankAccountHolder = document.getElementById('ownerBankHolder')?.value.trim() || businessName;
    const qrisImage = document.getElementById('ownerQrisImage')?.value || '';

    adminState.ownerConfig = {
        ...adminState.ownerConfig,
        businessName,
        whatsappNumber: wa,
        phone,
        email,
        address,
        mapsUrl,
        operatingHours,
        socialMedia: { instagram, facebook, tiktok },
        bankName,
        bankAccountNumber,
        bankAccountHolder,
        qrisImage
    };

    saveConfigData();

    // Database Sync via API
    try {
        await fetch('/api/owner-config', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                business_name: businessName,
                whatsapp_number: wa,
                phone: phone,
                email: email,
                address: address,
                maps_url: mapsUrl,
                operating_hours: operatingHours,
                instagram: instagram,
                facebook: facebook,
                tiktok: tiktok,
                bank_name: bankName,
                bank_account_number: bankAccountNumber,
                bank_account_holder: bankAccountHolder,
                qris_image: qrisImage || null
            })
        });
    } catch (err) {
        console.error("Gagal simpan kontak ke API:", err);
    }

    renderOverviewMetrics();
    renderContactForm();
    showAdminToast('Pengaturan Disimpan', 'Kontak, Rekening Bank & QRIS berhasil diperbarui.', 'success');
}

function handleSaveContact(e) {
    saveContactSettings(e);
}

function previewCarImageUrl(url) {
    const imgPrev = document.getElementById('carImagePreview');
    const box = document.getElementById('carImagePreviewBox');
    if (imgPrev && box) {
        if (url && url.trim() !== '') {
            imgPrev.src = url;
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    }
}

// Upload Foto Mobil Handler (Click File Picker or Drag & Drop)
function processCarImageFile(file) {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran foto terlalu besar. Maksimal 10MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (evt) {
        const base64 = evt.target.result;
        const carImgInput = document.getElementById('carImage');
        if (carImgInput) carImgInput.value = base64;
        previewCarImageUrl(base64);
    };
    reader.readAsDataURL(file);
}

function handleCarImageFileUpload(e) {
    const file = e.target.files[0];
    if (file) processCarImageFile(file);
}

function handleCarImageDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const zone = document.getElementById('carImageDropZone');
    if (zone) {
        zone.style.borderColor = 'var(--clr-primary, #ef4444)';
        zone.style.background = '#fef2f2';
    }
}

function handleCarImageDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const zone = document.getElementById('carImageDropZone');
    if (zone) {
        zone.style.borderColor = 'var(--clr-border, #cbd5e1)';
        zone.style.background = '#f8fafc';
    }
}

function handleCarImageDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    handleCarImageDragLeave(e);
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        const fileInput = document.getElementById('carImageFile');
        if (fileInput) {
            fileInput.files = e.dataTransfer.files;
        }
        processCarImageFile(file);
    }
}

// Modal Tambah / Edit Mobil
function openAddCarModal() {
    const modal = document.getElementById('carModal');
    if (modal) modal.classList.remove('hidden');
    document.getElementById('carModalTitle').textContent = 'Tambah Unit Mobil Baru';
    document.getElementById('carIdInput').value = '';
    document.getElementById('carForm').reset();
    document.getElementById('carStatus').value = 'ready';
    document.getElementById('carImage').value = '';
    const fileInput = document.getElementById('carImageFile');
    if (fileInput) fileInput.value = '';
    previewCarImageUrl('');
}

function openEditCarModal(carId) {
    const car = adminState.cars.find(c => c.id === carId);
    if (!car) return;

    const modal = document.getElementById('carModal');
    if (modal) modal.classList.remove('hidden');
    document.getElementById('carModalTitle').textContent = `Edit Unit: ${car.brand} ${car.model}`;
    document.getElementById('carIdInput').value = car.id;
    document.getElementById('carBrand').value = car.brand;
    document.getElementById('carModel').value = car.model;
    document.getElementById('carYear').value = car.year || '2023';
    document.getElementById('carCategory').value = car.category;
    document.getElementById('carStatus').value = car.status;
    document.getElementById('carSeats').value = car.seats;
    document.getElementById('carTrans').value = car.transmission;
    document.getElementById('carFuel').value = car.fuel;
    document.getElementById('carPriceNormal').value = car.priceNormal;
    document.getElementById('carPriceHoliday').value = car.priceHoliday;
    document.getElementById('carDriverFee').value = car.driverFee || 150000;
    document.getElementById('carImage').value = car.image || '';
    document.getElementById('carDesc').value = car.description || '';
    const fileInput = document.getElementById('carImageFile');
    if (fileInput) fileInput.value = '';
    previewCarImageUrl(car.image || '');
}

function closeCarModal() {
    const modal = document.getElementById('carModal');
    if (modal) modal.classList.add('hidden');
}

// Simpan Data Mobil ke Database API & LocalState
async function handleSaveCar(e) {
    e.preventDefault();

    const id = document.getElementById('carIdInput').value;
    const fileInput = document.getElementById('carImageFile');
    const imageVal = document.getElementById('carImage').value.trim();

    const brand = document.getElementById('carBrand').value.trim();
    const model = document.getElementById('carModel').value.trim();
    const year = document.getElementById('carYear').value.trim();
    const category = document.getElementById('carCategory').value;
    const status = document.getElementById('carStatus').value;
    const seats = parseInt(document.getElementById('carSeats').value) || 7;
    const transmission = document.getElementById('carTrans').value;
    const fuel = document.getElementById('carFuel').value;
    const priceNormal = parseFloat(document.getElementById('carPriceNormal').value) || 0;
    const priceHoliday = parseFloat(document.getElementById('carPriceHoliday').value) || 0;
    const driverFee = parseFloat(document.getElementById('carDriverFee').value) || 150000;
    const description = document.getElementById('carDesc').value.trim();

    // Construct FormData for multipart API call
    const formData = new FormData();
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('year', year);
    formData.append('category', category);
    formData.append('status', status);
    formData.append('seats', seats);
    formData.append('transmission', transmission);
    formData.append('fuel', fuel);
    formData.append('price_normal', priceNormal);
    formData.append('price_holiday', priceHoliday);
    formData.append('driver_fee', driverFee);
    formData.append('description', description);

    if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append('image_file', fileInput.files[0]);
    } else if (imageVal) {
        formData.append('image', imageVal);
    }

    let savedCar = null;

    try {
        let apiUrl = '/api/cars';
        if (id) {
            apiUrl = `/api/cars/${id}`;
            formData.append('_method', 'PUT'); // Method spoofing for Laravel file uploads
        }

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        });

        if (res.ok) {
            const result = await res.json();
            if (result.data) {
                const c = result.data;
                savedCar = {
                    id: c.id.toString(),
                    carCode: c.car_code,
                    brand: c.brand,
                    model: c.model,
                    year: c.year,
                    category: c.category,
                    seats: c.seats,
                    transmission: c.transmission,
                    fuel: c.fuel,
                    luggage: c.luggage,
                    priceNormal: parseFloat(c.price_normal),
                    priceHoliday: parseFloat(c.price_holiday),
                    driverFee: parseFloat(c.driver_fee || 150000),
                    status: c.status,
                    image: c.image || '',
                    description: c.description
                };
            }
        }
    } catch (err) {
        console.error("API error while saving car:", err);
    }

    if (!savedCar) {
        savedCar = {
            id: id || ('car-' + Date.now()),
            brand, model, year, category, status, seats, transmission, fuel,
            priceNormal, priceHoliday, driverFee, description,
            image: imageVal
        };
    }

    if (id) {
        const idx = adminState.cars.findIndex(c => c.id === id);
        if (idx !== -1) adminState.cars[idx] = savedCar;
        else adminState.cars.push(savedCar);
    } else {
        adminState.cars.push(savedCar);
    }

    saveCarsData();
    closeCarModal();
    renderAllDashboard();
    alert('✅ Data unit mobil dan foto berhasil disimpan ke database!');
}

async function deleteCar(carId) {
    const car = adminState.cars.find(c => c.id === carId);
    if (!car) return;

    if (confirm(`Yakin ingin menghapus unit mobil ${car.brand} ${car.model}?`)) {
        adminState.cars = adminState.cars.filter(c => c.id !== carId);

        try {
            await fetch(`/api/cars/${carId}`, { method: 'DELETE' });
        } catch (e) {}

        saveCarsData();
        renderAllDashboard();
    }
}

function formatBookingDateRange(startDateStr, endDateStr, startTimeStr, endTimeStr) {
    if (!startDateStr || !endDateStr) return '';
    const startTime = startTimeStr || '09:00';
    const endTime = endTimeStr || '09:00';

    try {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const startParts = startDateStr.split('-');
        const endParts = endDateStr.split('-');

        if (startParts.length === 3 && endParts.length === 3) {
            const startD = parseInt(startParts[2], 10);
            const startM = months[parseInt(startParts[1], 10) - 1];
            const startY = startParts[0];

            const endD = parseInt(endParts[2], 10);
            const endM = months[parseInt(endParts[1], 10) - 1];
            const endY = endParts[0];

            return `
                <div style="font-weight: 700; color: var(--clr-text-main); font-size: 0.8125rem;">
                    ${startD} ${startM} ${startY} <span style="color: #2563eb; font-weight: 800;">(${startTime})</span>
                </div>
                <div style="font-size: 0.725rem; color: #64748b; margin-top: 0.2rem;">
                    s/d ${endD} ${endM} ${endY} <span style="color: #d97706; font-weight: 800;">(${endTime})</span>
                </div>
            `;
        }
    } catch (e) {}
    return `<div>${startDateStr} (${startTime})</div><div style="font-size: 0.725rem; color: #64748b; margin-top: 0.2rem;">s/d ${endDateStr} (${endTime})</div>`;
}

// Fetch Bookings for Admin
async function fetchAdminBookings() {
    let loadedBookings = [];

    // Reset dummy cache jika belum dikosongkan sesuai instruksi user
    if (!localStorage.getItem('rcm_empty_bookings_clean_v6')) {
        localStorage.removeItem('rcm_rent_bookings');
        localStorage.setItem('rcm_empty_bookings_clean_v6', 'true');
    }

    // 1. Try reading from LocalStorage
    const savedBookings = localStorage.getItem('rcm_rent_bookings');
    if (savedBookings) {
        try {
            loadedBookings = JSON.parse(savedBookings);
        } catch (e) {
            loadedBookings = [];
        }
    }

    // 2. Try fetching from Backend API
    try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
            const result = await res.json();
            if (result.data && Array.isArray(result.data) && result.data.length > 0) {
                const apiBookings = result.data.map(b => ({
                    id: b.id.toString(),
                    booking_code: b.booking_code,
                    car_id: b.car_id ? b.car_id.toString() : '',
                    customer_name: b.customer_name,
                    customer_phone: b.customer_phone,
                    car_name: b.car ? `${b.car.brand} ${b.car.model}` : (b.car_name || 'Toyota Avanza Veloz'),
                    start_date: b.start_date ? b.start_date.split('T')[0] : '',
                    end_date: b.end_date ? b.end_date.split('T')[0] : '',
                    start_time: b.start_time || '09:00',
                    end_time: b.end_time || '09:00',
                    driver_label: b.driver_label || (b.with_driver ? '+Supir' : 'Tanpa Supir'),
                    with_driver: Boolean(b.with_driver),
                    total_price: parseFloat(b.total_price || 0),
                    payment_type: b.payment_type || 'lunas_awal',
                    payment_method: b.payment_method || null,
                    dp_amount: parseFloat(b.dp_amount || 0),
                    status: b.status || 'pending',
                    notes: b.notes || '',
                    ktp_image: b.ktp_image || '',
                    payment_proof: b.payment_proof || '',
                    payment_proof_settlement: b.payment_proof_settlement || ''
                }));

                const apiIds = new Set(apiBookings.map(a => a.id));
                const localOnly = loadedBookings.filter(l => !apiIds.has(l.id));
                loadedBookings = [...apiBookings, ...localOnly];
            }
        }
    } catch (err) {}

    // 3. Fallback to DEFAULT_BOOKINGS if still empty
    if (!loadedBookings || loadedBookings.length === 0) {
        loadedBookings = [...DEFAULT_BOOKINGS];
    }

    adminState.bookings = loadedBookings;
    localStorage.setItem('rcm_rent_bookings', JSON.stringify(adminState.bookings));
}

function saveBookingsData() {
    localStorage.setItem('rcm_rent_bookings', JSON.stringify(adminState.bookings));
}

function updateBookingCounters() {
    const all = adminState.bookings || [];
    const activeList = all.filter(b => !isBookingExpired(b));
    const historyList = all.filter(isBookingExpired);
    const lunasVerifiedTotal = all.filter(isBookingVerified).reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

    const activeBadge = document.getElementById('sidebarActiveBookingCount');
    const sidebarHistBadge = document.getElementById('sidebarHistoryCount');
    const headerHistBadge = document.getElementById('headerHistoryCount');
    const histTotalStat = document.getElementById('historyTotalCountStat');
    const histRevStat = document.getElementById('historyVerifiedRevenueStat');

    if (activeBadge) activeBadge.textContent = activeList.length;
    if (sidebarHistBadge) sidebarHistBadge.textContent = historyList.length;
    if (headerHistBadge) headerHistBadge.textContent = historyList.length;
    if (histTotalStat) histTotalStat.textContent = `${historyList.length} Pesanan Selesai`;
    if (histRevStat) histRevStat.textContent = formatRupiah(lunasVerifiedTotal);
}

function normalizeBookingStatusKey(rawStatus) {
    const st = String(rawStatus || 'pending').toLowerCase();
    if (st === 'completed' || st === 'selesai') {
        return 'completed';
    }
    if (st === 'confirmed_pending' || st === 'verifikasi_menunggu' || st.includes('verifikasi + menunggu') || st.includes('verifikasi+menunggu')) {
        return 'confirmed_pending';
    }
    if (st === 'confirmed' || st === 'verifikasi' || st === 'terverifikasi' || st === 'dikonfirmasi') {
        return 'confirmed';
    }
    if (st === 'cancelled' || st === 'dibatalkan' || st === 'dibatalakn' || st === 'batal') {
        return 'cancelled';
    }
    return 'pending';
}

function buildBookingRowHtml(b, isHistoryRow = false) {
    const normStatus = normalizeBookingStatusKey(b.status);
    let triggerClass = 'custom-status-pending';
    let statusIcon = 'fa-clock';
    let statusLabel = 'Menunggu';

    if (normStatus === 'confirmed') {
        triggerClass = 'custom-status-confirmed';
        statusIcon = 'fa-circle-check';
        statusLabel = 'Verifikasi';
    } else if (normStatus === 'confirmed_pending') {
        triggerClass = 'custom-status-confirmed-pending';
        statusIcon = 'fa-file-circle-check';
        statusLabel = 'Verifikasi + Menunggu';
    } else if (normStatus === 'cancelled') {
        triggerClass = 'custom-status-cancelled';
        statusIcon = 'fa-circle-xmark';
        statusLabel = 'Dibatalkan';
    } else if (normStatus === 'completed') {
        triggerClass = 'custom-status-gray';
        statusIcon = 'fa-circle-check';
        statusLabel = 'Selesai';
    }

    const dateDisplay = formatBookingDateRange(b.start_date, b.end_date, b.start_time, b.end_time);
    const driverDisplay = b.driver_label || (b.with_driver ? '+Supir' : 'Tanpa Supir');
    const carDisplay = b.car_name || 'Toyota Avanza Veloz';
    const timerInfo = getBookingRentalTimerInfo(b);

    // Status Column
    let statusColHtml = '';
    if (isHistoryRow) {
        statusColHtml = `
            <div class="custom-status-trigger custom-status-gray" title="Status pesanan selesai tersimpan di riwayat">
                <span class="status-trigger-left">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Selesai</span>
                </span>
            </div>
        `;
    } else if (normStatus === 'confirmed') {
        if (timerInfo.hasPenalty && !timerInfo.isPenaltyPaid) {
            // Status terverifikasi berubah menjadi Denda
            statusColHtml = `
                <button type="button" onclick="viewBookingDocument('${b.id}', false)" class="custom-status-trigger is-locked" style="background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; cursor: pointer; width: 100%; box-shadow: 0 1px 3px rgba(220, 38, 38, 0.15);" title="Terlambat melewati 1 jam - Dikenakan Denda Rp 50.000/jam. Klik untuk mengunggah bukti pembayaran denda">
                    <span class="status-trigger-left" style="font-weight: 800;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span>Denda</span>
                    </span>
                    <i class="fa-solid fa-cloud-arrow-up" style="font-size: 0.72rem; margin-left: 0.35rem; color: #dc2626;" title="Upload Bukti Bayar Denda"></i>
                </button>
            `;
        } else if (timerInfo.hasPenalty && timerInfo.isPenaltyPaid) {
            statusColHtml = `
                <div class="custom-status-trigger custom-status-confirmed is-locked" style="width: 100%;" title="Status Terverifikasi">
                    <span class="status-trigger-left" style="font-weight: 800;">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>Verifikasi</span>
                    </span>
                    <i class="fa-solid fa-lock status-lock-icon" title="Terkunci"></i>
                </div>
            `;
        } else {
            statusColHtml = `
                <div class="custom-status-trigger custom-status-confirmed is-locked" style="width: 100%;" title="Status sudah Terverifikasi dan terkunci permanen (tidak dapat diubah)">
                    <span class="status-trigger-left">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>Verifikasi</span>
                    </span>
                    <i class="fa-solid fa-lock status-lock-icon" title="Terkunci (Sudah Terverifikasi)"></i>
                </div>
            `;
        }
    } else if (normStatus === 'confirmed_pending') {
        if (timerInfo.hasPenalty && !timerInfo.isPenaltyPaid) {
            statusColHtml = `
                <button type="button" onclick="viewBookingDocument('${b.id}', false)" class="custom-status-trigger is-locked" style="background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; cursor: pointer; width: 100%; box-shadow: 0 1px 3px rgba(220, 38, 38, 0.15);" title="Terlambat melewati 1 jam - Dikenakan Denda Rp 50.000/jam. Klik untuk mengunggah bukti pembayaran denda">
                    <span class="status-trigger-left" style="font-weight: 800;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span>Denda</span>
                    </span>
                    <i class="fa-solid fa-cloud-arrow-up" style="font-size: 0.72rem; margin-left: 0.35rem; color: #dc2626;" title="Upload Bukti Bayar Denda"></i>
                </button>
            `;
        } else {
            statusColHtml = `
                <button type="button" onclick="toggleStatusDropdownPortal(event, '${b.id}')" class="custom-status-trigger custom-status-confirmed-pending" data-status-trigger-id="${b.id}" style="width: 100%;">
                    <span class="status-trigger-left">
                        <i class="fa-solid fa-file-circle-check" style="color: #2563eb;"></i>
                        <span style="font-size: 0.73rem;">Verifikasi + Menunggu</span>
                    </span>
                    <i class="fa-solid fa-chevron-down status-trigger-chevron"></i>
                </button>
            `;
        }
    } else if (normStatus === 'cancelled') {
        statusColHtml = `
            <div class="custom-status-trigger custom-status-cancelled" style="width: 100%;">
                <span class="status-trigger-left">
                    <i class="fa-solid fa-circle-xmark"></i>
                    <span>Dibatalkan</span>
                </span>
            </div>
        `;
    } else {
        statusColHtml = `
            <button type="button" onclick="toggleStatusDropdownPortal(event, '${b.id}')" class="custom-status-trigger ${triggerClass}" data-status-trigger-id="${b.id}" style="width: 100%;">
                <span class="status-trigger-left">
                    <i class="fa-solid ${statusIcon}"></i>
                    <span>${statusLabel}</span>
                </span>
                <i class="fa-solid fa-chevron-down status-trigger-chevron"></i>
            </button>
        `;
    }

    // Aksi Column: Ditambahkan tombol Checklist (✔) untuk menyelesaikan peminjaman dan memindahkannya ke Riwayat
    let actionsHtml = '';
    if (isHistoryRow) {
        actionsHtml = `
            <div class="booking-action-group">
                <button type="button" onclick="viewBookingDocument('${b.id}', true)" class="booking-action-icon-btn btn-icon-history-doc" title="Lihat Dokumen & Bukti Bayar (Riwayat)" aria-label="Lihat Dokumen">
                    <i class="fa-solid fa-file-lines"></i>
                </button>
                <button type="button" onclick="deleteBooking('${b.id}')" class="booking-action-icon-btn btn-icon-history-delete" title="Hapus Data Riwayat" aria-label="Hapus">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    } else {
        actionsHtml = `
            <div class="booking-action-group">
                <button type="button" onclick="completeBookingRental('${b.id}')" class="booking-action-icon-btn btn-icon-complete" title="Selesaikan Peminjaman (Pindahkan ke Riwayat)" aria-label="Selesaikan Peminjaman" style="background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; font-size: 0.85rem;">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button type="button" onclick="viewBookingDocument('${b.id}', false)" class="booking-action-icon-btn btn-icon-doc" title="Dokumen KTP & Bukti Pembayaran" aria-label="Dokumen">
                    <i class="fa-solid fa-file-lines"></i>
                </button>
                <button type="button" onclick="openEditAdminBookingModal('${b.id}')" class="booking-action-icon-btn btn-icon-edit" title="Edit Data Booking" aria-label="Edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" onclick="deleteBooking('${b.id}')" class="booking-action-icon-btn btn-icon-delete" title="Hapus Data Booking" aria-label="Hapus">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    }

    const rowBg = isHistoryRow ? '#f8fafc' : '#ffffff';
    const rowHoverBg = isHistoryRow ? '#f1f5f9' : '#f8fafc';
    const rowClass = isHistoryRow ? 'is-history-row' : '';

    return `
        <tr class="${rowClass}" style="border-bottom: 1px solid #e2e8f0; background: ${rowBg}; transition: background 0.15s;" onmouseover="this.style.background='${rowHoverBg}'" onmouseout="this.style.background='${rowBg}'">
            <td style="padding: 1rem 1.25rem; font-family: monospace; font-weight: 700; color: #2563eb; white-space: nowrap;">
                <span style="background: ${isHistoryRow ? '#f1f5f9' : '#eff6ff'}; border: 1px solid ${isHistoryRow ? '#cbd5e1' : '#bfdbfe'}; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.8rem; letter-spacing: 0.05em;">
                    ${escapeHtml(b.booking_code || '-')}
                </span>
            </td>
            <td style="padding: 1rem 1.25rem;">
                <div style="font-weight: 700; color: ${isHistoryRow ? '#475569' : 'var(--clr-text-main)'}; font-size: 0.875rem;">${escapeHtml(b.customer_name)}</div>
            </td>
            <td style="padding: 1rem 1.25rem; color: ${isHistoryRow ? '#475569' : 'var(--clr-text-main)'}; font-weight: 600;">
                ${escapeHtml(carDisplay)}
            </td>
            <td style="padding: 1rem 1.25rem; white-space: nowrap; color: ${isHistoryRow ? '#64748b' : 'inherit'};">
                <div style="font-weight: 600;">${dateDisplay}</div>
            </td>
            <td style="padding: 1rem 1.25rem; color: ${isHistoryRow ? '#64748b' : '#059669'}; font-weight: 600;">
                ${escapeHtml(driverDisplay)}
            </td>
            <td style="padding: 1rem 1.25rem; font-weight: 800; color: ${isHistoryRow ? '#475569' : 'var(--clr-text-main)'}; white-space: nowrap;">
                <div>${formatRupiah(b.total_price)}</div>
                ${!isHistoryRow ? `
                    <div class="booking-total-penalty-sub" data-penalty-total-id="${b.id}" style="${timerInfo.hasPenalty ? 'display: block;' : 'display: none;'} color: #dc2626; font-size: 0.75rem; font-weight: 800; margin-top: 0.15rem; font-family: monospace;">
                        ${timerInfo.hasPenalty ? `+${formatRupiah(timerInfo.penaltyAmount)}` : ''}
                    </div>
                ` : (b.penalty_amount && parseFloat(b.penalty_amount) > 0 ? `
                    <div style="color: #dc2626; font-size: 0.7rem; font-weight: 700; margin-top: 0.15rem;">+${formatRupiah(b.penalty_amount)}</div>
                ` : '')}
            </td>
            <td style="padding: 1rem 1.25rem; white-space: nowrap;">
                ${!isHistoryRow && timerInfo.hasEnd ? `
                    <div class="booking-timer-badge" data-timer-booking-id="${b.id}" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.6rem; border-radius: 6px; font-family: monospace; font-size: 0.75rem; font-weight: 700; ${!timerInfo.isStarted ? 'background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1;' : (timerInfo.isOverdue ? 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;' : 'background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;')}">
                        <i class="${!timerInfo.isStarted ? 'fa-regular fa-clock' : 'fa-solid fa-clock'}"></i>
                        <span class="booking-timer-val" data-timer-val-id="${b.id}">${timerInfo.countdownText}</span>
                    </div>
                ` : (isHistoryRow ? `
                    <span style="display: inline-flex; align-items: center; gap: 0.3rem; background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                        <span>Selesai</span>
                    </span>
                ` : '<span style="color: #94a3b8; font-size: 0.75rem;">-</span>')}
            </td>
            <td style="padding: 1rem 1.25rem;">
                ${statusColHtml}
            </td>
            <td style="padding: 1rem 1.25rem; text-align: center;">
                ${actionsHtml}
            </td>
        </tr>
    `;
}

function renderBookingsTable() {
    updateBookingCounters();
    const tbody = document.getElementById('adminBookingsTableBody');
    if (!tbody) return;

    const searchQuery = (document.getElementById('adminBookingSearch')?.value || adminState.bookingSearchQuery || '').toLowerCase();
    const filterStatus = document.getElementById('adminBookingFilterStatus')?.value || adminState.bookingFilterStatus || 'all';

    // Hanya tampilkan booking yang MASIH AKTIF (belum diselesaikan via checklist)
    let filtered = (adminState.bookings || []).filter(b => {
        if (isBookingExpired(b)) return false;

        const matchesSearch = !searchQuery ||
            (b.customer_name && b.customer_name.toLowerCase().includes(searchQuery)) ||
            (b.customer_phone && b.customer_phone.toLowerCase().includes(searchQuery)) ||
            (b.car_name && b.car_name.toLowerCase().includes(searchQuery)) ||
            (b.booking_code && b.booking_code.toLowerCase().includes(searchQuery));

        let matchesStatus = true;
        if (filterStatus !== 'all') {
            matchesStatus = (normalizeBookingStatusKey(b.status) === filterStatus);
        }

        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="padding: 2.5rem; text-align: center; color: var(--clr-text-muted);">
                    Belum ada data booking aktif. Pesanan yang telah diselesaikan dapat dilihat di <strong>Riwayat Pemesanan</strong>.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(b => buildBookingRowHtml(b, false)).join('');
}

function renderHistoryTable() {
    updateBookingCounters();
    const tbody = document.getElementById('adminHistoryTableBody');
    if (!tbody) return;

    const searchQuery = (document.getElementById('adminHistorySearch')?.value || adminState.historySearchQuery || '').toLowerCase();
    const filterStatus = document.getElementById('adminHistoryFilterStatus')?.value || adminState.historyFilterStatus || 'all';

    // Tampilkan booking yang sudah selesai dan masuk riwayat
    let filtered = (adminState.bookings || []).filter(b => {
        if (!isBookingExpired(b)) return false;

        const matchesSearch = !searchQuery ||
            (b.customer_name && b.customer_name.toLowerCase().includes(searchQuery)) ||
            (b.customer_phone && b.customer_phone.toLowerCase().includes(searchQuery)) ||
            (b.car_name && b.car_name.toLowerCase().includes(searchQuery)) ||
            (b.booking_code && b.booking_code.toLowerCase().includes(searchQuery));

        return matchesSearch;
    });

    const footerInfo = document.getElementById('historyModalFooterInfo');
    if (footerInfo) {
        footerInfo.textContent = `Menampilkan ${filtered.length} data pemesanan`;
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="padding: 2.5rem; text-align: center; color: var(--clr-text-muted);">
                    Belum ada data pemesanan di Riwayat. Tekan tombol checklist (✔) di kolom Aksi Dashboard untuk menyelesaikan peminjaman dan memindahkannya ke sini.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(b => buildBookingRowHtml(b, true)).join('');
}

function filterBookingsTable() {
    adminState.bookingSearchQuery = document.getElementById('adminBookingSearch')?.value || '';
    adminState.bookingFilterStatus = document.getElementById('adminBookingFilterStatus')?.value || 'all';
    renderBookingsTable();
}

function filterHistoryTable() {
    adminState.historySearchQuery = document.getElementById('adminHistorySearch')?.value || '';
    adminState.historyFilterStatus = document.getElementById('adminHistoryFilterStatus')?.value || 'all';
    renderHistoryTable();
}

// Selesaikan peminjaman armada mobil dan pindahkan data ke Riwayat Pemesanan (Aksi Tombol Checklist ✔)
async function completeBookingRental(id) {
    const booking = (adminState.bookings || []).find(b => b.id == id);
    if (!booking) return;

    const timerInfo = getBookingRentalTimerInfo(booking);

    // 1. Validasi: Blokir jika pembayaran pemesanan belum terverifikasi
    const normStatus = normalizeBookingStatusKey(booking.status);
    if (normStatus === 'confirmed_pending') {
        const hasPaymentProof = Boolean(booking.payment_proof && String(booking.payment_proof).length > 20);
        if (!hasPaymentProof) {
            alert(`❌ Tidak Dapat Menyelesaikan Peminjaman!\n\nPelanggan "${booking.customer_name}" memilih skema "Bayar di Akhir" dan status masih "Verifikasi + Menunggu Pembayaran".\n\nHarap ubah status menjadi Verifikasi atau upload bukti pembayaran di menu Dokumen terlebih dahulu sebelum menyelesaikan peminjaman.`);
            return;
        }
    } else if (!isBookingVerified(booking)) {
        alert(`❌ Tidak Dapat Menyelesaikan Peminjaman!\n\nPesanan pelanggan "${booking.customer_name}" belum melakukan pembayaran atau status belum diverifikasi.\n\nHarap verifikasi pembayaran pesanan terlebih dahulu.`);
        return;
    }

    // 2. Validasi: Blokir jika skema DP belum melunasi sisa tagihan
    if (booking.payment_type === 'dp' && (!booking.payment_proof_settlement || String(booking.payment_proof_settlement).length < 20)) {
        alert(`❌ Tidak Dapat Menyelesaikan Peminjaman!\n\nPelanggan "${booking.customer_name}" memilih skema DP dan BELUM menyelesaikan bukti pembayaran Pelunasan.\n\nHarap upload bukti pelunasan di menu Dokumen terlebih dahulu.`);
        return;
    }

    // 3. Validasi: Blokir jika pemakaian melewati batas waktu dan denda belum dibayar/diverifikasi
    if (timerInfo.hasPenalty && !timerInfo.isPenaltyPaid) {
        alert(`❌ Tidak Dapat Menyelesaikan Peminjaman!\n\nPemakaian armada telah melewati batas waktu dan terdapat Denda Keterlambatan sebesar ${formatRupiah(timerInfo.penaltyAmount)} yang BELUM dibayar/diverifikasi.\n\nSilakan unggah bukti bayar denda pada menu Dokumen terlebih dahulu.`);
        return;
    }

    let confirmMsg = `Selesaikan peminjaman armada mobil untuk pelanggan "${booking.customer_name}" (Kode: ${booking.booking_code || '-'})?\n\nPeminjaman ini akan ditandai Selesai dan dipindahkan ke Riwayat Pemesanan.`;
    if (!confirm(confirmMsg)) {
        return;
    }

    booking.status = 'completed';
    if (timerInfo.hasPenalty) {
        booking.penalty_amount = timerInfo.penaltyAmount;
    }

    saveBookingsData();

    try {
        const payload = {
            status: 'completed'
        };
        if (booking.penalty_amount) {
            payload.penalty_amount = booking.penalty_amount;
        }
        await fetch(`/api/bookings/${booking.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.error('Gagal sinkronisasi status selesai ke server:', err);
    }

    renderBookingsTable();
    renderHistoryTable();
    renderOverviewMetrics();

    showAdminToast(
        'Peminjaman Selesai',
        `Peminjaman untuk ${booking.customer_name} (${booking.booking_code || ''}) telah berhasil diselesaikan & dipindahkan ke Riwayat Pemesanan!`,
        'success'
    );
}

// Update realtime countdown jam pemakaian & denda keterlambatan setiap detik
function updateBookingRealtimeTimers() {
    if (!adminState.isLoggedIn) return;
    const timerBadges = document.querySelectorAll('.booking-timer-badge[data-timer-booking-id]');
    if (!timerBadges || timerBadges.length === 0) return;

    let needsStatusReRender = false;

    timerBadges.forEach(badge => {
        const id = badge.getAttribute('data-timer-booking-id');
        const b = (adminState.bookings || []).find(item => item.id == id);
        if (!b) return;

        const timerInfo = getBookingRentalTimerInfo(b);
        const valEl = badge.querySelector('.booking-timer-val');
        if (valEl) {
            valEl.textContent = timerInfo.countdownText;
        }

        const iconEl = badge.querySelector('i');
        if (!timerInfo.isStarted) {
            badge.style.background = '#f1f5f9';
            badge.style.color = '#64748b';
            badge.style.borderColor = '#cbd5e1';
            if (iconEl) iconEl.className = 'fa-regular fa-clock';
        } else if (timerInfo.isOverdue) {
            badge.style.background = '#fef2f2';
            badge.style.color = '#dc2626';
            badge.style.borderColor = '#fecaca';
            if (iconEl) iconEl.className = 'fa-solid fa-clock';
        } else {
            badge.style.background = '#ecfdf5';
            badge.style.color = '#059669';
            badge.style.borderColor = '#a7f3d0';
            if (iconEl) iconEl.className = 'fa-solid fa-clock';
        }

        const subEl = document.querySelector(`.booking-penalty-timer-sub[data-penalty-sub-id="${id}"]`);
        if (subEl) {
            subEl.innerHTML = '';
            subEl.style.display = 'none';
        }

        const totalSubEl = document.querySelector(`.booking-total-penalty-sub[data-penalty-total-id="${id}"]`);
        if (totalSubEl) {
            if (timerInfo.hasPenalty) {
                totalSubEl.innerHTML = `+${formatRupiah(timerInfo.penaltyAmount)}`;
                totalSubEl.style.display = 'block';
            } else {
                totalSubEl.innerHTML = '';
                totalSubEl.style.display = 'none';
            }
        }

        // Cek jika status Verifikasi perlu berubah jadi Denda (atau sebaliknya jika bukti denda diunggah)
        const row = badge.closest('tr');
        if (row) {
            const statusCell = row.cells ? row.cells[7] : null;
            if (statusCell) {
                const normStatus = normalizeBookingStatusKey(b.status);
                if (normStatus === 'confirmed') {
                    const isShowingDenda = statusCell.textContent.includes('Denda');
                    const shouldShowDenda = timerInfo.hasPenalty && !timerInfo.isPenaltyPaid;
                    if (isShowingDenda !== shouldShowDenda) {
                        needsStatusReRender = true;
                    }
                }
            }
        }
    });

    if (needsStatusReRender) {
        renderBookingsTable();
    }
}

// Interval timer realtime berjalan setiap 1 detik
setInterval(updateBookingRealtimeTimers, 1000);

// =========================================================================
// CUSTOM FLOATING STATUS DROPDOWN PORTAL
// =========================================================================
let activeStatusDropdownBookingId = null;

function closeStatusDropdownPortal() {
    const portal = document.getElementById('globalStatusDropdownPortal');
    if (portal) portal.remove();
    document.querySelectorAll('.custom-status-trigger.is-open').forEach(btn => btn.classList.remove('is-open'));
    activeStatusDropdownBookingId = null;
}

function toggleStatusDropdownPortal(event, bookingId) {
    event.stopPropagation();
    const btn = event.currentTarget;

    const booking = (adminState.bookings || []).find(b => b.id == bookingId);
    const currentStatus = normalizeBookingStatusKey(booking ? booking.status : 'pending');

    // Jika sudah diverifikasi, status terkunci permanen dan tidak dapat diubah
    if (currentStatus === 'confirmed') {
        showAdminToast('Status Terkunci', 'Pesanan yang telah Terverifikasi terkunci permanen dan tidak dapat diubah lagi.', 'info');
        return;
    }

    if (activeStatusDropdownBookingId == bookingId && document.getElementById('globalStatusDropdownPortal')) {
        closeStatusDropdownPortal();
        return;
    }

    closeStatusDropdownPortal();
    activeStatusDropdownBookingId = bookingId;
    btn.classList.add('is-open');

    const portal = document.createElement('div');
    portal.id = 'globalStatusDropdownPortal';
    portal.className = 'status-dd-portal';
    portal.onclick = (e) => e.stopPropagation();

    const isBayarAkhir = (booking && booking.payment_type === 'bayar_akhir') || currentStatus === 'confirmed_pending';

    let confirmedPendingOptionHtml = '';
    if (isBayarAkhir) {
        confirmedPendingOptionHtml = `
            <button type="button" class="status-dd-item opt-confirmed-pending ${currentStatus === 'confirmed_pending' ? 'is-selected' : ''}" onclick="selectBookingStatusFromPortal('${bookingId}', 'confirmed_pending')">
                <span class="status-dd-item-left">
                    <span class="status-dd-icon"><i class="fa-solid fa-file-circle-check"></i></span>
                    <span>
                        <div class="status-dd-title">Verifikasi + Menunggu Pembayaran</div>
                        <div class="status-dd-sub">Unit diverifikasi, pelunasan saat selesai sewa</div>
                    </span>
                </span>
                <i class="fa-solid fa-check status-dd-check"></i>
            </button>
        `;
    }

    portal.innerHTML = `
        <div class="status-dd-header">Ubah Status Pesanan</div>
        <button type="button" class="status-dd-item opt-confirmed ${currentStatus === 'confirmed' ? 'is-selected' : ''}" onclick="selectBookingStatusFromPortal('${bookingId}', 'confirmed')">
            <span class="status-dd-item-left">
                <span class="status-dd-icon"><i class="fa-solid fa-circle-check"></i></span>
                <span>
                    <div class="status-dd-title">Verifikasi</div>
                    <div class="status-dd-sub">Pembayaran sah & masuk pendapatan</div>
                </span>
            </span>
            <i class="fa-solid fa-check status-dd-check"></i>
        </button>
        ${confirmedPendingOptionHtml}
        <button type="button" class="status-dd-item opt-pending ${currentStatus === 'pending' ? 'is-selected' : ''}" onclick="selectBookingStatusFromPortal('${bookingId}', 'pending')">
            <span class="status-dd-item-left">
                <span class="status-dd-icon"><i class="fa-solid fa-clock"></i></span>
                <span>
                    <div class="status-dd-title">Menunggu</div>
                    <div class="status-dd-sub">Belum masuk hitungan pendapatan</div>
                </span>
            </span>
            <i class="fa-solid fa-check status-dd-check"></i>
        </button>
        <button type="button" class="status-dd-item opt-cancelled ${currentStatus === 'cancelled' ? 'is-selected' : ''}" onclick="selectBookingStatusFromPortal('${bookingId}', 'cancelled')">
            <span class="status-dd-item-left">
                <span class="status-dd-icon"><i class="fa-solid fa-circle-xmark"></i></span>
                <span>
                    <div class="status-dd-title">Dibatalkan</div>
                    <div class="status-dd-sub">Pesanan batal & jadwal dibuka</div>
                </span>
            </span>
            <i class="fa-solid fa-check status-dd-check"></i>
        </button>
    `;

    document.body.appendChild(portal);

    // Hitung posisi akurat terhadap viewport (otomatis ke atas jika mentok bawah layar)
    const rect = btn.getBoundingClientRect();
    const portalWidth = portal.offsetWidth || 244;
    const portalHeight = portal.offsetHeight || 195;

    let topPos = rect.bottom + 6;
    if (topPos + portalHeight > window.innerHeight - 12) {
        topPos = Math.max(12, rect.top - portalHeight - 6);
    }

    let leftPos = rect.left;
    if (leftPos + portalWidth > window.innerWidth - 12) {
        leftPos = Math.max(12, window.innerWidth - portalWidth - 12);
    }

    portal.style.top = `${topPos}px`;
    portal.style.left = `${leftPos}px`;
}

async function selectBookingStatusFromPortal(bookingId, newStatus) {
    closeStatusDropdownPortal();
    await updateBookingStatus(bookingId, newStatus);
}

document.addEventListener('click', (e) => {
    closeStatusDropdownPortal();
    const docModal = document.getElementById('documentViewModal');
    if (docModal && e.target === docModal) {
        closeDocumentViewModal();
        return;
    }
    const histModal = document.getElementById('bookingHistoryModal');
    if (histModal && e.target === histModal) {
        closeBookingHistoryModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeStatusDropdownPortal();
        const docModal = document.getElementById('documentViewModal');
        if (docModal && !docModal.classList.contains('hidden')) {
            closeDocumentViewModal();
            return;
        }
        closeBookingHistoryModal();
    }
});

window.addEventListener('resize', closeStatusDropdownPortal);
window.addEventListener('scroll', closeStatusDropdownPortal, true);

async function handleBookingStatusChange(id, newStatus) {
    await updateBookingStatus(id, newStatus);
}

async function updateBookingStatus(id, newStatus) {
    const idx = adminState.bookings.findIndex(b => b.id == id);
    if (idx !== -1) {
        const currentStatusKey = normalizeBookingStatusKey(adminState.bookings[idx].status);
        if (currentStatusKey === 'confirmed') {
            showAdminToast('Status Terkunci', 'Pesanan yang telah Terverifikasi terkunci permanen dan tidak dapat diubah lagi statusnya.', 'warning');
            return;
        }

        adminState.bookings[idx].status = newStatus;
        saveBookingsData();
        renderBookingsTable();
        renderHistoryTable();
        renderOverviewMetrics();

        const statusLabels = {
            confirmed: 'Verifikasi',
            confirmed_pending: 'Verifikasi + Menunggu Pembayaran',
            pending: 'Menunggu',
            cancelled: 'Dibatalkan'
        };
        const toastType = (newStatus === 'confirmed' || newStatus === 'confirmed_pending') ? 'success' : (newStatus === 'cancelled' ? 'error' : 'warning');
        const extraMsg = newStatus === 'confirmed'
            ? 'Pembayaran terverifikasi — Pendapatan otomatis bertambah!'
            : (newStatus === 'confirmed_pending'
                ? 'Unit berhasil diverifikasi (Bayar di Akhir) — Menunggu pelunasan sewa!'
                : `Status pesanan diubah menjadi: ${statusLabels[newStatus] || newStatus}`);
        showAdminToast('Status Booking Diperbarui', extraMsg, toastType);

        try {
            await fetch(`/api/bookings/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (e) {}
    }
}

async function deleteBooking(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus data booking ini?')) return;
    adminState.bookings = adminState.bookings.filter(b => b.id != id);
    saveBookingsData();
    renderBookingsTable();
    renderHistoryTable();
    renderOverviewMetrics();
    showAdminToast('Data Booking Dihapus', 'Pesanan berhasil dihapus dari daftar.', 'error');

    try {
        await fetch(`/api/bookings/${id}`, {
            method: 'DELETE'
        });
    } catch (e) {}
}

// =========================================================================
// MODAL POPUP RIWAYAT PEMESANAN (PEMBAYARAN LUNAS) & EXCEL EXPORT
// =========================================================================
function openBookingHistoryModal() {
    closeStatusDropdownPortal();
    const modal = document.getElementById('bookingHistoryModal');
    if (modal) {
        modal.classList.remove('hidden');
        renderHistoryTable();
    }
}

function closeBookingHistoryModal() {
    closeStatusDropdownPortal();
    const modal = document.getElementById('bookingHistoryModal');
    if (modal) modal.classList.add('hidden');
}

function exportBookingHistoryExcel() {
    const searchQuery = (document.getElementById('adminHistorySearch')?.value || adminState.historySearchQuery || '').toLowerCase();
    const filterStatus = document.getElementById('adminHistoryFilterStatus')?.value || adminState.historyFilterStatus || 'lunas';

    const historyList = (adminState.bookings || []).filter(b => {
        if (!isBookingExpired(b)) return false;

        const matchesSearch = !searchQuery ||
            (b.customer_name && b.customer_name.toLowerCase().includes(searchQuery)) ||
            (b.customer_phone && b.customer_phone.toLowerCase().includes(searchQuery)) ||
            (b.car_name && b.car_name.toLowerCase().includes(searchQuery)) ||
            (b.booking_code && b.booking_code.toLowerCase().includes(searchQuery));

        return matchesSearch;
    });

    if (historyList.length === 0) {
        showAdminToast('Data Kosong', 'Belum ada data riwayat pemesanan lunas untuk diunduh ke Excel.', 'warning');
        return;
    }

    const statusLabelMap = {
        confirmed: 'Terverifikasi',
        confirmed_pending: 'Verifikasi + Menunggu',
        completed: 'Selesai',
        pending: 'Menunggu',
        cancelled: 'Dibatalkan'
    };

    const payTypeLabelMap = {
        dp: 'DP (Uang Muka)',
        lunas_awal: 'Bayar Lunas di Awal',
        bayar_akhir: 'Bayar di Akhir',
        transaksi_wa: 'Transaksi via WhatsApp'
    };

    let totalVerifiedIncome = 0;

    const excelRows = historyList.map((b, index) => {
        const normStatus = normalizeBookingStatusKey(b.status);
        const totalPrice = parseFloat(b.total_price) || 0;
        const verifiedIncome = normStatus === 'confirmed' ? totalPrice : 0;
        totalVerifiedIncome += verifiedIncome;

        const pType = b.payment_type || 'lunas_awal';
        const dpVal = pType === 'dp' ? (parseFloat(b.dp_amount) || Math.round(totalPrice * 0.5)) : 0;

        return {
            'No': index + 1,
            'Kode Booking': b.booking_code || '-',
            'Nama Pelanggan': b.customer_name || '-',
            'No. WhatsApp': b.customer_phone || '-',
            'Armada Mobil': b.car_name || '-',
            'Tanggal Mulai': b.start_date || '-',
            'Jam Mulai': b.start_time || '09:00',
            'Tanggal Selesai': b.end_date || '-',
            'Jam Selesai': b.end_time || '09:00',
            'Layanan Supir': b.driver_label || (b.with_driver ? '+Supir' : 'Tanpa Supir'),
            'Skema Pembayaran': payTypeLabelMap[pType] || pType,
            'Metode Bayar': b.payment_method ? String(b.payment_method).toUpperCase() : '-',
            'Nominal DP (Rp)': dpVal,
            'Total Biaya Sewa (Rp)': totalPrice,
            'Status Pembayaran': statusLabelMap[normStatus] || b.status,
            'Pendapatan Terverifikasi (Rp)': verifiedIncome,
            'Catatan': b.notes || '-'
        };
    });

    // Baris Ringkasan Total di bagian bawah Excel
    excelRows.push({
        'No': '',
        'Kode Booking': '',
        'Nama Pelanggan': 'TOTAL PENDAPATAN TERVERIFIKASI',
        'No. WhatsApp': '',
        'Armada Mobil': '',
        'Tanggal Mulai': '',
        'Jam Mulai': '',
        'Tanggal Selesai': '',
        'Jam Selesai': '',
        'Layanan Supir': '',
        'Skema Pembayaran': '',
        'Metode Bayar': '',
        'Nominal DP (Rp)': '',
        'Total Biaya Sewa (Rp)': '',
        'Status Pembayaran': `${historyList.filter(isBookingVerified).length} Pesanan Sah`,
        'Pendapatan Terverifikasi (Rp)': totalVerifiedIncome,
        'Catatan': ''
    });

    const fileDate = getTodayLocalStr();

    if (typeof window.XLSX !== 'undefined') {
        const worksheet = window.XLSX.utils.json_to_sheet(excelRows);
        worksheet['!cols'] = [
            { wch: 5 },  // No
            { wch: 14 }, // Kode Booking
            { wch: 24 }, // Nama Pelanggan
            { wch: 16 }, // No. WhatsApp
            { wch: 24 }, // Armada Mobil
            { wch: 14 }, // Tanggal Mulai
            { wch: 11 }, // Jam Mulai
            { wch: 14 }, // Tanggal Selesai
            { wch: 11 }, // Jam Selesai
            { wch: 18 }, // Layanan Supir
            { wch: 20 }, // Skema Pembayaran
            { wch: 14 }, // Metode Bayar
            { wch: 16 }, // Nominal DP
            { wch: 20 }, // Total Biaya Sewa
            { wch: 20 }, // Status Pembayaran
            { wch: 26 }, // Pendapatan Terverifikasi
            { wch: 30 }  // Catatan
        ];
        const workbook = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Pemesanan');
        window.XLSX.writeFile(workbook, `Riwayat_Pemesanan_Lunas_RCM_${fileDate}.xlsx`);
        showAdminToast('Excel Berhasil Diunduh', `File Riwayat_Pemesanan_Lunas_RCM_${fileDate}.xlsx berhasil disimpan.`, 'success');
    } else {
        // Fallback Offline ke format Excel .xls berbasis tabel HTML
        const headers = Object.keys(excelRows[0]);
        let tableHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table border="1">';
        tableHtml += '<tr style="background:#dc2626;color:#ffffff;font-weight:bold;">' + headers.map(h => `<th>${escapeHtml(h)}</th>`).join('') + '</tr>';
        excelRows.forEach(row => {
            tableHtml += '<tr>' + headers.map(h => `<td>${escapeHtml(String(row[h] ?? ''))}</td>`).join('') + '</tr>';
        });
        tableHtml += '</table></body></html>';

        const blob = new Blob(['\ufeff', tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Riwayat_Pemesanan_Lunas_RCM_${fileDate}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showAdminToast('Excel Berhasil Diunduh', `File Riwayat_Pemesanan_Lunas_RCM_${fileDate}.xls berhasil disimpan.`, 'success');
    }
}

let currentViewingBookingId = null;
let currentViewingIsHistory = false;
let pendingDocChanges = {
    payment_proof: null,
    payment_proof_settlement: null,
    ktp_image: null
};

// Fungsi aman untuk membuka dokumen (gambar biasa atau base64) di tab baru tanpa diblokir browser
function openDocumentImagePreview(el) {
    if (!el) return;
    const src = el.src || el.href || el.getAttribute('data-src');
    if (!src || src === '#' || src.length < 10) return;

    if (src.startsWith('data:')) {
        const win = window.open('');
        if (win) {
            win.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Preview Dokumen</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            margin: 0;
                            background: #0f172a;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            min-height: 100vh;
                            padding: 1rem;
                            box-sizing: border-box;
                        }
                        img {
                            max-width: 100%;
                            max-height: 95vh;
                            object-fit: contain;
                            border-radius: 8px;
                            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                        }
                    </style>
                </head>
                <body>
                    <img src="${src}" alt="Dokumen Penuh" />
                </body>
                </html>
            `);
            win.document.close();
        }
    } else {
        window.open(src, '_blank');
    }
}
window.openDocumentImagePreview = openDocumentImagePreview;

// Buat URL Pesan Permintaan Pembayaran via WhatsApp untuk Pelanggan
function buildPaymentRequestWaUrl(booking) {
    const cfg = adminState.ownerConfig || {};
    const cleanPhone = (booking.customer_phone || '').replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.substring(1) : cleanPhone;

    const totalPrice = parseFloat(booking.total_price) || 0;
    const payType = booking.payment_type || 'lunas_awal';
    const dpAmount = payType === 'dp' ? (parseFloat(booking.dp_amount) || Math.round(totalPrice * 0.5)) : 0;
    const remAmount = payType === 'dp' ? Math.max(0, totalPrice - dpAmount) : 0;

    const bankName = cfg.bankName || 'BCA';
    const bankNum = cfg.bankAccountNumber || '7890123456';
    const bankHolder = cfg.bankAccountHolder || cfg.businessName || 'RPM Rent Car Makassar';

    let tagihanLines = '';
    if (payType === 'dp') {
        tagihanLines = `• Skema Pembayaran: *DP (Uang Muka)*\n• Total Biaya Sewa: ${formatRupiah(totalPrice)}\n• *Nominal DP yang Perlu Dibayar: ${formatRupiah(dpAmount)}*\n• Sisa Pelunasan: ${formatRupiah(remAmount)}`;
    } else if (payType === 'bayar_akhir') {
        tagihanLines = `• Skema Pembayaran: *Bayar di Akhir / Pelunasan*\n• *Total Tagihan Pembayaran: ${formatRupiah(totalPrice)}*`;
    } else if (payType === 'transaksi_wa') {
        tagihanLines = `• Skema Transaksi: *Transaksi Langsung via WhatsApp*\n• *Total Tagihan Biaya Sewa: ${formatRupiah(totalPrice)}*`;
    } else {
        tagihanLines = `• Skema Pembayaran: *Bayar Lunas di Awal*\n• *Total Tagihan Pembayaran: ${formatRupiah(totalPrice)}*`;
    }

    const msg = `
*PERMINTAAN PEMBAYARAN RENTAL MOBIL*
_${cfg.businessName || 'RPM Rent Car Makassar'}_

Halo Kak *${booking.customer_name || 'Pelanggan'}*, berikut rincian permintaan pembayaran untuk pesanan sewa mobil Anda:

📌 *Detail Pesanan:*
• Kode Booking: *${booking.booking_code || '-'}*
• Unit Armada: *${booking.car_name || '-'}*
• Jadwal Sewa: ${booking.start_date || '-'} s/d ${booking.end_date || '-'}

💳 *Rincian Tagihan Pembayaran:*
${tagihanLines}

🏦 *Metode Pembayaran Resmi:*
• *Transfer Bank ${bankName}:* \`${bankNum}\`
  a.n *${bankHolder}*
• *QRIS:* Tersedia (Silakan balas pesan ini jika ingin meminta gambar kode QRIS)

Mohon kesediaannya untuk melakukan pembayaran dan mengirimkan foto *Bukti Transfer / Pembayaran* melalui WhatsApp ini agar pesanan Anda segera kami proses/verifikasi. Terima kasih! 🙏
`.trim();

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
}

function sendPaymentRequestWhatsApp(id) {
    const booking = (adminState.bookings || []).find(b => b.id == id);
    if (!booking) return;
    const url = buildPaymentRequestWaUrl(booking);
    window.open(url, '_blank');
}

function viewBookingDocument(id, isHistory = false) {
    currentViewingBookingId = id;
    currentViewingIsHistory = Boolean(isHistory);
    const booking = (adminState.bookings || []).find(b => b.id == id);
    if (!booking) return;

    // Reset pending perubahan dokumen yang belum disubmit
    pendingDocChanges = {
        payment_proof: null,
        payment_proof_settlement: null,
        penalty_proof: null,
        ktp_image: null
    };

    const submitBtn = document.getElementById('docSubmitAllBtn');
    const submitBtnText = document.getElementById('docSubmitAllBtnText');
    if (submitBtn) submitBtn.disabled = false;
    if (submitBtnText) submitBtnText.textContent = 'Submit & Simpan Semua Dokumen';

    const modal = document.getElementById('documentViewModal');
    if (!modal) return;

    // Header modal titles
    const modalTitle = document.getElementById('docModalTitle');
    const modalSubtitle = document.getElementById('docModalSubtitle');
    const modalIcon = document.getElementById('docModalIcon');
    const ktpSection = document.getElementById('docKtpSectionWrapper');
    const waSection = document.getElementById('docPaymentWaSection');
    const openFullBtn = document.getElementById('docOpenFullBtn');

    if (modalTitle) {
        modalTitle.textContent = currentViewingIsHistory
            ? 'Dokumen & Bukti Bayar (Riwayat)'
            : 'Dokumen KTP & Bukti Pembayaran';
    }
    if (modalSubtitle) {
        modalSubtitle.textContent = currentViewingIsHistory
            ? 'Rincian pesanan dan verifikasi bukti transfer / pembayaran'
            : 'Verifikasi identitas, bukti bayar & permintaan pembayaran via WhatsApp';
    }
    if (modalIcon) {
        modalIcon.textContent = currentViewingIsHistory ? '🧾' : '📄';
    }

    // Bagian KTP tidak ada sama sekali jika dilihat dari Riwayat Pemesanan
    if (ktpSection) {
        if (currentViewingIsHistory) {
            ktpSection.classList.add('hidden');
        } else {
            ktpSection.classList.remove('hidden');
        }
    }
    // Bagian permintaan WhatsApp disembunyikan jika riwayat sudah lunas/selesai
    if (waSection) {
        if (currentViewingIsHistory) {
            waSection.classList.add('hidden');
        } else {
            waSection.classList.remove('hidden');
        }
    }

    const nameEl = document.getElementById('docCustomerName');
    const phoneEl = document.getElementById('docCustomerPhone');
    const carEl = document.getElementById('docCarName');
    const codeEl = document.getElementById('docBookingCode');
    const datesEl = document.getElementById('docBookingDates');
    const driverEl = document.getElementById('docDriverService');
    const payTypeEl = document.getElementById('docPaymentType');
    const payDetailEl = document.getElementById('docPaymentDetail');

    if (nameEl) nameEl.textContent = booking.customer_name || '-';
    if (phoneEl) phoneEl.textContent = booking.customer_phone || '-';
    if (carEl) carEl.textContent = booking.car_name || '-';
    if (codeEl) codeEl.textContent = booking.booking_code || '-';

    if (datesEl) {
        const dateRange = formatBookingDateRange(booking.start_date, booking.end_date, booking.start_time, booking.end_time);
        datesEl.innerHTML = dateRange || `${escapeHtml(booking.start_date || '-')} s/d ${escapeHtml(booking.end_date || '-')}`;
    }

    if (driverEl) {
        const isWithDriver = Boolean(booking.with_driver) ||
            booking.driver_option === 'with_driver' ||
            booking.driver_option === 'luar_kota' ||
            String(booking.driver_label || '').toLowerCase().includes('supir');

        if (isWithDriver) {
            driverEl.textContent = booking.driver_label ? `Dengan Supir (${booking.driver_label})` : 'Dengan Supir (+Supir)';
            driverEl.style.color = '#059669';
        } else {
            driverEl.textContent = 'Tanpa Supir (Lepas Kunci)';
            driverEl.style.color = '#475569';
        }
    }

    const payType = booking.payment_type || 'lunas_awal';
    const payMethod = booking.payment_method ? booking.payment_method.toUpperCase() : '-';
    const totalPrice = parseFloat(booking.total_price) || 0;
    const dpAmount = parseFloat(booking.dp_amount) || Math.round(totalPrice * 0.5);
    const remAmount = Math.max(0, totalPrice - dpAmount);

    if (payTypeEl) {
        if (payType === 'dp') payTypeEl.textContent = 'DP (Uang Muka)';
        else if (payType === 'bayar_akhir') payTypeEl.textContent = 'Bayar di Akhir';
        else if (payType === 'transaksi_wa') payTypeEl.textContent = 'Transaksi via WA';
        else payTypeEl.textContent = 'Bayar Lunas di Awal';
    }
    if (payDetailEl) {
        if (payType === 'dp') {
            payDetailEl.textContent = `${payMethod} • DP ${formatRupiah(dpAmount)} (Sisa ${formatRupiah(remAmount)})`;
        } else if (payType === 'bayar_akhir') {
            payDetailEl.textContent = `Tagihan Akhir: ${formatRupiah(totalPrice)}`;
        } else if (payType === 'transaksi_wa') {
            payDetailEl.textContent = `Tagihan: ${formatRupiah(totalPrice)} (Transaksi via WhatsApp)`;
        } else {
            payDetailEl.textContent = `${payMethod} • Lunas ${formatRupiah(totalPrice)}`;
        }
    }

    // Set tombol Permintaan Pembayaran via WhatsApp
    const reqPayWaUrl = buildPaymentRequestWaUrl(booking);
    const reqPayWaBtn = document.getElementById('docRequestPaymentWaBtn');
    const reqPayWaBtnInner = document.getElementById('docRequestPaymentWaBtnInner');
    if (reqPayWaBtn) reqPayWaBtn.href = reqPayWaUrl;
    if (reqPayWaBtnInner) reqPayWaBtnInner.href = reqPayWaUrl;

    // Preview Bukti Pembayaran Pelanggan (Bagian 1: DP Awal / Lunas)
    const proofTitleEl = document.getElementById('docPaymentProofTitle');
    const proofBadgeEl = document.getElementById('docPaymentProofBadge');
    const uploadBtnTextEl = document.getElementById('docUploadProofBtnText');
    const noProofTitleEl = document.getElementById('docNoProofTitle');
    const noProofDescEl = document.getElementById('docNoProofDesc');
    const innerUploadBtnTextEl = document.getElementById('docUploadProofInnerBtnText');

    if (payType === 'dp') {
        if (proofTitleEl) proofTitleEl.textContent = '💰 Bukti Pembayaran DP Awal (Uang Muka):';
        if (proofBadgeEl) {
            proofBadgeEl.textContent = `Nominal DP: ${formatRupiah(dpAmount)}`;
            proofBadgeEl.className = 'inline-block';
            proofBadgeEl.style.cssText = 'font-size: 0.68rem; font-weight: 800; padding: 0.1rem 0.4rem; border-radius: 4px; background: #fffbeb; color: #b45309; border: 1px solid #fde68a;';
        }
        if (uploadBtnTextEl) uploadBtnTextEl.textContent = 'Upload Bukti DP (Admin)';
        if (noProofTitleEl) noProofTitleEl.textContent = 'Bukti DP Awal Belum Diunggah';
        if (noProofDescEl) noProofDescEl.textContent = 'Pelanggan belum mengunggah bukti transfer DP awal, atau membayar DP langsung ke Admin.';
        if (innerUploadBtnTextEl) innerUploadBtnTextEl.textContent = '📷 Upload Bukti DP Awal';
    } else {
        if (proofTitleEl) proofTitleEl.textContent = (payType === 'bayar_akhir') ? '💳 Bukti Pembayaran Pelunasan Akhir:' : (payType === 'transaksi_wa' ? '💳 Bukti Pembayaran Transaksi WA:' : '💳 Bukti Pembayaran Lunas di Awal:');
        if (proofBadgeEl) proofBadgeEl.className = 'hidden';
        if (uploadBtnTextEl) uploadBtnTextEl.textContent = 'Upload Bukti Bayar (Admin)';
        if (noProofTitleEl) noProofTitleEl.textContent = 'Bukti Pembayaran Belum Diunggah';
        if (noProofDescEl) noProofDescEl.textContent = (payType === 'transaksi_wa') ? 'Pelanggan melakukan transaksi via WhatsApp. Admin dapat mengunggah bukti transfer/bayar yang dikirim pelanggan melalui tombol upload di atas.' : 'Pelanggan belum mengunggah bukti transfer/QRIS pada form, atau melakukan transaksi secara langsung dengan Admin.';
        if (innerUploadBtnTextEl) innerUploadBtnTextEl.textContent = '📷 Upload Bukti Pembayaran';
    }

    const proofImg = document.getElementById('docPaymentProofImage');
    const noProofMsg = document.getElementById('docNoPaymentProofMsg');
    const openProofFullBtn = document.getElementById('docOpenProofFullBtn');

    if (booking.payment_proof && booking.payment_proof.length > 50) {
        if (proofImg) {
            proofImg.src = booking.payment_proof;
            proofImg.classList.remove('hidden');
        }
        if (noProofMsg) noProofMsg.classList.add('hidden');
        if (openProofFullBtn) {
            openProofFullBtn.href = booking.payment_proof;
            openProofFullBtn.classList.remove('hidden');
        }
    } else {
        if (proofImg) {
            proofImg.src = '';
            proofImg.classList.add('hidden');
        }
        if (noProofMsg) noProofMsg.classList.remove('hidden');
        if (openProofFullBtn) openProofFullBtn.classList.add('hidden');
    }

    // Preview Bukti Pembayaran Pelunasan (Bagian 2: Khusus jika Skema DP)
    const settlementSection = document.getElementById('docSettlementProofSection');
    const settlementBadge = document.getElementById('docSettlementAmountBadge');
    const settlementImg = document.getElementById('docSettlementProofImage');
    const noSettlementMsg = document.getElementById('docNoSettlementProofMsg');
    const openSettlementFullBtn = document.getElementById('docOpenSettlementProofFullBtn');

    if (payType === 'dp') {
        if (settlementSection) settlementSection.classList.remove('hidden');
        if (settlementBadge) settlementBadge.textContent = `Sisa Pelunasan: ${formatRupiah(remAmount)}`;

        if (booking.payment_proof_settlement && booking.payment_proof_settlement.length > 50) {
            if (settlementImg) {
                settlementImg.src = booking.payment_proof_settlement;
                settlementImg.classList.remove('hidden');
            }
            if (noSettlementMsg) noSettlementMsg.classList.add('hidden');
            if (openSettlementFullBtn) {
                openSettlementFullBtn.href = booking.payment_proof_settlement;
                openSettlementFullBtn.classList.remove('hidden');
            }
        } else {
            if (settlementImg) {
                settlementImg.src = '';
                settlementImg.classList.add('hidden');
            }
            if (noSettlementMsg) noSettlementMsg.classList.remove('hidden');
            if (openSettlementFullBtn) openSettlementFullBtn.classList.add('hidden');
        }
    } else {
        if (settlementSection) settlementSection.classList.add('hidden');
    }

    // Preview Bukti Pembayaran Denda Keterlambatan
    const penaltySection = document.getElementById('docPenaltyProofSection');
    const penaltyBadge = document.getElementById('docPenaltyAmountBadge');
    const penaltyImg = document.getElementById('docPenaltyProofImage');
    const noPenaltyMsg = document.getElementById('docNoPenaltyProofMsg');
    const openPenaltyFullBtn = document.getElementById('docOpenPenaltyProofFullBtn');
    const timerInfo = getBookingRentalTimerInfo(booking);

    const calculatedPenalty = timerInfo.hasPenalty ? timerInfo.penaltyAmount : 0;
    const currentPenalty = Math.max(calculatedPenalty, parseFloat(booking.penalty_amount || 0));
    const hasPenaltyProof = Boolean(booking.penalty_proof && String(booking.penalty_proof).length > 20);

    // Tampilan denda HANYA muncul pada saat jam pemakaian melewati batas (isOverdue) atau ada denda/bukti denda
    const shouldShowPenalty = Boolean(timerInfo.isOverdue || timerInfo.hasPenalty || currentPenalty > 0 || hasPenaltyProof);

    if (penaltySection) {
        if (shouldShowPenalty) {
            penaltySection.classList.remove('hidden');
        } else {
            penaltySection.classList.add('hidden');
        }
    }

    if (penaltyBadge) {
        if (currentPenalty > 0) {
            const hrText = timerInfo.overdueHours > 0 ? ` (${timerInfo.overdueHours} Jam)` : '';
            penaltyBadge.textContent = `Denda: ${formatRupiah(currentPenalty)}${hrText}`;
            penaltyBadge.style.color = '#dc2626';
            penaltyBadge.style.background = '#fef2f2';
            penaltyBadge.style.borderColor = '#fecaca';
        } else {
            penaltyBadge.textContent = 'Lewat Batas Waktu (< 1 Jam)';
            penaltyBadge.style.color = '#d97706';
            penaltyBadge.style.background = '#fffbeb';
            penaltyBadge.style.borderColor = '#fde68a';
        }
    }

    if (booking.penalty_proof && booking.penalty_proof.length > 50) {
        if (penaltyImg) {
            penaltyImg.src = booking.penalty_proof;
            penaltyImg.classList.remove('hidden');
        }
        if (noPenaltyMsg) noPenaltyMsg.classList.add('hidden');
        if (openPenaltyFullBtn) {
            openPenaltyFullBtn.href = booking.penalty_proof;
            openPenaltyFullBtn.classList.remove('hidden');
        }
    } else {
        if (penaltyImg) {
            penaltyImg.src = '';
            penaltyImg.classList.add('hidden');
        }
        if (noPenaltyMsg) noPenaltyMsg.classList.remove('hidden');
        if (openPenaltyFullBtn) openPenaltyFullBtn.classList.add('hidden');
    }

    // Preview KTP (hanya jika bukan history)
    const img = document.getElementById('docKtpImage');
    const noImgMsg = document.getElementById('docNoImageMsg');
    const chatWaBtn = document.getElementById('docChatWaBtn');

    if (currentViewingIsHistory) {
        if (openFullBtn) openFullBtn.classList.add('hidden');
    } else {
        const cleanPhone = (booking.customer_phone || '').replace(/[^0-9]/g, '');
        let targetPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.substring(1) : cleanPhone;
        if (chatWaBtn) {
            chatWaBtn.href = `https://wa.me/${targetPhone}?text=${encodeURIComponent(`Halo Kak ${booking.customer_name}, mohon kirimkan foto KTP untuk verifikasi pesanan rental mobil ${booking.car_name || ''} (Kode: ${booking.booking_code || ''}). Terima kasih!`)}`;
        }

        if (booking.ktp_image && booking.ktp_image.length > 50) {
            if (img) {
                img.src = booking.ktp_image;
                img.classList.remove('hidden');
            }
            if (noImgMsg) noImgMsg.classList.add('hidden');
            if (openFullBtn) {
                openFullBtn.href = booking.ktp_image;
                openFullBtn.classList.remove('hidden');
            }
        } else {
            if (img) {
                img.src = '';
                img.classList.add('hidden');
            }
            if (noImgMsg) noImgMsg.classList.remove('hidden');
            if (openFullBtn) openFullBtn.classList.add('hidden');
        }
    }

    modal.classList.remove('hidden');
}

// Upload atau ganti Bukti Pembayaran Pelanggan langsung oleh Admin (termasuk untuk transaksi secara langsung)
async function handleAdminUploadPaymentProof(event) {
    const file = event.target.files[0];
    if (!file || !currentViewingBookingId) return;

    const booking = (adminState.bookings || []).find(b => b.id == currentViewingBookingId);
    if (!booking) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const rawBase64 = e.target.result;
        const tempImg = new Image();
        tempImg.onload = function() {
            const canvas = document.createElement('canvas');
            let width = tempImg.width;
            let height = tempImg.height;
            const maxDim = 1280;
            if (width > maxDim || height > maxDim) {
                if (width > height) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                } else {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(tempImg, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);

            pendingDocChanges.payment_proof = compressedBase64;

            // Update preview di modal secara langsung
            const proofImg = document.getElementById('docPaymentProofImage');
            const noProofMsg = document.getElementById('docNoPaymentProofMsg');
            const openProofFullBtn = document.getElementById('docOpenProofFullBtn');

            if (proofImg) {
                proofImg.src = compressedBase64;
                proofImg.classList.remove('hidden');
            }
            if (noProofMsg) noProofMsg.classList.add('hidden');
            if (openProofFullBtn) {
                openProofFullBtn.href = compressedBase64;
                openProofFullBtn.classList.remove('hidden');
            }

            const msgLabel = booking.payment_type === 'dp' ? 'Bukti DP awal' : 'Bukti pembayaran';
            showAdminToast('File Dipilih', `${msgLabel} siap disimpan. Silakan klik tombol "Submit & Simpan Semua Dokumen" di bawah untuk menyimpan perubahan.`, 'info');
            event.target.value = '';
        };
        tempImg.src = rawBase64;
    };
    reader.readAsDataURL(file);
}

// Upload atau ganti Bukti Pembayaran Pelunasan Pelanggan oleh Admin (Khusus skema DP)
async function handleAdminUploadSettlementProof(event) {
    const file = event.target.files[0];
    if (!file || !currentViewingBookingId) return;

    const booking = (adminState.bookings || []).find(b => b.id == currentViewingBookingId);
    if (!booking) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const rawBase64 = e.target.result;
        const tempImg = new Image();
        tempImg.onload = function() {
            const canvas = document.createElement('canvas');
            let width = tempImg.width;
            let height = tempImg.height;
            const maxDim = 1280;
            if (width > maxDim || height > maxDim) {
                if (width > height) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                } else {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(tempImg, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);

            pendingDocChanges.payment_proof_settlement = compressedBase64;

            // Update preview di modal secara langsung
            const settlementImg = document.getElementById('docSettlementProofImage');
            const noSettlementMsg = document.getElementById('docNoSettlementProofMsg');
            const openSettlementFullBtn = document.getElementById('docOpenSettlementProofFullBtn');

            if (settlementImg) {
                settlementImg.src = compressedBase64;
                settlementImg.classList.remove('hidden');
            }
            if (noSettlementMsg) noSettlementMsg.classList.add('hidden');
            if (openSettlementFullBtn) {
                openSettlementFullBtn.href = compressedBase64;
                openSettlementFullBtn.classList.remove('hidden');
            }

            showAdminToast('File Dipilih', 'Bukti pelunasan siap disimpan. Silakan klik tombol "Submit & Simpan Semua Dokumen" di bawah untuk menyimpan perubahan.', 'info');
            event.target.value = '';
        };
        tempImg.src = rawBase64;
    };
    reader.readAsDataURL(file);
}

// Upload atau ganti Bukti Pembayaran Denda Keterlambatan oleh Admin
async function handleAdminUploadPenaltyProof(event) {
    const file = event.target.files[0];
    if (!file || !currentViewingBookingId) return;

    const booking = (adminState.bookings || []).find(b => b.id == currentViewingBookingId);
    if (!booking) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const rawBase64 = e.target.result;
        const tempImg = new Image();
        tempImg.onload = function() {
            const canvas = document.createElement('canvas');
            let width = tempImg.width;
            let height = tempImg.height;
            const maxDim = 1280;
            if (width > maxDim || height > maxDim) {
                if (width > height) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                } else {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(tempImg, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);

            pendingDocChanges.penalty_proof = compressedBase64;

            // Update preview di modal secara langsung
            const penaltyImg = document.getElementById('docPenaltyProofImage');
            const noPenaltyMsg = document.getElementById('docNoPenaltyProofMsg');
            const openPenaltyFullBtn = document.getElementById('docOpenPenaltyProofFullBtn');

            if (penaltyImg) {
                penaltyImg.src = compressedBase64;
                penaltyImg.classList.remove('hidden');
            }
            if (noPenaltyMsg) noPenaltyMsg.classList.add('hidden');
            if (openPenaltyFullBtn) {
                openPenaltyFullBtn.href = compressedBase64;
                openPenaltyFullBtn.classList.remove('hidden');
            }

            showAdminToast('File Dipilih', 'Bukti pembayaran denda siap disimpan. Silakan klik tombol "Submit & Simpan Semua Dokumen" di bawah untuk menyimpan perubahan.', 'info');
            event.target.value = '';
        };
        tempImg.src = rawBase64;
    };
    reader.readAsDataURL(file);
}

// Upload atau ganti foto KTP langsung dari Admin Dashboard
async function handleAdminUploadKtp(event) {
    const file = event.target.files[0];
    if (!file || !currentViewingBookingId) return;

    const booking = (adminState.bookings || []).find(b => b.id == currentViewingBookingId);
    if (!booking) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const rawBase64 = e.target.result;

        // Kompres via Canvas (max 1280px)
        const tempImg = new Image();
        tempImg.onload = function() {
            const canvas = document.createElement('canvas');
            let width = tempImg.width;
            let height = tempImg.height;
            const maxDim = 1280;
            if (width > maxDim || height > maxDim) {
                if (width > height) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                } else {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(tempImg, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);

            pendingDocChanges.ktp_image = compressedBase64;

            // Update preview foto KTP dan tombol Lihat KTP Penuh di bagian atas
            const img = document.getElementById('docKtpImage');
            const noImgMsg = document.getElementById('docNoImageMsg');
            const openFullBtn = document.getElementById('docOpenFullBtn');

            if (img) {
                img.src = compressedBase64;
                img.classList.remove('hidden');
            }
            if (noImgMsg) noImgMsg.classList.add('hidden');
            if (openFullBtn) {
                openFullBtn.href = compressedBase64;
                openFullBtn.classList.remove('hidden');
            }

            showAdminToast('File Dipilih', 'Foto KTP pelanggan siap disimpan. Silakan klik tombol "Submit & Simpan Semua Dokumen" di bawah untuk menyimpan perubahan.', 'info');
            event.target.value = '';
        };
        tempImg.src = rawBase64;
    };
    reader.readAsDataURL(file);
}

// Submit dan simpan semua dokumen booking sekaligus ke server & database
async function submitAllDocuments() {
    if (!currentViewingBookingId) return;

    const booking = (adminState.bookings || []).find(b => b.id == currentViewingBookingId);
    if (!booking) return;

    const submitBtn = document.getElementById('docSubmitAllBtn');
    const submitBtnText = document.getElementById('docSubmitAllBtnText');
    const originalText = submitBtnText ? submitBtnText.textContent : 'Submit & Simpan Semua Dokumen';

    if (submitBtn) submitBtn.disabled = true;
    if (submitBtnText) submitBtnText.textContent = 'Menyimpan...';

    const payload = {};
    let hasChanges = false;

    if (pendingDocChanges.payment_proof !== null) {
        booking.payment_proof = pendingDocChanges.payment_proof;
        payload.payment_proof = pendingDocChanges.payment_proof;
        hasChanges = true;
    }
    if (pendingDocChanges.payment_proof_settlement !== null) {
        booking.payment_proof_settlement = pendingDocChanges.payment_proof_settlement;
        payload.payment_proof_settlement = pendingDocChanges.payment_proof_settlement;
        hasChanges = true;
    }
    if (pendingDocChanges.penalty_proof !== null) {
        booking.penalty_proof = pendingDocChanges.penalty_proof;
        payload.penalty_proof = pendingDocChanges.penalty_proof;
        const timerInfo = getBookingRentalTimerInfo(booking);
        const curPenalty = (timerInfo.hasPenalty ? timerInfo.penaltyAmount : 0) || parseFloat(booking.penalty_amount || 0);
        if (curPenalty > 0) {
            booking.penalty_amount = curPenalty;
            payload.penalty_amount = curPenalty;
        }
        hasChanges = true;
    }
    if (pendingDocChanges.ktp_image !== null) {
        booking.ktp_image = pendingDocChanges.ktp_image;
        payload.ktp_image = pendingDocChanges.ktp_image;
        hasChanges = true;
    }

    // Otomatis verifikasi pesanan saat menyimpan dokumen KTP / bukti pembayaran
    if (booking.status !== 'confirmed' && (booking.payment_proof || booking.ktp_image || booking.payment_proof_settlement)) {
        booking.status = 'confirmed';
        payload.status = 'confirmed';
        hasChanges = true;
    }

    // Simpan ke local state/storage
    saveBookingsData();

    // Kirim sinkronisasi ke backend API
    try {
        if (hasChanges && Object.keys(payload).length > 0) {
            await fetch(`/api/bookings/${booking.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        }
    } catch (err) {
        console.error('Gagal sinkronisasi dokumen booking ke server:', err);
    } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = originalText;
    }

    // Reset pending changes
    pendingDocChanges = {
        payment_proof: null,
        payment_proof_settlement: null,
        penalty_proof: null,
        ktp_image: null
    };

    renderBookingsTable();
    renderHistoryTable();
    renderOverviewMetrics();

    showAdminToast(
        'Dokumen Berhasil Disimpan',
        'Semua dokumen pesanan berhasil disimpan & status pesanan telah diverifikasi!',
        'success'
    );

    closeDocumentViewModal();
}

function closeDocumentViewModal() {
    pendingDocChanges = {
        payment_proof: null,
        payment_proof_settlement: null,
        penalty_proof: null,
        ktp_image: null
    };
    const modal = document.getElementById('documentViewModal');
    if (modal) modal.classList.add('hidden');
}

window.viewBookingDocument = viewBookingDocument;
window.closeDocumentViewModal = closeDocumentViewModal;
window.submitAllDocuments = submitAllDocuments;
window.handleAdminUploadKtp = handleAdminUploadKtp;
window.handleAdminUploadPaymentProof = handleAdminUploadPaymentProof;
window.handleAdminUploadSettlementProof = handleAdminUploadSettlementProof;
window.handleAdminUploadPenaltyProof = handleAdminUploadPenaltyProof;
window.completeBookingRental = completeBookingRental;
window.sendPaymentRequestWhatsApp = sendPaymentRequestWhatsApp;
window.handleOwnerQrisUpload = handleOwnerQrisUpload;
window.removeOwnerQrisImage = removeOwnerQrisImage;

function setAdminPaymentType(type) {
    const hiddenInput = document.getElementById('abPaymentType');
    if (hiddenInput) hiddenInput.value = type;

    const cards = ['lunas_awal', 'dp', 'bayar_akhir'];
    cards.forEach(c => {
        const cardEl = document.getElementById(`abPayCard_${c}`);
        const radio = cardEl ? cardEl.querySelector('input[type="radio"]') : null;
        if (cardEl) {
            cardEl.classList.toggle('is-active', c === type);
            if (radio) radio.checked = (c === type);
        }
    });

    const dpWrap = document.getElementById('abDpAmountWrap');
    const totalPrice = parseFloat(document.getElementById('abTotalPrice')?.value) || 0;
    const dpInput = document.getElementById('abDpAmount');

    if (type === 'dp') {
        if (dpWrap) dpWrap.classList.remove('hidden');
        if (dpInput && (!dpInput.value || parseFloat(dpInput.value) === 0)) {
            dpInput.value = Math.round(totalPrice * 0.5);
        }
    } else {
        if (dpWrap) dpWrap.classList.add('hidden');
    }

    updateAdminBookingSummary();
}

function setAdminQuickDp(percentage) {
    const totalPrice = parseFloat(document.getElementById('abTotalPrice')?.value) || 0;
    const dpInput = document.getElementById('abDpAmount');
    if (dpInput) {
        dpInput.value = Math.round(totalPrice * percentage);
    }
    updateAdminBookingSummary();
}

function updateAdminBookingSummary() {
    const carSelect = document.getElementById('abCarId');
    const startDateVal = document.getElementById('abStartDate')?.value;
    const endDateVal = document.getElementById('abEndDate')?.value;
    const driverOpt = document.getElementById('abDriverOption')?.value || 'with_driver';
    const totalPrice = parseFloat(document.getElementById('abTotalPrice')?.value) || 0;
    const payType = document.getElementById('abPaymentType')?.value || 'lunas_awal';
    const dpVal = parseFloat(document.getElementById('abDpAmount')?.value) || 0;
    const statusVal = document.getElementById('abStatus')?.value || 'confirmed';

    let days = 1;
    if (startDateVal && endDateVal) {
        const start = new Date(startDateVal);
        const end = new Date(endDateVal);
        if (!isNaN(start) && !isNaN(end) && end >= start) {
            const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            days = diffDays > 0 ? diffDays : 1;
        }
    }

    const driverLabels = {
        with_driver: '+Supir (Dalam Kota)',
        without_driver: 'Lepas Kunci',
        luar_kota: '+Supir (Luar Kota)'
    };
    const payLabels = {
        lunas_awal: 'Lunas di Awal',
        dp: 'DP (Uang Muka)',
        bayar_akhir: 'Bayar di Akhir'
    };
    const statusLabels = {
        confirmed: 'Verifikasi',
        confirmed_pending: 'Verifikasi + Menunggu Bayar',
        pending: 'Menunggu',
        cancelled: 'Dibatalkan'
    };

    const carText = carSelect && carSelect.selectedIndex >= 0
        ? carSelect.options[carSelect.selectedIndex].textContent
        : 'Pilih Armada Mobil';

    const durBadge = document.getElementById('abDurationBadge');
    const sumDurationPill = document.getElementById('abSummaryDurationPill');
    const sumCar = document.getElementById('abSummaryCar');
    const sumMeta = document.getElementById('abSummaryMeta');
    const sumTotal = document.getElementById('abSummaryTotal');
    const priceHint = document.getElementById('abPriceFormattedHint');
    const dpHint = document.getElementById('abDpFormattedHint');
    const footerSummary = document.getElementById('abFooterSummary');

    const formattedTotal = formatRupiah(totalPrice);

    if (durBadge) durBadge.textContent = `${days} Hari`;
    if (sumDurationPill) sumDurationPill.textContent = `${days} Hari`;
    if (sumCar) sumCar.textContent = carText;
    if (sumMeta) sumMeta.textContent = `${days} Hari · ${driverLabels[driverOpt] || '+Supir'}`;
    if (sumTotal) sumTotal.textContent = formattedTotal;
    if (priceHint) priceHint.textContent = formattedTotal;
    if (dpHint) dpHint.textContent = `${formatRupiah(dpVal)} dari ${formattedTotal}`;
    if (footerSummary) {
        footerSummary.textContent = `${statusLabels[statusVal] || 'Verifikasi'} · ${payLabels[payType] || 'Lunas di Awal'}`;
    }
}

function handleAdminStartDateChange() {
    const startDateEl = document.getElementById('abStartDate');
    const endDateEl = document.getElementById('abEndDate');
    if (startDateEl && endDateEl) {
        endDateEl.min = startDateEl.value;
        if (endDateEl.value && endDateEl.value < startDateEl.value) {
            endDateEl.value = startDateEl.value;
        }
    }
    calculateAdminBookingPrice();
}

function handleAdminBookingPaymentTypeChange() {
    const payType = document.getElementById('abPaymentType')?.value || 'lunas_awal';
    setAdminPaymentType(payType);
}

function populateAdminBookingCarSelect(selectedCarId = null) {
    const carSelect = document.getElementById('abCarId');
    if (!carSelect) return;
    if (adminState.cars && adminState.cars.length > 0) {
        carSelect.innerHTML = adminState.cars.map(c =>
            `<option value="${c.id}" ${selectedCarId && c.id == selectedCarId ? 'selected' : ''}>${escapeHtml(c.brand)} ${escapeHtml(c.model)} (${escapeHtml(c.year || '')})</option>`
        ).join('');
    } else {
        carSelect.innerHTML = '<option value="1">Toyota Avanza Veloz</option>';
    }
}

function openAdminBookingModal() {
    const modal = document.getElementById('adminBookingModal');
    if (!modal) return;

    const bookingIdEl = document.getElementById('abBookingId');
    if (bookingIdEl) bookingIdEl.value = '';

    const titleIconEl = document.getElementById('adminBookingModalIcon');
    const titleTextEl = document.getElementById('adminBookingModalTitleText');
    const subtitleEl = document.getElementById('adminBookingModalSubtitle');
    const submitBtnEl = document.getElementById('abSubmitBtn');
    if (titleIconEl) titleIconEl.innerHTML = '<i class="fa-solid fa-plus"></i>';
    if (titleTextEl) titleTextEl.textContent = 'Input Booking Manual';
    if (subtitleEl) subtitleEl.textContent = 'Buat pesanan sewa unit baru secara langsung untuk pelanggan';
    if (submitBtnEl) submitBtnEl.innerHTML = '<i class="fa-solid fa-check"></i><span>Simpan Booking</span>';

    populateAdminBookingCarSelect();

    const todayStr = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('abStartDate');
    const endDateInput = document.getElementById('abEndDate');

    if (startDateInput) {
        startDateInput.min = todayStr;
        startDateInput.value = todayStr;
    }
    if (endDateInput) {
        endDateInput.min = todayStr;
        endDateInput.value = getRelativeDateStr(1);
    }

    const nameEl = document.getElementById('abCustomerName');
    const phoneEl = document.getElementById('abCustomerPhone');
    const notesEl = document.getElementById('abNotes');
    const startTimeEl = document.getElementById('abStartTime');
    const endTimeEl = document.getElementById('abEndTime');
    const driverOptEl = document.getElementById('abDriverOption');
    const eventTypeEl = document.getElementById('abEventType');
    const statusEl = document.getElementById('abStatus');

    if (nameEl) nameEl.value = '';
    if (phoneEl) phoneEl.value = '';
    if (notesEl) notesEl.value = '';
    if (startTimeEl) startTimeEl.value = '09:00';
    if (endTimeEl) endTimeEl.value = '09:00';
    if (driverOptEl) driverOptEl.value = 'with_driver';
    if (eventTypeEl) eventTypeEl.value = 'Wisata / Liburan Keluarga';
    if (statusEl) {
        statusEl.value = 'confirmed';
        statusEl.disabled = false;
    }
    const lockedHint = document.getElementById('abStatusLockedHint');
    if (lockedHint) lockedHint.classList.add('hidden');

    const dpEl = document.getElementById('abDpAmount');
    if (dpEl) dpEl.value = '';

    setAdminPaymentType('lunas_awal');
    calculateAdminBookingPrice();
    modal.classList.remove('hidden');
}

function openEditAdminBookingModal(id) {
    const booking = (adminState.bookings || []).find(b => b.id == id);
    if (!booking) return;

    const modal = document.getElementById('adminBookingModal');
    if (!modal) return;

    const bookingIdEl = document.getElementById('abBookingId');
    if (bookingIdEl) bookingIdEl.value = booking.id;

    const titleIconEl = document.getElementById('adminBookingModalIcon');
    const titleTextEl = document.getElementById('adminBookingModalTitleText');
    const subtitleEl = document.getElementById('adminBookingModalSubtitle');
    const submitBtnEl = document.getElementById('abSubmitBtn');
    if (titleIconEl) titleIconEl.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    if (titleTextEl) titleTextEl.textContent = 'Edit Data Booking';
    if (subtitleEl) subtitleEl.textContent = `${booking.booking_code ? '#' + booking.booking_code + ' · ' : ''}Perbarui jadwal, armada, atau rincian biaya sewa`;
    if (submitBtnEl) submitBtnEl.innerHTML = '<i class="fa-solid fa-check"></i><span>Simpan Perubahan</span>';

    populateAdminBookingCarSelect(booking.car_id);

    const nameEl = document.getElementById('abCustomerName');
    const phoneEl = document.getElementById('abCustomerPhone');
    const startDateEl = document.getElementById('abStartDate');
    const endDateEl = document.getElementById('abEndDate');
    const startTimeEl = document.getElementById('abStartTime');
    const endTimeEl = document.getElementById('abEndTime');
    const driverOptEl = document.getElementById('abDriverOption');
    const eventTypeEl = document.getElementById('abEventType');
    const statusEl = document.getElementById('abStatus');
    const totalPriceEl = document.getElementById('abTotalPrice');
    const dpEl = document.getElementById('abDpAmount');
    const notesEl = document.getElementById('abNotes');

    const todayStr = new Date().toISOString().split('T')[0];
    const startVal = booking.start_date ? String(booking.start_date).split('T')[0] : todayStr;
    if (startDateEl) {
        startDateEl.min = startVal < todayStr ? startVal : todayStr;
        startDateEl.value = startVal;
    }
    if (endDateEl) {
        endDateEl.value = booking.end_date ? String(booking.end_date).split('T')[0] : getRelativeDateStr(1);
        endDateEl.min = startVal;
    }

    if (nameEl) nameEl.value = booking.customer_name || '';
    if (phoneEl) phoneEl.value = booking.customer_phone || '';
    if (startTimeEl) startTimeEl.value = booking.start_time || '09:00';
    if (endTimeEl) endTimeEl.value = booking.end_time || '09:00';
    if (eventTypeEl) eventTypeEl.value = booking.event_type || 'Wisata / Liburan Keluarga';

    if (driverOptEl) {
        const dLabel = String(booking.driver_label || '').toLowerCase();
        if (dLabel.includes('luar kota')) driverOptEl.value = 'luar_kota';
        else if (booking.with_driver === false || dLabel.includes('lepas') || dLabel.includes('tanpa')) driverOptEl.value = 'without_driver';
        else driverOptEl.value = 'with_driver';
    }

    if (statusEl) {
        const norm = normalizeBookingStatusKey(booking.status);
        statusEl.value = norm;
        const lockedHint = document.getElementById('abStatusLockedHint');
        if (norm === 'confirmed') {
            statusEl.disabled = true;
            if (lockedHint) lockedHint.classList.remove('hidden');
        } else {
            statusEl.disabled = false;
            if (lockedHint) lockedHint.classList.add('hidden');
        }
    }

    if (totalPriceEl) totalPriceEl.value = parseFloat(booking.total_price) || 0;
    if (dpEl) dpEl.value = booking.dp_amount ? parseFloat(booking.dp_amount) : '';
    if (notesEl) notesEl.value = booking.notes || '';

    setAdminPaymentType(booking.payment_type || 'lunas_awal');
    updateAdminBookingSummary();
    modal.classList.remove('hidden');
}

function closeAdminBookingModal() {
    const modal = document.getElementById('adminBookingModal');
    if (modal) modal.classList.add('hidden');
}

function calculateAdminBookingPrice() {
    const carId = document.getElementById('abCarId')?.value;
    const startDateVal = document.getElementById('abStartDate')?.value;
    const endDateVal = document.getElementById('abEndDate')?.value;
    const driverOpt = document.getElementById('abDriverOption')?.value;

    if (!carId || !adminState.cars) {
        updateAdminBookingSummary();
        return;
    }
    const car = adminState.cars.find(c => c.id == carId) || adminState.cars[0];
    const isHoliday = adminState.ownerConfig ? adminState.ownerConfig.isHolidayPricingActive : false;
    const carRate = car ? (isHoliday ? (car.priceHoliday || car.priceNormal) : car.priceNormal) : 350000;

    let days = 1;
    if (startDateVal && endDateVal) {
        const start = new Date(startDateVal);
        const end = new Date(endDateVal);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        days = diffDays > 0 ? diffDays : 1;
    }

    let driverTotal = 0;
    if (driverOpt === 'with_driver' || driverOpt === 'luar_kota') {
        const driverRate = car ? (isHoliday ? (car.driverFee || 150000) : (car.driverFee || 150000)) : 150000;
        driverTotal = driverRate * days;
    }

    const grandTotal = (carRate * days) + driverTotal;
    const priceInput = document.getElementById('abTotalPrice');
    if (priceInput) priceInput.value = grandTotal;
    updateAdminBookingSummary();
}

async function handleSaveAdminBooking(e) {
    e.preventDefault();
    const editingId = document.getElementById('abBookingId')?.value || '';
    const name = document.getElementById('abCustomerName').value.trim();
    const phone = document.getElementById('abCustomerPhone').value.trim();
    const carId = document.getElementById('abCarId').value;
    const startDate = document.getElementById('abStartDate').value;
    const endDate = document.getElementById('abEndDate').value;
    const startTime = document.getElementById('abStartTime')?.value || '09:00';
    const endTime = document.getElementById('abEndTime')?.value || '09:00';
    const driverOpt = document.getElementById('abDriverOption').value;
    const eventType = document.getElementById('abEventType')?.value || 'Wisata / Liburan Keluarga';
    let status = document.getElementById('abStatus')?.value || 'confirmed';
    if (editingId) {
        const existing = (adminState.bookings || []).find(b => b.id == editingId);
        if (existing && normalizeBookingStatusKey(existing.status) === 'confirmed') {
            status = 'confirmed';
        }
    }
    const totalPrice = parseFloat(document.getElementById('abTotalPrice').value) || 0;
    const notes = document.getElementById('abNotes').value.trim();
    const paymentType = document.getElementById('abPaymentType')?.value || 'lunas_awal';
    const dpAmount = paymentType === 'dp' ? (parseFloat(document.getElementById('abDpAmount')?.value) || Math.round(totalPrice * 0.5)) : 0;

    if (endDate < startDate) {
        showAdminToast('Tanggal Tidak Valid', 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai.', 'error');
        return;
    }

    const selectedCar = (adminState.cars || []).find(c => c.id == carId);
    const carName = selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : 'Toyota Avanza Veloz';

    const driverLabel = driverOpt === 'with_driver' ? '+Supir' : (driverOpt === 'luar_kota' ? '+Supir (Luar Kota)' : 'Tanpa Supir');
    const withDriver = driverOpt !== 'without_driver';

    const apiPayload = {
        car_id: carId,
        customer_name: name,
        customer_phone: phone,
        event_type: eventType,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        with_driver: withDriver,
        driver_option: driverOpt,
        total_price: totalPrice,
        payment_type: paymentType,
        dp_amount: dpAmount,
        status: status,
        notes: notes
    };

    if (editingId) {
        const idx = (adminState.bookings || []).findIndex(b => b.id == editingId);
        if (idx !== -1) {
            adminState.bookings[idx] = {
                ...adminState.bookings[idx],
                car_id: carId,
                customer_name: name,
                customer_phone: phone,
                car_name: carName,
                event_type: eventType,
                start_date: startDate,
                end_date: endDate,
                start_time: startTime,
                end_time: endTime,
                driver_label: driverLabel,
                with_driver: withDriver,
                total_price: totalPrice,
                payment_type: paymentType,
                dp_amount: dpAmount,
                status: status,
                notes: notes
            };
        }

        try {
            await fetch(`/api/bookings/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(apiPayload)
            });
        } catch (err) {}

        saveBookingsData();
        closeAdminBookingModal();
        renderBookingsTable();
        renderHistoryTable();
        renderOverviewMetrics();
        showAdminToast('Data Booking Diperbarui', `Perubahan pesanan ${name} berhasil disimpan.`, 'success');
        return;
    }

    const newBooking = {
        id: Date.now().toString(),
        booking_code: 'RCM-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        car_id: carId,
        customer_name: name,
        customer_phone: phone,
        car_name: carName,
        event_type: eventType,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        driver_label: driverLabel,
        with_driver: withDriver,
        total_price: totalPrice,
        payment_type: paymentType,
        dp_amount: dpAmount,
        status: status,
        notes: notes
    };

    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(apiPayload)
        });
        if (res.ok) {
            const data = await res.json();
            if (data.data) {
                newBooking.id = data.data.id.toString();
                if (data.data.booking_code) newBooking.booking_code = data.data.booking_code;
            }
        }
    } catch (err) {}

    adminState.bookings.unshift(newBooking);
    saveBookingsData();
    closeAdminBookingModal();
    renderBookingsTable();
    renderHistoryTable();
    renderOverviewMetrics();
    showAdminToast('Booking Berhasil Disimpan', `Pesanan ${name} berhasil ditambahkan.`, 'success');
}

function resetAllDataToDefault() {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh data kembali ke setelan awal pabrik?')) {
        localStorage.removeItem('rcm_rent_cars');
        localStorage.removeItem('rcm_rent_config');
        localStorage.removeItem('rcm_rent_reviews');
        localStorage.removeItem('rcm_rent_bookings');
        initAdmin();
        alert('Data berhasil direset.');
    }
}

// Watcher Real-Time: Pindahkan otomatis booking yang lewat tanggal ke Riwayat Pemesanan tanpa perlu reload
let lastActiveBookingSignature = null;

function checkAndMigrateExpiredBookingsRealtime() {
    if (!adminState.isLoggedIn) return;
    const activeIds = (adminState.bookings || [])
        .filter(b => !isBookingExpired(b))
        .map(b => `${b.id}:${b.end_date}:${b.status}`)
        .join('|');

    if (lastActiveBookingSignature !== null && lastActiveBookingSignature !== activeIds) {
        renderBookingsTable();
        renderHistoryTable();
        renderOverviewMetrics();
    }
    lastActiveBookingSignature = activeIds;
}

setInterval(checkAndMigrateExpiredBookingsRealtime, 15000);

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    initAdmin();
});

// Auto-refresh data booking saat window aktif kembali atau LocalStorage berubah dari tab pelanggan
window.addEventListener('focus', () => {
    if (adminState.isLoggedIn) {
        fetchAdminBookings().then(() => {
            renderBookingsTable();
            renderHistoryTable();
            renderOverviewMetrics();
        });
    }
});

window.addEventListener('storage', (e) => {
    if (adminState.isLoggedIn && (!e.key || e.key === 'rcm_rent_bookings')) {
        fetchAdminBookings().then(() => {
            renderBookingsTable();
            renderHistoryTable();
            renderOverviewMetrics();
        });
    }
});

// Window exports for review moderation, booking history, Excel export & custom dropdown
window.openAdminAddReviewModal = openAdminAddReviewModal;
window.openAdminEditReviewModal = openAdminEditReviewModal;
window.closeAdminAddReviewModal = closeAdminAddReviewModal;
window.setAdminReviewUserType = setAdminReviewUserType;
window.setAdminReviewRating = setAdminReviewRating;
window.updateAdminReviewLivePreview = updateAdminReviewLivePreview;
window.toggleAdminReviewUserType = toggleAdminReviewUserType;
window.handleAdminRevMediaFile = handleAdminRevMediaFile;
window.handleAdminRevMediaDragOver = handleAdminRevMediaDragOver;
window.handleAdminRevMediaDragLeave = handleAdminRevMediaDragLeave;
window.handleAdminRevMediaDrop = handleAdminRevMediaDrop;
window.removeAdminRevMediaItem = removeAdminRevMediaItem;
window.removeAdminRevMedia = removeAdminRevMedia;
window.handleAdminRevAvatarFile = handleAdminRevAvatarFile;
window.handleAdminRevAvatarDragOver = handleAdminRevAvatarDragOver;
window.handleAdminRevAvatarDragLeave = handleAdminRevAvatarDragLeave;
window.handleAdminRevAvatarDrop = handleAdminRevAvatarDrop;
window.removeAdminRevAvatar = removeAdminRevAvatar;
window.handleAdminAddReviewSubmit = handleAdminAddReviewSubmit;
window.handleBookingStatusChange = handleBookingStatusChange;
window.updateBookingStatus = updateBookingStatus;
window.toggleStatusDropdownPortal = toggleStatusDropdownPortal;
window.closeStatusDropdownPortal = closeStatusDropdownPortal;
window.selectBookingStatusFromPortal = selectBookingStatusFromPortal;
window.openEditAdminBookingModal = openEditAdminBookingModal;
window.setAdminPaymentType = setAdminPaymentType;
window.updateAdminBookingSummary = updateAdminBookingSummary;
window.setAdminQuickDp = setAdminQuickDp;
window.handleAdminStartDateChange = handleAdminStartDateChange;
window.openBookingHistoryModal = openBookingHistoryModal;
window.closeBookingHistoryModal = closeBookingHistoryModal;
window.filterHistoryTable = filterHistoryTable;
window.renderHistoryTable = renderHistoryTable;
window.completeBookingRental = completeBookingRental;
window.handleAdminUploadPenaltyProof = handleAdminUploadPenaltyProof;
window.getBookingRentalTimerInfo = getBookingRentalTimerInfo;
window.updateBookingRealtimeTimers = updateBookingRealtimeTimers;
window.exportBookingHistoryExcel = exportBookingHistoryExcel;
window.formatBookingDateRange = formatBookingDateRange;
window.showAdminToast = showAdminToast;
window.toggleAdminSidebar = toggleAdminSidebar;
window.closeAdminSidebar = closeAdminSidebar;

/**
 * Dashboard Admin Owner - Logika Lengkap, Database Sync & Upload Foto Mobil
 */

let adminState = {
    cars: [],
    ownerConfig: {},
    reviews: [],
    bookings: [],
    currentTab: 'overview',
    searchQuery: '',
    reviewsFilter: 'all',
    bookingFilterStatus: 'all',
    bookingSearchQuery: '',
    isLoggedIn: false
};

const DEFAULT_BOOKINGS = [
    {
        id: "1",
        booking_code: "RCM-89A12B",
        car_id: "1",
        customer_name: "Irfan",
        customer_phone: "082196984912",
        car_name: "toyota avanza veloz",
        start_date: "2026-10-13",
        end_date: "2026-10-30",
        start_time: "09:00",
        end_time: "09:00",
        driver_label: "+Supir",
        with_driver: true,
        total_price: 9900000,
        status: "confirmed"
    }
];

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
    if (!localStorage.getItem('rcm_cars_v2')) {
        localStorage.removeItem('garuda_rent_cars');
        localStorage.setItem('rcm_cars_v2', 'true');
    }

    const savedConfig = localStorage.getItem('garuda_rent_config');
    if (savedConfig) {
        try {
            adminState.ownerConfig = JSON.parse(savedConfig);
        } catch (e) {
            adminState.ownerConfig = { ...DEFAULT_OWNER_CONFIG };
        }
    } else {
        adminState.ownerConfig = { ...DEFAULT_OWNER_CONFIG };
        localStorage.setItem('garuda_rent_config', JSON.stringify(adminState.ownerConfig));
    }

    // Load Owner Config, Cars, Reviews & Bookings from Database API
    await fetchAdminOwnerConfig();
    await fetchAdminCars();
    await fetchAdminReviews();
    await fetchAdminBookings();

    adminState.isLoggedIn = sessionStorage.getItem('garuda_admin_logged') === 'true';
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
                    whatsappNumber: c.whatsapp_number || '6281234567890',
                    phone: c.phone || '0812-3456-7890',
                    email: c.email || 'kontak@garudarentcar.com',
                    address: c.address || 'Jl. Perintis Kemerdekaan No. 10, Makassar, Sulawesi Selatan',
                    mapsUrl: c.maps_url || 'https://maps.google.com/?q=Jl.+Perintis+Kemerdekaan+No.+10,+Makassar,+Sulawesi+Selatan',
                    operatingHours: c.operating_hours || 'Buka 24 Jam Setiap Hari',
                    socialMedia: {
                        instagram: c.instagram || '@garudarentcar_id',
                        facebook: c.facebook || 'Garuda Rent Car Official',
                        tiktok: c.tiktok || '@garudarentcar'
                    },
                    isHolidayPricingActive: Boolean(c.is_holiday_pricing_active),
                    holidayNotes: c.holiday_notes || 'Tarif Musim Libur & Hari Besar Nasional (Peak Season)'
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
    const savedCars = localStorage.getItem('garuda_rent_cars');
    if (savedCars) {
        try {
            adminState.cars = JSON.parse(savedCars);
        } catch (e) {
            adminState.cars = [];
        }
    }

    try {
        const res = await fetch('/api/cars');
        if (res.ok) {
            const result = await res.json();
            if (result.data) {
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
            }
        }
    } catch (err) {
        // LocalStorage fallback
    }
}

// Fetch Reviews for Admin Moderation
async function fetchAdminReviews() {
    const savedReviews = localStorage.getItem('garuda_rent_reviews');
    if (savedReviews) {
        try {
            adminState.reviews = JSON.parse(savedReviews);
        } catch (e) {
            adminState.reviews = [...DEFAULT_REVIEWS];
        }
    } else {
        adminState.reviews = [...DEFAULT_REVIEWS];
        localStorage.setItem('garuda_rent_reviews', JSON.stringify(adminState.reviews));
    }

    try {
        const res = await fetch('/api/reviews?status=all');
        if (res.ok) {
            const result = await res.json();
            if (result.data) {
                adminState.reviews = result.data;
                localStorage.setItem('garuda_rent_reviews', JSON.stringify(adminState.reviews));
            }
        }
    } catch (err) {
        // Fallback to localStorage
    }
}

function saveCarsData() {
    localStorage.setItem('garuda_rent_cars', JSON.stringify(adminState.cars));
}

function saveConfigData() {
    localStorage.setItem('garuda_rent_config', JSON.stringify(adminState.ownerConfig));
}

function saveReviewsData() {
    localStorage.setItem('garuda_rent_reviews', JSON.stringify(adminState.reviews));
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
        sessionStorage.setItem('garuda_admin_logged', 'true');
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
        sessionStorage.removeItem('garuda_admin_logged');
        checkAuthView();
    }
}

// Ganti Tab Halaman
function switchTab(tabName) {
    adminState.currentTab = tabName;
    closeAdminSidebar();

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
        overview: { title: 'Ringkasan Bisnis & Armada', subtitle: 'Pantau ketersediaan armada dan status operasional hari ini.' },
        bookings: { title: 'Kelola Data Booking & Pesanan', subtitle: 'Pantau pesanan masuk, verifikasi status sewa, dan input booking manual.' },
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
        fetchAdminBookings().then(() => renderBookingsTable());
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

// Render 4 Kartu Metrik di Overview
function renderOverviewMetrics() {
    const total = adminState.cars.length;
    const ready = adminState.cars.filter(c => c.status === 'ready').length;
    const inUse = adminState.cars.filter(c => c.status === 'in_use').length;

    const totalEl = document.getElementById('statTotalCars');
    const readyEl = document.getElementById('statReadyCars');
    const inUseEl = document.getElementById('statInUseCars');
    const waEl = document.getElementById('statWaNumber');

    if (totalEl) totalEl.textContent = total;
    if (readyEl) readyEl.textContent = ready;
    if (inUseEl) inUseEl.textContent = inUse;
    if (waEl) waEl.textContent = `+${adminState.ownerConfig.whatsappNumber || '6281234567890'}`;
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

// Render Tabel & Moderasi Review Pelanggan
function renderReviewsTable() {
    const tbody = document.getElementById('reviewsTableBody');
    if (!tbody) return;

    const totalCount = adminState.reviews.length;
    const pendingCount = adminState.reviews.filter(r => r.status === 'pending').length;
    const approvedCount = adminState.reviews.filter(r => r.status === 'approved' || !r.status).length;
    const rejectedCount = adminState.reviews.filter(r => r.status === 'rejected').length;

    // Update Counter Badges
    const badgeTotal = document.getElementById('reviewStatTotal');
    const badgePending = document.getElementById('reviewStatPending');
    const badgeApproved = document.getElementById('reviewStatApproved');
    const badgeRejected = document.getElementById('reviewStatRejected');

    if (badgeTotal) badgeTotal.textContent = totalCount;
    if (badgePending) badgePending.textContent = pendingCount;
    if (badgeApproved) badgeApproved.textContent = approvedCount;
    if (badgeRejected) badgeRejected.textContent = rejectedCount;

    // Filter list
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
        const rating = parseInt(rev.rating || 5);
        const starsHtml = Array.from({ length: 5 }, (_, i) => 
            `<svg style="width:0.875rem;height:0.875rem;fill:${i < rating ? '#22c55e' : '#cbd5e1'};stroke:${i < rating ? '#22c55e' : '#cbd5e1'}" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
        ).join('');

        const status = rev.status || 'approved';
        let statusBadge = '';

        if (status === 'pending') {
            statusBadge = `<span style="background: #fef3c7; color: #d97706; border: 1px solid #fde68a; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.25rem;"><svg style="width:0.75rem;height:0.75rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Menunggu Verifikasi</span>`;
        } else if (status === 'approved') {
            statusBadge = `<span style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.25rem;"><svg style="width:0.75rem;height:0.75rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Disetujui / Dipublikasi</span>`;
        } else {
            statusBadge = `<span style="background: #ffe4e6; color: #e11d48; border: 1px solid #fecdd3; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.25rem;"><svg style="width:0.75rem;height:0.75rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Ditolak</span>`;
        }

        const avatarSrc = rev.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name)}&background=22c55e&color=fff&bold=true`;

        return `
            <tr style="border-bottom: 1px solid var(--clr-border);">
                <td style="padding: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <img src="${avatarSrc}" alt="${rev.name}" style="width: 2.5rem; height: 2.5rem; border-radius: 50%; object-fit: cover; border: 1px solid var(--clr-border);">
                        <div>
                            <div style="font-weight: 800; font-size: 0.875rem; color: var(--clr-text-main);">${rev.name}</div>
                            <div style="font-size: 0.7rem; color: var(--clr-primary); font-weight: 600;">${rev.car_name || 'Mobil Rental'}</div>
                        </div>
                    </div>
                </td>
                <td style="padding: 1rem;">
                    <div style="display: flex; gap: 0.1rem; align-items: center;">
                        ${starsHtml}
                    </div>
                </td>
                <td style="padding: 1rem; font-size: 0.8125rem; color: var(--clr-text-muted); max-width: 24rem; line-height: 1.5;">
                    "${rev.comment}"
                </td>
                <td style="padding: 1rem;">
                    ${statusBadge}
                </td>
                <td style="padding: 1rem; text-align: right;">
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.35rem;">
                        ${status !== 'approved' ? `
                            <button onclick="approveReview('${rev.id}')" class="btn btn-emerald btn-sm" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.25rem;" title="Verifikasi & Tampilkan di Website">
                                <svg style="width:0.75rem;height:0.75rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                Setujui
                            </button>
                        ` : ''}
                        ${status !== 'rejected' ? `
                            <button onclick="rejectReview('${rev.id}')" class="btn btn-outline btn-sm" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; color: #d97706; border-color: #fde68a; display: inline-flex; align-items: center; gap: 0.25rem;" title="Sembunyikan dari Website">
                                <svg style="width:0.75rem;height:0.75rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                Tolak
                            </button>
                        ` : ''}
                        <button onclick="openAdminEditReviewModal('${rev.id}')" class="btn btn-outline btn-sm" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; color: #3b82f6; border-color: #bfdbfe; display: inline-flex; align-items: center; gap: 0.25rem;" title="Edit Ulasan & Foto">
                            <svg style="width:0.75rem;height:0.75rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Edit
                        </button>
                        <button onclick="deleteReview('${rev.id}')" class="btn btn-outline btn-sm" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; color: var(--clr-rose); border-color: #fecdd3;" title="Hapus Ulasan">
                            <svg style="width:0.75rem;height:0.75rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter Status Review Admin
function setAdminReviewFilter(status, btnEl) {
    adminState.reviewsFilter = status;

    document.querySelectorAll('.review-filter-btn').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
    });

    if (btnEl) {
        btnEl.classList.add('btn-primary');
        btnEl.classList.remove('btn-outline');
    }

    renderReviewsTable();
}

// Verifikasi & Approve Review
async function approveReview(reviewId) {
    const rev = adminState.reviews.find(r => r.id == reviewId);
    if (!rev) return;

    rev.status = 'approved';

    // API Call
    try {
        await fetch(`/api/reviews/${reviewId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ status: 'approved' })
        });
    } catch (e) {}

    saveReviewsData();
    renderReviewsTable();
    alert(`Ulasan dari "${rev.name}" berhasil diverifikasi & dipublikasikan ke halaman utama website!`);
}

// Tolak / Sembunyikan Review
async function rejectReview(reviewId) {
    const rev = adminState.reviews.find(r => r.id == reviewId);
    if (!rev) return;

    rev.status = 'rejected';

    // API Call
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

        // API Call
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
    if (titleEl) titleEl.textContent = 'Tambah Review Pelanggan Manual';

    const submitBtn = document.getElementById('adminRevSubmitBtn');
    if (submitBtn) submitBtn.textContent = 'Simpan & Publikasikan Ulasan';

    const idEl = document.getElementById('adminRevId');
    if (idEl) idEl.value = '';

    const ratingEl = document.getElementById('adminRevRating');
    if (ratingEl) ratingEl.value = '5';

    const avatarEl = document.getElementById('adminRevAvatar');
    if (avatarEl) avatarEl.value = '';

    const fileInput = document.getElementById('adminRevAvatarFile');
    if (fileInput) fileInput.value = '';

    const previewBox = document.getElementById('adminRevAvatarPreviewBox');
    if (previewBox) previewBox.style.display = 'none';
}

// Modal Admin Edit Review
function openAdminEditReviewModal(reviewId) {
    const rev = adminState.reviews.find(r => r.id == reviewId);
    if (!rev) return;

    const modal = document.getElementById('adminReviewModal');
    if (modal) modal.classList.remove('hidden');

    const titleEl = document.getElementById('adminReviewModalTitle');
    if (titleEl) titleEl.textContent = 'Edit Review Pelanggan';

    const submitBtn = document.getElementById('adminRevSubmitBtn');
    if (submitBtn) submitBtn.textContent = 'Perbarui Ulasan';

    document.getElementById('adminRevId').value = rev.id;
    document.getElementById('adminRevName').value = rev.name || '';
    document.getElementById('adminRevRating').value = rev.rating || '5';
    document.getElementById('adminRevCar').value = rev.car_name || '';
    document.getElementById('adminRevComment').value = rev.comment || '';
    document.getElementById('adminRevAvatar').value = rev.avatar || '';

    const fileInput = document.getElementById('adminRevAvatarFile');
    if (fileInput) fileInput.value = '';

    const previewBox = document.getElementById('adminRevAvatarPreviewBox');
    const previewImg = document.getElementById('adminRevAvatarPreview');
    if (rev.avatar) {
        if (previewImg) previewImg.src = rev.avatar;
        if (previewBox) previewBox.style.display = 'flex';
    } else {
        if (previewBox) previewBox.style.display = 'none';
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

    const reader = new FileReader();
    reader.onload = function (evt) {
        const base64 = evt.target.result;
        const avatarInput = document.getElementById('adminRevAvatar');
        if (avatarInput) avatarInput.value = base64;

        const previewBox = document.getElementById('adminRevAvatarPreviewBox');
        const previewImg = document.getElementById('adminRevAvatarPreview');
        if (previewImg) previewImg.src = base64;
        if (previewBox) previewBox.style.display = 'flex';
    };
    reader.readAsDataURL(file);
}

function handleAdminRevAvatarFile(e) {
    const file = e.target.files[0];
    if (file) processAdminRevAvatarFile(file);
}

function handleAdminRevAvatarDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const zone = document.getElementById('adminRevAvatarDropZone');
    if (zone) {
        zone.style.borderColor = 'var(--clr-primary, #10b981)';
        zone.style.background = '#f0fdf4';
    }
}

function handleAdminRevAvatarDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const zone = document.getElementById('adminRevAvatarDropZone');
    if (zone) {
        zone.style.borderColor = 'var(--clr-border, #cbd5e1)';
        zone.style.background = '#f8fafc';
    }
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

    const previewBox = document.getElementById('adminRevAvatarPreviewBox');
    if (previewBox) previewBox.style.display = 'none';
}

async function handleAdminAddReviewSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('adminRevId').value;
    const name = document.getElementById('adminRevName').value.trim();
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
    formData.append('rating', rating);
    formData.append('car_name', carName);
    formData.append('comment', comment);

    if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append('avatar_file', fileInput.files[0]);
    } else if (avatarVal) {
        formData.append('avatar', avatarVal);
    } else if (!id) {
        formData.append('avatar', `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22c55e&color=fff&bold=true`);
    }

    const submitBtn = document.getElementById('adminRevSubmitBtn');
    const origBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Menyimpan...';
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
            submitBtn.textContent = origBtnText;
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
                    rating,
                    car_name: carName,
                    comment,
                    avatar: avatarVal || adminState.reviews[idx].avatar
                };
            }
        }
        alert("Ulasan berhasil diperbarui.");
    } else {
        if (!savedRev) {
            savedRev = {
                id: Date.now(),
                name,
                rating,
                car_name: carName,
                comment,
                status: 'approved',
                avatar: avatarVal || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22c55e&color=fff&bold=true`,
                created_at: new Date().toISOString()
            };
        }
        adminState.reviews.unshift(savedRev);
        alert("Ulasan berhasil ditambahkan dan dipublikasikan.");
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

    if (businessInput) businessInput.value = cfg.businessName || 'Rent Car Makassar';
    if (waInput) waInput.value = cfg.whatsappNumber || '6281234567890';
    if (phoneInput) phoneInput.value = cfg.phone || '0812-3456-7890';
    if (emailInput) emailInput.value = cfg.email || 'kontak@garudarentcar.com';
    if (addressInput) addressInput.value = cfg.address || 'Jl. Perintis Kemerdekaan No. 10, Makassar, Sulawesi Selatan';
    if (mapsInput) mapsInput.value = cfg.mapsUrl || cfg.maps_url || 'https://maps.google.com/?q=Jl.+Perintis+Kemerdekaan+No.+10,+Makassar,+Sulawesi+Selatan';
    if (hoursInput) hoursInput.value = cfg.operatingHours || 'Buka 24 Jam Setiap Hari';
    if (igInput) igInput.value = sm.instagram || cfg.instagram || '@garudarentcar_id';
    if (fbInput) fbInput.value = sm.facebook || cfg.facebook || 'Garuda Rent Car Official';
    if (tiktokInput) tiktokInput.value = sm.tiktok || cfg.tiktok || '@garudarentcar';
}

// Simpan Kontak Owner & WhatsApp
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

    adminState.ownerConfig = {
        ...adminState.ownerConfig,
        businessName,
        whatsappNumber: wa,
        phone,
        email,
        address,
        mapsUrl,
        operatingHours,
        socialMedia: { instagram, facebook, tiktok }
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
                tiktok: tiktok
            })
        });
    } catch (err) {
        console.error("Gagal simpan kontak ke API:", err);
    }

    renderOverviewMetrics();
    renderContactForm();
    showAdminToast('Pengaturan Disimpan', 'Informasi kontak & titik GPS berhasil diperbarui.', 'success');
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

    // 1. Try reading from LocalStorage
    const savedBookings = localStorage.getItem('garuda_rent_bookings');
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
                    status: b.status || 'pending',
                    notes: b.notes || '',
                    ktp_image: b.ktp_image || ''
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
    localStorage.setItem('garuda_rent_bookings', JSON.stringify(adminState.bookings));
}

function saveBookingsData() {
    localStorage.setItem('garuda_rent_bookings', JSON.stringify(adminState.bookings));
}

function renderBookingsTable() {
    const tbody = document.getElementById('adminBookingsTableBody');
    if (!tbody) return;

    const searchQuery = (document.getElementById('adminBookingSearch')?.value || adminState.bookingSearchQuery || '').toLowerCase();
    const filterStatus = document.getElementById('adminBookingFilterStatus')?.value || adminState.bookingFilterStatus || 'all';

    let filtered = (adminState.bookings || []).filter(b => {
        const matchesSearch = !searchQuery || 
            (b.customer_name && b.customer_name.toLowerCase().includes(searchQuery)) ||
            (b.customer_phone && b.customer_phone.toLowerCase().includes(searchQuery)) ||
            (b.car_name && b.car_name.toLowerCase().includes(searchQuery)) ||
            (b.booking_code && b.booking_code.toLowerCase().includes(searchQuery));
        
        let matchesStatus = true;
        if (filterStatus !== 'all') {
            const curStatus = (b.status || 'pending').toLowerCase();
            if (filterStatus === 'confirmed') {
                matchesStatus = (curStatus === 'confirmed' || curStatus === 'verifikasi' || curStatus === 'dikonfirmasi');
            } else if (filterStatus === 'pending') {
                matchesStatus = (curStatus === 'pending' || curStatus === 'menunggu' || curStatus === 'menunggu pembayaran');
            } else if (filterStatus === 'cancelled') {
                matchesStatus = (curStatus === 'cancelled' || curStatus === 'dibatalkan' || curStatus === 'dibatalakn' || curStatus === 'batal');
            } else {
                matchesStatus = (curStatus === filterStatus);
            }
        }

        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="padding: 2.5rem; text-align: center; color: var(--clr-text-muted);">
                    Belum ada data booking atau tidak ada pesanan yang sesuai dengan pencarian/filter.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(b => {
        const statusVal = (b.status || 'pending').toLowerCase();
        let selectClass = 'status-pending';
        let isConfirmed = false;
        let isPending = false;
        let isCancelled = false;

        if (statusVal === 'confirmed' || statusVal === 'verifikasi' || statusVal === 'dikonfirmasi') {
            selectClass = 'status-confirmed';
            isConfirmed = true;
        } else if (statusVal === 'cancelled' || statusVal === 'dibatalkan' || statusVal === 'dibatalakn' || statusVal === 'batal') {
            selectClass = 'status-cancelled';
            isCancelled = true;
        } else {
            selectClass = 'status-pending';
            isPending = true;
        }

        const dateDisplay = formatBookingDateRange(b.start_date, b.end_date, b.start_time, b.end_time);
        const driverDisplay = b.driver_label || (b.with_driver ? '+Supir' : 'Tanpa Supir');
        const carDisplay = b.car_name || 'Toyota Avanza Veloz';

        const statusSelectHtml = `
            <select onchange="handleBookingStatusChange('${b.id}', this.value)" class="booking-status-select ${selectClass}">
                <option value="confirmed" ${isConfirmed ? 'selected' : ''}>Verifikasi</option>
                <option value="pending" ${isPending ? 'selected' : ''}>Menunggu Pembayaran</option>
                <option value="cancelled" ${isCancelled ? 'selected' : ''}>Dibatalkan</option>
            </select>
        `;

        return `
            <tr style="border-bottom: 1px solid var(--clr-border); background: #ffffff;">
                <td style="padding: 1rem 1.25rem;">
                    <div style="font-weight: 700; color: var(--clr-text-main); font-size: 0.875rem;">${escapeHtml(b.customer_name)}</div>
                    <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.15rem;">${escapeHtml(b.customer_phone)}</div>
                    ${b.booking_code ? `<span style="display:inline-block; font-size: 0.65rem; background: #f1f5f9; color: #475569; padding: 0.1rem 0.35rem; border-radius: 4px; margin-top: 0.25rem; font-family: monospace;">${escapeHtml(b.booking_code)}</span>` : ''}
                </td>
                <td style="padding: 1rem 1.25rem; color: var(--clr-text-main); font-weight: 600;">
                    ${escapeHtml(carDisplay)}
                </td>
                <td style="padding: 1rem 1.25rem; white-space: nowrap;">
                    ${dateDisplay}
                </td>
                <td style="padding: 1rem 1.25rem; color: #059669; font-weight: 600;">
                    ${escapeHtml(driverDisplay)}
                </td>
                <td style="padding: 1rem 1.25rem; font-weight: 800; color: var(--clr-text-main); white-space: nowrap;">
                    ${formatRupiah(b.total_price)}
                </td>
                <td style="padding: 1rem 1.25rem;">
                    ${statusSelectHtml}
                </td>
                <td style="padding: 1rem 1.25rem; text-align: center;">
                    <button onclick="viewBookingDocument('${b.id}')" style="background: #2563eb; color: white; border: none; padding: 0.4rem 0.85rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: background 0.15s; display: inline-flex; align-items: center; gap: 0.35rem;" title="Lihat Dokumen Persyaratan & KTP">📄 Lihat Dokumen</button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterBookingsTable() {
    adminState.bookingSearchQuery = document.getElementById('adminBookingSearch')?.value || '';
    adminState.bookingFilterStatus = document.getElementById('adminBookingFilterStatus')?.value || 'all';
    renderBookingsTable();
}

async function handleBookingStatusChange(id, newStatus) {
    await updateBookingStatus(id, newStatus);
}

async function updateBookingStatus(id, newStatus) {
    const idx = adminState.bookings.findIndex(b => b.id == id);
    if (idx !== -1) {
        adminState.bookings[idx].status = newStatus;
        saveBookingsData();
        renderBookingsTable();

        const statusLabels = {
            confirmed: 'Verifikasi',
            pending: 'Menunggu Pembayaran',
            cancelled: 'Dibatalkan'
        };
        const toastType = newStatus === 'confirmed' ? 'success' : (newStatus === 'cancelled' ? 'error' : 'warning');
        showAdminToast('Status Booking Diperbarui', `Pesanan #${id} status: ${statusLabels[newStatus] || newStatus}`, toastType);

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

    try {
        await fetch(`/api/bookings/${id}`, {
            method: 'DELETE'
        });
    } catch (e) {}
}

let currentViewingBookingId = null;

function viewBookingDocument(id) {
    currentViewingBookingId = id;
    const booking = (adminState.bookings || []).find(b => b.id == id);
    if (!booking) return;

    const modal = document.getElementById('documentViewModal');
    if (!modal) return;

    const nameEl = document.getElementById('docCustomerName');
    const phoneEl = document.getElementById('docCustomerPhone');
    const carEl = document.getElementById('docCarName');
    const codeEl = document.getElementById('docBookingCode');

    if (nameEl) nameEl.textContent = booking.customer_name || '-';
    if (phoneEl) phoneEl.textContent = booking.customer_phone || '-';
    if (carEl) carEl.textContent = booking.car_name || '-';
    if (codeEl) codeEl.textContent = booking.booking_code || '-';

    const img = document.getElementById('docKtpImage');
    const noImgMsg = document.getElementById('docNoImageMsg');
    const openFullBtn = document.getElementById('docOpenFullBtn');
    const chatWaBtn = document.getElementById('docChatWaBtn');

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

    modal.classList.remove('hidden');
}

// Upload atau ganti foto KTP langsung dari Admin Dashboard
async function handleAdminUploadKtp(event) {
    const file = event.target.files[0];
    if (!file || !currentViewingBookingId) return;

    const booking = (adminState.bookings || []).find(b => b.id == currentViewingBookingId);
    if (!booking) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const rawBase64 = e.target.result;
        
        // Kompres via Canvas (max 1280px)
        const tempImg = new Image();
        tempImg.onload = async function() {
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

            booking.ktp_image = compressedBase64;
            saveBookingsData();

            try {
                await fetch(`/api/bookings/${booking.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        ktp_image: compressedBase64
                    })
                });
            } catch (err) {
                console.error(err);
            }

            viewBookingDocument(booking.id);
            renderBookingsTable();
            alert('✅ Foto KTP berhasil disimpan!');
            event.target.value = '';
        };
        tempImg.src = rawBase64;
    };
    reader.readAsDataURL(file);
}

function closeDocumentViewModal() {
    const modal = document.getElementById('documentViewModal');
    if (modal) modal.classList.add('hidden');
}

window.viewBookingDocument = viewBookingDocument;
window.closeDocumentViewModal = closeDocumentViewModal;
window.handleAdminUploadKtp = handleAdminUploadKtp;

function openAdminBookingModal() {
    const modal = document.getElementById('adminBookingModal');
    if (!modal) return;

    const carSelect = document.getElementById('abCarId');
    if (carSelect) {
        if (adminState.cars && adminState.cars.length > 0) {
            carSelect.innerHTML = adminState.cars.map(c => 
                `<option value="${c.id}">${c.brand} ${c.model} (${c.year})</option>`
            ).join('');
        } else {
            carSelect.innerHTML = '<option value="1">Toyota Avanza Veloz</option>';
        }
    }

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const startDateInput = document.getElementById('abStartDate');
    const endDateInput = document.getElementById('abEndDate');
    if (startDateInput) startDateInput.value = today;
    if (endDateInput) endDateInput.value = tomorrow;

    calculateAdminBookingPrice();
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

    if (!carId || !adminState.cars) return;
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
}

async function handleSaveAdminBooking(e) {
    e.preventDefault();
    const name = document.getElementById('abCustomerName').value.trim();
    const phone = document.getElementById('abCustomerPhone').value.trim();
    const carId = document.getElementById('abCarId').value;
    const startDate = document.getElementById('abStartDate').value;
    const endDate = document.getElementById('abEndDate').value;
    const startTime = document.getElementById('abStartTime')?.value || '09:00';
    const endTime = document.getElementById('abEndTime')?.value || '09:00';
    const driverOpt = document.getElementById('abDriverOption').value;
    const status = document.getElementById('abStatus').value;
    const totalPrice = parseFloat(document.getElementById('abTotalPrice').value) || 0;
    const notes = document.getElementById('abNotes').value.trim();

    const selectedCar = (adminState.cars || []).find(c => c.id == carId);
    const carName = selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : 'toyota avanza veloz';

    const driverLabel = driverOpt === 'with_driver' ? '+Supir' : (driverOpt === 'luar_kota' ? '+Supir (Luar Kota)' : 'Tanpa Supir');
    const withDriver = driverOpt !== 'without_driver';

    const newBooking = {
        id: Date.now().toString(),
        booking_code: 'RCM-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        car_id: carId,
        customer_name: name,
        customer_phone: phone,
        car_name: carName,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        driver_label: driverLabel,
        with_driver: withDriver,
        total_price: totalPrice,
        status: status,
        notes: notes
    };

    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                car_id: carId,
                customer_name: name,
                customer_phone: phone,
                start_date: startDate,
                end_date: endDate,
                start_time: startTime,
                end_time: endTime,
                with_driver: withDriver,
                driver_option: driverOpt,
                total_price: totalPrice,
                status: status,
                notes: notes
            })
        });
        if (res.ok) {
            const data = await res.json();
            if (data.data) {
                newBooking.id = data.data.id.toString();
            }
        }
    } catch (err) {}

    adminState.bookings.unshift(newBooking);
    saveBookingsData();
    closeAdminBookingModal();
    renderBookingsTable();
    alert('✅ Data Booking Manual berhasil disimpan!');
}

function resetAllDataToDefault() {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh data kembali ke setelan awal pabrik?')) {
        localStorage.removeItem('garuda_rent_cars');
        localStorage.removeItem('garuda_rent_config');
        localStorage.removeItem('garuda_rent_reviews');
        localStorage.removeItem('garuda_rent_bookings');
        initAdmin();
        alert('Data berhasil direset.');
    }
}

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    initAdmin();
});

// Auto-refresh data booking saat window aktif kembali
window.addEventListener('focus', () => {
    if (adminState.isLoggedIn && adminState.currentTab === 'bookings') {
        fetchAdminBookings().then(() => renderBookingsTable());
    }
});

// Window exports for review moderation & manual add/edit
window.openAdminAddReviewModal = openAdminAddReviewModal;
window.openAdminEditReviewModal = openAdminEditReviewModal;
window.closeAdminAddReviewModal = closeAdminAddReviewModal;
window.handleAdminRevAvatarFile = handleAdminRevAvatarFile;
window.handleAdminRevAvatarDragOver = handleAdminRevAvatarDragOver;
window.handleAdminRevAvatarDragLeave = handleAdminRevAvatarDragLeave;
window.handleAdminRevAvatarDrop = handleAdminRevAvatarDrop;
window.removeAdminRevAvatar = removeAdminRevAvatar;
window.handleAdminAddReviewSubmit = handleAdminAddReviewSubmit;
window.handleBookingStatusChange = handleBookingStatusChange;
window.updateBookingStatus = updateBookingStatus;
window.formatBookingDateRange = formatBookingDateRange;
window.showAdminToast = showAdminToast;
window.toggleAdminSidebar = toggleAdminSidebar;
window.closeAdminSidebar = closeAdminSidebar;

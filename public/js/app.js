/**
 * Aplikasi Rental Mobil RPM — Frontend Pelanggan & Pemesanan
 */

// Global State
let state = {
    cars: [],
    ownerConfig: {},
    reviews: [],
    selectedCar: null,
    confirmedBookings: [],
    ktpImageBase64: null,
    paymentProofBase64: null,
    reviewAvatarBase64: null,
    reviewStories: [],
    selectedReviewRating: 5,
    currentCategoryFilter: 'all',
    searchQuery: '',
    isCatalogExpanded: false
};

// Format Rupiah helper
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Escape HTML helper
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Format Tanggal Tampilan
function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return dateStr;
    }
}

// Inisialisasi State dari LocalStorage & API
async function initStorage() {
    // Bersihkan cache lama (garuda_ keys) & paksa refresh data
    ['garuda_rent_cars','garuda_rent_config','garuda_rent_reviews','garuda_rent_bookings'].forEach(k => localStorage.removeItem(k));
    if (localStorage.getItem('rcm_cars_v_rev') !== '9') {
        localStorage.removeItem('rcm_rent_cars');
        localStorage.removeItem('rcm_rent_config');
        localStorage.removeItem('rcm_rent_reviews');
        localStorage.removeItem('rcm_rent_bookings');
        localStorage.setItem('rcm_cars_v_rev', '9');
    }

    // 1. Cars initial cache
    const savedCars = localStorage.getItem('rcm_rent_cars');
    if (savedCars) {
        try {
            state.cars = JSON.parse(savedCars);
        } catch (e) {
            state.cars = [...(typeof DEFAULT_CARS !== 'undefined' ? DEFAULT_CARS : [])];
        }
    }
    if (!state.cars || state.cars.length === 0) {
        state.cars = [...(typeof DEFAULT_CARS !== 'undefined' ? DEFAULT_CARS : [])];
        localStorage.setItem('rcm_rent_cars', JSON.stringify(state.cars));
    }

    // 2. Config initial cache
    const savedConfig = localStorage.getItem('rcm_rent_config');
    if (savedConfig) {
        try {
            state.ownerConfig = JSON.parse(savedConfig);
        } catch (e) {
            state.ownerConfig = { ...DEFAULT_OWNER_CONFIG };
        }
    } else {
        state.ownerConfig = { ...DEFAULT_OWNER_CONFIG };
        localStorage.setItem('rcm_rent_config', JSON.stringify(state.ownerConfig));
    }

    // 3. Reviews initial cache
    const savedReviews = localStorage.getItem('rcm_rent_reviews');
    if (savedReviews) {
        try {
            state.reviews = JSON.parse(savedReviews);
        } catch (e) {
            state.reviews = [...DEFAULT_REVIEWS];
        }
    } else {
        state.reviews = [...DEFAULT_REVIEWS];
        localStorage.setItem('rcm_rent_reviews', JSON.stringify(state.reviews));
    }

    // Render UI LANGSUNG seketika (0 ms) sehingga halaman tidak nge-lag/blank
    renderOwnerInfo();
    renderCarsCatalog();
    renderReviews();

    // 4. Fetch pembaruan dari backend API secara PARALEL di latar belakang
    Promise.allSettled([
        fetchCarsApi(),
        fetchConfigApi(),
        fetchReviewsApi()
    ]);
}

// Fetch Cars dari API secara background
async function fetchCarsApi() {
    try {
        const res = await fetch('/api/cars');
        if (res.ok) {
            const result = await res.json();
            if (result.data && result.data.length > 0) {
                state.cars = result.data.map(c => ({
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
                    driver_fee: parseFloat(c.driver_fee || 50000),
                    driverFee: parseFloat(c.driver_fee || 50000),
                    driverRateNormal: parseFloat(c.driver_fee || c.driver_rate_normal || 50000),
                    driverRateHoliday: parseFloat(c.driver_fee || c.driver_rate_holiday || 50000),
                    rental_option: c.rental_option || 'both',
                    rentalOption: c.rental_option || 'both',
                    status: c.status,
                    image: c.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
                    description: c.description
                }));
                localStorage.setItem('rcm_rent_cars', JSON.stringify(state.cars));
                renderCarsCatalog();
            }
        }
    } catch (err) {}
}

// Fetch Config dari API secara background
async function fetchConfigApi() {
    try {
        const res = await fetch('/api/owner-config');
        if (res.ok) {
            const result = await res.json();
            if (result.data) {
                const c = result.data;
                state.ownerConfig = {
                    businessName: c.business_name,
                    tagline: c.tagline,
                    description: c.description,
                    whatsappNumber: c.whatsapp_number,
                    phone: c.phone,
                    email: c.email,
                    address: c.address,
                    mapsUrl: c.maps_url || null,
                    operatingHours: c.operating_hours,
                    socialMedia: {
                        instagram: c.instagram,
                        facebook: c.facebook,
                        tiktok: c.tiktok
                    },
                    isHolidayPricingActive: !!c.is_holiday_pricing_active,
                    holidayNotes: c.holiday_notes,
                    bankName: c.bank_name || state.ownerConfig.bankName || 'BCA',
                    bankAccountNumber: c.bank_account_number || state.ownerConfig.bankAccountNumber || '7890123456',
                    bankAccountHolder: c.bank_account_holder || state.ownerConfig.bankAccountHolder || 'RPM Rent Car Makassar',
                    qrisImage: c.qris_image !== undefined ? (c.qris_image || '') : (state.ownerConfig.qrisImage || '')
                };
                localStorage.setItem('rcm_rent_config', JSON.stringify(state.ownerConfig));
                renderOwnerInfo();
            }
        }
    } catch (err) {}
}

// Fetch Reviews dari API secara background
async function fetchReviewsApi() {
    try {
        const res = await fetch('/api/reviews?status=approved');
        if (res.ok) {
            const result = await res.json();
            if (result.data && result.data.length > 0) {
                state.reviews = result.data;
                localStorage.setItem('rcm_rent_reviews', JSON.stringify(state.reviews));
                renderReviews();
            }
        }
    } catch (err) {}
}

// Render Header, Info Rental & Kontak Owner
function renderOwnerInfo() {
    const cfg = state.ownerConfig;

    // Title & Taglines
    document.querySelectorAll('.brand-title').forEach(el => {
        if (el.dataset.customBrand === 'rpm') {
            el.innerHTML = `RPM <span style="color: var(--clr-primary);">Rent Car</span>`;
        } else {
            el.textContent = cfg.businessName || 'RPM Rent Car Makassar';
        }
    });
    document.querySelectorAll('.brand-tagline').forEach(el => el.textContent = cfg.tagline || '');
    document.querySelectorAll('.brand-desc').forEach(el => el.textContent = cfg.description || '');

    // Kontak info
    const phoneEls = document.querySelectorAll('.owner-phone');
    phoneEls.forEach(el => {
        el.textContent = cfg.phone || '0812-3456-7890';
        if (el.tagName === 'A') el.href = `tel:${(cfg.phone || '').replace(/[^0-9]/g, '')}`;
    });

    const waEls = document.querySelectorAll('.owner-whatsapp');
    waEls.forEach(el => {
        if (!el.classList.contains('floating-wa-clean') && !el.classList.contains('wa-icon-only')) {
            el.textContent = `+${cfg.whatsappNumber || '6281234567890'}`;
        }
        if (el.tagName === 'A') el.href = `https://wa.me/${cfg.whatsappNumber || '6281234567890'}?text=${encodeURIComponent('Halo RPM Rent Car Makassar, saya ingin berkonsultasi mengenai sewa mobil.')}`;
    });

    const emailEls = document.querySelectorAll('.owner-email');
    emailEls.forEach(el => {
        el.textContent = cfg.email || 'kontak@rentcarmakassar.com';
        if (el.tagName === 'A') el.href = `mailto:${cfg.email || ''}`;
    });

    const addressEls = document.querySelectorAll('.owner-address');
    addressEls.forEach(el => el.textContent = cfg.address || 'Jl. Perintis Kemerdekaan No. 10, Makassar, Sulawesi Selatan');

    const mapsUrl = cfg.mapsUrl || cfg.maps_url || `https://maps.google.com/?q=${encodeURIComponent(cfg.address || 'Jl. Perintis Kemerdekaan No. 10, Makassar, Sulawesi Selatan')}`;
    const gpsBtns = document.querySelectorAll('.owner-gps-link');
    gpsBtns.forEach(btn => btn.href = mapsUrl);

    const gpsIframe = document.getElementById('ownerGpsIframe');
    if (gpsIframe) {
        gpsIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(cfg.address || 'Jl. Perintis Kemerdekaan No. 10, Makassar, Sulawesi Selatan')}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    const hoursEls = document.querySelectorAll('.owner-hours');
    hoursEls.forEach(el => el.textContent = cfg.operatingHours || 'Buka 24 Jam Setiap Hari');

    // Medsos
    const igEl = document.getElementById('footerIg');
    if (igEl && cfg.socialMedia) {
        const span = igEl.querySelector('.medsos-text') || igEl;
        span.textContent = cfg.socialMedia.instagram || 'Instagram';
        igEl.href = `https://instagram.com/${(cfg.socialMedia.instagram || '').replace('@', '')}`;
    }
    const fbEl = document.getElementById('footerFb');
    if (fbEl && cfg.socialMedia) {
        const span = fbEl.querySelector('.medsos-text') || fbEl;
        span.textContent = cfg.socialMedia.facebook || 'Facebook';
    }
    const ttEl = document.getElementById('footerTiktok');
    if (ttEl && cfg.socialMedia) {
        const span = ttEl.querySelector('.medsos-text') || ttEl;
        span.textContent = cfg.socialMedia.tiktok || 'TikTok';
        ttEl.href = `https://tiktok.com/@${(cfg.socialMedia.tiktok || '').replace('@', '')}`;
    }

    // Holiday Alert Banner (bagian atas jika mode liburan dinonaktifkan sesuai permintaan)
    const holidayBanner = document.getElementById('holidayAlertBanner');
    if (holidayBanner) {
        holidayBanner.classList.add('hidden');
        holidayBanner.style.display = 'none';
    }
}

// Render Katalog Unit Mobil
function renderCarsCatalog() {
    const grid = document.getElementById('carsGrid');
    if (!grid) return;

    let filtered = state.cars;

    // Filter Kategori
    if (state.currentCategoryFilter !== 'all') {
        filtered = filtered.filter(c => c.category.toLowerCase() === state.currentCategoryFilter.toLowerCase());
    }

    // Filter Pencarian
    if (state.searchQuery.trim() !== '') {
        const q = state.searchQuery.toLowerCase();
        filtered = filtered.filter(c =>
            c.brand.toLowerCase().includes(q) ||
            c.model.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
        );
    }

    // Counter Ringkas
    const totalReady = state.cars.filter(c => c.status === 'ready').length;
    const totalInUse = state.cars.filter(c => c.status === 'in_use').length;

    const readyCounter = document.getElementById('readyCountBadge');
    if (readyCounter) readyCounter.textContent = `${totalReady} Unit Ready`;

    const inUseCounter = document.getElementById('inUseCountBadge');
    if (inUseCounter) inUseCounter.textContent = `${totalInUse} Sedang Digunakan`;

    const filterUnitsCount = document.getElementById('filterUnitsCount');
    if (filterUnitsCount) {
        filterUnitsCount.textContent = filtered.length;
    }

    if (filtered.length === 0) {
        const toggleWrapper = document.getElementById('catalogToggleWrapper');
        if (toggleWrapper) {
            toggleWrapper.style.display = 'none';
            toggleWrapper.innerHTML = '';
        }

        grid.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 4rem 1rem; text-align: center; background: white; border-radius: var(--radius-lg); border: 1px solid var(--clr-border);">
                <div style="width: 3rem; height: 3rem; margin: 0 auto 0.75rem auto; color: var(--clr-text-subtle); display: flex; align-items: center; justify-content: center;">
                    <svg style="width: 2.25rem; height: 2.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <h3 style="font-size: 1rem; font-weight: 700; color: var(--clr-text-main); margin-bottom: 0.25rem;">Unit tidak ditemukan</h3>
                <p style="color: var(--clr-text-muted); font-size: 0.8125rem; margin-bottom: 1rem;">Coba cari dengan kata kunci lain atau pilih kategori Semua.</p>
                <button onclick="resetFilters()" class="btn btn-primary btn-sm">
                    Lihat Semua Unit
                </button>
            </div>
        `;
        return;
    }

    const isHoliday = state.ownerConfig.isHolidayPricingActive;
    const INITIAL_ROW_LIMIT = 6; // 2 baris pada tampilan desktop 3-kolom
    const hasMoreCars = filtered.length > INITIAL_ROW_LIMIT;
    const displayedCars = state.isCatalogExpanded ? filtered : filtered.slice(0, INITIAL_ROW_LIMIT);

    grid.innerHTML = displayedCars.map((car, idx) => {
        const isReady = car.status === 'ready';
        const activePrice = isHoliday ? car.priceHoliday : car.priceNormal;
        const isExtraCard = idx >= 6 && state.isCatalogExpanded;
        const delayStyle = isExtraCard ? `style="animation-delay: ${(idx - 6) * 0.08}s;"` : '';

        return `
            <div class="card-unit reveal-on-scroll ${isExtraCard ? 'card-animate-in' : ''}" ${delayStyle}>
                <div>
                    <!-- Foto & Status Tag -->
                    <div class="card-img-wrap">
                        <img
                            src="${car.image}"
                            alt="${car.brand} ${car.model}"
                            loading="lazy"
                            decoding="async"
                            onerror="this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'"
                        />

                        <!-- Status Pill -->
                        <div class="card-status-wrap" style="position: absolute; top: 0.75rem; right: 0.75rem;">
                            ${isReady ? `
                                <span class="status-pill-ready">
                                    <span class="dot-indicator" style="background-color: var(--clr-emerald);"></span>
                                    Ready
                                </span>
                            ` : `
                                <span class="status-pill-used">
                                    <span class="dot-indicator" style="background-color: #f59e0b;"></span>
                                    Sedang Digunakan
                                </span>
                            `}
                        </div>

                        <!-- Kategori Badge & Ketentuan Driver -->
                        <div class="card-cat-wrap" style="position: absolute; top: 0.75rem; left: 0.75rem; display: flex; flex-direction: column; gap: 0.35rem; align-items: flex-start;">
                            <span class="badge-tag">
                                ${car.category}
                            </span>
                            ${(car.rental_option === 'driver_only' || car.rentalOption === 'driver_only') ? `
                                <span style="background: rgba(220, 38, 38, 0.9); backdrop-filter: blur(4px); color: #ffffff; font-size: 0.625rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 0.25rem; box-shadow: 0 2px 6px rgba(220, 38, 38, 0.35);">
                                    <i class="fa-solid fa-user-tie"></i> +Supir Wajib
                                </span>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Informasi Unit Mobil -->
                    <div class="card-body-info" style="padding: 1.25rem;">
                        <div class="card-brand-meta" style="font-size: 0.75rem; color: var(--clr-text-muted); font-weight: 600; margin-bottom: 0.25rem;">
                            ${car.brand} • ${car.year}
                        </div>
                        <h3 class="card-car-title" style="font-size: 1.125rem; font-weight: 800; color: var(--clr-text-main); margin-bottom: 0.5rem;">
                            ${car.model}
                        </h3>

                        <!-- Spesifikasi Ringkas Interaktif -->
                        <div class="card-specs-row">
                            <span class="spec-pill" title="Kapasitas Penumpang">
                                <i class="fa-solid fa-users"></i> ${car.seats} Kursi
                            </span>
                            <span class="spec-pill" title="Tipe Transmisi">
                                <i class="fa-solid fa-gauge-high"></i> ${car.transmission}
                            </span>
                            <span class="spec-pill" title="Bahan Bakar">
                                <i class="fa-solid fa-gas-pump"></i> ${car.fuel}
                            </span>
                        </div>

                        ${car.description && car.description !== 'null' ? `
                            <p class="line-clamp-2 card-car-desc" style="font-size: 0.8125rem; color: var(--clr-text-muted); line-height: 1.5; margin-bottom: 0.5rem;">
                                ${car.description}
                            </p>
                        ` : ''}
                    </div>
                </div>

                <!-- Footer Kartu: Harga & Tombol Aksi -->
                <div class="card-footer-wrap" style="padding: 0 1.25rem 1.25rem 1.25rem;">
                    <div class="card-price-row" style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 0.75rem;">
                        <div>
                            <div class="card-price-label" style="font-size: 0.7rem; color: var(--clr-text-subtle); font-weight: 600;">Tarif Sewa:</div>
                            <div class="card-price-value" style="font-size: 1.25rem; font-weight: 800; color: var(--clr-text-main);">
                                ${formatRupiah(activePrice)}<span class="card-price-unit" style="font-size: 0.75rem; font-weight: 400; color: var(--clr-text-muted);"> / hari</span>
                            </div>
                        </div>

                    </div>

                    <button
                        onclick="openBookingModal('${car.id}')"
                        class="btn ${isReady ? 'btn-primary' : 'btn-outline'} card-book-btn"
                        style="width: 100%;">
                        <span>${isReady ? 'Pilih & Pesan Unit' : 'Cek Detail / Booking Jadwal'}</span>
                        <svg style="width:0.875rem;height:0.875rem;display:inline-block;vertical-align:-1px;margin-left:0.25rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Pasang / Perbarui Tombol Swis Up ke Bawah
    let toggleWrapper = document.getElementById('catalogToggleWrapper');
    if (!toggleWrapper) {
        toggleWrapper = document.createElement('div');
        toggleWrapper.id = 'catalogToggleWrapper';
        toggleWrapper.className = 'catalog-toggle-wrapper text-center';
        grid.parentNode.insertBefore(toggleWrapper, grid.nextSibling);
    }

    if (hasMoreCars) {
        toggleWrapper.style.display = 'block';
        toggleWrapper.innerHTML = `
            <div style="margin-top: 2.5rem; text-align: center;">
                <button
                    onclick="toggleCatalogExpand()"
                    class="btn btn-expand-catalog"
                    id="btnToggleExpandCars"
                    type="button"
                    aria-expanded="${state.isCatalogExpanded ? 'true' : 'false'}"
                >
                    <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                        <span>${state.isCatalogExpanded ? 'Tampilkan Lebih Sedikit' : `Lihat Semua Armada (${filtered.length} Unit)`}</span>
                        <i class="fa-solid ${state.isCatalogExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}" style="transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-left: 0.35rem;"></i>
                    </span>
                </button>
            </div>
        `;
    } else {
        toggleWrapper.style.display = 'none';
        toggleWrapper.innerHTML = '';
    }

    initScrollReveal();
}

// Handler Swis Up ke Bawah Katalog Mobil
function toggleCatalogExpand() {
    state.isCatalogExpanded = !state.isCatalogExpanded;
    renderCarsCatalog();

    if (!state.isCatalogExpanded) {
        const katalogEl = document.getElementById('katalog');
        if (katalogEl) {
            katalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Scroller Interval 5 Detik untuk Ulasan Pelanggan
let reviewIntervalTimer = null;

function initIntervalReviewScroller(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const intervalMs = options.intervalMs || 5000;
    let isPaused = false;

    // Bersihkan timer lama jika ada
    if (reviewIntervalTimer) {
        clearInterval(reviewIntervalTimer);
        reviewIntervalTimer = null;
    }

    function getCardStep() {
        const firstCard = container.querySelector('.review-card-item');
        if (firstCard) {
            const styles = window.getComputedStyle(container);
            const gap = parseFloat(styles.columnGap || styles.gap || '24') || 24;
            return firstCard.offsetWidth + gap;
        }
        return 404;
    }

    function slideNext() {
        const step = getCardStep();
        const halfWidth = container.scrollWidth / 2;

        if (halfWidth > 0 && container.scrollLeft >= halfWidth - 10) {
            container.scrollLeft = container.scrollLeft - halfWidth;
        }

        container.scrollBy({ left: step, behavior: 'smooth' });
    }

    function slidePrev() {
        const step = getCardStep();
        const halfWidth = container.scrollWidth / 2;

        if (halfWidth > 0 && container.scrollLeft <= 10) {
            container.scrollLeft = container.scrollLeft + halfWidth;
        }

        container.scrollBy({ left: -step, behavior: 'smooth' });
    }

    function startTimer() {
        if (reviewIntervalTimer) clearInterval(reviewIntervalTimer);
        reviewIntervalTimer = setInterval(() => {
            if (!isPaused) {
                slideNext();
            }
        }, intervalMs);
    }

    function resetTimer() {
        startTimer();
    }

    // Jalankan timer per 5 detik
    startTimer();

    // Pause saat hover pada track komentar atau tombol panah
    const prevBtn = options.prevBtnId ? document.getElementById(options.prevBtnId) : null;
    const nextBtn = options.nextBtnId ? document.getElementById(options.nextBtnId) : null;

    container.onmouseenter = () => { isPaused = true; };
    container.onmouseleave = () => { isPaused = false; resetTimer(); };

    container.ontouchstart = () => { isPaused = true; };
    container.ontouchend = () => {
        setTimeout(() => { isPaused = false; resetTimer(); }, 3000);
    };

    // Tombol Navigasi Kiri & Kanan (di samping kiri kanan ujung komentar)
    if (prevBtn) {
        prevBtn.onmouseenter = () => { isPaused = true; };
        prevBtn.onmouseleave = () => { isPaused = false; resetTimer(); };
        prevBtn.onclick = (e) => {
            e.preventDefault();
            slidePrev();
            resetTimer();
        };
    }

    if (nextBtn) {
        nextBtn.onmouseenter = () => { isPaused = true; };
        nextBtn.onmouseleave = () => { isPaused = false; resetTimer(); };
        nextBtn.onclick = (e) => {
            e.preventDefault();
            slideNext();
            resetTimer();
        };
    }

    // Loop check saat user drag atau scroll manual (throttled dengan requestAnimationFrame)
    let reviewScrollTicking = false;
    container.addEventListener('scroll', () => {
        if (!reviewScrollTicking) {
            window.requestAnimationFrame(() => {
                const halfWidth = container.scrollWidth / 2;
                if (halfWidth > 0) {
                    if (container.scrollLeft >= halfWidth) {
                        container.scrollLeft -= halfWidth;
                    } else if (container.scrollLeft <= 0) {
                        container.scrollLeft += halfWidth;
                    }
                }
                reviewScrollTicking = false;
            });
            reviewScrollTicking = true;
        }
    }, { passive: true });
}

// Helper Kategori Artis & Multi-Media Stories
function isArtistReview(rev) {
    const ut = String(rev?.user_type || '').toLowerCase().trim();
    return ut === 'artis' || ut === 'artist' || ut === 'vip';
}

function isVideoMediaUrl(url) {
    if (!url) return false;
    const lower = String(url).toLowerCase();
    return lower.startsWith('data:video/') || /\.(mp4|webm|mov|avi|mkv|m4v)(\?|$)/.test(lower);
}

function getReviewStories(rev) {
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
        .map(item => ({
            url: String(item.url),
            type: item.type === 'video' || isVideoMediaUrl(item.url) ? 'video' : 'image'
        }));

    if (normalized.length > 0) return normalized;

    if (rev.media) {
        const type = rev.media_type === 'video' || isVideoMediaUrl(rev.media) ? 'video' : 'image';
        return [{ url: String(rev.media), type }];
    }

    return [];
}

// Global state untuk Instagram Story Viewer (1 Komentar = 1 Orang Tersebut)
let activeStoryReview = null;
let activeStorySlides = [];
let currentSlideIndex = 0;
let storyProgressInterval = null;
let storyIsPaused = false;
let storyIsMuted = true;
let storyElapsedMs = 0;
let storyLastTickTime = 0;
const STORY_IMAGE_DURATION_MS = 5500;

const CROWN_SVG_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" style="width:100%;height:100%;"><defs><linearGradient id="crownGradRedOrange" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#dc2626"/><stop offset="50%" stop-color="#ef4444"/><stop offset="100%" stop-color="#f97316"/></linearGradient></defs><path fill="url(#crownGradRedOrange)" d="M2 19h20v2H2v-2zm1.5-2L2 7l6 4 4-7 4 7 6-4-1.5 10h-17z"/></svg>`;

// Render Review & Testimoni Pelanggan (Layout Baru: Avatar -> Nama -> 5 Bintang -> Komentar -> "review")
function renderReviews() {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;

    const approved = state.reviews.filter(r => r.status === 'approved' || !r.status);

    if (approved.length === 0) {
        container.innerHTML = `
            <div style="flex: 1 1 100%; padding: 3rem 1rem; text-align: center; background: white; border-radius: var(--radius-xl); border: 1px solid var(--clr-border);">
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: center;">
                    <svg style="width:2.25rem;height:2.25rem;fill:#dc2626;stroke:#dc2626" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <h4 style="font-size: 1rem; font-weight: 700; color: var(--clr-text-main);">Belum ada ulasan publik</h4>
                <p style="font-size: 0.8125rem; color: var(--clr-text-muted); margin-bottom: 1rem;">Jadilah pelanggan pertama yang memberikan ulasan untuk layanan kami!</p>
                <button onclick="openReviewModal()" class="btn btn-primary btn-sm">
                    Tulis Ulasan Pertama
                </button>
            </div>
        `;
        return;
    }

    // Duplicate reviews smoothly for continuous horizontal scroller
    let displayList = [...approved];
    while (displayList.length < 6) {
        displayList = [...displayList, ...approved];
    }
    displayList = [...displayList, ...displayList];

    container.innerHTML = displayList.map((rev, cardIdx) => {
        const isArtis = isArtistReview(rev);
        const stories = getReviewStories(rev);
        const hasMedia = stories.length > 0;
        const rating = parseInt(rev.rating || 5);
        const starActiveColor = '#dc2626';
        const starInactiveColor = '#e2e8f0';

        const starsHtml = Array.from({ length: 5 }, (_, i) => {
            return `<svg style="width:1.35rem;height:1.35rem;fill:${i < rating ? starActiveColor : starInactiveColor};stroke:${i < rating ? starActiveColor : starInactiveColor}" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
        }).join('');

        const safeName = escapeHtml(rev.name || 'Pelanggan');
        const safeComment = escapeHtml(rev.comment || '');
        const safeCar = escapeHtml(rev.car_name || '');
        const avatarSrc = rev.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name || 'P')}&background=${isArtis ? 'dc2626' : '64748b'}&color=fff&bold=true`;

        const ringClass = isArtis
            ? 'review-avatar-ring is-artist'
            : (hasMedia ? 'review-avatar-ring has-story' : 'review-avatar-ring');

        const storyBadgeCount = stories.length > 0
            ? `<span style="font-size: 0.7rem; font-weight: 800; padding: 0.1rem 0.45rem; border-radius: 9999px; background: ${isArtis ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' : '#f1f5f9'}; color: ${isArtis ? '#ffffff' : '#475569'};">▶ ${stories.length}</span>`
            : '';

        return `
            <div class="review-card-item ${isArtis ? 'review-card-artist' : ''}" onclick="openStoryByReviewId('${rev.id}')" title="Klik untuk melihat Story & ulasan lengkap ${safeName}">
                <div>
                    <!-- Top Centered Avatar (+ Mahkota jika Artis) -->
                    <div class="review-card-top">
                        <div class="review-avatar-wrap">
                            ${isArtis ? `<span class="review-crown-badge">${CROWN_SVG_ICON}</span>` : ''}
                            <div class="${ringClass}">
                                <img
                                    src="${avatarSrc}"
                                    alt="${safeName}"
                                    class="review-avatar-img"
                                    onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name || 'P')}&background=${isArtis ? 'dc2626' : '64748b'}&color=fff'"
                                />
                            </div>
                        </div>

                        <!-- Centered Name -->
                        <div class="review-author-name">${safeName}</div>

                        <!-- Centered 5 Stars -->
                        <div class="review-stars-row">
                            ${starsHtml}
                        </div>
                    </div>

                    <!-- Comment Paragraph -->
                    <p class="review-comment-body">${safeComment}</p>
                </div>

                <!-- Bottom Footer: Optional Car Name & Bottom-Right "review" -->
                <div class="review-card-footer-action">
                    ${safeCar ? `
                        <span class="review-car-tag">
                            <svg style="width:0.75rem;height:0.75rem;fill:none;stroke:currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                            ${safeCar}
                        </span>
                    ` : '<span></span>'}
                    <span class="review-action-link">
                        <span>review</span>
                        ${storyBadgeCount}
                    </span>
                </div>
            </div>
        `;
    }).join('');

    initIntervalReviewScroller('reviewsContainer', {
        intervalMs: 5000,
        prevBtnId: 'reviewsPrevBtn',
        nextBtnId: 'reviewsNextBtn'
    });
}

// =========================================================================
// INSTAGRAM STORY VIEWER — STRICTLY 1 COMMENTER PER STORY SESSION
// =========================================================================
function openStoryByReviewId(reviewId) {
    const approved = state.reviews.filter(r => r.status === 'approved' || !r.status);
    const rev = approved.find(r => String(r.id) === String(reviewId));
    if (!rev) return;

    activeStoryReview = rev;
    const mediaList = getReviewStories(rev);
    activeStorySlides = mediaList.length > 0 ? mediaList : [{ type: 'text', url: null }];
    currentSlideIndex = 0;
    storyIsPaused = false;
    storyIsMuted = true;

    const modal = document.getElementById('storyViewerModal');
    if (modal) modal.classList.remove('hidden');

    renderStoryViewerHeader(rev);
    buildStoryProgressBars();
    displayStorySlide(0);
}

function renderStoryViewerHeader(rev) {
    const isArtis = isArtistReview(rev);
    const avatarWrap = document.getElementById('storyHeaderAvatarWrap');
    const crownEl = document.getElementById('storyViewerCrown');
    const avatarEl = document.getElementById('storyViewerAvatar');
    const nameEl = document.getElementById('storyViewerName');
    const subEl = document.getElementById('storyViewerSub');
    const starsEl = document.getElementById('storyViewerStars');
    const commentEl = document.getElementById('storyViewerComment');
    const dateEl = document.getElementById('storyViewerDate');
    const pauseBtn = document.getElementById('storyPauseBtn');

    if (avatarWrap) avatarWrap.classList.toggle('is-artist', false);
    if (crownEl) crownEl.classList.add('hidden'); // Mahkota dalam story dihilangkan

    if (avatarEl) {
        avatarEl.src = rev.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name || 'P')}&background=${isArtis ? 'dc2626' : '64748b'}&color=fff&bold=true`;
    }
    if (nameEl) nameEl.textContent = rev.name || 'Pelanggan';
    if (subEl) subEl.textContent = `${rev.car_name || 'Unit Rental'} • Story Pelanggan`;
    if (commentEl) commentEl.textContent = rev.comment || '';
    if (pauseBtn) pauseBtn.textContent = '⏸';

    if (starsEl) {
        const rating = parseInt(rev.rating || 5);
        starsEl.style.color = '#dc2626';
        starsEl.innerHTML = Array.from({ length: 5 }, (_, i) => i < rating ? '★' : '☆').join('') +
            ` <span style="font-size:0.75rem; color:#fff; margin-left:0.25rem;">(${rating}.0)</span>`;
    }

    if (dateEl) {
        dateEl.textContent = rev.created_at ? formatDisplayDate(rev.created_at) : 'Ulasan Resmi';
    }
}

function closeStoryViewer() {
    const modal = document.getElementById('storyViewerModal');
    if (modal) modal.classList.add('hidden');

    if (storyProgressInterval) {
        clearInterval(storyProgressInterval);
        storyProgressInterval = null;
    }

    const vid = document.getElementById('storyViewerVid');
    if (vid) {
        vid.onended = null;
        vid.ontimeupdate = null;
        vid.pause();
        vid.removeAttribute('src');
        vid.load();
    }

    activeStoryReview = null;
    activeStorySlides = [];
    storyIsPaused = false;
}

function buildStoryProgressBars() {
    const container = document.getElementById('storyProgressContainer');
    if (!container) return;

    container.innerHTML = activeStorySlides.map((_, i) => `
        <div class="story-progress-segment">
            <div id="storyProgressFill_${i}" class="story-progress-fill"></div>
        </div>
    `).join('');
}

function displayStorySlide(index) {
    if (storyProgressInterval) {
        clearInterval(storyProgressInterval);
        storyProgressInterval = null;
    }

    if (!activeStoryReview || !activeStorySlides || activeStorySlides.length === 0) return;

    currentSlideIndex = Math.max(0, Math.min(index, activeStorySlides.length - 1));
    const slide = activeStorySlides[currentSlideIndex];

    // Update progress bars for all slides of THIS commenter
    activeStorySlides.forEach((_, i) => {
        const fill = document.getElementById(`storyProgressFill_${i}`);
        if (!fill) return;
        fill.style.width = i < currentSlideIndex ? '100%' : '0%';
    });

    const slideCounter = document.getElementById('storySlideCounter');
    if (slideCounter) {
        slideCounter.textContent = activeStorySlides.length > 1 ? `${currentSlideIndex + 1} / ${activeStorySlides.length}` : '1 / 1';
    }

    const arrowPrev = document.getElementById('storyArrowPrev');
    const arrowNext = document.getElementById('storyArrowNext');
    if (arrowPrev) arrowPrev.classList.toggle('hidden', currentSlideIndex === 0);
    if (arrowNext) arrowNext.classList.toggle('hidden', currentSlideIndex >= activeStorySlides.length - 1);

    const imgEl = document.getElementById('storyViewerImg');
    const vidEl = document.getElementById('storyViewerVid');
    const textBgEl = document.getElementById('storyViewerTextBg');
    const muteBtn = document.getElementById('storyMuteBtn');
    const pauseBtn = document.getElementById('storyPauseBtn');

    storyIsPaused = false;
    storyElapsedMs = 0;
    if (pauseBtn) pauseBtn.textContent = '⏸';

    // Reset video handlers
    if (vidEl) {
        vidEl.onended = null;
        vidEl.ontimeupdate = null;
        vidEl.pause();
    }

    if (slide.type === 'video' && slide.url) {
        if (textBgEl) textBgEl.classList.add('hidden');
        if (imgEl) imgEl.classList.add('hidden');
        if (muteBtn) {
            muteBtn.classList.remove('hidden');
            muteBtn.textContent = storyIsMuted ? '🔇' : '🔊';
        }
        if (vidEl) {
            vidEl.classList.remove('hidden');
            vidEl.muted = storyIsMuted;
            vidEl.src = slide.url;
            vidEl.currentTime = 0;

            const activeFill = document.getElementById(`storyProgressFill_${currentSlideIndex}`);
            vidEl.ontimeupdate = () => {
                if (vidEl.duration && activeFill) {
                    const pct = Math.min(100, (vidEl.currentTime / vidEl.duration) * 100);
                    activeFill.style.width = `${pct}%`;
                }
            };
            vidEl.onended = () => {
                if (activeFill) activeFill.style.width = '100%';
                nextStory();
            };
            vidEl.play().catch(() => {});
        }
        return;
    }

    if (muteBtn) muteBtn.classList.add('hidden');
    if (vidEl) vidEl.classList.add('hidden');

    if (slide.url) {
        if (textBgEl) textBgEl.classList.add('hidden');
        if (imgEl) {
            imgEl.classList.remove('hidden');
            imgEl.src = slide.url;
        }
    } else {
        if (imgEl) imgEl.classList.add('hidden');
        if (textBgEl) {
            const isArtis = isArtistReview(activeStoryReview);
            textBgEl.style.background = isArtis
                ? 'linear-gradient(135deg, #064e3b 0%, #052e16 100%)'
                : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
            textBgEl.classList.remove('hidden');
        }
    }

    startStoryTimerLoop();
}

function startStoryTimerLoop() {
    if (storyProgressInterval) clearInterval(storyProgressInterval);
    storyLastTickTime = Date.now();
    const activeFill = document.getElementById(`storyProgressFill_${currentSlideIndex}`);

    storyProgressInterval = setInterval(() => {
        const now = Date.now();
        const delta = now - storyLastTickTime;
        storyLastTickTime = now;

        if (storyIsPaused) return;

        storyElapsedMs += delta;
        const pct = Math.min(100, (storyElapsedMs / STORY_IMAGE_DURATION_MS) * 100);
        if (activeFill) activeFill.style.width = `${pct}%`;

        if (storyElapsedMs >= STORY_IMAGE_DURATION_MS) {
            clearInterval(storyProgressInterval);
            storyProgressInterval = null;
            nextStory();
        }
    }, 50);
}

function toggleStoryMute(e) {
    if (e) e.stopPropagation();
    storyIsMuted = !storyIsMuted;
    const vidEl = document.getElementById('storyViewerVid');
    const muteBtn = document.getElementById('storyMuteBtn');
    if (vidEl) vidEl.muted = storyIsMuted;
    if (muteBtn) muteBtn.textContent = storyIsMuted ? '🔇' : '🔊';
}

function toggleStoryPause(e) {
    if (e) e.stopPropagation();
    storyIsPaused = !storyIsPaused;
    const pauseBtn = document.getElementById('storyPauseBtn');
    const vidEl = document.getElementById('storyViewerVid');
    if (pauseBtn) pauseBtn.textContent = storyIsPaused ? '▶' : '⏸';

    if (vidEl && !vidEl.classList.contains('hidden')) {
        if (storyIsPaused) vidEl.pause();
        else vidEl.play().catch(() => {});
    }
}

function pauseStoryHold() {
    if (storyIsPaused) return;
    const vidEl = document.getElementById('storyViewerVid');
    storyIsPaused = true;
    if (vidEl && !vidEl.classList.contains('hidden')) vidEl.pause();
}

function resumeStoryHold() {
    const pauseBtn = document.getElementById('storyPauseBtn');
    if (pauseBtn && pauseBtn.textContent === '▶') return;
    storyIsPaused = false;
    storyLastTickTime = Date.now();
    const vidEl = document.getElementById('storyViewerVid');
    if (vidEl && !vidEl.classList.contains('hidden')) vidEl.play().catch(() => {});
}

function nextStory(e) {
    if (e) e.stopPropagation();
    if (currentSlideIndex < activeStorySlides.length - 1) {
        currentSlideIndex++;
        displayStorySlide(currentSlideIndex);
    } else {
        closeStoryViewer();
    }
}

function prevStory(e) {
    if (e) e.stopPropagation();
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        displayStorySlide(currentSlideIndex);
    } else {
        displayStorySlide(0);
    }
}

// Populate Review Car Select Dropdown from Available Fleet
function populatePublicReviewCarSelect() {
    const carSelect = document.getElementById('reviewCarName');
    if (!carSelect) return;

    let opts = '<option value="">-- Pilih Armada Mobil yang Disewa --</option>';
    if (state.cars && state.cars.length > 0) {
        state.cars.forEach(car => {
            const fullName = `${car.brand} ${car.model}`.trim();
            const isReady = car.status === 'ready';
            const statusLabel = isReady ? '🟢 Tersedia (Ready)' : (car.status === 'in_use' ? '🟡 Sedang Digunakan' : '🔴 Perawatan');
            opts += `<option value="${escapeHtml(fullName)}">${escapeHtml(fullName)} — ${statusLabel}</option>`;
        });
    }
    carSelect.innerHTML = opts;
}

// Buka Modal Tambah Review Pelanggan
function openReviewModal() {
    state.selectedReviewRating = 5;
    state.reviewAvatarBase64 = null;
    state.reviewStories = [];

    const form = document.getElementById('reviewForm');
    if (form) form.reset();

    populatePublicReviewCarSelect();
    renderPublicReviewMediaGrid();

    const avatarPrev = document.getElementById('reviewAvatarPreview');
    if (avatarPrev) avatarPrev.classList.add('hidden');

    setReviewRating(5);

    const modal = document.getElementById('reviewModal');
    if (modal) modal.classList.remove('hidden');
}

// Tutup Modal Review
function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) modal.classList.add('hidden');
}

// Set Rating Bintang pada Modal
function setReviewRating(stars) {
    state.selectedReviewRating = stars;
    const ratingInput = document.getElementById('reviewRatingInput');
    if (ratingInput) ratingInput.value = stars;

    const starBtns = document.querySelectorAll('.star-picker-btn');
    starBtns.forEach((btn, idx) => {
        if (idx < stars) {
            btn.style.color = '#dc2626';
            btn.textContent = '★';
        } else {
            btn.style.color = '#cbd5e1';
            btn.textContent = '☆';
        }
    });
}

// Handle Upload Foto / Avatar Review
function handleReviewAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran foto avatar maksimal 5MB.");
        e.target.value = '';
        return;
    }

    compressImageFileToBase64(file, 400, 0.85).then((compressed) => {
        state.reviewAvatarBase64 = compressed;
        const previewImg = document.getElementById('reviewAvatarPreview');
        if (previewImg) {
            previewImg.src = compressed;
            previewImg.classList.remove('hidden');
        }
    });
}

function compressImageFileToBase64(file, maxDim = 1080, quality = 0.84) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (event) {
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
            img.onerror = () => resolve(event.target.result);
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Handle Multi-Upload Media Story (Banyak Foto / Video)
async function handleReviewMediaUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
        const isVideo = file.type.startsWith('video/');
        const maxSize = isVideo ? 50 * 1024 * 1024 : 15 * 1024 * 1024;

        if (file.size > maxSize) {
            alert(`File "${file.name}" terlalu besar. Maksimal ${isVideo ? '50MB untuk video' : '15MB untuk foto'}.`);
            continue;
        }

        const itemId = `rev_media_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

        if (isVideo) {
            const objectUrl = URL.createObjectURL(file);
            state.reviewStories.push({
                id: itemId,
                url: objectUrl,
                type: 'video',
                file: file
            });
        } else {
            const compressedBase64 = await compressImageFileToBase64(file, 1080, 0.84);
            state.reviewStories.push({
                id: itemId,
                url: compressedBase64,
                type: 'image',
                file: null
            });
        }
    }

    e.target.value = '';
    renderPublicReviewMediaGrid();
}

function removeReviewMediaItem(itemId) {
    const target = state.reviewStories.find(item => item.id === itemId);
    if (target && target.type === 'video' && target.url && target.url.startsWith('blob:')) {
        URL.revokeObjectURL(target.url);
    }
    state.reviewStories = state.reviewStories.filter(item => item.id !== itemId);
    renderPublicReviewMediaGrid();
}

function renderPublicReviewMediaGrid() {
    const box = document.getElementById('reviewMediaPreviewBox');
    const grid = document.getElementById('reviewMediaPreviewGrid');
    const badge = document.getElementById('reviewMediaCountBadge');

    if (badge) {
        badge.textContent = `${state.reviewStories.length} Media Dipilih`;
    }

    if (!box || !grid) return;

    if (state.reviewStories.length === 0) {
        box.classList.add('hidden');
        grid.innerHTML = '';
        return;
    }

    box.classList.remove('hidden');
    grid.innerHTML = state.reviewStories.map(item => `
        <div style="position: relative; aspect-ratio: 1/1; border-radius: 0.6rem; overflow: hidden; background: #0f172a; border: 1.5px solid #fda4af;">
            ${item.type === 'video'
                ? `<video src="${item.url}" muted playsinline style="width:100%; height:100%; object-fit:cover;"></video>
                   <span style="position:absolute; bottom:4px; left:4px; font-size:0.6rem; font-weight:800; background:rgba(0,0,0,0.75); color:#fff; padding:1px 5px; border-radius:4px;">🎬 Video</span>`
                : `<img src="${item.url}" alt="Media" style="width:100%; height:100%; object-fit:cover;" />
                   <span style="position:absolute; bottom:4px; left:4px; font-size:0.6rem; font-weight:800; background:rgba(0,0,0,0.75); color:#fff; padding:1px 5px; border-radius:4px;">📸 Foto</span>`
            }
            <button type="button" onclick="removeReviewMediaItem('${item.id}')" style="position:absolute; top:4px; right:4px; width:20px; height:20px; border-radius:50%; border:none; background:#e11d48; color:#fff; font-size:0.7rem; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center;" title="Hapus media ini">✕</button>
        </div>
    `).join('');
}

// Handle Submit Review Pelanggan (Dengan Banyak Foto/Video)
async function handleReviewSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('reviewName').value.trim();
    const carName = document.getElementById('reviewCarName').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    const rating = state.selectedReviewRating;
    const avatar = state.reviewAvatarBase64 || null;

    if (!name || !comment) {
        alert("Silakan isi nama dan ulasan Anda!");
        return;
    }

    const submitBtn = document.getElementById('reviewSubmitBtn');
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim Ulasan & Media...';
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('rating', rating);
    formData.append('car_name', carName);
    formData.append('comment', comment);
    formData.append('user_type', 'regular');
    formData.append('status', 'pending');
    if (avatar) formData.append('avatar', avatar);

    const inlineStories = [];
    state.reviewStories.forEach((item) => {
        if (item.file) {
            formData.append('story_files[]', item.file);
        } else if (item.url) {
            inlineStories.push({ url: item.url, type: item.type });
        }
    });
    formData.append('stories', JSON.stringify(inlineStories));

    let savedReview = null;
    try {
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        });

        if (res.ok) {
            const json = await res.json();
            if (json.data) savedReview = json.data;
        }
    } catch (err) {
        console.warn('Fallback local review save:', err);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
        }
    }

    const fallbackLocal = savedReview || {
        id: Date.now(),
        name,
        rating,
        car_name: carName,
        comment,
        avatar,
        user_type: 'regular',
        stories: inlineStories,
        media: inlineStories[0]?.url || null,
        media_type: inlineStories[0]?.type || null,
        status: 'pending',
        created_at: new Date().toISOString()
    };

    state.reviews.unshift(fallbackLocal);
    try {
        localStorage.setItem('rcm_rent_reviews', JSON.stringify(state.reviews));
    } catch (err) {}

    closeReviewModal();
    alert("🎉 Terima kasih! Ulasan & Story Anda telah berhasil dikirim.\n\nReview Anda akan ditampilkan di halaman utama website setelah diverifikasi dan disetujui oleh Admin kami.");
}

// Helper Tanggal Lokal Hari Ini (YYYY-MM-DD) secara Real-Time
function getTodayLocalStr() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function isBookingScheduleActive(endDateStr, statusVal = 'confirmed') {
    if (!endDateStr) return false;
    const st = String(statusVal || '').toLowerCase();
    if (st === 'completed' || st === 'cancelled' || st === 'dibatalkan') return false;
    const cleanEnd = String(endDateStr).split('T')[0];
    return cleanEnd >= getTodayLocalStr();
}

// Ambil Jadwal Booking Terkonfirmasi (Yang Masih Aktif / Belum Lewat Tanggal) untuk Unit Mobil Ini
async function fetchConfirmedBookings(carId) {
    state.confirmedBookings = [];
    if (!carId) return [];

    let bookings = [];

    // 1. Coba ambil dari Backend API Laravel (hanya yang aktif / belum lewat tanggal)
    try {
        const res = await fetch(`/api/bookings?car_id=${carId}&status=confirmed&active_only=1`);
        if (res.ok) {
            const json = await res.json();
            if (json.data && Array.isArray(json.data)) {
                bookings = json.data.filter(b => isBookingScheduleActive(b.end_date, b.status));
            }
        }
    } catch (e) {
        // Fallback jika API sedang tidak terjangkau
    }

    // 2. Gabungkan dengan LocalStorage (sinkronisasi offline & realtime), abaikan yang sudah lewat tanggal
    try {
        const saved = localStorage.getItem('rcm_rent_bookings');
        if (saved) {
            const localList = JSON.parse(saved);
            localList.forEach(lb => {
                const lbStatus = String(lb.status || '').toLowerCase();
                const isConfirmed = (lbStatus === 'confirmed' || lbStatus === 'verifikasi' || lbStatus === 'dikonfirmasi');
                if ((lb.car_id == carId || lb.carId == carId) && isConfirmed && isBookingScheduleActive(lb.end_date, lb.status)) {
                    const exists = bookings.some(b => b.id == lb.id || (b.booking_code && b.booking_code === lb.booking_code));
                    if (!exists) {
                        bookings.push(lb);
                    }
                }
            });
        }
    } catch (e) {}

    state.confirmedBookings = bookings.filter(b => isBookingScheduleActive(b.end_date, b.status));
    return state.confirmedBookings;
}

// Render Notifikasi Jadwal yang Sudah Dikonfirmasi pada Modal (Hanya yang Belum Lewat Tanggal)
function renderConfirmedDatesNotice() {
    const noticeEl = document.getElementById('confirmedDatesNotice');
    const listEl = document.getElementById('confirmedDatesList');
    if (!noticeEl || !listEl) return;

    const activeConfirmed = (state.confirmedBookings || []).filter(b => isBookingScheduleActive(b.end_date, b.status));
    state.confirmedBookings = activeConfirmed;

    if (activeConfirmed.length > 0) {
        listEl.innerHTML = activeConfirmed.map(b => {
            const startText = formatDisplayDate(b.start_date);
            const endText = formatDisplayDate(b.end_date);
            const cust = b.customer_name ? ` (${escapeHtml(b.customer_name)})` : '';
            return `<div style="margin-top: 0.25rem; font-weight: 600;">• <strong>${startText} — ${endText}</strong>${cust}</div>`;
        }).join('');
        noticeEl.classList.remove('hidden');
    } else {
        listEl.innerHTML = '';
        noticeEl.classList.add('hidden');
    }
}

// State & Controller Kalender Interaktif Pemesanan
let calMonthStart = 9; // 0-indexed: 9 = Oktober
let calYearStart = 2026;
let calMonthEnd = 9;
let calYearEnd = 2026;

// Fallback jadwal statis per model mobil (otomatis difilter jika tanggal sudah lewat)
const defaultBookedSchedules = {
    "Land Cruiser": [
        { start: "2026-10-18", end: "2026-10-21" }
    ],
    "Land Cruser": [
        { start: "2026-10-18", end: "2026-10-21" }
    ],
    "Avanza": [
        { start: "2026-10-16", end: "2026-10-19" },
        { start: "2026-10-22", end: "2026-10-25" }
    ],
    "Alphard": [
        { start: "2026-10-18", end: "2026-10-21" }
    ]
};

function getCarBookedSchedules() {
    const car = state.selectedCar;
    if (!car) return [];

    const todayStr = getTodayLocalStr();
    const schedules = [];
    // 1. Ambil dari database / state.confirmedBookings (hanya jadwal yang belum lewat dari hari ini)
    if (state.confirmedBookings && state.confirmedBookings.length > 0) {
        state.confirmedBookings.forEach(b => {
            if (b.start_date && b.end_date && isBookingScheduleActive(b.end_date, b.status)) {
                const s = b.start_date.split('T')[0];
                const e = b.end_date.split('T')[0];
                if (e >= todayStr) {
                    schedules.push({ start: s, end: e });
                }
            }
        });
    }

    // 2. Tambahkan default schedules jika cocok dengan nama model mobil & belum lewat tanggal
    Object.keys(defaultBookedSchedules).forEach(key => {
        if (car.model && car.model.toLowerCase().includes(key.toLowerCase())) {
            defaultBookedSchedules[key].forEach(ds => {
                if (ds.end >= todayStr && !schedules.some(s => s.start === ds.start && s.end === ds.end)) {
                    schedules.push(ds);
                }
            });
        }
    });

    return schedules;
}

function closeBookingCalendars() {
    const calStart = document.getElementById('calendar-start');
    const calEnd = document.getElementById('calendar-end');
    if (calStart) calStart.classList.add('hidden');
    if (calEnd) calEnd.classList.add('hidden');
}

function toggleBookingCalendar(type) {
    const calStart = document.getElementById('calendar-start');
    const calEnd = document.getElementById('calendar-end');
    if (type === 'start') {
        if (calEnd) calEnd.classList.add('hidden');
        if (calStart) {
            const isHidden = calStart.classList.contains('hidden');
            if (isHidden) {
                renderBookingCalendar('start');
                calStart.classList.remove('hidden');
            } else {
                calStart.classList.add('hidden');
            }
        }
    } else {
        if (calStart) calStart.classList.add('hidden');
        if (calEnd) {
            const isHidden = calEnd.classList.contains('hidden');
            if (isHidden) {
                renderBookingCalendar('end');
                calEnd.classList.remove('hidden');
            } else {
                calEnd.classList.add('hidden');
            }
        }
    }
}

function changeBookingMonth(direction, type) {
    const now = new Date();
    const currYear = now.getFullYear();
    const currMonth = now.getMonth();

    if (type === 'start') {
        const nextMonth = calMonthStart + direction;
        const testDate = new Date(calYearStart, nextMonth, 1);
        const minDate = new Date(currYear, currMonth, 1);
        if (direction < 0 && testDate < minDate) {
            return; // Tidak dapat memilih bulan yang sudah lewat
        }
        calMonthStart += direction;
        if (calMonthStart > 11) { calMonthStart = 0; calYearStart++; }
        else if (calMonthStart < 0) { calMonthStart = 11; calYearStart--; }
        renderBookingCalendar('start');
    } else {
        const startVal = document.getElementById('bookStartDate')?.value;
        let minYear = currYear;
        let minMonth = currMonth;
        if (startVal) {
            const sParts = startVal.split('-');
            if (sParts.length === 3) {
                minYear = parseInt(sParts[0], 10);
                minMonth = parseInt(sParts[1], 10) - 1;
            }
        }
        const nextMonth = calMonthEnd + direction;
        const testDate = new Date(calYearEnd, nextMonth, 1);
        const minDate = new Date(minYear, minMonth, 1);
        if (direction < 0 && testDate < minDate) {
            return; // Tidak dapat memilih bulan sebelum tanggal mulai
        }
        calMonthEnd += direction;
        if (calMonthEnd > 11) { calMonthEnd = 0; calYearEnd++; }
        else if (calMonthEnd < 0) { calMonthEnd = 11; calYearEnd--; }
        renderBookingCalendar('end');
    }
}

function renderBookingCalendar(type) {
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const month = type === 'start' ? calMonthStart : calMonthEnd;
    const year = type === 'start' ? calYearStart : calYearEnd;

    const titleEl = document.getElementById(`cal-month-year-${type}`);
    if (titleEl) titleEl.textContent = `${monthNames[month]} ${year}`;

    const daysContainer = document.getElementById(`cal-days-${type}`);
    if (!daysContainer) return;
    daysContainer.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const schedules = getCarBookedSchedules();

    // Hari ini (Local time string YYYY-MM-DD)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const startVal = document.getElementById('bookStartDate')?.value || '';

    // Spasi hari kosong sebelum tanggal 1
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        daysContainer.appendChild(emptyDiv);
    }

    // Render tiap tanggal
    for (let d = 1; d <= totalDays; d++) {
        const formattedMonth = String(month + 1).padStart(2, '0');
        const formattedDay = String(d).padStart(2, '0');
        const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

        const dayBtn = document.createElement('button');
        dayBtn.type = 'button';
        dayBtn.textContent = d;
        dayBtn.className = "cal-day-btn";

        // 1. Cek apakah tanggal sudah lewat dari hari ini (real-time: tidak dapat memilih tanggal lampau)
        const isPast = dateStr < todayStr;

        // 2. Jika memilih tanggal selesai sewa (end), tidak dapat memilih tanggal di belakang tanggal mulai
        const isBeforeStart = (type === 'end' && startVal && dateStr < startVal);

        let isBooked = false;
        let isFinish = false;

        schedules.forEach(item => {
            const bStart = new Date(item.start);
            const bEnd = new Date(item.end);
            const currDate = new Date(dateStr);

            // Jika tanggal sama persis dengan tanggal selesai sewa (end_date) -> Tanda Kuning (Waktu Jangka Selesai Peminjaman)
            if (currDate.getTime() === bEnd.getTime()) {
                isFinish = true;
            }
            // Jika dalam masa sewa (dari start_date sampai sebelum end_date) -> Tanda Merah (Dibooking)
            else if (currDate >= bStart && currDate < bEnd) {
                isBooked = true;
            }
        });

        if (isPast) {
            dayBtn.classList.add('cal-past');
            dayBtn.title = `Tanggal sudah lewat (${dateStr})`;
            dayBtn.disabled = true;
        } else if (isBeforeStart) {
            dayBtn.classList.add('cal-past');
            dayBtn.title = `Tidak dapat memilih tanggal sebelum tanggal mulai (${startVal})`;
            dayBtn.disabled = true;
        } else if (isBooked) {
            dayBtn.classList.add('cal-booked');
            dayBtn.title = `Sudah Dibooking (${dateStr})`;
            dayBtn.disabled = true;
        } else if (isFinish) {
            dayBtn.classList.add('cal-finish');
            dayBtn.title = `Waktu Selesai Peminjaman - Tidak Dapat Dipesan (${dateStr})`;
            dayBtn.disabled = true;
        } else {
            dayBtn.onclick = () => selectBookingDate(dateStr, type);
        }

        daysContainer.appendChild(dayBtn);
    }
}

function selectBookingDate(dateStr, type) {
    const input = document.getElementById(type === 'start' ? 'bookStartDate' : 'bookEndDate');
    if (input) input.value = dateStr;
    closeBookingCalendars();

    const startVal = document.getElementById('bookStartDate')?.value;
    const endVal = document.getElementById('bookEndDate')?.value;
    if (type === 'start') {
        if (!endVal || endVal < dateStr) {
            const endInput = document.getElementById('bookEndDate');
            if (endInput) endInput.value = dateStr;
        }
        // Sinkronkan kalender selesai jika bulan/tahunnya di bawah tanggal mulai
        const sParts = dateStr.split('-');
        if (sParts.length === 3) {
            const sY = parseInt(sParts[0], 10);
            const sM = parseInt(sParts[1], 10) - 1;
            if (calYearEnd < sY || (calYearEnd === sY && calMonthEnd < sM)) {
                calYearEnd = sY;
                calMonthEnd = sM;
            }
        }
        renderBookingCalendar('end');
    }

    calculateBookingPrice();
    checkDateConflict();
}

// Cek Apakah Tanggal yang Dipilih Bentrok dengan Pesanan yang Sudah Dikonfirmasi
function checkDateConflict() {
    const startVal = document.getElementById('bookStartDate')?.value;
    const endVal = document.getElementById('bookEndDate')?.value;
    const alertEl = document.getElementById('dateConflictAlert');
    const submitBtn = document.getElementById('bookingSubmitBtn');
    const labelSpan = submitBtn ? submitBtn.querySelector('.submit-label') : null;

    if (!startVal || !endVal) {
        if (alertEl) alertEl.classList.add('hidden');
        return false;
    }

    const schedules = getCarBookedSchedules();

    const userStart = new Date(startVal);
    const userEnd = new Date(endVal);

    if (userEnd < userStart) {
        if (alertEl) {
            alertEl.classList.remove('hidden');
            alertEl.style.backgroundColor = '#fef2f2';
            alertEl.style.borderColor = '#ef4444';
            alertEl.style.color = '#b91c1c';
            alertEl.innerHTML = '<span>⚠️</span><div><strong>Perhatian:</strong> Tanggal selesai tidak boleh lebih awal dari tanggal mulai!</div>';
        }
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.55';
            submitBtn.style.cursor = 'not-allowed';
        }
        return true;
    }

    let isConflict = false;

    schedules.forEach(item => {
        const bookedStart = new Date(item.start);
        const bookedEnd = new Date(item.end);

        // Bentrok jika berada dalam rentang booking atau tepat di tanggal selesai sewa (merah & kuning tidak dapat dipesan)
        if (userStart <= bookedEnd && userEnd >= bookedStart) {
            isConflict = true;
        }
    });

    if (isConflict) {
        if (alertEl) {
            alertEl.classList.remove('hidden');
            alertEl.style.backgroundColor = '#fef2f2';
            alertEl.style.borderColor = '#ef4444';
            alertEl.style.color = '#b91c1c';
            alertEl.innerHTML = '<span>🚫</span><div>Maaf, mobil ini sudah dibooking pada rentang tanggal tersebut (termasuk jadwal selesai sewa). Silakan pilih tanggal lain!</div>';
        }
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.55';
            submitBtn.style.cursor = 'not-allowed';
        }
        if (labelSpan) labelSpan.textContent = '⛔ Jadwal Bentrok — Silakan Pilih Tanggal Lain';
        return true;
    } else {
        if (alertEl) {
            alertEl.classList.remove('hidden');
            alertEl.style.backgroundColor = '#ecfdf5';
            alertEl.style.borderColor = '#10b981';
            alertEl.style.color = '#047857';
            alertEl.innerHTML = '<span>✅</span><div><strong>Tersedia:</strong> Tanggal yang Anda pilih kosong &amp; siap dibooking!</div>';
        }
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
        if (labelSpan) labelSpan.textContent = 'Kirim Form Pemesanan ke WhatsApp Owner';
        return false;
    }
}

// Buka Modal Detail & Formulir Pemesanan
async function openBookingModal(carId) {
    const car = state.cars.find(c => c.id === carId);
    if (!car) return;

    state.selectedCar = car;
    state.ktpImageBase64 = null;
    state.paymentProofBase64 = null;
    state.settlementProofBase64 = null;
    resetKtpPreview();
    resetPaymentProofPreview();
    resetCustomerSettlementProofPreview();

    // Reset Opsi Pembayaran ke default (Bayar Lunas di Awal)
    const defaultPayType = document.querySelector('input[name="paymentType"][value="lunas_awal"]');
    if (defaultPayType) defaultPayType.checked = true;
    const dpInput = document.getElementById('bookDpAmount');
    if (dpInput) {
        dpInput.value = '';
        delete dpInput.dataset.userEdited;
    }
    handlePaymentTypeChange();

    const modal = document.getElementById('bookingModal');

    // Set Info Mobil di Modal
    document.getElementById('modalCarImage').src = car.image;
    document.getElementById('modalCarTitle').textContent = `${car.brand} ${car.model} (${car.year})`;
    document.getElementById('modalCarCategory').textContent = car.category;
    document.getElementById('modalCarDesc').textContent = car.description;

    // Spesifikasi
    document.getElementById('modalCarSeats').textContent = `${car.seats} Kursi`;
    document.getElementById('modalCarTrans').textContent = car.transmission;
    document.getElementById('modalCarFuel').textContent = car.fuel;
    document.getElementById('modalCarLuggage').textContent = car.luggage || '3 Koper';

    // Status Badge
    const statusBadge = document.getElementById('modalCarStatus');
    if (car.status === 'ready') {
        statusBadge.className = 'status-pill-ready';
        statusBadge.innerHTML = '<span class="dot-indicator" style="background-color: var(--clr-emerald);"></span> Unit Ready / Siap Jalan';
    } else {
        statusBadge.className = 'status-pill-used';
        statusBadge.innerHTML = '<span class="dot-indicator" style="background-color: #f59e0b;"></span> Sedang Dalam Masa Sewa';
    }

    // Biaya Supir per Hari untuk Mobil Ini
    const driverFeeVal = car.driver_fee || car.driverFee || 50000;
    const driverFeeTextEl = document.getElementById('modalCarDriverFeeText');
    if (driverFeeTextEl) {
        driverFeeTextEl.textContent = `+ ${formatRupiah(driverFeeVal)} / hari`;
    }

    // Cek Ketentuan Layanan Sewa (Hanya Supir / Keduanya)
    const isDriverOnly = (car.rental_option === 'driver_only') || (car.rentalOption === 'driver_only');
    const selfWrapper = document.getElementById('driverOptionSelfWrapper');
    const driverWrapper = document.getElementById('driverOptionDriverWrapper');
    const selfRadio = document.getElementById('driverOptionSelf');
    const driverRadio = document.getElementById('driverOptionDriver');
    const driverOnlyAlert = document.getElementById('driverOnlyAlert');

    if (isDriverOnly) {
        if (selfRadio) {
            selfRadio.checked = false;
            selfRadio.disabled = true;
        }
        if (driverRadio) {
            driverRadio.checked = true;
            driverRadio.disabled = false;
        }
        if (selfWrapper) {
            selfWrapper.style.opacity = '0.45';
            selfWrapper.style.cursor = 'not-allowed';
            selfWrapper.style.background = '#f1f5f9';
            selfWrapper.style.borderColor = 'var(--clr-border)';
        }
        if (driverWrapper) {
            driverWrapper.style.opacity = '1';
            driverWrapper.style.cursor = 'pointer';
            driverWrapper.style.borderColor = '#10b981';
            driverWrapper.style.background = '#ecfdf5';
        }
        if (driverOnlyAlert) driverOnlyAlert.classList.remove('hidden');
    } else {
        if (selfRadio) {
            selfRadio.disabled = false;
            selfRadio.checked = true;
        }
        if (driverRadio) {
            driverRadio.disabled = false;
            driverRadio.checked = false;
        }
        if (selfWrapper) {
            selfWrapper.style.opacity = '1';
            selfWrapper.style.cursor = 'pointer';
            selfWrapper.style.background = '#f8fafc';
            selfWrapper.style.borderColor = 'var(--clr-border)';
        }
        if (driverWrapper) {
            driverWrapper.style.opacity = '1';
            driverWrapper.style.cursor = 'pointer';
            driverWrapper.style.background = '#f8fafc';
            driverWrapper.style.borderColor = 'var(--clr-border)';
        }
        if (driverOnlyAlert) driverOnlyAlert.classList.add('hidden');
    }

    // Set Option Select Mobil di Form
    const selectUnit = document.getElementById('bookCarSelect');
    if (selectUnit) {
        selectUnit.innerHTML = state.cars.map(c =>
            `<option value="${c.id}" ${c.id === car.id ? 'selected' : ''}>${c.brand} ${c.model} (${c.year}) — ${formatRupiah(state.ownerConfig.isHolidayPricingActive ? c.priceHoliday : c.priceNormal)}/hari</option>`
        ).join('');
    }

    // Populate Dynamic Keperluan Event Options
    const eventSelect = document.getElementById('bookEventSelect') || document.getElementById('bookEvent');
    if (eventSelect) {
        if (typeof EVENT_OPTIONS !== 'undefined') {
            eventSelect.innerHTML = EVENT_OPTIONS.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
        }
    }
    selectCustomEventOption('Wisata / Liburan', 'Wisata / Liburan Keluarga', '<i class="fa-solid fa-umbrella-beach" style="color: #2563eb;"></i>', 'Liburan bersama keluarga, kerabat, atau rekan wisata');

    // Inisialisasi Kalender ke Bulan & Tahun Berjalan Secara Real-Time
    const currentDate = new Date();
    calMonthStart = currentDate.getMonth();
    calYearStart = currentDate.getFullYear();
    calMonthEnd = currentDate.getMonth();
    calYearEnd = currentDate.getFullYear();

    // Set Default Date secara Real-Time (Hari ini s/d Besok)
    const startDateInput = document.getElementById('bookStartDate');
    const endDateInput = document.getElementById('bookEndDate');

    const pad = (n) => String(n).padStart(2, '0');
    const todayStr = `${currentDate.getFullYear()}-${pad(currentDate.getMonth() + 1)}-${pad(currentDate.getDate())}`;
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    const nextDayStr = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(nextDate.getDate())}`;

    if (startDateInput) startDateInput.value = todayStr;
    if (endDateInput) endDateInput.value = nextDayStr;

    // Tampilkan modal secara INSTAN tanpa menunggu jaringan (zero delay / anti-lag)
    renderConfirmedDatesNotice();
    renderBookingCalendar('start');
    renderBookingCalendar('end');
    calculateBookingPrice();
    checkDateConflict();

    if (modal) modal.classList.remove('hidden');

    // Ambil jadwal terkonfirmasi dari database secara asynchronous di latar belakang
    fetchConfirmedBookings(car.id).then(() => {
        if (state.selectedCar && state.selectedCar.id === car.id) {
            renderConfirmedDatesNotice();
            renderBookingCalendar('start');
            renderBookingCalendar('end');
            checkDateConflict();
        }
    }).catch(() => {});
}

// Tutup Modal Pemesanan
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.add('hidden');
    closeBookingCalendars();
}

// Sinkronisasi Real-Time pada Form Pemesanan agar booking yang sudah lewat tanggal otomatis hilang
function refreshBookingModalSchedulesRealtime() {
    const modal = document.getElementById('bookingModal');
    if (!modal || modal.classList.contains('hidden') || !state.selectedCar) return;
    fetchConfirmedBookings(state.selectedCar.id).then(() => {
        renderConfirmedDatesNotice();
        renderBookingCalendar('start');
        renderBookingCalendar('end');
        checkDateConflict();
    }).catch(() => {});
}

setInterval(refreshBookingModalSchedulesRealtime, 15000);
window.addEventListener('focus', refreshBookingModalSchedulesRealtime);
window.addEventListener('storage', (e) => {
    if (!e.key || e.key === 'rcm_rent_bookings') {
        refreshBookingModalSchedulesRealtime();
    }
});

// Listener untuk menutup kalender jika klik di luar
document.addEventListener('click', function(e) {
    const calStart = document.getElementById('calendar-start');
    const calEnd = document.getElementById('calendar-end');
    const startInput = document.getElementById('bookStartDate');
    const endInput = document.getElementById('bookEndDate');

    if (calStart && !calStart.contains(e.target) && e.target !== startInput) {
        calStart.classList.add('hidden');
    }
    if (calEnd && !calEnd.contains(e.target) && e.target !== endInput) {
        calEnd.classList.add('hidden');
    }
});

// Upload KTP Handler dengan auto-kompresi gambar
function handleKtpUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran foto KTP terlalu besar. Maksimal 10MB.");
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const rawBase64 = event.target.result;

        // Kompres via HTML5 Canvas (max 1200px) agar ringan & andal
        const tempImg = new Image();
        tempImg.onload = function () {
            const canvas = document.createElement('canvas');
            let width = tempImg.width;
            let height = tempImg.height;
            const maxDim = 1200;
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
            const compressed = canvas.toDataURL('image/jpeg', 0.85);

            state.ktpImageBase64 = compressed;

            const promptEl = document.getElementById('ktpUploadPrompt');
            const containerEl = document.getElementById('ktpPreviewContainer');
            const previewImg = document.getElementById('ktpPreviewImg') || document.getElementById('ktpPreviewImage');
            const fileNameEl = document.getElementById('ktpFileName');

            if (promptEl) promptEl.classList.add('hidden');
            if (containerEl) containerEl.classList.remove('hidden');
            if (previewImg) {
                previewImg.src = compressed;
                previewImg.classList.remove('hidden');
            }
            if (fileNameEl) {
                fileNameEl.textContent = `${file.name} (Siap Diunggah)`;
            }
        };
        tempImg.src = rawBase64;
    };
    reader.readAsDataURL(file);
}

// Reset Preview Foto KTP
function resetKtpPreview() {
    state.ktpImageBase64 = null;
    const input = document.getElementById('bookKtpInput');
    if (input) input.value = '';

    const promptEl = document.getElementById('ktpUploadPrompt');
    const containerEl = document.getElementById('ktpPreviewContainer');
    const previewImg = document.getElementById('ktpPreviewImg') || document.getElementById('ktpPreviewImage');
    const fileNameEl = document.getElementById('ktpFileName');

    if (promptEl) promptEl.classList.remove('hidden');
    if (containerEl) containerEl.classList.add('hidden');
    if (previewImg) {
        previewImg.src = '';
        previewImg.classList.add('hidden');
    }
    if (fileNameEl) fileNameEl.textContent = '';
}

// Render Info Rekening & QRIS dari Konfigurasi Owner ke Modal Pemesanan
function renderPaymentConfigInModal() {
    const cfg = state.ownerConfig || {};
    const bankNameEl = document.getElementById('displayBankName');
    const bankNumEl = document.getElementById('displayBankNumber');
    const bankHolderEl = document.getElementById('displayBankHolder');
    const qrisImgEl = document.getElementById('displayQrisImage');
    const qrisEmptyEl = document.getElementById('qrisEmptyNotice');

    if (bankNameEl) bankNameEl.textContent = cfg.bankName || 'BCA';
    if (bankNumEl) bankNumEl.textContent = cfg.bankAccountNumber || '7890123456';
    if (bankHolderEl) bankHolderEl.textContent = cfg.bankAccountHolder || cfg.businessName || 'RPM Rent Car Makassar';

    if (qrisImgEl && qrisEmptyEl) {
        if (cfg.qrisImage && cfg.qrisImage.length > 20) {
            qrisImgEl.src = cfg.qrisImage;
            qrisImgEl.classList.remove('hidden');
            qrisEmptyEl.classList.add('hidden');
        } else {
            qrisImgEl.src = '';
            qrisImgEl.classList.add('hidden');
            qrisEmptyEl.classList.remove('hidden');
        }
    }
}

// Salin Nomor Rekening ke Clipboard
function copyBankAccountNumber() {
    const cfg = state.ownerConfig || {};
    const accNum = cfg.bankAccountNumber || document.getElementById('displayBankNumber')?.textContent || '7890123456';
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(accNum.trim()).then(() => {
            const btnTxt = document.getElementById('copyBankBtnText');
            if (btnTxt) {
                const old = btnTxt.textContent;
                btnTxt.textContent = '✓ Tersalin!';
                setTimeout(() => { btnTxt.textContent = old; }, 2000);
            }
        }).catch(() => {});
    }
}

// Handler Perubahan Opsi Pembayaran (DP / Bayar Lunas di Awal / Bayar di Akhir)
function handlePaymentTypeChange() {
    const payTypeRadio = document.querySelector('input[name="paymentType"]:checked');
    if (!payTypeRadio) return;
    const payType = payTypeRadio.value || 'lunas_awal';
    const dpAmountBox = document.getElementById('dpAmountBox');
    const waNoticeText = document.getElementById('whatsappPaymentNoticeText');
    const waNoticeTitle = document.getElementById('whatsappNoticeTitle');

    // Update highlight border radio cards
    const lblDp = document.getElementById('labelPayTypeDp');
    const lblLunas = document.getElementById('labelPayTypeLunas');
    const lblAkhir = document.getElementById('labelPayTypeAkhir');
    [lblDp, lblLunas, lblAkhir].forEach(el => {
        if (el) {
            el.style.borderColor = 'var(--clr-border)';
            el.style.background = '#f8fafc';
        }
    });
    const activeLbl = payType === 'dp' ? lblDp : (payType === 'lunas_awal' ? lblLunas : lblAkhir);
    if (activeLbl) {
        activeLbl.style.borderColor = '#dc2626';
        activeLbl.style.background = '#fef2f2';
    }

    if (payType === 'dp') {
        if (dpAmountBox) dpAmountBox.classList.remove('hidden');
        if (waNoticeTitle) waNoticeTitle.textContent = 'Pembayaran DP Awal via WhatsApp Admin';
        if (waNoticeText) {
            waNoticeText.innerHTML = 'Anda memilih opsi <strong>DP (Uang Muka)</strong>. Rincian DP akan dikirimkan ke WhatsApp Admin. Admin akan mengirimkan nomor rekening resmi / QRIS untuk pembayaran transfer DP guna mengunci jadwal pesanan Anda.';
        }
        updateDpButtonsHighlight(50);
    } else if (payType === 'lunas_awal') {
        if (dpAmountBox) dpAmountBox.classList.add('hidden');
        if (waNoticeTitle) waNoticeTitle.textContent = 'Pembayaran Lunas di Awal via WhatsApp Admin';
        if (waNoticeText) {
            waNoticeText.innerHTML = 'Anda memilih opsi <strong>Bayar Lunas di Awal</strong>. Admin akan mengirimkan invoice total tagihan pelunasan penuh dan nomor rekening/QRIS resmi langsung melalui chat WhatsApp.';
        }
    } else {
        if (dpAmountBox) dpAmountBox.classList.add('hidden');
        if (waNoticeTitle) waNoticeTitle.textContent = 'Pembayaran di Akhir (Saat Selesai / Serah Terima)';
        if (waNoticeText) {
            waNoticeText.innerHTML = 'Anda memilih opsi <strong>Bayar di Akhir</strong>. Tidak perlu transfer sekarang. Tagihan sewa akan diselesaikan saat serah terima unit / selesai sewa.';
        }
    }

    calculateBookingPrice();
}

// Handler Perubahan Metode Pembayaran (Transfer Bank / QRIS)
function handlePaymentMethodChange() {
    const methodRadio = document.querySelector('input[name="paymentMethod"]:checked');
    if (!methodRadio) return;
    const method = methodRadio.value || 'transfer';
    const tfInfo = document.getElementById('paymentTransferInfo');
    const qrisInfo = document.getElementById('paymentQrisInfo');
    const lblTf = document.getElementById('labelMethodTf');
    const lblQris = document.getElementById('labelMethodQris');

    if (method === 'qris') {
        if (tfInfo) tfInfo.classList.add('hidden');
        if (qrisInfo) qrisInfo.classList.remove('hidden');
        if (lblQris) lblQris.style.borderColor = '#dc2626';
        if (lblTf) lblTf.style.borderColor = 'var(--clr-border)';
    } else {
        if (tfInfo) tfInfo.classList.remove('hidden');
        if (qrisInfo) qrisInfo.classList.add('hidden');
        if (lblTf) lblTf.style.borderColor = '#dc2626';
        if (lblQris) lblQris.style.borderColor = 'var(--clr-border)';
    }
}

// Update Highlight Tombol DP 30% dan DP 50%
function updateDpButtonsHighlight(pct) {
    const btn30 = document.getElementById('btnDp30');
    const btn50 = document.getElementById('btnDp50');
    if (!btn30 || !btn50) return;

    if (pct === 30) {
        btn30.style.background = '#f59e0b';
        btn30.style.color = '#ffffff';
        btn30.style.fontWeight = '800';
        btn30.style.boxShadow = '0 2px 5px rgba(245, 158, 11, 0.4)';

        btn50.style.background = '#ffffff';
        btn50.style.color = '#b45309';
        btn50.style.fontWeight = '700';
        btn50.style.boxShadow = 'none';
    } else if (pct === 50) {
        btn50.style.background = '#f59e0b';
        btn50.style.color = '#ffffff';
        btn50.style.fontWeight = '800';
        btn50.style.boxShadow = '0 2px 5px rgba(245, 158, 11, 0.4)';

        btn30.style.background = '#ffffff';
        btn30.style.color = '#b45309';
        btn30.style.fontWeight = '700';
        btn30.style.boxShadow = 'none';
    } else {
        btn30.style.background = '#ffffff';
        btn30.style.color = '#b45309';
        btn30.style.fontWeight = '700';
        btn30.style.boxShadow = 'none';

        btn50.style.background = '#ffffff';
        btn50.style.color = '#b45309';
        btn50.style.fontWeight = '700';
        btn50.style.boxShadow = 'none';
    }
}

// Set Cepat Persentase DP (30% atau 50%)
function setDpPercentage(pct) {
    const dpInput = document.getElementById('bookDpAmount');
    if (!dpInput) return;
    const total = state.currentGrandTotal || 400000;
    const calcDp = Math.round((total * pct) / 100);
    dpInput.value = calcDp;
    dpInput.dataset.userEdited = 'true';
    updateDpButtonsHighlight(pct);
    calculateBookingPrice();
}

// Handle Input Manual Nominal DP
function handleDpAmountInput() {
    const dpInput = document.getElementById('bookDpAmount');
    if (!dpInput) return;
    dpInput.dataset.userEdited = 'true';

    const total = state.currentGrandTotal || 0;
    const currentVal = parseFloat(dpInput.value) || 0;
    if (total > 0) {
        const val30 = Math.round(total * 0.3);
        const val50 = Math.round(total * 0.5);
        if (Math.abs(currentVal - val30) <= Math.max(100, val30 * 0.02)) {
            updateDpButtonsHighlight(30);
        } else if (Math.abs(currentVal - val50) <= Math.max(100, val50 * 0.02)) {
            updateDpButtonsHighlight(50);
        } else {
            updateDpButtonsHighlight(null);
        }
    }
    calculateBookingPrice();
}

// Upload Bukti Pembayaran (Opsional) dengan Kompresi Canvas
function handlePaymentProofUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran file bukti pembayaran terlalu besar. Maksimal 10MB.");
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const rawBase64 = event.target.result;
        const tempImg = new Image();
        tempImg.onload = function () {
            const canvas = document.createElement('canvas');
            let width = tempImg.width;
            let height = tempImg.height;
            const maxDim = 1200;
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
            const compressed = canvas.toDataURL('image/jpeg', 0.85);

            state.paymentProofBase64 = compressed;

            const promptEl = document.getElementById('paymentProofUploadPrompt');
            const containerEl = document.getElementById('paymentProofPreviewContainer');
            const previewImg = document.getElementById('paymentProofPreviewImg');
            const fileNameEl = document.getElementById('paymentProofFileName');

            if (promptEl) promptEl.classList.add('hidden');
            if (containerEl) containerEl.classList.remove('hidden');
            if (previewImg) previewImg.src = compressed;
            if (fileNameEl) fileNameEl.textContent = `${file.name} (Bukti Bayar Siap Dikirim)`;
        };
        tempImg.src = rawBase64;
    };
    reader.readAsDataURL(file);
}

// Reset Preview Bukti Pembayaran
function resetPaymentProofPreview() {
    state.paymentProofBase64 = null;
    const input = document.getElementById('bookPaymentProofInput');
    if (input) input.value = '';

    const promptEl = document.getElementById('paymentProofUploadPrompt');
    const containerEl = document.getElementById('paymentProofPreviewContainer');
    const previewImg = document.getElementById('paymentProofPreviewImg');
    const fileNameEl = document.getElementById('paymentProofFileName');

    if (promptEl) promptEl.classList.remove('hidden');
    if (containerEl) containerEl.classList.add('hidden');
    if (previewImg) previewImg.src = '';
    if (fileNameEl) fileNameEl.textContent = '';
}

// Upload Bukti Pelunasan oleh Pelanggan (Khusus DP, Opsional)
function handleCustomerSettlementProofUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran file bukti pelunasan terlalu besar. Maksimal 10MB.");
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const rawBase64 = event.target.result;
        const tempImg = new Image();
        tempImg.onload = function () {
            const canvas = document.createElement('canvas');
            let width = tempImg.width;
            let height = tempImg.height;
            const maxDim = 1200;
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
            const compressed = canvas.toDataURL('image/jpeg', 0.85);

            state.settlementProofBase64 = compressed;

            const promptEl = document.getElementById('customerSettlementProofUploadPrompt');
            const containerEl = document.getElementById('customerSettlementProofPreviewContainer');
            const previewImg = document.getElementById('customerSettlementProofPreviewImg');
            const fileNameEl = document.getElementById('customerSettlementProofFileName');

            if (promptEl) promptEl.classList.add('hidden');
            if (containerEl) containerEl.classList.remove('hidden');
            if (previewImg) previewImg.src = compressed;
            if (fileNameEl) fileNameEl.textContent = `${file.name} (Bukti Pelunasan Terlampir)`;
        };
        tempImg.src = rawBase64;
    };
    reader.readAsDataURL(file);
}

// Reset Preview Bukti Pelunasan Pelanggan
function resetCustomerSettlementProofPreview() {
    state.settlementProofBase64 = null;
    const input = document.getElementById('bookCustomerSettlementProofInput');
    if (input) input.value = '';

    const promptEl = document.getElementById('customerSettlementProofUploadPrompt');
    const containerEl = document.getElementById('customerSettlementProofPreviewContainer');
    const previewImg = document.getElementById('customerSettlementProofPreviewImg');
    const fileNameEl = document.getElementById('customerSettlementProofFileName');

    if (promptEl) promptEl.classList.remove('hidden');
    if (containerEl) containerEl.classList.add('hidden');
    if (previewImg) previewImg.src = '';
    if (fileNameEl) fileNameEl.textContent = '';
}

// Kalkulasi Total Harga Sewa & Supir
function calculateBookingPrice() {
    const selectedId = document.getElementById('bookCarSelect')?.value;
    const car = state.cars.find(c => c.id === selectedId) || state.selectedCar;
    if (!car) return;

    const isHoliday = state.ownerConfig.isHolidayPricingActive;
    const carRate = isHoliday ? car.priceHoliday : car.priceNormal;

    const startDateVal = document.getElementById('bookStartDate')?.value;
    const endDateVal = document.getElementById('bookEndDate')?.value;

    let days = 1;
    if (startDateVal && endDateVal) {
        const start = new Date(startDateVal);
        const end = new Date(endDateVal);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        days = diffDays > 0 ? diffDays : 1;
    }

    const carTotal = carRate * days;

    const driverOption = document.querySelector('input[name="driverOption"]:checked')?.value || 'without_driver';
    const isWithDriver = (driverOption === 'with_driver' || driverOption === 'driver');
    let driverTotal = 0;
    let driverRateText = 'Rp 0';

    if (isWithDriver) {
        const driverRate = isHoliday ? (car.driverFee || car.driverRateHoliday || 50000) : (car.driverFee || car.driverRateNormal || 50000);
        driverTotal = driverRate * days;
        driverRateText = `${formatRupiah(driverRate)}/hari`;
    }

    const grandTotal = carTotal + driverTotal;
    state.currentGrandTotal = grandTotal;

    const daysLabelEl = document.getElementById('calcDaysLabel');
    if (daysLabelEl) daysLabelEl.textContent = `${days} Hari`;

    // Update UI Kalkulasi
    const dailyEl = document.getElementById('calcDailyRate');
    if (dailyEl) dailyEl.textContent = `${formatRupiah(carRate)} / hari`;

    const carTotalEl = document.getElementById('calcCarTotal');
    if (carTotalEl) carTotalEl.textContent = formatRupiah(carTotal);

    const driverRow = document.getElementById('calcDriverRow');
    const driverRateEl = document.getElementById('calcDriverRate');
    const driverTotalEl = document.getElementById('calcDriverTotal');

    if (isWithDriver) {
        if (driverRow) driverRow.classList.remove('hidden');
        if (driverRateEl) driverRateEl.textContent = driverRateText;
        if (driverTotalEl) driverTotalEl.textContent = formatRupiah(driverTotal);
    } else {
        if (driverRow) driverRow.classList.add('hidden');
    }

    const grandTotalEl = document.getElementById('calcGrandTotal');
    if (grandTotalEl) grandTotalEl.textContent = formatRupiah(grandTotal);

    // Hitung Nominal Pembayaran DP vs Lunas di Awal vs Bayar di Akhir
    const payType = document.querySelector('input[name="paymentType"]:checked')?.value || 'lunas_awal';
    const dpInput = document.getElementById('bookDpAmount');
    const dpSummaryRow = document.getElementById('calcDpSummaryRow');
    const dpDisplayEl = document.getElementById('calcDpDisplay');
    const remDisplayEl = document.getElementById('calcRemainingDisplay');

    if (payType === 'dp') {
        if (dpInput && (!dpInput.value || !dpInput.dataset.userEdited)) {
            dpInput.value = Math.round(grandTotal * 0.5);
        }
        const dpVal = Math.max(0, Math.min(grandTotal, parseFloat(dpInput?.value) || Math.round(grandTotal * 0.5)));
        const remainingVal = Math.max(0, grandTotal - dpVal);

        if (dpSummaryRow) dpSummaryRow.classList.remove('hidden');
        if (dpDisplayEl) dpDisplayEl.textContent = formatRupiah(dpVal);
        if (remDisplayEl) remDisplayEl.textContent = formatRupiah(remainingVal);
    } else {
        if (dpSummaryRow) dpSummaryRow.classList.add('hidden');
    }
}

// Handle Submit Formulir Pemesanan ke WhatsApp & Database Booking
async function handleBookingSubmit(e) {
    e.preventDefault();

    const selectedId = document.getElementById('bookCarSelect')?.value;
    const car = state.cars.find(c => c.id == selectedId) || state.selectedCar;
    if (!car) {
        alert('Silakan pilih armada mobil terlebih dahulu.');
        return;
    }

    const name = (document.getElementById('bookCustomerName') || document.getElementById('bookCustName'))?.value.trim() || '';
    const phone = (document.getElementById('bookCustomerPhone') || document.getElementById('bookCustPhone'))?.value.trim() || '';
    const city = document.getElementById('bookCustomerCity')?.value.trim() || '';
    const eventEl = document.getElementById('bookEventSelect') || document.getElementById('bookEvent');
    const event = eventEl ? eventEl.value : 'Wisata / Liburan';
    const startDate = document.getElementById('bookStartDate')?.value || '';
    const endDate = document.getElementById('bookEndDate')?.value || '';
    // Jam peminjaman otomatis secara real-time saat pelanggan melakukan pemesanan
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const realTimeNow = `${currentHours}:${currentMinutes}`;
    const startTime = document.getElementById('bookStartTime')?.value || realTimeNow;
    const endTime = document.getElementById('bookEndTime')?.value || realTimeNow;
    const pickupLoc = document.getElementById('bookPickupLocation')?.value.trim() || '';
    const driverOpt = document.querySelector('input[name="driverOption"]:checked')?.value || 'without_driver';
    const notes = (document.getElementById('bookNotes') || document.getElementById('bookCustNotes'))?.value.trim() || '';

    if (!name || !phone || !startDate || !endDate) {
        alert('Harap lengkapi semua kolom wajib (Nama, WhatsApp, Tanggal Pemakaian).');
        return;
    }

    // Pastikan foto KTP terunggah untuk verifikasi identitas penyewa
    if (!state.ktpImageBase64) {
        alert('⚠️ Harap pilih dan upload foto KTP / Kartu Identitas Penyewa terlebih dahulu.');
        const ktpPrompt = document.getElementById('ktpUploadPrompt');
        if (ktpPrompt) {
            ktpPrompt.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        document.getElementById('bookKtpInput')?.click();
        return;
    }

    // Blokir jika tanggal bentrok dengan pesanan yang sudah dikonfirmasi
    if (checkDateConflict()) {
        alert('⚠️ PERINGATAN: Mobil ini telah berstatus DIKONFIRMASI untuk rentang tanggal yang Anda pilih.\n\nPelanggan lain tidak dapat melakukan booking pada tanggal yang sama. Silakan pilih tanggal lain yang masih tersedia!');
        return;
    }

    const isWithDriver = (driverOpt === 'with_driver' || driverOpt === 'driver');
    const isHoliday = state.ownerConfig.isHolidayPricingActive;
    const carRate = isHoliday ? car.priceHoliday : car.priceNormal;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;

    const carTotal = carRate * diffDays;
    let driverTotal = 0;
    let driverLabel = 'Lepas Kunci (Berkendara Sendiri)';

    if (isWithDriver) {
        const driverRate = isHoliday ? (car.driverFee || car.driverRateHoliday || 50000) : (car.driverFee || car.driverRateNormal || 50000);
        driverTotal = driverRate * diffDays;
        driverLabel = `Dengan Supir Pengalaman (${formatRupiah(driverRate)}/hari)`;
    }

    const grandTotal = carTotal + driverTotal;
    const generatedCode = 'RCM-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Ambil data opsi pembayaran (DP / Lunas di Awal / Bayar di Akhir)
    const paymentType = document.querySelector('input[name="paymentType"]:checked')?.value || 'lunas_awal';
    const dpAmountVal = paymentType === 'dp'
        ? (parseFloat(document.getElementById('bookDpAmount')?.value) || Math.round(grandTotal * 0.5))
        : 0;
    const remainingAmountVal = paymentType === 'dp' ? Math.max(0, grandTotal - dpAmountVal) : 0;
    const paymentMethod = 'whatsapp';
    const paymentProofData = null;
    const settlementProofData = null;

    const initialStatus = paymentType === 'bayar_akhir' ? 'confirmed_pending' : 'pending';

    const newBookingObj = {
        id: Date.now().toString(),
        booking_code: generatedCode,
        car_id: car.id ? car.id.toString() : '',
        customer_name: name,
        customer_phone: phone,
        car_name: `${car.brand || ''} ${car.model || ''}`.trim() || 'Toyota Avanza',
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        driver_label: isWithDriver ? '+Supir' : 'Tanpa Supir',
        with_driver: isWithDriver,
        total_price: grandTotal,
        payment_type: paymentType,
        payment_method: paymentMethod,
        dp_amount: dpAmountVal,
        status: initialStatus,
        notes: notes,
        ktp_image: state.ktpImageBase64 || null,
        payment_proof: paymentProofData,
        payment_proof_settlement: settlementProofData
    };

    // 1. Simpan ke LocalStorage agar langsung tampil di Dashboard Admin Data Booking
    try {
        let existingBookings = [];
        const saved = localStorage.getItem('rcm_rent_bookings');
        if (saved) {
            existingBookings = JSON.parse(saved);
        }
        existingBookings.unshift(newBookingObj);
        localStorage.setItem('rcm_rent_bookings', JSON.stringify(existingBookings));
    } catch (err) {}

    // 2. Simpan ke Database Backend API Laravel (/api/bookings)
    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                car_id: car.id,
                customer_name: name,
                customer_phone: phone,
                customer_city: city,
                event_type: event,
                start_date: startDate,
                end_date: endDate,
                start_time: startTime,
                end_time: endTime,
                duration_days: diffDays,
                pickup_location: pickupLoc,
                driver_option: isWithDriver ? 'with_driver' : 'without_driver',
                with_driver: isWithDriver,
                total_price: grandTotal,
                payment_type: paymentType,
                payment_method: paymentMethod,
                dp_amount: dpAmountVal,
                status: initialStatus,
                notes: notes,
                ktp_image: state.ktpImageBase64 || null,
                payment_proof: paymentProofData,
                payment_proof_settlement: settlementProofData
            })
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            if (res.status === 422 && errData.message) {
                alert(`⚠️ ${errData.message}`);
                return;
            }
        }

        if (res.ok) {
            const apiRes = await res.json();
            if (apiRes.data && apiRes.data.id) {
                newBookingObj.id = apiRes.data.id.toString();
                newBookingObj.booking_code = apiRes.data.booking_code || generatedCode;
                // Update local storage dengan ID resmi dari database
                try {
                    const saved = localStorage.getItem('rcm_rent_bookings');
                    if (saved) {
                        let cur = JSON.parse(saved);
                        if (cur.length > 0) cur[0] = newBookingObj;
                        localStorage.setItem('rcm_rent_bookings', JSON.stringify(cur));
                    }
                } catch (e) {}
            }
        }
    } catch (apiErr) {
        console.warn('Simpan ke backend offline/fallback:', apiErr);
    }

    // 3. Format Pesan WhatsApp Super Rapi Sesuai Opsi Pembayaran (Transaksi & Pembayaran via Chat WhatsApp)
    const cfg = state.ownerConfig || {};
    let paymentDetailsWa = '';
    let closingGreeting = '';

    if (paymentType === 'dp') {
        paymentDetailsWa = `💳 *SKEMA PEMBAYARAN:*
• Opsi Pembayaran: *DP (Uang Muka)*
• Nominal DP Awal: *${formatRupiah(dpAmountVal)}*
• Sisa Pelunasan: *${formatRupiah(remainingAmountVal)}*
• Transaksi & Pembayaran: Dilakukan via chat WhatsApp Admin`;
        closingGreeting = `Halo Admin ${cfg.businessName || 'Rent Car Makassar'}, saya ingin memesan unit rental mobil di atas dengan opsi DP (${formatRupiah(dpAmountVal)}). Mohon konfirmasi jadwal dan info nomor rekening transfer / QRIS untuk pembayaran DP via WhatsApp ini. Terima kasih!`;
    } else if (paymentType === 'lunas_awal') {
        paymentDetailsWa = `💳 *SKEMA PEMBAYARAN:*
• Opsi Pembayaran: *Bayar Lunas di Awal*
• Total Tagihan Lunas: *${formatRupiah(grandTotal)}*
• Transaksi & Pembayaran: Dilakukan via chat WhatsApp Admin`;
        closingGreeting = `Halo Admin ${cfg.businessName || 'Rent Car Makassar'}, saya ingin memesan unit rental mobil di atas dengan pembayaran Lunas di Awal (${formatRupiah(grandTotal)}). Mohon konfirmasi jadwal, invoice, dan nomor rekening transfer / QRIS via WhatsApp ini. Terima kasih!`;
    } else {
        paymentDetailsWa = `💳 *SKEMA PEMBAYARAN:*
• Opsi Pembayaran: *Bayar di Akhir (Saat Selesai / Serah Terima)*
• Total Tagihan Akhir: *${formatRupiah(grandTotal)}*
• Transaksi & Pembayaran: Dibayarkan saat serah terima unit / selesai sewa`;
        closingGreeting = `Halo Admin ${cfg.businessName || 'Rent Car Makassar'}, saya ingin memesan unit rental mobil di atas dengan opsi Bayar di Akhir. Mohon konfirmasi ketersediaan unit dan jadwal sewa via WhatsApp ini. Terima kasih!`;
    }

    const message = `
*FORMULIR PEMESANAN RENTAL MOBIL*
_Rent Car Makassar — Booking System_
Kode Booking: *${newBookingObj.booking_code}*

📌 *DETAIL PELANGGAN:*
• Nama Lengkap: ${name}
• No. WhatsApp/HP: ${phone}
${city ? `• Asal Kota/Alamat: ${city}\n` : ''}
🚘 *DETAIL UNIT & LAYANAN:*
• Unit Mobil: *${car.brand} ${car.model} (${car.year})*
• Kategori: ${car.category}
• Opsi Layanan: ${driverLabel}
• Keperluan: ${event}

📅 *JADWAL SEWA:*
• Mulai: ${startDate} (Pukul ${startTime} WITA)
• Selesai: ${endDate} (Pukul ${endTime} WITA) — (${diffDays} Hari)
${pickupLoc ? `• Lokasi Penjemputan: ${pickupLoc}\n` : ''}
💰 *RINCIAN BIAYA SEWA:*
• Tarif Sewa Unit (${diffDays} Hari): ${formatRupiah(carTotal)}
${isWithDriver ? `• Biaya Supir (${diffDays} Hari): ${formatRupiah(driverTotal)}\n` : ''}• *TOTAL BIAYA: ${formatRupiah(grandTotal)}*
${isHoliday ? `_(Catatan: Menggunakan Tarif Peak Season / Liburan)_\n` : ''}
${paymentDetailsWa}
• Identitas / Foto KTP: ✅ Sudah Terlampir di Sistem & Siap Diverifikasi

📝 *CATATAN TAMBAHAN:*
${notes ? notes : '-'}

${closingGreeting}
`.trim();

    const encodedMsg = encodeURIComponent(message);
    const rawWaNumber = cfg.whatsappNumber || '6281234567890';
    let waNumber = rawWaNumber.replace(/[^0-9]/g, '');
    if (waNumber.startsWith('0')) {
        waNumber = '62' + waNumber.substring(1);
    }
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

    closeBookingModal();
    window.open(waUrl, '_blank');
}

function setCategoryFilter(category, btnElement) {
    state.currentCategoryFilter = category;
    state.isCatalogExpanded = false;

    document.querySelectorAll('.cat-filter-btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
    });

    if (btnElement) {
        btnElement.classList.add('btn-primary');
        btnElement.classList.remove('btn-outline');
    }

    renderCarsCatalog();
}

function resetFilters() {
    state.currentCategoryFilter = 'all';
    state.searchQuery = '';
    state.isCatalogExpanded = false;
    const searchInput = document.getElementById('carSearchInput');
    if (searchInput) searchInput.value = '';

    const firstBtn = document.querySelector('.cat-filter-btn');
    if (firstBtn) setCategoryFilter('all', firstBtn);
    else renderCarsCatalog();
}

// Mobile Menu Drawer Handlers
function toggleMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    const barsIcon = document.getElementById('menuIconBars');
    const closeIcon = document.getElementById('menuIconClose');
    if (!drawer) return;

    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
        drawer.classList.remove('open');
        if (backdrop) backdrop.classList.add('hidden');
        if (barsIcon) barsIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
        document.body.style.overflow = '';
    } else {
        drawer.classList.add('open');
        if (backdrop) backdrop.classList.remove('hidden');
        if (barsIcon) barsIcon.classList.add('hidden');
        if (closeIcon) closeIcon.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    const barsIcon = document.getElementById('menuIconBars');
    const closeIcon = document.getElementById('menuIconClose');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.add('hidden');
    if (barsIcon) barsIcon.classList.remove('hidden');
    if (closeIcon) closeIcon.classList.add('hidden');
    document.body.style.overflow = '';
}

// Scroll Effects (Header Glass & Back to Top - Optimized with requestAnimationFrame & state guard)
function initScrollEffects() {
    const header = document.querySelector('.header-glass');
    const backToTopBtn = document.getElementById('backToTopBtn');
    let ticking = false;
    let isHeaderScrolled = false;
    let isBackToTopVisible = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY || window.pageYOffset;

                // 1. Header Glass Effect (hanya mutasi DOM jika status berubah)
                const shouldHeader = scrollY > 30;
                if (shouldHeader !== isHeaderScrolled) {
                    isHeaderScrolled = shouldHeader;
                    if (header) {
                        if (isHeaderScrolled) {
                            header.classList.add('header-scrolled');
                        } else {
                            header.classList.remove('header-scrolled');
                        }
                    }
                }

                // 2. Floating Back to Top Button
                const shouldTop = scrollY > 400;
                if (shouldTop !== isBackToTopVisible) {
                    isBackToTopVisible = shouldTop;
                    if (backToTopBtn) {
                        if (isBackToTopVisible) {
                            backToTopBtn.classList.remove('hidden');
                        } else {
                            backToTopBtn.classList.add('hidden');
                        }
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Scroll Reveal Effect via IntersectionObserver dengan Staggering
function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed), .reveal-scale:not(.is-revealed)');
    if (!targets.length) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -30px 0px'
        });

        targets.forEach((target, index) => {
            target.style.transitionDelay = `${(index % 4) * 0.06}s`;
            observer.observe(target);
        });
    } else {
        targets.forEach(target => target.classList.add('is-revealed'));
    }
}

// Smooth Number Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter-number:not(.counter-done)');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
        counters.forEach(c => {
            c.textContent = c.getAttribute('data-target') || c.textContent;
            c.classList.add('counter-done');
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                observer.unobserve(el);
                el.classList.add('counter-done');

                const target = parseInt(el.getAttribute('data-target'), 10) || 0;
                const duration = 1200;
                const startTime = performance.now();

                function updateCounter(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(1, elapsed / duration);
                    // easeOutExpo
                    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    el.textContent = Math.floor(ease * target);

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
            }
        });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));
}

// Interactive City Selector & Route Information di Bagian Jangkauan
const CITY_ROUTE_DATA = {
    'Makassar & Sulawesi': {
        icon: 'fa-plane-departure',
        highlight: 'Hub Utama Sulawesi & Antar-Kota',
        desc: 'Melayani Antar-Jemput Bandara Sultan Hasanuddin (UPG), Pelabuhan Soekarno-Hatta, Pettarani, Losari, Gowa, Maros, Bira, hingga Tana Toraja. Pilihan lepas kunci atau supir profesional.'
    },
    'Jabodetabek': {
        icon: 'fa-building',
        highlight: 'Ibu Kota & Sekitarnya',
        desc: 'Antar-jemput Bandara Soekarno-Hatta (CGK), Halim Perdanakusuma, kawasan perkantoran Sudirman/Thamrin, Tangerang, BSD, Depok, dan Bekasi. Armada bisnis & keluarga prima.'
    },
    'Surabaya & Malang': {
        icon: 'fa-mountain-sun',
        highlight: 'Jawa Timur & Wisata Bromo',
        desc: 'Layanan Bandara Juanda (SUB), Stasiun Gubeng/Pasar Turi, rute wisata Batu-Malang, dan paket privat tour Gunung Bromo dengan supir berpengalaman.'
    },
    'Bali & Lombok': {
        icon: 'fa-umbrella-beach',
        highlight: 'Destinasi Wisata Favorit',
        desc: 'Penjemputan Bandara I Gusti Ngurah Rai (DPS), Kuta, Seminyak, Canggu, Ubud, hingga penyeberangan ke Lombok & Sirkuit Mandalika.'
    },
    'Medan & Sumatera': {
        icon: 'fa-route',
        highlight: 'Sumatera Utara & Lintas Kota',
        desc: 'Armada siap di Bandara Kualanamu (KNO), pusat kota Medan, Danau Toba, Parapat, Berastagi, hingga kebutuhan perjalanan dinas lintas kabupaten.'
    },
    'Kalimantan & Lainnya': {
        icon: 'fa-truck-plane',
        highlight: 'IKN & Kota Transit Utama',
        desc: 'Melayani Balikpapan (BPN), Samarinda, rute proyek IKN Nusantara, Banjarmasin, Pontianak, serta pulau lainnya melalui jaringan mitra resmi RPM.'
    }
};

function updateCityRouteInfo(cityName) {
    const infoContainer = document.getElementById('cityRouteInfoBox');
    if (!infoContainer) return;

    const data = CITY_ROUTE_DATA[cityName] || {
        icon: 'fa-location-dot',
        highlight: `Wilayah ${cityName}`,
        desc: `RPM Rent Car siap melayani pemesanan sewa mobil dengan supir maupun lepas kunci untuk wilayah ${cityName} dan sekitarnya.`
    };

    infoContainer.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <div style="width: 2.25rem; height: 2.25rem; border-radius: 0.5rem; background: rgba(239, 68, 68, 0.2); color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; margin-top: 2px;">
                <i class="fa-solid ${data.icon}"></i>
            </div>
            <div>
                <div style="font-weight: 800; color: #ffffff; font-size: 0.875rem; margin-bottom: 0.2rem;">
                    ${data.highlight}
                </div>
                <div style="color: #94a3b8; font-size: 0.8rem; line-height: 1.5;">
                    ${data.desc}
                </div>
            </div>
        </div>
    `;
}

function initCitySelector() {
    const cityBoxes = document.querySelectorAll('.city-box');
    const waLink = document.querySelector('.city-wa-cta');
    if (!cityBoxes.length || !waLink) return;

    cityBoxes.forEach(box => {
        box.style.cursor = 'pointer';
        box.addEventListener('click', () => {
            cityBoxes.forEach(b => b.classList.remove('active-city'));
            box.classList.add('active-city');

            const cityName = box.textContent.trim();
            updateCityRouteInfo(cityName);

            const waNumber = state?.ownerConfig?.whatsappNumber || '6281234567890';
            const text = encodeURIComponent(`Halo RPM Rent Car Makassar, saya ingin menanyakan ketersediaan rental mobil di wilayah ${cityName}.`);
            waLink.href = `https://wa.me/${waNumber}?text=${text}`;
        });
    });
}

// Interactive Mouse Spotlight on Cards (Hardware-Accelerated 60fps)
function initCardSpotlight() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cardsContainer = document.getElementById('carsGrid');
    if (!cardsContainer) return;

    let rafId = null;
    let targetCard = null;
    let mouseX = 0;
    let mouseY = 0;

    cardsContainer.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.card-unit');
        if (!card) {
            targetCard = null;
            return;
        }

        targetCard = card;
        const rect = card.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        if (!rafId) {
            rafId = requestAnimationFrame(() => {
                if (targetCard) {
                    targetCard.style.setProperty('--mouse-x', `${mouseX}px`);
                    targetCard.style.setProperty('--mouse-y', `${mouseY}px`);
                }
                rafId = null;
            });
        }
    }, { passive: true });

    cardsContainer.addEventListener('mouseleave', () => {
        const cards = cardsContainer.querySelectorAll('.card-unit');
        cards.forEach(c => {
            c.style.removeProperty('--mouse-x');
            c.style.removeProperty('--mouse-y');
        });
    }, { passive: true });
}

// Inisialisasi Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initStorage();
    initScrollEffects();
    initScrollReveal();
    initCounterAnimation();
    initCitySelector();
    initCardSpotlight();

    const searchInput = document.getElementById('carSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if (searchInput) {
        function updateClearBtnVisibility() {
            if (clearSearchBtn) {
                clearSearchBtn.style.display = searchInput.value.trim() ? 'flex' : 'none';
            }
        }

        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            state.isCatalogExpanded = false;
            updateClearBtnVisibility();
            renderCarsCatalog();
        });

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                searchInput.value = '';
                state.searchQuery = '';
                state.isCatalogExpanded = false;
                updateClearBtnVisibility();
                renderCarsCatalog();
                searchInput.focus();
            });
        }
    }

    const startDate = document.getElementById('bookStartDate');
    const endDate = document.getElementById('bookEndDate');

    if (startDate && endDate) {
        startDate.addEventListener('change', () => {
            if (endDate.value < startDate.value) {
                endDate.value = startDate.value;
            }
            endDate.min = startDate.value;
            calculateBookingPrice();
            checkDateConflict();
        });

        endDate.addEventListener('change', () => {
            calculateBookingPrice();
            checkDateConflict();
        });
    }

    document.querySelectorAll('input[name="driverOption"]').forEach(radio => {
        radio.addEventListener('change', calculateBookingPrice);
    });

    const ktpInput = document.getElementById('bookKtpInput');
    if (ktpInput) {
        ktpInput.addEventListener('change', handleKtpUpload);
    }

    const dpInput = document.getElementById('bookDpAmount');
    if (dpInput) {
        dpInput.addEventListener('input', () => {
            dpInput.dataset.userEdited = 'true';
            calculateBookingPrice();
        });
    }

    const reviewAvatarInput = document.getElementById('reviewAvatarInput');
    if (reviewAvatarInput) {
        reviewAvatarInput.addEventListener('change', handleReviewAvatarUpload);
    }
});

state.cars = [...DEFAULT_CARS];

// =========================================================================
// Custom Modern Event Selector Component
// =========================================================================
function toggleCustomEventDropdown(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const menu = document.getElementById('customEventDropdownMenu');
    const chevron = document.getElementById('customEventChevron');
    const trigger = document.getElementById('customEventSelectTrigger');
    if (!menu) return;

    const isHidden = menu.classList.contains('hidden');
    if (isHidden) {
        menu.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
    } else {
        menu.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
}

function selectCustomEventOption(val, title, icon, desc) {
    const hiddenSelect = document.getElementById('bookEvent');
    if (hiddenSelect) {
        hiddenSelect.value = val;
        hiddenSelect.dispatchEvent(new Event('change'));
    }

    const titleEl = document.getElementById('customEventSelectedTitle');
    const descEl = document.getElementById('customEventSelectedDesc');
    const iconEl = document.getElementById('customEventSelectedIconBox');

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc || '';
    if (iconEl) iconEl.innerHTML = icon || '<i class="fa-solid fa-umbrella-beach" style="color: #2563eb;"></i>';

    // Update active highlight & checkmark in list items
    const items = document.querySelectorAll('.custom-event-item');
    items.forEach(item => {
        const itemVal = item.getAttribute('data-value');
        const checkIcon = item.querySelector('.event-item-check');
        if (itemVal === val) {
            item.classList.add('active');
            if (checkIcon) checkIcon.classList.remove('hidden');
        } else {
            item.classList.remove('active');
            if (checkIcon) checkIcon.classList.add('hidden');
        }
    });

    // Close menu
    const menu = document.getElementById('customEventDropdownMenu');
    const chevron = document.getElementById('customEventChevron');
    const trigger = document.getElementById('customEventSelectTrigger');
    if (menu) menu.classList.add('hidden');
    if (chevron) chevron.style.transform = 'rotate(0deg)';
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

// Close custom event dropdown when clicking outside
document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('customEventDropdownWrapper');
    const menu = document.getElementById('customEventDropdownMenu');
    const chevron = document.getElementById('customEventChevron');
    const trigger = document.getElementById('customEventSelectTrigger');
    if (wrapper && !wrapper.contains(e.target)) {
        if (menu && !menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
    }
});

// Keyboard navigation when Story Viewer is open
document.addEventListener('keydown', (e) => {
    const storyModal = document.getElementById('storyViewerModal');
    if (storyModal && !storyModal.classList.contains('hidden')) {
        if (e.key === 'Escape') closeStoryViewer();
        else if (e.key === 'ArrowRight') nextStory();
        else if (e.key === 'ArrowLeft') prevStory();
    }
});

// Alias for form submission compatibility and global handlers
window.openStoryByReviewId = openStoryByReviewId;
window.closeStoryViewer = closeStoryViewer;
window.nextStory = nextStory;
window.prevStory = prevStory;
window.toggleStoryMute = toggleStoryMute;
window.toggleStoryPause = toggleStoryPause;
window.pauseStoryHold = pauseStoryHold;
window.resumeStoryHold = resumeStoryHold;
window.openReviewModal = openReviewModal;
window.closeReviewModal = closeReviewModal;
window.setReviewRating = setReviewRating;
window.handleReviewAvatarUpload = handleReviewAvatarUpload;
window.handleReviewMediaUpload = handleReviewMediaUpload;
window.removeReviewMediaItem = removeReviewMediaItem;
window.handleReviewSubmit = handleReviewSubmit;
window.toggleCustomEventDropdown = toggleCustomEventDropdown;
window.selectCustomEventOption = selectCustomEventOption;
window.submitBookingWhatsApp = handleBookingSubmit;
window.handleBookingSubmit = handleBookingSubmit;
window.resetKtpPreview = resetKtpPreview;
window.resetPaymentProofPreview = resetPaymentProofPreview;
window.handlePaymentProofUpload = handlePaymentProofUpload;
window.resetCustomerSettlementProofPreview = resetCustomerSettlementProofPreview;
window.handleCustomerSettlementProofUpload = handleCustomerSettlementProofUpload;
window.handlePaymentTypeChange = handlePaymentTypeChange;
window.handlePaymentMethodChange = handlePaymentMethodChange;
window.setDpPercentage = setDpPercentage;
window.handleDpAmountInput = handleDpAmountInput;
window.updateDpButtonsHighlight = updateDpButtonsHighlight;
window.copyBankAccountNumber = copyBankAccountNumber;
window.checkDateConflict = checkDateConflict;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.initScrollReveal = initScrollReveal;

// =========================================================================
// FIRST-VISIT CINEMATIC VIDEO INTRO PRELOADER
// =========================================================================
function initIntroPreloader() {
    const root = document.documentElement;
    const preloader = document.getElementById('introPreloader');
    const video = document.getElementById('introPreloaderVideo');
    const skipBtn = document.getElementById('introSkipBtn');
    const muteBtn = document.getElementById('introMuteBtn');
    const muteIcon = document.getElementById('introMuteIcon');
    const progressBar = document.getElementById('introProgressBar');

    const seen = localStorage.getItem('rpm_intro_seen') || sessionStorage.getItem('rpm_intro_seen');
    const params = new URLSearchParams(window.location.search);
    const forceIntro = params.get('intro') === '1';

    if ((seen && !forceIntro) || !root.classList.contains('intro-active') || !preloader || !video) {
        if (preloader) {
            preloader.style.display = 'none';
            try {
                if (video) {
                    video.pause();
                    video.removeAttribute('src');
                    const sourceEl = video.querySelector('source');
                    if (sourceEl) sourceEl.removeAttribute('src');
                    video.load();
                }
            } catch (e) {}
        }
        root.classList.remove('intro-active', 'intro-merging');
        return;
    }

    let isFinished = false;
    const LIGHT_PHASE_TIME_SEC = 8.15;
    const MERGE_LEAD_TIME_SEC = 0.85;

    function updateMuteUi() {
        if (!muteIcon) return;
        muteIcon.className = video.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    }

    function finishIntroPreloader() {
        if (isFinished) return;
        isFinished = true;

        try {
            localStorage.setItem('rpm_intro_seen', '1');
            sessionStorage.setItem('rpm_intro_seen', '1');
        } catch (e) {}

        if (progressBar) {
            progressBar.style.width = '100%';
        }

        root.classList.add('intro-merging');
        preloader.classList.add('is-merging');

        setTimeout(() => {
            try {
                video.pause();
                video.removeAttribute('src');
                const sourceEl = video.querySelector('source');
                if (sourceEl) sourceEl.removeAttribute('src');
                video.load();
            } catch (e) {}

            preloader.style.display = 'none';
            root.classList.remove('intro-active', 'intro-merging');

            if (typeof initScrollReveal === 'function') {
                initScrollReveal();
            }
        }, 920);
    }

    function markVideoReady() {
        preloader.classList.add('is-playing');
    }

    video.addEventListener('playing', markVideoReady);
    video.addEventListener('canplay', markVideoReady);

    video.addEventListener('timeupdate', () => {
        if (isFinished) return;
        const duration = video.duration || 0;
        const current = video.currentTime || 0;

        if (current >= LIGHT_PHASE_TIME_SEC) {
            preloader.classList.add('is-light-phase');
        }

        if (duration > 0) {
            const pct = Math.min(100, (current / duration) * 100);
            if (progressBar) {
                progressBar.style.width = `${pct}%`;
            }

            if (duration - current <= MERGE_LEAD_TIME_SEC) {
                preloader.classList.add('is-light-phase');
                finishIntroPreloader();
            }
        }
    });

    video.addEventListener('ended', finishIntroPreloader);
    video.addEventListener('error', finishIntroPreloader);

    if (skipBtn) {
        skipBtn.addEventListener('click', finishIntroPreloader);
    }

    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            updateMuteUi();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!isFinished && root.classList.contains('intro-active')) {
            if (e.key === 'Escape' || e.key === 'ArrowRight') {
                finishIntroPreloader();
            }
        }
    });

    updateMuteUi();

    try {
        video.load();
    } catch (e) {}

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
            video.muted = true;
            updateMuteUi();
            video.play().catch(() => {
                // If autoplay is completely blocked, let user skip or dismiss gracefully
            });
        });
    }
}

initIntroPreloader();

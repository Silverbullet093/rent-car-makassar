/**
 * Aplikasi Rental Mobil Garuda — Frontend Pelanggan & Pemesanan
 */

// Global State
let state = {
    cars: [],
    ownerConfig: {},
    reviews: [],
    selectedCar: null,
    confirmedBookings: [],
    ktpImageBase64: null,
    reviewAvatarBase64: null,
    selectedReviewRating: 5,
    currentCategoryFilter: 'all',
    searchQuery: ''
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
    if (!localStorage.getItem('rcm_cars_v2')) {
        localStorage.removeItem('garuda_rent_cars');
        localStorage.setItem('rcm_cars_v2', 'true');
    }
    
    // Cars setup
    const savedCars = localStorage.getItem('garuda_rent_cars');
    if (savedCars) {
        try {
            state.cars = JSON.parse(savedCars);
        } catch (e) {
            state.cars = [];
        }
    } else {
        state.cars = [];
        localStorage.setItem('garuda_rent_cars', JSON.stringify(state.cars));
    }

    // Try fetching cars from API if available
    try {
        const res = await fetch('/api/cars');
        if (res.ok) {
            const result = await res.json();
            if (result.data) {
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
                    driverRateNormal: parseFloat(c.driver_rate_normal || 0),
                    driverRateHoliday: parseFloat(c.driver_rate_holiday || 0),
                    status: c.status,
                    image: c.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
                    description: c.description
                }));
                localStorage.setItem('garuda_rent_cars', JSON.stringify(state.cars));
            }
        }
    } catch (err) {
        // Silent fallback to local storage
    }

    // Config setup
    const savedConfig = localStorage.getItem('garuda_rent_config');
    if (savedConfig) {
        try {
            state.ownerConfig = JSON.parse(savedConfig);
        } catch (e) {
            state.ownerConfig = { ...DEFAULT_OWNER_CONFIG };
        }
    } else {
        state.ownerConfig = { ...DEFAULT_OWNER_CONFIG };
        localStorage.setItem('garuda_rent_config', JSON.stringify(state.ownerConfig));
    }

    // Try fetching config from API
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
                    holidayNotes: c.holiday_notes
                };
                localStorage.setItem('garuda_rent_config', JSON.stringify(state.ownerConfig));
            }
        }
    } catch (err) {
        // Silent fallback
    }

    // Reviews setup
    await initReviewsStorage();

    renderOwnerInfo();
    renderCarsCatalog();
    renderReviews();
}

// Inisialisasi Data Reviews
async function initReviewsStorage() {
    const savedReviews = localStorage.getItem('garuda_rent_reviews');
    if (savedReviews) {
        try {
            state.reviews = JSON.parse(savedReviews);
        } catch (e) {
            state.reviews = [...DEFAULT_REVIEWS];
        }
    } else {
        state.reviews = [...DEFAULT_REVIEWS];
        localStorage.setItem('garuda_rent_reviews', JSON.stringify(state.reviews));
    }

    // Try fetching approved reviews from backend API
    try {
        const res = await fetch('/api/reviews?status=approved');
        if (res.ok) {
            const result = await res.json();
            if (result.data && result.data.length > 0) {
                state.reviews = result.data;
                localStorage.setItem('garuda_rent_reviews', JSON.stringify(state.reviews));
            }
        }
    } catch (err) {
        // LocalStorage fallback
    }
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
        el.textContent = cfg.email || 'kontak@garudarentcar.com';
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

    // Holiday Alert Banner
    const holidayBanner = document.getElementById('holidayAlertBanner');
    if (holidayBanner) {
        if (cfg.isHolidayPricingActive) {
            holidayBanner.classList.remove('hidden');
            const txt = document.getElementById('holidayBannerText');
            if (txt) {
                txt.textContent = `📢 ${cfg.holidayNotes || 'Mode Tarif Musim Liburan / Peak Season Sedang Aktif'}. Harga sewa menyesuaikan tarif libur.`;
            }
        } else {
            holidayBanner.classList.add('hidden');
        }
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

    if (filtered.length === 0) {
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

    grid.innerHTML = filtered.map(car => {
        const isReady = car.status === 'ready';
        const activePrice = isHoliday ? car.priceHoliday : car.priceNormal;

        return `
            <div class="card-unit reveal-on-scroll">
                <div>
                    <!-- Foto & Status Tag -->
                    <div class="card-img-wrap">
                        <img 
                            src="${car.image}" 
                            alt="${car.brand} ${car.model}" 
                            loading="lazy"
                            onerror="this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'"
                        />

                        <!-- Status Pill -->
                        <div style="position: absolute; top: 0.75rem; right: 0.75rem;">
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

                        <!-- Kategori Badge -->
                        <div style="position: absolute; top: 0.75rem; left: 0.75rem;">
                            <span class="badge-tag">
                                ${car.category}
                            </span>
                        </div>

                        ${isHoliday ? `
                            <div style="position: absolute; bottom: 0.5rem; left: 0.5rem; background: var(--clr-rose); color: white; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: var(--radius-sm);">
                                Tarif Libur
                            </div>
                        ` : ''}
                    </div>

                    <!-- Informasi Unit Mobil -->
                    <div style="padding: 1.25rem;">
                        <div style="font-size: 0.75rem; color: var(--clr-text-muted); font-weight: 600; margin-bottom: 0.25rem;">
                            ${car.brand} • ${car.year}
                        </div>
                        <h3 style="font-size: 1.125rem; font-weight: 800; color: var(--clr-text-main); margin-bottom: 0.5rem;">
                            ${car.model}
                        </h3>

                        <!-- Spesifikasi Ringkas -->
                        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--clr-text-muted); margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--clr-border);">
                            <span>${car.seats} Kursi</span>
                            <span>•</span>
                            <span>${car.transmission}</span>
                            <span>•</span>
                            <span>${car.fuel}</span>
                        </div>

                        ${car.description && car.description !== 'null' ? `
                            <p class="line-clamp-2" style="font-size: 0.8125rem; color: var(--clr-text-muted); line-height: 1.5; margin-bottom: 0.5rem;">
                                ${car.description}
                            </p>
                        ` : ''}
                    </div>
                </div>

                <!-- Footer Kartu: Harga & Tombol Aksi -->
                <div style="padding: 0 1.25rem 1.25rem 1.25rem;">
                    <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 0.75rem;">
                        <div>
                            <div style="font-size: 0.7rem; color: var(--clr-text-subtle); font-weight: 600;">Tarif Sewa:</div>
                            <div style="font-size: 1.25rem; font-weight: 800; color: var(--clr-text-main);">
                                ${formatRupiah(activePrice)}<span style="font-size: 0.75rem; font-weight: 400; color: var(--clr-text-muted);"> / hari</span>
                            </div>
                        </div>
                        ${!isHoliday ? `
                            <div style="font-size: 0.7rem; color: var(--clr-text-subtle); text-align: right;">
                                Libur: <span style="font-weight: 600; color: var(--clr-text-muted);">${formatRupiah(car.priceHoliday)}</span>
                            </div>
                        ` : `
                            <div style="font-size: 0.7rem; color: var(--clr-text-subtle); text-align: right;">
                                Normal: <span style="text-decoration: line-through;">${formatRupiah(car.priceNormal)}</span>
                            </div>
                        `}
                    </div>

                    <button 
                        onclick="openBookingModal('${car.id}')"
                        class="btn ${isReady ? 'btn-primary' : 'btn-outline'}" 
                        style="width: 100%;">
                        <span>${isReady ? 'Pilih & Pesan Unit' : 'Cek Detail / Booking Jadwal'}</span>
                        <svg style="width:0.875rem;height:0.875rem;display:inline-block;vertical-align:-1px;margin-left:0.25rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    initScrollReveal();
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
            return firstCard.offsetWidth + 24; // 24px gap
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

    // Loop check saat user drag atau scroll manual
    container.onscroll = () => {
        const halfWidth = container.scrollWidth / 2;
        if (halfWidth > 0) {
            if (container.scrollLeft >= halfWidth) {
                container.scrollLeft -= halfWidth;
            } else if (container.scrollLeft <= 0) {
                container.scrollLeft += halfWidth;
            }
        }
    };
}

// Render Review & Testimoni Pelanggan (1 Baris Auto-Scroll ke Kanan)
function renderReviews() {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;

    // Filter only approved reviews for public site
    const approved = state.reviews.filter(r => r.status === 'approved' || !r.status);

    if (approved.length === 0) {
        container.innerHTML = `
            <div style="flex: 1 1 100%; padding: 3rem 1rem; text-align: center; background: white; border-radius: var(--radius-xl); border: 1px solid var(--clr-border);">
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: center;">
                    <svg style="width:2.25rem;height:2.25rem;fill:#eab308;stroke:#eab308" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <h4 style="font-size: 1rem; font-weight: 700; color: var(--clr-text-main);">Belum ada ulasan publik</h4>
                <p style="font-size: 0.8125rem; color: var(--clr-text-muted); margin-bottom: 1rem;">Jadilah pelanggan pertama yang memberikan ulasan untuk layanan kami!</p>
                <button onclick="openReviewModal()" class="btn btn-primary btn-sm">
                    <svg style="width:0.875rem;height:0.875rem;display:inline-block;vertical-align:-1px;margin-right:0.25rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    Tulis Ulasan Pertama
                </button>
            </div>
        `;
        return;
    }

    // Multiply reviews so track can smoothly and endlessly loop
    let displayList = [...approved];
    while (displayList.length < 6) {
        displayList = [...displayList, ...approved];
    }
    // Duplicate once more so halfWidth is exactly one full cycle
    displayList = [...displayList, ...displayList];

    container.innerHTML = displayList.map(rev => {
        const rating = parseInt(rev.rating || 5);
        const starsHtml = Array.from({ length: 5 }, (_, i) => 
            `<svg style="width:1rem;height:1rem;fill:${i < rating ? '#22c55e' : '#cbd5e1'};stroke:${i < rating ? '#22c55e' : '#cbd5e1'}" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
        ).join('');

        const avatarSrc = rev.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name)}&background=22c55e&color=fff&bold=true`;

        return `
            <div class="review-card-item">
                <div>
                    <!-- Green Quote Icon -->
                    <div style="color: #22c55e; font-size: 2.25rem; line-height: 1; font-family: Georgia, serif; font-weight: bold; margin-bottom: 0.75rem;">
                        “
                    </div>

                    <!-- Review Text -->
                    <p style="font-size: 0.9375rem; color: var(--clr-text-muted); line-height: 1.6; margin-bottom: 1.5rem; font-style: normal;">
                        ${rev.comment}
                    </p>
                </div>

                <!-- Footer Card: Author Info & Rating -->
                <div style="padding-top: 1rem; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <img 
                            src="${avatarSrc}" 
                            alt="${rev.name}"
                            onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name)}&background=22c55e&color=fff'"
                            style="width: 2.75rem; height: 2.75rem; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0;"
                        />
                        <div>
                            <div style="font-size: 0.9rem; font-weight: 800; color: var(--clr-text-main);">
                                ${rev.name}
                            </div>
                            ${rev.car_name ? `
                                <div style="font-size: 0.75rem; color: var(--clr-primary); font-weight: 600; display: flex; align-items: center; gap: 0.25rem; margin-top: 0.1rem;">
                                    <svg style="width:0.75rem;height:0.75rem;fill:none;stroke:currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                                    ${rev.car_name}
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Rating Stars -->
                    <div style="display: flex; gap: 0.15rem; align-items: center;">
                        ${starsHtml}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Start interval scroll per 5 detik untuk ulasan pelanggan
    initIntervalReviewScroller('reviewsContainer', {
        intervalMs: 5000,
        prevBtnId: 'reviewsPrevBtn',
        nextBtnId: 'reviewsNextBtn'
    });
}

// Buka Modal Tambah Review Pelanggan
function openReviewModal() {
    state.selectedReviewRating = 5;
    state.reviewAvatarBase64 = null;
    
    const form = document.getElementById('reviewForm');
    if (form) form.reset();
    
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
            btn.style.color = '#22c55e';
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

    if (file.size > 3 * 1024 * 1024) {
        alert("Ukuran foto terlalu besar. Maksimal 3MB.");
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        state.reviewAvatarBase64 = event.target.result;
        const previewImg = document.getElementById('reviewAvatarPreview');
        if (previewImg) {
            previewImg.src = event.target.result;
            previewImg.classList.remove('hidden');
        }
    };
    reader.readAsDataURL(file);
}

// Handle Submit Review Pelanggan
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

    const newReviewData = {
        name: name,
        rating: rating,
        car_name: carName,
        comment: comment,
        avatar: avatar,
        status: 'pending' // pending verification by Admin
    };

    // Try posting to API
    let savedSuccessfully = false;
    try {
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newReviewData)
        });

        if (res.ok) {
            savedSuccessfully = true;
        }
    } catch (err) {
        // Fallback to local storage
    }

    // Always keep LocalStorage in sync as well
    const newLocalReview = {
        id: Date.now(),
        ...newReviewData,
        created_at: new Date().toISOString()
    };
    state.reviews.unshift(newLocalReview);
    localStorage.setItem('garuda_rent_reviews', JSON.stringify(state.reviews));

    closeReviewModal();

    // Show nice alert modal / message
    alert("🎉 Terima kasih! Ulasan Anda telah berhasil dikirim.\n\nReview Anda akan ditampilkan di halaman utama website setelah diverifikasi dan disetujui oleh Admin kami.");
}

// Ambil Jadwal Booking Terkonfirmasi untuk Unit Mobil Ini
async function fetchConfirmedBookings(carId) {
    state.confirmedBookings = [];
    if (!carId) return [];

    let bookings = [];

    // 1. Coba ambil dari Backend API Laravel
    try {
        const res = await fetch(`/api/bookings?car_id=${carId}&status=confirmed`);
        if (res.ok) {
            const json = await res.json();
            if (json.data && Array.isArray(json.data)) {
                bookings = json.data;
            }
        }
    } catch (e) {
        // Fallback jika API sedang tidak terjangkau
    }

    // 2. Gabungkan dengan LocalStorage (sinkronisasi offline & realtime)
    try {
        const saved = localStorage.getItem('garuda_rent_bookings');
        if (saved) {
            const localList = JSON.parse(saved);
            localList.forEach(lb => {
                if ((lb.car_id == carId || lb.carId == carId) && lb.status === 'confirmed') {
                    const exists = bookings.some(b => b.id == lb.id || (b.booking_code && b.booking_code === lb.booking_code));
                    if (!exists) {
                        bookings.push(lb);
                    }
                }
            });
        }
    } catch (e) {}

    state.confirmedBookings = bookings;
    return bookings;
}

// Render Notifikasi Jadwal yang Sudah Dikonfirmasi pada Modal
function renderConfirmedDatesNotice() {
    const noticeEl = document.getElementById('confirmedDatesNotice');
    const listEl = document.getElementById('confirmedDatesList');
    if (!noticeEl || !listEl) return;

    if (state.confirmedBookings && state.confirmedBookings.length > 0) {
        listEl.innerHTML = state.confirmedBookings.map(b => {
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

// Fallback jadwal statis per model mobil (agar langsung terdata seperti di referensi)
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

    const schedules = [];
    // 1. Ambil dari database / state.confirmedBookings
    if (state.confirmedBookings && state.confirmedBookings.length > 0) {
        state.confirmedBookings.forEach(b => {
            if (b.start_date && b.end_date) {
                const s = b.start_date.split('T')[0];
                const e = b.end_date.split('T')[0];
                schedules.push({ start: s, end: e });
            }
        });
    }

    // 2. Tambahkan default schedules jika cocok dengan nama model mobil
    Object.keys(defaultBookedSchedules).forEach(key => {
        if (car.model && car.model.toLowerCase().includes(key.toLowerCase())) {
            defaultBookedSchedules[key].forEach(ds => {
                if (!schedules.some(s => s.start === ds.start && s.end === ds.end)) {
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
    if (type === 'start') {
        calMonthStart += direction;
        if (calMonthStart > 11) { calMonthStart = 0; calYearStart++; }
        else if (calMonthStart < 0) { calMonthStart = 11; calYearStart--; }
        renderBookingCalendar('start');
    } else {
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

        if (isBooked) {
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
    if (startVal && endVal && endVal < startVal) {
        if (type === 'start') {
            document.getElementById('bookEndDate').value = startVal;
        }
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
    resetKtpPreview();

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

    // Inisialisasi Kalender ke Bulan Oktober 2026 (atau bulan saat ini)
    calMonthStart = 9; // Oktober
    calYearStart = 2026;
    calMonthEnd = 9;
    calYearEnd = 2026;

    // Set Default Date di luar tanggal bentrok (contoh: 22 s/d 24 Oktober 2026)
    const startDateInput = document.getElementById('bookStartDate');
    const endDateInput = document.getElementById('bookEndDate');
    
    if (startDateInput) startDateInput.value = '2026-10-22';
    if (endDateInput) endDateInput.value = '2026-10-24';

    // Ambil jadwal terkonfirmasi dari database
    await fetchConfirmedBookings(car.id);
    renderConfirmedDatesNotice();

    // Render kalender untuk unit mobil yang dipilih
    renderBookingCalendar('start');
    renderBookingCalendar('end');
    calculateBookingPrice();
    checkDateConflict();

    if (modal) modal.classList.remove('hidden');
}

// Tutup Modal Pemesanan
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.add('hidden');
    closeBookingCalendars();
}

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
        const driverRate = isHoliday ? (car.driverRateHoliday || 150000) : (car.driverRateNormal || 150000);
        driverTotal = driverRate * days;
        driverRateText = `${formatRupiah(driverRate)}/hari`;
    }

    const grandTotal = carTotal + driverTotal;

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
    const startTime = document.getElementById('bookStartTime')?.value || '09:00';
    const endTime = document.getElementById('bookEndTime')?.value || '09:00';
    const pickupLoc = document.getElementById('bookPickupLocation')?.value.trim() || '';
    const driverOpt = document.querySelector('input[name="driverOption"]:checked')?.value || 'without_driver';
    const notes = (document.getElementById('bookNotes') || document.getElementById('bookCustNotes'))?.value.trim() || '';

    if (!name || !phone || !startDate || !endDate) {
        alert('Harap lengkapi semua kolom wajib (Nama, WhatsApp, Tanggal Pemakaian).');
        return;
    }

    // Pastikan foto KTP terunggah untuk verifikasi
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
        const driverRate = isHoliday ? (car.driverRateHoliday || 150000) : (car.driverRateNormal || 150000);
        driverTotal = driverRate * diffDays;
        driverLabel = `Dengan Supir Pengalaman (${formatRupiah(driverRate)}/hari)`;
    }

    const grandTotal = carTotal + driverTotal;
    const generatedCode = 'RCM-' + Math.random().toString(36).substring(2, 8).toUpperCase();

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
        status: 'pending', // Status awal: Menunggu Konfirmasi
        notes: notes,
        ktp_image: state.ktpImageBase64 || null
    };

    // 1. Simpan ke LocalStorage agar langsung tampil di Dashboard Admin Data Booking
    try {
        let existingBookings = [];
        const saved = localStorage.getItem('garuda_rent_bookings');
        if (saved) {
            existingBookings = JSON.parse(saved);
        }
        existingBookings.unshift(newBookingObj);
        localStorage.setItem('garuda_rent_bookings', JSON.stringify(existingBookings));
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
                status: 'pending',
                notes: notes,
                ktp_image: state.ktpImageBase64 || null
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
                    const saved = localStorage.getItem('garuda_rent_bookings');
                    if (saved) {
                        let cur = JSON.parse(saved);
                        if (cur.length > 0) cur[0] = newBookingObj;
                        localStorage.setItem('garuda_rent_bookings', JSON.stringify(cur));
                    }
                } catch (e) {}
            }
        }
    } catch (apiErr) {
        console.warn('Simpan ke backend offline/fallback:', apiErr);
    }

    // 3. Format Pesan WhatsApp Super Rapi & Menarik
    const cfg = state.ownerConfig;
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

📅 *JADWAL & LOKASI SEWA:*
• Mulai: ${startDate} (Pukul ${startTime} WITA)
• Selesai: ${endDate} (Pukul ${endTime} WITA) — (${diffDays} Hari)
${pickupLoc ? `• Lokasi Penjemputan: ${pickupLoc}\n` : ''}
💰 *ESTIMASI TOTAL BIAYA:*
• Tarif Sewa Unit (${diffDays} Hari): ${formatRupiah(carTotal)}
${isWithDriver ? `• Biaya Supir (${diffDays} Hari): ${formatRupiah(driverTotal)}\n` : ''}• *GRAND TOTAL BIAYA: ${formatRupiah(grandTotal)}*
${isHoliday ? `_(Catatan: Menggunakan Tarif Peak Season / Liburan)_\n` : ''}
📝 *CATATAN TAMBAHAN:*
${notes ? notes : '-'}

Halo Admin ${cfg.businessName || 'Rent Car Makassar'}, mohon proses pesanan rental mobil saya di atas. KTP dan dokumen pendukung sudah siap dikonfirmasi. Terima kasih!
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

// Scroll Effects (Header Glass & Back to Top)
function initScrollEffects() {
    const header = document.querySelector('.header-glass');
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY || window.pageYOffset;

        if (header) {
            if (scrollY > 30) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }

        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.remove('hidden');
            } else {
                backToTopBtn.classList.add('hidden');
            }
        }
    }, { passive: true });
}

// Scroll Reveal Effect via IntersectionObserver
function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
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
            threshold: 0.08,
            rootMargin: '0px 0px -20px 0px'
        });

        targets.forEach(target => observer.observe(target));
    } else {
        targets.forEach(target => target.classList.add('is-revealed'));
    }
}

// Inisialisasi Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initStorage();
    initScrollEffects();
    initScrollReveal();

    const searchInput = document.getElementById('carSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderCarsCatalog();
        });
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

    const reviewAvatarInput = document.getElementById('reviewAvatarInput');
    if (reviewAvatarInput) {
        reviewAvatarInput.addEventListener('change', handleReviewAvatarUpload);
    }
});

// Alias for form submission compatibility and global handlers
window.submitBookingWhatsApp = handleBookingSubmit;
window.handleBookingSubmit = handleBookingSubmit;
window.resetKtpPreview = resetKtpPreview;
window.checkDateConflict = checkDateConflict;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.initScrollReveal = initScrollReveal;

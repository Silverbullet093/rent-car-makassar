import React from 'react';
import { formatRupiah } from '../utils/helpers';

export default function CarCard({ car, isHolidayPricingActive, onBookNow, isExtraCard = false, extraIndex = 0 }) {
    const isReady = car.status === 'ready';
    const isDriverOnly = car.rentalOption === 'driver_only' || car.rental_option === 'driver_only';
    const activePrice = isHolidayPricingActive
        ? (car.priceHoliday || car.price_holiday)
        : (car.priceNormal || car.price_normal);

    const animationStyle = isExtraCard ? { animationDelay: `${extraIndex * 0.08}s` } : {};

    return (
        <div className={`card-unit reveal-on-scroll ${isExtraCard ? 'card-animate-in' : ''}`} style={animationStyle}>
            <div>
                {/* Foto & Status Tag */}
                <div className="card-img-wrap">
                    <img
                        src={car.image || '/Land Cruser (1).png'}
                        alt={`${car.brand} ${car.model}`}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                        }}
                    />

                    {/* Status Pill */}
                    <div className="card-status-wrap" style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                        {isReady ? (
                            <span className="status-pill-ready">
                                <span className="dot-indicator" style={{ backgroundColor: 'var(--clr-emerald, #10b981)' }}></span>
                                Ready
                            </span>
                        ) : (
                            <span className="status-pill-used">
                                <span className="dot-indicator" style={{ backgroundColor: '#f59e0b' }}></span>
                                Sedang Digunakan
                            </span>
                        )}
                    </div>

                    {/* Kategori Badge & Ketentuan Driver */}
                    <div className="card-cat-wrap" style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-start' }}>
                        <span className="badge-tag">
                            {car.category}
                        </span>
                        {isDriverOnly && (
                            <span style={{ background: 'rgba(220, 38, 38, 0.9)', backdropFilter: 'blur(4px)', color: '#ffffff', fontSize: '0.625rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', boxShadow: '0 2px 6px rgba(220, 38, 38, 0.35)' }}>
                                <i className="fa-solid fa-user-tie"></i> +Supir Wajib
                            </span>
                        )}
                    </div>

                    {isHolidayPricingActive && (
                        <div className="card-holiday-tag" style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'var(--clr-rose, #e11d48)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm, 4px)' }}>
                            Tarif Libur
                        </div>
                    )}
                </div>

                {/* Informasi Unit Mobil */}
                <div className="card-body-info" style={{ padding: '1.25rem' }}>
                    <div className="card-brand-meta" style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted, #64748b)', fontWeight: 600, marginBottom: '0.25rem' }}>
                        {car.brand} • {car.year}
                    </div>
                    <h3 className="card-car-title" style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--clr-text-main, #0f172a)', marginBottom: '0.5rem' }}>
                        {car.model}
                    </h3>

                    {/* Spesifikasi Ringkas Interaktif */}
                    <div className="card-specs-row">
                        <span className="spec-pill" title="Kapasitas Penumpang">
                            <i className="fa-solid fa-users"></i> {car.seats} Kursi
                        </span>
                        <span className="spec-pill" title="Tipe Transmisi">
                            <i className="fa-solid fa-gauge-high"></i> {car.transmission}
                        </span>
                        <span className="spec-pill" title="Bahan Bakar">
                            <i className="fa-solid fa-gas-pump"></i> {car.fuel}
                        </span>
                    </div>

                    {car.description && car.description !== 'null' && (
                        <p className="line-clamp-2 card-car-desc" style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted, #64748b)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                            {car.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Footer Kartu: Harga & Tombol Aksi */}
            <div className="card-footer-wrap" style={{ padding: '0 1.25rem 1.25rem 1.25rem' }}>
                <div className="card-price-row" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div>
                        <div className="card-price-label" style={{ fontSize: '0.7rem', color: 'var(--clr-text-subtle, #94a3b8)', fontWeight: 600 }}>Tarif Sewa:</div>
                        <div className="card-price-value" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--clr-text-main, #0f172a)' }}>
                            {formatRupiah(activePrice)}<span className="card-price-unit" style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--clr-text-muted, #64748b)' }}> / hari</span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => onBookNow(car)}
                    className={`btn ${isReady ? 'btn-primary' : 'btn-outline'} card-book-btn`}
                    style={{ width: '100%' }}>
                    <span>{isReady ? 'Pilih & Pesan Unit' : 'Cek Detail / Booking Jadwal'}</span>
                    <svg style={{ width: '0.875rem', height: '0.875rem', display: 'inline-block', verticalAlign: '-1px', marginLeft: '0.25rem' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

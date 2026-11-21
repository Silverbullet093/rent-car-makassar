import React, { useState, useMemo } from 'react';
import CarCard from './CarCard';

const CATEGORY_TABS = [
    { id: 'all', label: 'Semua Tipe', icon: 'fa-layer-group' },
    { id: 'MPV', label: 'MPV Keluarga', icon: 'fa-van-shuttle' },
    { id: 'SUV', label: 'SUV Gagah', icon: 'fa-mountain' },
    { id: 'City Car', label: 'City Car Lincah', icon: 'fa-bolt' },
    { id: 'Mewah', label: 'VIP / Mewah', icon: 'fa-crown' }
];

const INITIAL_ROW_LIMIT = 6; // 2 baris pada tampilan 3-kolom desktop (6 mobil)

export default function CarCatalog({ cars = [], isHolidayPricingActive, onBookNow }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const filteredCars = useMemo(() => {
        return cars.filter(car => {
            const matchesCat = selectedCategory === 'all' ||
                (car.category && car.category.toLowerCase().includes(selectedCategory.toLowerCase()));
            const term = searchQuery.trim().toLowerCase();
            const matchesSearch = !term ||
                (car.brand && car.brand.toLowerCase().includes(term)) ||
                (car.model && car.model.toLowerCase().includes(term)) ||
                (car.category && car.category.toLowerCase().includes(term)) ||
                (car.carCode && car.carCode.toLowerCase().includes(term));
            return matchesCat && matchesSearch;
        });
    }, [cars, selectedCategory, searchQuery]);

    const handleCategoryClick = (catId) => {
        setSelectedCategory(catId);
        setIsExpanded(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setIsExpanded(false);
    };

    const hasMoreCars = filteredCars.length > INITIAL_ROW_LIMIT;
    const displayedCars = isExpanded ? filteredCars : filteredCars.slice(0, INITIAL_ROW_LIMIT);

    const toggleExpand = () => {
        if (isExpanded) {
            setIsExpanded(false);
            const catalogEl = document.getElementById('katalog');
            if (catalogEl) {
                catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            setIsExpanded(true);
        }
    };

    return (
        <section id="katalog" style={{ padding: '5rem 0', background: 'var(--clr-bg, #f8fafc)' }}>
            <div className="container">
                {/* Section Header */}
                <div style={{ textAlign: 'center', maxWidth: '36rem', margin: '0 auto 2.5rem auto' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clr-primary, #dc2626)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Katalog Armada
                    </span>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--clr-text-main, #0f172a)', marginTop: '0.25rem' }}>
                        Pilihan Mobil Terbaik Perjalanan Anda
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted, #64748b)', marginTop: '0.5rem' }}>
                        Seluruh unit terawat dengan inspeksi berkala. Pilih unit dan isi formulir pemesanan langsung via WhatsApp.
                    </p>
                </div>

                {/* Modern Luxury Filter & Search Controls (2 Baris: Atas Kategori, Bawah Pencarian) */}
                <div className="catalog-controls-container">
                    {/* Baris 1 (Atas): Kategori Filter & Unit Counter */}
                    <div className="catalog-filter-top">
                        <div className="catalog-category-scroller">
                            {CATEGORY_TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleCategoryClick(tab.id)}
                                    className={`cat-filter-btn ${selectedCategory === tab.id ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    <i className={`fa-solid ${tab.icon}`}></i>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="catalog-counter-badge">
                            <span className="counter-dot"></span>
                            <span><strong>{filteredCars.length}</strong> Pilihan Unit</span>
                        </div>
                    </div>

                    {/* Baris 2 (Bawah): Pencarian Unit */}
                    <div className="catalog-search-row">
                        <div className="catalog-search-capsule">
                            <i className="fa-solid fa-magnifying-glass search-icon"></i>
                            <input
                                type="text"
                                id="carSearchInput"
                                placeholder="Cari unit mobil (contoh: Innova Reborn, Fortuner, Alphard, Brio...)"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="catalog-search-input"
                                autoComplete="off"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => { setSearchQuery(''); setIsExpanded(false); }}
                                    className="clear-search-btn"
                                    style={{ display: 'flex' }}
                                    title="Hapus pencarian"
                                >
                                    <i className="fa-solid fa-circle-xmark"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cars Grid */}
                {displayedCars.length > 0 ? (
                    <div id="carsGrid" className="grid md:grid-cols-3 gap-6">
                        {displayedCars.map((car, idx) => (
                            <CarCard
                                key={car.id}
                                car={car}
                                isHolidayPricingActive={isHolidayPricingActive}
                                onBookNow={onBookNow}
                                isExtraCard={isExpanded && idx >= INITIAL_ROW_LIMIT}
                                extraIndex={idx - INITIAL_ROW_LIMIT}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div style={{ gridColumn: '1 / -1', padding: '4rem 1rem', textAlign: 'center', background: 'white', borderRadius: 'var(--radius-lg, 0.75rem)', border: '1px solid var(--clr-border, #e2e8f0)' }}>
                        <div style={{ width: '3rem', height: '3rem', margin: '0 auto 0.75rem auto', color: 'var(--clr-text-subtle, #94a3b8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg style={{ width: '2.25rem', height: '2.25rem' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--clr-text-main, #0f172a)', marginBottom: '0.25rem' }}>
                            Unit tidak ditemukan
                        </h3>
                        <p style={{ color: 'var(--clr-text-muted, #64748b)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
                            Coba cari dengan kata kunci lain atau pilih kategori Semua Tipe.
                        </p>
                        <button
                            type="button"
                            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setIsExpanded(false); }}
                            className="btn btn-primary btn-sm"
                        >
                            Lihat Semua Unit
                        </button>
                    </div>
                )}

                {/* Tombol Swis Up ke Bawah (Expand / Collapse) */}
                {hasMoreCars && (
                    <div className="catalog-toggle-wrapper" style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                        <button
                            type="button"
                            onClick={toggleExpand}
                            className="btn btn-expand-catalog"
                            id="btnToggleExpandCars"
                            aria-expanded={isExpanded}
                        >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>{isExpanded ? 'Tampilkan Lebih Sedikit' : `Lihat Semua Armada (${filteredCars.length} Unit)`}</span>
                                <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', marginLeft: '0.35rem' }}></i>
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

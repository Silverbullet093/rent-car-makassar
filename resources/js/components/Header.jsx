import React, { useState, useEffect } from 'react';

export default function Header({ config, onSelectUnitClick }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled((window.scrollY || window.pageYOffset) > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMobileMenuOpen(prev => !prev);
    const closeMenu = () => setIsMobileMenuOpen(false);

    const isHoliday = Boolean(config?.isHolidayPricingActive);
    const waNumber = config?.whatsappNumber || '6281234567890';
    const waUrl = `https://wa.me/${waNumber}?text=Halo%20RPM%20Rent%20Car,%20saya%20ingin%20konsultasi%20sewa%20mobil.`;

    return (
        <>
            {/* ANNOUNCEMENT BANNER: TARIF LIBUR / PEAK SEASON (JIKA AKTIF) */}
            {isHoliday && (
                <div id="holidayAlertBanner" style={{ backgroundColor: 'var(--clr-primary)', color: 'white', fontSize: '0.75rem', padding: '0.5rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                    <span id="holidayBannerText">{config?.holidayNotes || 'Mode Tarif Hari Libur / Peak Season Sedang Aktif'}</span>
                </div>
            )}

            {/* NAVBAR GLASSMORPHISM */}
            <header className={`header-glass ${isScrolled ? 'header-scrolled' : ''}`}>
                <div className="container-fluid header-inner">
                    
                    {/* BRAND LOGO */}
                    <a href="#home" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
                        <div className="navbar-logo-circle" style={{ width: '2.75rem', height: '2.75rem', background: 'var(--clr-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)', overflow: 'hidden', flexShrink: 0 }}>
                            <img src="/logo_rpm_red.png" alt="RPM Rent Car" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.35)' }} />
                        </div>
                        <div style={{ textDecoration: 'none' }}>
                            <span className="brand-title" data-custom-brand="rpm" style={{ textDecoration: 'none' }}>
                                RPM <span style={{ color: 'var(--clr-primary)', textDecoration: 'none' }}>Rent Car</span>
                            </span>
                            <span className="brand-subtitle" style={{ textDecoration: 'none' }}>
                                MAKASSAR
                            </span>
                        </div>
                    </a>

                    {/* DESKTOP NAVIGATION */}
                    <nav className="nav-desktop flex items-center gap-1">
                        <a href="#home" className="nav-link" style={{ textDecoration: 'none' }}>Beranda</a>
                        <a href="#katalog" className="nav-link" style={{ textDecoration: 'none' }}>Armada Mobil</a>
                        <a href="#jangkauan" className="nav-link" style={{ textDecoration: 'none' }}>Jangkauan</a>
                        <a href="#layanan" className="nav-link" style={{ textDecoration: 'none' }}>Layanan</a>
                        <a href="#reviews" className="nav-link" style={{ textDecoration: 'none' }}>Ulasan</a>
                        <a href="#kontak" className="nav-link" style={{ textDecoration: 'none' }}>Kontak</a>
                    </nav>

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center gap-2">
                        <a 
                            href="#katalog" 
                            onClick={onSelectUnitClick} 
                            className="btn btn-primary btn-sm nav-cta-desktop" 
                            style={{ borderRadius: '9999px', padding: '0.5rem 1.35rem', fontWeight: 700 }}
                        >
                            <span>Pilih Unit</span>
                            <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.75rem', marginLeft: '0.35rem' }}></i>
                        </a>
                        
                        {/* Hamburger Button (Mobile & Tablet) */}
                        <button 
                            id="mobileMenuToggle" 
                            className="mobile-menu-btn" 
                            aria-label="Buka Menu Navigasi" 
                            onClick={toggleMenu}
                        >
                            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`} id="menuIconBars"></i>
                        </button>
                    </div>
                </div>
            </header>

            {/* MOBILE NAVIGATION DRAWER OVERLAY */}
            <div 
                id="mobileDrawerBackdrop" 
                className={`mobile-drawer-backdrop ${isMobileMenuOpen ? '' : 'hidden'}`} 
                onClick={closeMenu}
            ></div>
            <div 
                id="mobileDrawer" 
                className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}
            >
                <div className="mobile-drawer-header">
                    <div className="flex items-center gap-2.5">
                        <div style={{ width: '2.35rem', height: '2.35rem', background: 'var(--clr-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 10px rgba(220, 38, 38, 0.25)' }}>
                            <img src="/logo_rpm_red.png" alt="RPM" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.35)' }} />
                        </div>
                        <div>
                            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', display: 'block', lineHeight: 1.1 }}>RPM <span style={{ color: 'var(--clr-primary)' }}>Rent Car</span></span>
                            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Makassar</span>
                        </div>
                    </div>
                    <button onClick={closeMenu} className="btn-close-drawer" aria-label="Tutup Menu">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <nav className="mobile-drawer-nav">
                    <a href="#home" className="mobile-nav-item" onClick={closeMenu}>
                        <i className="fa-solid fa-house"></i>
                        <span>Beranda</span>
                    </a>
                    <a href="#katalog" className="mobile-nav-item" onClick={closeMenu}>
                        <i className="fa-solid fa-car-side"></i>
                        <span>Armada Mobil</span>
                    </a>
                    <a href="#jangkauan" className="mobile-nav-item" onClick={closeMenu}>
                        <i className="fa-solid fa-map-location-dot"></i>
                        <span>Jangkauan Wilayah</span>
                    </a>
                    <a href="#layanan" className="mobile-nav-item" onClick={closeMenu}>
                        <i className="fa-solid fa-briefcase"></i>
                        <span>Layanan Kami</span>
                    </a>
                    <a href="#reviews" className="mobile-nav-item" onClick={closeMenu}>
                        <i className="fa-solid fa-comments"></i>
                        <span>Ulasan Pelanggan</span>
                    </a>
                    <a href="#kontak" className="mobile-nav-item" onClick={closeMenu}>
                        <i className="fa-solid fa-phone"></i>
                        <span>Kontak &amp; Lokasi</span>
                    </a>
                </nav>

                <div className="mobile-drawer-footer">
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-emerald btn-lg w-full flex items-center justify-center gap-2" style={{ borderRadius: '0.85rem', fontWeight: 800, fontSize: '0.95rem' }}>
                        <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.25rem' }}></i>
                        <span>Konsultasi Cepat WA</span>
                    </a>
                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.72rem', color: '#94a3b8' }}>
                        Buka 24 Jam Setiap Hari • Makassar
                    </div>
                </div>
            </div>
        </>
    );
}

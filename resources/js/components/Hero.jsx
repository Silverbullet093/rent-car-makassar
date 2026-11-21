import React from 'react';

export default function Hero({ config }) {
    const waNumber = config?.whatsappNumber || '6281234567890';
    const waUrl = `https://wa.me/${waNumber}?text=Halo%20RPM%20Rent%20Car,%20saya%20ingin%20berkonsultasi%20mengenai%20sewa%20mobil.`;

    return (
        <section id="home" className="hero-fullscreen-laptop" style={{ position: 'relative', padding: '6.75rem 0 3.5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--clr-border)', overflow: 'hidden' }}>
            
            {/* Background Car Graphic (White Alphard) with Gradient Fade */}
            <div className="hero-alphard-bg">
                <div className="hero-alphard-overlay"></div>
            </div>

            <div className="container-fluid" style={{ position: 'relative', zIndex: 2 }}>
                <div className="grid md:grid-cols-2 gap-8 items-center hero-main-grid" style={{ minHeight: '380px' }}>
                    
                    {/* Left Hero Text Content */}
                    <div className="reveal-on-scroll" style={{ maxWidth: '42rem' }}>
                        {/* Capsule Badge */}
                        <div className="hero-capsule-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1.25rem', borderRadius: '9999px', color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.25rem', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.06)' }}>
                            <i className="fa-solid fa-shield-halved"></i>
                            <span>RENTAL MOBIL RESMI MAKASSAR &amp; SULAWESI</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="hero-main-title" style={{ fontSize: 'clamp(2.85rem, 4.8vw, 4rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1.35rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Sewa Mobil Nyaman. <br />
                            <span style={{ color: 'var(--clr-primary)' }}>Di Mana Pun Perjalanan Anda.</span>
                        </h1>

                        {/* Description */}
                        <p className="brand-desc hero-description" style={{ fontSize: '1.2rem', color: '#475569', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '40rem', fontWeight: 400, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {config?.description || 'RPM Rent Car Makassar menyediakan armada prima dengan layanan supir berpengalaman & opsi lepas kunci untuk keperluan wisata, dinas bisnis, pernikahan, dan perjalanan keluarga Anda.'}
                        </p>

                        {/* Call to Action Buttons */}
                        <div className="flex items-center gap-3" style={{ marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                            <a href="#katalog" className="btn btn-primary btn-lg" style={{ borderRadius: '0.875rem', fontWeight: 700, padding: '0.95rem 1.85rem', fontSize: '1rem', boxShadow: '0 10px 20px -3px rgba(220, 38, 38, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                                <i className="fa-solid fa-car"></i>
                                <span>Eksplor Armada Mobil</span>
                            </a>
                            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg hero-wa-link" style={{ borderRadius: '0.875rem', fontWeight: 700, padding: '0.95rem 1.85rem', fontSize: '1rem', background: '#ffffff', border: '2px solid #e2e8f0', color: '#1e293b', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                                <i className="fa-brands fa-whatsapp" style={{ color: '#10b981', fontSize: '1.25rem' }}></i>
                                <span>Hubungi Admin WA</span>
                            </a>
                        </div>

                        {/* Trust Badges Row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            <span className="trust-badge-pill" style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0.45rem 0.95rem' }}>
                                <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i> Unit Bersih &amp; Steril
                            </span>
                            <span className="trust-badge-pill" style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0.45rem 0.95rem' }}>
                                <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i> Harga Transparan
                            </span>
                            <span className="trust-badge-pill" style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0.45rem 0.95rem' }}>
                                <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i> Driver Berpengalaman
                            </span>
                        </div>
                    </div>

                    {/* Right Hero Area with Studio Background */}
                    <div style={{ position: 'relative', minHeight: '300px' }}>
                    </div>

                </div>

                {/* HORIZONTAL QUICK SPEC METRIC BAR (5 CARDS) */}
                <div className="hero-metric-bar reveal-on-scroll">
                    <div className="metric-item">
                        <div className="metric-icon">
                            <i className="fa-solid fa-car"></i>
                        </div>
                        <div>
                            <div className="metric-title"><span className="counter-number">10</span>+ Unit</div>
                            <div className="metric-sub">Armada Prima</div>
                        </div>
                    </div>
                    <div className="metric-item">
                        <div className="metric-icon">
                            <i className="fa-solid fa-map-location-dot"></i>
                        </div>
                        <div>
                            <div className="metric-title">Makassar</div>
                            <div className="metric-sub">Sulawesi &amp; Nasional</div>
                        </div>
                    </div>
                    <div className="metric-item">
                        <div className="metric-icon">
                            <i className="fa-solid fa-key"></i>
                        </div>
                        <div>
                            <div className="metric-title">Lepas Kunci</div>
                            <div className="metric-sub">Bisa Setir Mandiri</div>
                        </div>
                    </div>
                    <div className="metric-item">
                        <div className="metric-icon">
                            <i className="fa-solid fa-user-tie"></i>
                        </div>
                        <div>
                            <div className="metric-title">Dengan Supir</div>
                            <div className="metric-sub">Driver Profesional</div>
                        </div>
                    </div>
                    <div className="metric-item">
                        <div className="metric-icon">
                            <i className="fa-brands fa-whatsapp"></i>
                        </div>
                        <div>
                            <div className="metric-title">Fast Order</div>
                            <div className="metric-sub">Konfirmasi 24 Jam</div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

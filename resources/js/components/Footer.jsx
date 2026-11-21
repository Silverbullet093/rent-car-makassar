import React, { useState, useEffect } from 'react';

export default function Footer({ config }) {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if ((window.scrollY || window.pageYOffset) > 400) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const waNumber = config?.whatsappNumber || '6281234567890';
    const waLink = `https://wa.me/${waNumber}?text=Halo%20RPM%20Rent%20Car%20Makassar,%20saya%20ingin%20bertanya%20mengenai%20rental%20mobil.`;
    const mapsLink = config?.mapsUrl || 'https://maps.google.com/?q=Jl.+Perintis+Kemerdekaan+No.+10,+Makassar,+Sulawesi+Selatan';
    const address = config?.address || 'Jl. Perintis Kemerdekaan No. 10, Makassar, Sulawesi Selatan';
    const phone = config?.phone || '0812-3456-7890';
    const email = config?.email || 'kontak@rentcarmakassar.com';

    return (
        <>
            {/* ==================================================== */}
            {/* FOOTER & KONTAK OWNER (HITAM & MERAH - SAMA SEPERTI MELAYANI) */}
            {/* ==================================================== */}
            <footer id="kontak" className="footer-dark-coverage">
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="grid md:grid-cols-12 gap-8" style={{ paddingBottom: '2.75rem', borderBottom: '1px solid #1e293b' }}>
                        
                        {/* Profil Perusahaan */}
                        <div className="md:col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="flex items-center gap-3">
                                <div style={{ width: '2.75rem', height: '2.75rem', background: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(220, 38, 38, 0.45)', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src="/logo_rpm_red.png" alt="RPM Rent Car" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.35)' }} />
                                </div>
                                <div>
                                    <span className="brand-title" data-custom-brand="rpm" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        RPM <span style={{ color: '#ef4444' }}>Rent Car</span>
                                    </span>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ef4444', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginTop: '2px' }}>
                                        MAKASSAR
                                    </span>
                                </div>
                            </div>
                            <p className="brand-tagline" style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: '26rem', margin: 0 }}>
                                {config?.tagline || 'Layanan Sewa Mobil Terpercaya di Makassar. Melayani lepas kunci dan dengan supir berpengalaman untuk kenyamanan perjalanan Anda.'}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8125rem' }}>
                                <div className="flex items-center gap-2.5">
                                    <i className="fa-solid fa-location-dot" style={{ color: '#ef4444', fontSize: '0.95rem', width: '1.1rem', textAlign: 'center' }}></i>
                                    <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="owner-gps-link" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s ease' }}>
                                        <span className="owner-address">{address}</span>
                                    </a>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <i className="fa-solid fa-clock" style={{ color: '#ef4444', fontSize: '0.95rem', width: '1.1rem', textAlign: 'center' }}></i>
                                    <span className="owner-hours" style={{ color: '#cbd5e1' }}>{config?.operatingHours || 'Buka 24 Jam Setiap Hari'}</span>
                                </div>
                                
                                {/* Tombol Buka Petunjuk Arah GPS (Google Maps) */}
                                <div style={{ paddingTop: '0.25rem' }}>
                                    <a 
                                        id="ownerGpsBtn" 
                                        href={mapsLink}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="owner-gps-link footer-gps-btn"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#221718', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.45rem 0.9rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s ease' }}
                                    >
                                        <i className="fa-solid fa-location-crosshairs" style={{ color: '#ef4444', fontSize: '0.85rem' }}></i>
                                        <span>Buka Lokasi GPS (Google Maps)</span>
                                        <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.65rem', opacity: 0.8 }}></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Kontak Owner */}
                        <div className="md:col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: '0.5rem', background: '#221718', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#ef4444', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', width: 'fit-content' }}>
                                <i className="fa-solid fa-headset"></i> KONTAK RESMI
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
                                <span>WhatsApp Admin:</span><br />
                                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="owner-whatsapp footer-red-link" style={{ fontWeight: 800, color: '#ef4444', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                                    <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.15rem' }}></i> +{waNumber}
                                </a>
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
                                <span>Telepon Kantor:</span>
                                <a href={`tel:${phone.replace(/\D/g, '')}`} className="owner-phone footer-light-link" style={{ fontWeight: 700, color: '#f8fafc', marginLeft: '0.35rem' }}>{phone}</a>
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
                                <span>Email Resmi:</span>
                                <a href={`mailto:${email}`} className="owner-email footer-light-link" style={{ fontWeight: 700, color: '#f8fafc', marginLeft: '0.35rem' }}>{email}</a>
                            </div>
                        </div>

                        {/* Media Sosial & Portal Owner */}
                        <div className="md:col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: '0.5rem', background: '#221718', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#ef4444', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', width: 'fit-content' }}>
                                <i className="fa-solid fa-share-nodes"></i> MEDIA SOSIAL
                            </div>
                            <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                                <a id="footerIg" href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-pill">
                                    <i className="fa-brands fa-instagram" style={{ color: '#ef4444' }}></i>
                                    <span className="medsos-text">Instagram</span>
                                </a>
                                <a id="footerFb" href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-pill">
                                    <i className="fa-brands fa-facebook" style={{ color: '#ef4444' }}></i>
                                    <span className="medsos-text">Facebook</span>
                                </a>
                                <a id="footerTiktok" href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-social-pill">
                                    <i className="fa-brands fa-tiktok" style={{ color: '#ef4444' }}></i>
                                    <span className="medsos-text">TikTok</span>
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* Footer Bottom Bar */}
                    <div style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>&copy; 2026 <span className="brand-title" style={{ color: '#cbd5e1', fontWeight: 700 }}>Rent Car Makassar</span>. All rights reserved.</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }}></span>
                            <span>Cakupan Layanan Wilayah Makassar &amp; Seluruh Indonesia</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* FLOATING WHATSAPP BUTTON (LOGO ONLY) */}
            <aside aria-label="Kontak Cepat WhatsApp" style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999 }}>
                <a 
                    href={waLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="floating-wa-clean wa-icon-only"
                    id="floatingWaBtn"
                    title="Chat WhatsApp dengan Admin"
                    aria-label="Chat WhatsApp Admin"
                >
                    <span className="floating-wa-tooltip">Butuh Sewa Mobil? Chat Kami</span>
                    <i className="fa-brands fa-whatsapp"></i>
                </a>
            </aside>

            {/* BACK TO TOP BUTTON */}
            <button 
                type="button"
                id="backToTopBtn" 
                className={`back-to-top-btn ${showBackToTop ? '' : 'hidden'}`}
                onClick={scrollToTop} 
                title="Kembali ke atas"
                aria-label="Kembali ke atas"
            >
                <i className="fa-solid fa-arrow-up"></i>
            </button>
        </>
    );
}

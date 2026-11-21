import React from 'react';

export default function ServicesSection() {
    return (
        <section id="layanan" style={{ padding: '5rem 0', background: '#ffffff', borderTop: '1px solid var(--clr-border)' }}>
            <div className="container">
                {/* Section Header */}
                <div style={{ textAlign: 'center', maxWidth: '48rem', margin: '0 auto 3.5rem auto' }}>
                    <div style={{ display: 'inline-block', padding: '0.35rem 1rem', borderRadius: '9999px', background: '#fef2f2', border: '1px solid rgba(220, 38, 38, 0.2)', color: '#dc2626', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                        LAYANAN KAMI
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '0.75rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Solusi Transportasi Profesional
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                        Pilihan paket fleksibel untuk keperluan pribadi, korporat, hingga acara penting Anda.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-3 gap-6 reveal-on-scroll">
                    
                    {/* Card 1: Dinas & Bisnis */}
                    <div className="service-card">
                        <div className="service-icon-box">
                            <i className="fa-solid fa-briefcase"></i>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>
                            Dinas &amp; Bisnis
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                            Antar jemput klien VIP, tamu instansi, dan mobilitas operasional kantor dengan faktur resmi &amp; supir berseragam rapi.
                        </p>
                    </div>

                    {/* Card 2: Wisata & Liburan */}
                    <div className="service-card">
                        <div className="service-icon-box">
                            <i className="fa-solid fa-umbrella-beach"></i>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>
                            Wisata &amp; Liburan
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                            Jelajahi destinasi eksotis Makassar, Toraja, Bira, dan sekitarnya bersama supir lokal berpengalaman &amp; ramah.
                        </p>
                    </div>

                    {/* Card 3: Wedding & VIP Car */}
                    <div className="service-card">
                        <div className="service-icon-box">
                            <i className="fa-solid fa-ring"></i>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>
                            Wedding &amp; VIP Car
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                            Mobil pengantin mewah seperti Alphard Gen 4 dan Land Cruiser berhias pita istimewa untuk momen terindah Anda.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}

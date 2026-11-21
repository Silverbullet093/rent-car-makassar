import React, { useState } from 'react';

const CITIES = [
    'Jabodetabek',
    'Surabaya & Malang',
    'Bali & Lombok',
    'Medan & Sumatera',
    'Makassar & Sulawesi',
    'Kalimantan & Lainnya'
];

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

export default function CoverageSection({ config }) {
    const [activeCity, setActiveCity] = useState('Makassar & Sulawesi');

    const currentRoute = CITY_ROUTE_DATA[activeCity] || CITY_ROUTE_DATA['Makassar & Sulawesi'];
    const waNumber = config?.whatsappNumber || '6281234567890';
    const waText = encodeURIComponent(`Halo RPM Rent Car Makassar, saya ingin menanyakan ketersediaan rental mobil di wilayah ${activeCity}.`);
    const cityWaLink = `https://wa.me/${waNumber}?text=${waText}`;

    return (
        <section id="jangkauan" className="section-dark-coverage">
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div className="grid md:grid-cols-12 gap-8 items-center reveal-on-scroll">
                    
                    {/* Left Text Column */}
                    <div className="md:col-span-5 text-left">
                        <div style={{ display: 'inline-block', padding: '0.35rem 0.85rem', borderRadius: '0.5rem', background: '#221718', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#ef4444', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                            CAKUPAN NASIONAL
                        </div>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, letterSpacing: '-0.025em', marginBottom: '1.25rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Melayani Perjalanan Di <br />Seluruh Wilayah Indonesia
                        </h2>
                        <p style={{ fontSize: '0.925rem', color: '#94a3b8', lineHeight: 1.65, marginBottom: '1.75rem' }}>
                            Dari Sabang sampai Merauke, RPM Rent Car siap menemani mobilitas Anda. Didukung jaringan mitra luas di kota-kota besar seperti Makassar, Jakarta, Surabaya, Bali, Medan, Balikpapan, dan puluhan kota lainnya.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem' }}>
                            <div style={{ background: '#161f33', padding: '1.15rem', borderRadius: '1rem', border: '1px solid #1e293b' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                                    <i className="fa-solid fa-city"></i> <span className="counter-number">34</span>+ Provinsi
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>Antar jemput bandara &amp; hotel terdekat.</p>
                            </div>
                            <div style={{ background: '#161f33', padding: '1.15rem', borderRadius: '1rem', border: '1px solid #1e293b' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                                    <i className="fa-solid fa-headset"></i> <span className="counter-number">24</span>/7 Layanan
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>Bantuan darurat di jalan kapanpun.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Card Column */}
                    <div className="md:col-span-7">
                        <div style={{ background: '#131b2e', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc' }}>
                                <i className="fa-solid fa-location-dot" style={{ color: '#ef4444' }}></i>
                                <span>Wilayah Utama Operasional</span>
                            </h3>
                            <div className="cities-grid">
                                {CITIES.map((city) => (
                                    <div
                                        key={city}
                                        className={`city-box ${activeCity === city ? 'active-city' : ''}`}
                                        onClick={() => setActiveCity(city)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {city}
                                    </div>
                                ))}
                            </div>
                            {/* Interactive Live Route Info Box */}
                            <div id="cityRouteInfoBox" className="city-route-info-box" style={{ marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>
                                        <i className={`fa-solid ${currentRoute.icon}`}></i>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.875rem', marginBottom: '0.2rem' }}>
                                            {currentRoute.highlight}
                                        </div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.5 }}>
                                            {currentRoute.desc}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(30, 41, 59, 0.8)', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.85rem' }}>Butuh sewa di kota lain di luar daftar di atas?</p>
                                <a href={cityWaLink} target="_blank" rel="noopener noreferrer" className="city-wa-cta">
                                    <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.1rem' }}></i>
                                    <span>TANYAKAN KETERSEDIAAN KOTA</span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

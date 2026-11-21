import React, { useState, useEffect, useMemo } from 'react';
import { formatRupiah, getTodayLocalStr, getTomorrowLocalStr, calculateDiffDays, cleanPhone, EVENT_OPTIONS } from '../utils/helpers';
import { fetchConfirmedBookingsApi, createBookingApi } from '../utils/api';

const DEFAULT_EVENT_OPTIONS = [
    { value: 'Wisata / Liburan', title: 'Wisata / Liburan Keluarga', icon: <i className="fa-solid fa-umbrella-beach text-blue-600" />, desc: 'Liburan bersama keluarga, kerabat, atau rekan wisata' },
    { value: 'Acara Pernikahan (Wedding)', title: 'Acara Pernikahan / Iring-iringan', icon: <i className="fa-solid fa-gem text-pink-600" />, desc: 'Mobil pengantin, rombongan keluarga, & iring-iringan resepsi' },
    { value: 'Dinas Kantor / Bisnis', title: 'Kunjungan Bisnis / Perjalanan Dinas', icon: <i className="fa-solid fa-briefcase text-slate-600" />, desc: 'Kunjungan dinas pemerintah, perusahaan, & agenda bisnis resmi' },
    { value: 'Antar Jemput Bandara', title: 'Antar / Jemput Bandara', icon: <i className="fa-solid fa-plane-departure text-sky-600" />, desc: 'Penjemputan & drop-off Bandara Sultan Hasanuddin Makassar' },
    { value: 'Mudik / Pulang Kampung', title: 'Mudik / Pulang Kampung', icon: <i className="fa-solid fa-house text-emerald-600" />, desc: 'Perjalanan antar kota / daerah Sulawesi Selatan & sekitarnya' },
    { value: 'Acara Keluarga / Hajatan', title: 'Acara Keluarga / Hajatan', icon: <i className="fa-solid fa-users text-orange-600" />, desc: 'Hajatan keluarga, wisuda, ziarah, & silaturahmi' },
    { value: 'Lainnya', title: 'Keperluan Lainnya', icon: <i className="fa-solid fa-car text-slate-500" />, desc: 'Keperluan transportasi harian atau kebutuhan personal lainnya' },
];

export default function BookingModal({ car, config, onClose, onSuccessBooking }) {
    if (!car) return null;

    const isHoliday = Boolean(config?.isHolidayPricingActive);
    const carRate = isHoliday
        ? (car.priceHoliday || car.price_holiday || car.priceNormal || 0)
        : (car.priceNormal || car.price_normal || 0);

    const isDriverOnly = car.rentalOption === 'driver_only' || car.rental_option === 'driver_only';
    const driverFeePerDay = car.driverFee || car.driver_fee || 50000;

    // States
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(DEFAULT_EVENT_OPTIONS[0]);
    const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);

    const [startDate, setStartDate] = useState(getTodayLocalStr());
    const [endDate, setEndDate] = useState(getTomorrowLocalStr());
    const [driverOption, setDriverOption] = useState(isDriverOnly ? 'driver' : 'self');
    const [notes, setNotes] = useState('');

    const [ktpFile, setKtpFile] = useState(null);
    const [ktpPreview, setKtpPreview] = useState('');
    const [ktpFileName, setKtpFileName] = useState('');

    const [paymentType, setPaymentType] = useState('lunas_awal');
    const [dpPercent, setDpPercent] = useState(50);
    const [customDpAmount, setCustomDpAmount] = useState('');

    const [confirmedBookings, setConfirmedBookings] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if (car.id) {
            fetchConfirmedBookingsApi(car.id).then(list => {
                if (isMounted) setConfirmedBookings(list || []);
            });
        }
        return () => { isMounted = false; };
    }, [car.id]);

    const handleKtpUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setKtpFile(file);
            setKtpFileName(file.name);
            const reader = new FileReader();
            reader.onload = () => setKtpPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const resetKtp = () => {
        setKtpFile(null);
        setKtpPreview('');
        setKtpFileName('');
    };

    // Calculate Price Breakdown
    const rentalDays = useMemo(() => {
        return calculateDiffDays(startDate, endDate);
    }, [startDate, endDate]);

    const carTotal = rentalDays * carRate;
    const isWithDriver = driverOption === 'driver' || isDriverOnly;
    const driverTotal = isWithDriver ? (driverFeePerDay * rentalDays) : 0;
    const grandTotal = carTotal + driverTotal;

    const calculatedDp = useMemo(() => {
        if (customDpAmount !== '') {
            return parseFloat(customDpAmount) || 0;
        }
        return Math.round(grandTotal * (dpPercent / 100));
    }, [grandTotal, dpPercent, customDpAmount]);

    const remainingBalance = Math.max(0, grandTotal - calculatedDp);

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!customerName.trim() || !customerPhone.trim()) {
            setErrorMessage('Mohon lengkapi Nama dan No WhatsApp Anda.');
            return;
        }

        if (endDate < startDate) {
            setErrorMessage('Tanggal selesai sewa tidak boleh sebelum tanggal mulai.');
            return;
        }

        setIsSubmitting(true);
        const bookingCode = 'RCM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const driverLabel = isWithDriver
            ? `Dengan Supir (+${formatRupiah(driverFeePerDay)}/hari)`
            : 'Lepas Kunci (Berkendara Sendiri)';

        const formData = new FormData();
        formData.append('booking_code', bookingCode);
        formData.append('car_id', car.id);
        formData.append('customer_name', customerName);
        formData.append('customer_phone', customerPhone);
        formData.append('car_name', `${car.brand} ${car.model}`);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        formData.append('driver_label', driverLabel);
        formData.append('with_driver', isWithDriver ? 1 : 0);
        formData.append('total_price', grandTotal);
        formData.append('payment_type', paymentType);
        formData.append('dp_amount', paymentType === 'dp' ? calculatedDp : 0);
        formData.append('notes', notes);
        formData.append('status', 'pending');

        if (ktpFile) {
            formData.append('ktp_image', ktpFile);
        }

        try {
            await createBookingApi(formData);
        } catch (apiErr) {
            console.warn('API booking notice:', apiErr);
        }

        // Generate WA Link
        const payLabel = paymentType === 'dp'
            ? `DP (${formatRupiah(calculatedDp)})`
            : paymentType === 'lunas_awal'
                ? 'Bayar Lunas di Awal'
                : 'Bayar saat Serah Terima';

        const waText =
`*FORMAT RESERVASI MOBIL — RPM RENT CAR MAKASSAR*
======================================
*Kode Pesanan:* ${bookingCode}
*Nama Pemesan:* ${customerName}
*No. WhatsApp:* ${customerPhone}

*Unit Armada:* ${car.brand} ${car.model} (${car.year})
*Ketentuan:* ${driverLabel}
*Keperluan:* ${selectedEvent.title}

*Jadwal Sewa:*
- Mulai: ${startDate}
- Selesai: ${endDate}
- Total Durasi: ${rentalDays} Hari

*Rincian Biaya:*
- Sewa Unit (${rentalDays}x): ${formatRupiah(carTotal)}
- Biaya Supir (${rentalDays}x): ${isWithDriver ? formatRupiah(driverTotal) : 'Rp 0'}
--------------------------------------
*TOTAL BIAYA:* ${formatRupiah(grandTotal)}
*Skema Bayar:* ${payLabel}
${notes ? `*Catatan Tambahan:* ${notes}\n` : ''}
======================================
Halo Admin RPM Rent Car Makassar, saya ingin konfirmasi ketersediaan unit dan kelanjutan pemesanan di atas. Terima kasih!`;

        const waTarget = cleanPhone(config?.whatsappNumber || '6281234567890');
        const waLink = `https://wa.me/${waTarget}?text=${encodeURIComponent(waText)}`;

        setIsSubmitting(false);
        if (onSuccessBooking) onSuccessBooking(bookingCode);
        window.open(waLink, '_blank');
        onClose();
    };

    return (
        <div id="bookingModal" className="modal-backdrop">
            <div className="modal-box max-w-3xl">
                
                {/* Header Modal */}
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                    <div>
                        <div id="modalCarCategory" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--clr-primary)', textTransform: 'uppercase' }}>
                            {car.category}
                        </div>
                        <h3 id="modalCarTitle" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--clr-text-main)', margin: 0 }}>
                            {car.brand} {car.model}
                        </h3>
                    </div>
                    <button type="button" onClick={onClose} className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
                        ✕
                    </button>
                </div>

                {/* Isi Modal */}
                <div style={{ padding: '1.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
                    
                    {/* Detail Mobil & Foto */}
                    <div className="grid sm:grid-cols-2 gap-5" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--clr-border)', marginBottom: '1.5rem' }}>
                        <div>
                            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '11rem', background: '#f1f5f9', border: '1px solid var(--clr-border)' }}>
                                <img
                                    id="modalCarImage"
                                    src={car.image || '/Land Cruser (1).png'}
                                    alt={`${car.brand} ${car.model}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                        <div>
                            <div id="modalCarStatus" style={{ marginBottom: '0.5rem' }}>
                                <span className={car.status === 'ready' ? 'status-pill-ready' : 'status-pill-used'}>
                                    <span className="dot-indicator" style={{ backgroundColor: car.status === 'ready' ? '#10b981' : '#f59e0b' }}></span>
                                    {car.status === 'ready' ? 'Ready' : 'Sedang Digunakan'}
                                </span>
                            </div>
                            <p id="modalCarDesc" style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                                {car.description || `${car.brand} ${car.model} siap menemani perjalanan dinas, wisata, dan keperluan keluarga Anda di Makassar.`}
                            </p>
                            
                            {/* Spesifikasi Ringkas */}
                            <div className="grid sm:grid-cols-2 gap-2" style={{ fontSize: '0.75rem' }}>
                                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #f1f5f9' }}>
                                    <span style={{ color: 'var(--clr-text-subtle)', fontSize: '0.65rem', display: 'block' }}>Kapasitas</span>
                                    <span id="modalCarSeats" style={{ fontWeight: 800, color: 'var(--clr-text-main)' }}>{car.seats} Kursi</span>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #f1f5f9' }}>
                                    <span style={{ color: 'var(--clr-text-subtle)', fontSize: '0.65rem', display: 'block' }}>Transmisi</span>
                                    <span id="modalCarTrans" style={{ fontWeight: 800, color: 'var(--clr-text-main)' }}>{car.transmission}</span>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #f1f5f9' }}>
                                    <span style={{ color: 'var(--clr-text-subtle)', fontSize: '0.65rem', display: 'block' }}>Bahan Bakar</span>
                                    <span id="modalCarFuel" style={{ fontWeight: 800, color: 'var(--clr-text-main)' }}>{car.fuel}</span>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #f1f5f9' }}>
                                    <span style={{ color: 'var(--clr-text-subtle)', fontSize: '0.65rem', display: 'block' }}>Bagasi</span>
                                    <span id="modalCarLuggage" style={{ fontWeight: 800, color: 'var(--clr-text-main)' }}>{car.luggage || '4 Koper'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FORMULIR PEMESANAN */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--clr-text-main)', paddingBottom: '0.35rem', borderBottom: '1px solid var(--clr-border)' }}>
                            Formulir Pemesanan Unit &amp; Waktu Pemakaian
                        </div>

                        {errorMessage && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                                {errorMessage}
                            </div>
                        )}

                        {/* Nama Pengorder & WA */}
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div className="form-group">
                                <label className="form-label">Nama Pengorder <span style={{ color: 'var(--clr-rose)' }}>*</span></label>
                                <input 
                                    type="text" 
                                    required 
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Masukkan nama lengkap pengorder" 
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nomor WhatsApp <span style={{ color: 'var(--clr-rose)' }}>*</span></label>
                                <input 
                                    type="tel" 
                                    required 
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    placeholder="Contoh: 08123456789" 
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {/* Nama Event / Keperluan */}
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>Nama Event / Keperluan Acara <span style={{ color: 'var(--clr-rose)' }}>*</span></span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--clr-text-subtle)', fontWeight: 'normal' }}>Pilih sesuai keperluan Anda</span>
                            </label>

                            {/* Custom Modern Select Box */}
                            <div id="customEventDropdownWrapper" style={{ position: 'relative' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEventDropdownOpen(prev => !prev)}
                                    className="custom-event-trigger-btn"
                                    aria-haspopup="listbox" 
                                    aria-expanded={isEventDropdownOpen}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        <span className="custom-event-icon-box">{selectedEvent.icon}</span>
                                        <div style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            <div className="custom-event-title">{selectedEvent.title}</div>
                                            <div className="custom-event-desc">{selectedEvent.desc}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #bfdbfe' }}>Ubah</span>
                                        <i className="fa-solid fa-chevron-down" style={{ color: '#64748b', fontSize: '0.75rem', transform: isEventDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}></i>
                                    </div>
                                </button>

                                {/* Modern Dropdown Menu Popup */}
                                {isEventDropdownOpen && (
                                    <div className="custom-event-dropdown-menu" role="listbox">
                                        <div className="custom-event-menu-header">
                                            <span>Pilih Jenis Keperluan Acara:</span>
                                        </div>
                                        <div className="custom-event-options-list">
                                            {DEFAULT_EVENT_OPTIONS.map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    className={`custom-event-item ${selectedEvent.value === opt.value ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setSelectedEvent(opt);
                                                        setIsEventDropdownOpen(false);
                                                    }}
                                                >
                                                    <div className="event-item-left">
                                                        <span className="event-item-icon">{opt.icon}</span>
                                                        <div>
                                                            <div className="event-item-name">{opt.title}</div>
                                                            <div className="event-item-sub">{opt.desc}</div>
                                                        </div>
                                                    </div>
                                                    {selectedEvent.value === opt.value && (
                                                        <i className="fa-solid fa-circle-check event-item-check"></i>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Waktu Pemakaian */}
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label className="form-label">Waktu Pemakaian (Tanggal Mulai) <span style={{ color: 'var(--clr-rose)' }}>*</span></label>
                                <div className="booking-date-input-wrap">
                                    <div className="date-input-icon-box">
                                        <i className="fa-solid fa-calendar-day"></i>
                                    </div>
                                    <input 
                                        type="date" 
                                        value={startDate}
                                        min={getTodayLocalStr()}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required 
                                        className="form-input booking-date-input" 
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ position: 'relative' }}>
                                <label className="form-label">Waktu Pemakaian (Tanggal Selesai) <span style={{ color: 'var(--clr-rose)' }}>*</span></label>
                                <div className="booking-date-input-wrap">
                                    <div className="date-input-icon-box">
                                        <i className="fa-solid fa-calendar-check"></i>
                                    </div>
                                    <input 
                                        type="date" 
                                        value={endDate}
                                        min={startDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required 
                                        className="form-input booking-date-input" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notifikasi Jadwal Terisi (jika ada) */}
                        {confirmedBookings.length > 0 && (
                            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#9f1239' }}>
                                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                                    <span>⚠️</span> Jadwal Terisi &amp; Sudah Dikonfirmasi:
                                </div>
                                <div>
                                    {confirmedBookings.map((b, idx) => (
                                        <div key={idx}>• {b.start_date?.split('T')[0]} s/d {b.end_date?.split('T')[0]}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pilihan Sewa */}
                        <div className="form-group">
                            <label className="form-label">Pilihan Jenis Sewa <span style={{ color: 'var(--clr-rose)' }}>*</span></label>
                            <div className="grid sm:grid-cols-2 gap-2">
                                <label style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', border: `1.5px solid ${driverOption === 'self' && !isDriverOnly ? '#dc2626' : 'var(--clr-border)'}`, borderRadius: 'var(--radius-md)', cursor: isDriverOnly ? 'not-allowed' : 'pointer', background: driverOption === 'self' && !isDriverOnly ? '#fef2f2' : '#f8fafc', opacity: isDriverOnly ? 0.5 : 1, transition: 'all 0.2s' }}>
                                    <input 
                                        type="radio" 
                                        name="driverOption" 
                                        value="self" 
                                        checked={driverOption === 'self' && !isDriverOnly} 
                                        disabled={isDriverOnly}
                                        onChange={() => setDriverOption('self')} 
                                        style={{ marginRight: '0.5rem' }} 
                                    />
                                    <div>
                                        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--clr-text-main)' }}>Lepas Kunci (Berkendara Sendiri)</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-subtle)' }}>Tanpa biaya pengemudi</div>
                                    </div>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', border: `1.5px solid ${isWithDriver ? '#dc2626' : 'var(--clr-border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: isWithDriver ? '#fef2f2' : '#f8fafc', transition: 'all 0.2s' }}>
                                    <input 
                                        type="radio" 
                                        name="driverOption" 
                                        value="driver" 
                                        checked={isWithDriver} 
                                        onChange={() => setDriverOption('driver')} 
                                        style={{ marginRight: '0.5rem' }} 
                                    />
                                    <div>
                                        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--clr-text-main)' }}>Pakai Supir (Driver)</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--clr-emerald)', fontWeight: 700 }}>+ {formatRupiah(driverFeePerDay)} / hari</div>
                                    </div>
                                </label>
                            </div>
                            {isDriverOnly && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.73rem', color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <i className="fa-solid fa-circle-exclamation" style={{ color: '#d97706', fontSize: '0.85rem', flexShrink: 0 }} />
                                    <span>Armada ini khusus melayani pemesanan <strong>Dengan Supir (Driver)</strong> demi kenyamanan &amp; keamanan. Opsi Lepas Kunci tidak tersedia untuk unit ini.</span>
                                </div>
                            )}
                        </div>

                        {/* Upload Foto KTP */}
                        <div className="form-group">
                            <label className="form-label">Foto Identitas / KTP Penyewa <span style={{ color: 'var(--clr-rose)' }}>*</span></label>
                            
                            <div className="upload-dropzone">
                                <input type="file" id="bookKtpInput" accept="image/*" className="hidden" onChange={handleKtpUpload} />

                                {!ktpPreview ? (
                                    <div onClick={() => document.getElementById('bookKtpInput')?.click()} style={{ cursor: 'pointer', textAlign: 'center', padding: '1.25rem' }}>
                                        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--clr-text-main)' }}>Klik di sini untuk memilih foto KTP</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-subtle)', marginTop: '0.2rem' }}>Format JPG, PNG, atau JPEG (Maksimal 5MB)</div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'left', padding: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clr-emerald)' }}>✓ Foto KTP terpilih</span>
                                            <button type="button" onClick={resetKtp} className="btn btn-rose btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>Ganti</button>
                                        </div>
                                        <div style={{ height: '10rem', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--clr-border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={ktpPreview} alt="Preview KTP" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-subtle)', marginTop: '0.35rem', fontFamily: 'monospace' }}>{ktpFileName}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Catatan Tambahan */}
                        <div className="form-group">
                            <label className="form-label">Catatan Tambahan (Opsional)</label>
                            <input 
                                type="text" 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Contoh: Lokasi penjemputan di Stasiun / Bandara..." 
                                className="form-input" 
                            />
                        </div>

                        {/* KALKULATOR RINCIAN HARGA OTOMATIS */}
                        <div style={{ background: '#0f172a', borderRadius: 'var(--radius-lg)', padding: '1.25rem', color: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #1e293b', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Rincian Estimasi Biaya</span>
                                <span style={{ fontSize: '0.7rem', background: '#1e293b', color: isHoliday ? '#fca5a5' : '#86efac', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
                                    {isHoliday ? 'Tarif Libur' : 'Tarif Normal'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8125rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                                    <span>Durasi Sewa:</span>
                                    <span style={{ color: 'white', fontWeight: 700 }}>{rentalDays} Hari</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                                    <span>Tarif Unit:</span>
                                    <span style={{ color: 'white', fontWeight: 700 }}>{formatRupiah(carRate)} / hari</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                                    <span>Subtotal Unit:</span>
                                    <span style={{ color: 'white', fontWeight: 700 }}>{formatRupiah(carTotal)}</span>
                                </div>
                                {isWithDriver && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                                        <span>Biaya Supir ({formatRupiah(driverFeePerDay)}/hari):</span>
                                        <span style={{ color: '#34d399', fontWeight: 700 }}>{formatRupiah(driverTotal)}</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ paddingTop: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Total Biaya:</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{formatRupiah(grandTotal)}</span>
                            </div>

                            {paymentType === 'dp' && (
                                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #334155', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fde047' }}>
                                        <span>Nominal DP Dibayar Awal:</span>
                                        <span style={{ fontWeight: 800 }}>{formatRupiah(calculatedDp)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                                        <span>Sisa Pelunasan:</span>
                                        <span style={{ color: '#f8fafc', fontWeight: 700 }}>{formatRupiah(remainingBalance)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PILIHAN OPSI PEMBAYARAN */}
                        <div className="form-group">
                            <label className="form-label">Pilihan Opsi Pembayaran <span style={{ color: 'var(--clr-rose)' }}>*</span></label>
                            <div className="grid sm:grid-cols-3 gap-2">
                                <label style={{ display: 'flex', alignItems: 'flex-start', padding: '0.75rem', border: `1.5px solid ${paymentType === 'dp' ? '#dc2626' : 'var(--clr-border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: paymentType === 'dp' ? '#fef2f2' : '#f8fafc', transition: 'all 0.2s' }}>
                                    <input type="radio" name="paymentType" value="dp" checked={paymentType === 'dp'} onChange={() => setPaymentType('dp')} style={{ marginRight: '0.5rem', marginTop: '0.2rem' }} />
                                    <div>
                                        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--clr-text-main)' }}>DP (Uang Muka)</div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-subtle)', lineHeight: 1.3, marginTop: '0.1rem' }}>Bayar DP di awal untuk kunci jadwal</div>
                                    </div>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'flex-start', padding: '0.75rem', border: `1.5px solid ${paymentType === 'lunas_awal' ? '#dc2626' : 'var(--clr-border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: paymentType === 'lunas_awal' ? '#fef2f2' : '#f8fafc', transition: 'all 0.2s' }}>
                                    <input type="radio" name="paymentType" value="lunas_awal" checked={paymentType === 'lunas_awal'} onChange={() => setPaymentType('lunas_awal')} style={{ marginRight: '0.5rem', marginTop: '0.2rem' }} />
                                    <div>
                                        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--clr-text-main)' }}>Bayar Lunas di Awal</div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--clr-emerald)', fontWeight: 700, lineHeight: 1.3, marginTop: '0.1rem' }}>Langsung lunas penuh di awal</div>
                                    </div>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'flex-start', padding: '0.75rem', border: `1.5px solid ${paymentType === 'bayar_akhir' ? '#dc2626' : 'var(--clr-border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: paymentType === 'bayar_akhir' ? '#fef2f2' : '#f8fafc', transition: 'all 0.2s' }}>
                                    <input type="radio" name="paymentType" value="bayar_akhir" checked={paymentType === 'bayar_akhir'} onChange={() => setPaymentType('bayar_akhir')} style={{ marginRight: '0.5rem', marginTop: '0.2rem' }} />
                                    <div>
                                        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--clr-text-main)' }}>Bayar di Akhir</div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-subtle)', lineHeight: 1.3, marginTop: '0.1rem' }}>Bayar saat unit selesai / serah terima</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* INPUT NOMINAL DP */}
                        {paymentType === 'dp' && (
                            <div className="form-group" style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.35rem' }}>
                                    <label className="form-label" style={{ marginBottom: 0, color: '#92400e', fontWeight: 800 }}>Nominal DP / Uang Muka (Rp)</label>
                                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                                        <button 
                                            type="button" 
                                            onClick={() => { setDpPercent(30); setCustomDpAmount(''); }} 
                                            style={{ fontSize: '0.68rem', padding: '0.18rem 0.55rem', borderRadius: '4px', border: '1px solid #f59e0b', background: dpPercent === 30 && customDpAmount === '' ? '#f59e0b' : '#ffffff', color: dpPercent === 30 && customDpAmount === '' ? '#ffffff' : '#b45309', fontWeight: 700, cursor: 'pointer' }}
                                        >
                                            DP 30%
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => { setDpPercent(50); setCustomDpAmount(''); }} 
                                            style={{ fontSize: '0.68rem', padding: '0.18rem 0.55rem', borderRadius: '4px', border: '1px solid #f59e0b', background: dpPercent === 50 && customDpAmount === '' ? '#f59e0b' : '#ffffff', color: dpPercent === 50 && customDpAmount === '' ? '#ffffff' : '#b45309', fontWeight: 800, cursor: 'pointer' }}
                                        >
                                            DP 50%
                                        </button>
                                    </div>
                                </div>
                                <input 
                                    type="number" 
                                    value={customDpAmount || calculatedDp}
                                    onChange={(e) => setCustomDpAmount(e.target.value)}
                                    placeholder="Masukkan nominal DP (Contoh: 300000)" 
                                    className="form-input" 
                                    style={{ background: '#ffffff', fontWeight: 800, color: '#0f172a' }} 
                                />
                                <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '0.35rem', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                                    <i className="fa-solid fa-circle-info" style={{ color: '#d97706', marginTop: '2px' }} />
                                    <span>Nominal DP dapat disesuaikan dengan kesepakatan (Standar: 50% dari total sewa). Pembayaran dikonfirmasi via WhatsApp Admin.</span>
                                </div>
                            </div>
                        )}

                        {/* KARTU INFORMASI TRANSAKSI VIA WHATSAPP RESMI */}
                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '3.5px solid #16a34a', borderRadius: 'var(--radius-md)', padding: '0.95rem 1.15rem', display: 'flex', alignItems: 'flex-start', gap: '0.85rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
                            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', flexShrink: 0 }}>
                                <i className="fa-brands fa-whatsapp"></i>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                                        Konfirmasi &amp; Pembayaran via WhatsApp Admin
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.775rem', color: '#475569', lineHeight: 1.45, marginTop: '0.2rem' }}>
                                    {paymentType === 'dp' && 'Anda memilih opsi DP (Uang Muka). Admin akan mengonfirmasi ketersediaan unit dan mengirim invoice DP via WhatsApp.'}
                                    {paymentType === 'lunas_awal' && 'Anda memilih opsi Bayar Lunas di Awal. Admin akan mengirimkan invoice total tagihan dan nomor rekening transfer / QRIS resmi langsung di chat WhatsApp.'}
                                    {paymentType === 'bayar_akhir' && 'Anda memilih opsi Bayar di Akhir. Anda dapat melakukan pembayaran saat penyerahan kunci / mobil selesai digunakan.'}
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.7rem', color: '#64748b', fontWeight: 600, flexWrap: 'wrap' }}>
                                    <span>Rekening BCA / BRI / Mandiri / QRIS</span>
                                    <span>•</span>
                                    <span>Verifikasi Cepat &amp; Langsung Terjadwal</span>
                                </div>
                            </div>
                        </div>

                        {/* TOMBOL KIRIM WHATSAPP */}
                        <div style={{ paddingTop: '0.5rem' }}>
                            <button type="submit" disabled={isSubmitting} className="btn btn-emerald btn-lg" style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '0.75rem', fontWeight: 800 }}>
                                <span>{isSubmitting ? 'Memproses Pesanan...' : 'Kirim Form Pemesanan ke WhatsApp Owner'}</span>
                                <svg style={{ width: '1rem', height: '1rem' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                            <p style={{ fontSize: '0.7rem', color: 'var(--clr-text-subtle)', textAlign: 'center', marginTop: '0.5rem' }}>
                                Formulir akan otomatis memformat data pengorder, waktu pemakaian, unit, dan mengirimkannya langsung ke WA Owner.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

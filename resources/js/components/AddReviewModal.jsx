import React, { useState } from 'react';
import { createReviewApi } from '../utils/api';

export default function AddReviewModal({ onClose, onSuccess, cars = [] }) {
    const [name, setName] = useState('');
    const [carName, setCarName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [userType, setUserType] = useState('regular');
    const [avatarFile, setAvatarFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!name.trim() || !comment.trim() || !carName.trim()) {
            setErrorMsg('Mohon lengkapi semua kolom yang wajib diisi.');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('car_name', carName);
        formData.append('rating', rating);
        formData.append('comment', comment);
        formData.append('user_type', userType);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            const res = await createReviewApi(formData);
            setIsSubmitting(false);
            if (onSuccess) onSuccess(res.data || res);
        } catch (err) {
            setIsSubmitting(false);
            setErrorMsg(err.message || 'Gagal mengirim ulasan');
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}>
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', maxWidth: '32rem', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative' }}>
                {/* Header */}
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--clr-text-main)', margin: 0 }}>
                            Tulis Ulasan Anda
                        </h3>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Bagikan pengalaman sewa mobil Anda di RPM Makassar</span>
                    </div>
                    <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {errorMsg && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', color: '#dc2626', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                            {errorMsg}
                        </div>
                    )}

                    {/* Star Rating Selector */}
                    <div>
                        <label className="form-label">Rating Pengalaman <span style={{ color: 'var(--clr-rose)' }}>*</span></label>
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '1.5rem', cursor: 'pointer' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                    key={star}
                                    className="fa-solid fa-star"
                                    onClick={() => setRating(star)}
                                    style={{ color: star <= rating ? '#dc2626' : '#cbd5e1', transition: 'color 0.2s' }}
                                ></i>
                            ))}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Nama Lengkap <span style={{ color: 'var(--clr-rose)' }}>*</span></label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Contoh: Rian Pratama"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Unit Mobil yang Disewa <span style={{ color: 'var(--clr-rose)' }}>*</span></label>
                        <select
                            className="form-select"
                            value={carName}
                            onChange={(e) => setCarName(e.target.value)}
                            required
                        >
                            <option value="">-- Pilih Armada Mobil (Ketersediaan) --</option>
                            {cars && cars.map((car) => {
                                const fullName = `${car.brand} ${car.model}`.trim();
                                const isReady = car.status === 'ready';
                                const statusLabel = isReady ? '🟢 Tersedia (Ready)' : (car.status === 'in_use' ? '🟡 Sedang Digunakan' : '🔴 Perawatan');
                                return (
                                    <option key={car.id} value={fullName}>
                                        {fullName} — {statusLabel}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Jenis Profil Penyewa</label>
                        <select className="form-select" value={userType} onChange={(e) => setUserType(e.target.value)}>
                            <option value="regular">Pelanggan Umum / Keluarga</option>
                            <option value="artis">Artis / VIP / Pejabat</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Komentar / Ulasan <span style={{ color: 'var(--clr-rose)' }}>*</span></label>
                        <textarea
                            className="form-textarea"
                            rows={3}
                            placeholder="Ceritakan kepuasan Anda mengenai kebersihan mobil, keramahan supir, ketepatan waktu..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Foto Profil / Avatar (Opsional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-input"
                            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-full"
                        style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', fontWeight: 800, marginTop: '0.5rem' }}
                    >
                        {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                    </button>
                </form>
            </div>
        </div>
    );
}

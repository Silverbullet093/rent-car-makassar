import React, { useState, useRef } from 'react';
import AddReviewModal from './AddReviewModal';

export default function ReviewsSection({ reviews = [], onReviewAdded, cars = [] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const sliderRef = useRef(null);

    const approvedReviews = reviews.filter(r => r.status === 'approved' || !r.status);

    // Duplicate list smoothly if items are few for continuous horizontal scroller
    let displayReviews = [...approvedReviews];
    if (displayReviews.length > 0 && displayReviews.length < 6) {
        displayReviews = [...displayReviews, ...approvedReviews];
    }
    if (displayReviews.length > 0 && displayReviews.length < 8) {
        displayReviews = [...displayReviews, ...displayReviews];
    }

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -340, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
    };

    return (
        <section id="reviews" style={{ padding: '4.5rem 0', background: '#ffffff', borderTop: '1px solid var(--clr-border)' }}>
            <div className="container">
                
                {/* Section Header */}
                <div className="reviews-section-header">
                    <div className="reviews-header-copy">
                        <span style={{ color: '#22c55e', fontWeight: 800, fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                            WHAT DRIVERS SAY
                        </span>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--clr-text-main)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                            Real Stories. Real Drivers.
                        </h2>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--clr-text-muted)', lineHeight: 1.6, margin: 0 }}>
                            Ulasan &amp; pengalaman jujur pelanggan kami. Kepuasan dan kenyamanan Anda adalah prioritas utama kami.
                        </p>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(true)}
                            className="btn btn-emerald btn-lg"
                            style={{ boxShadow: '0 10px 25px -5px rgba(34, 197, 94, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, padding: '0.75rem 1.35rem', fontSize: '0.9rem' }}
                        >
                            <svg style={{ width: '1rem', height: '1rem' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                            <span>Tulis Ulasan &amp; Story</span>
                        </button>
                    </div>
                </div>

                {/* 1 ROW REVIEWS CAROUSEL WITH LEFT & RIGHT EDGE ARROWS */}
                <div className="reviews-carousel-outer reveal-on-scroll">
                    {/* Tombol Panah Kiri */}
                    <button
                        type="button"
                        id="reviewsPrevBtn"
                        className="carousel-edge-btn edge-btn-left"
                        onClick={scrollLeft}
                        aria-label="Ulasan Sebelumnya"
                        title="Sebelumnya"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    <div className="horizontal-slider-wrapper" ref={sliderRef} style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}>
                        <div id="reviewsContainer" className="reviews-slider-track">
                            {displayReviews.length === 0 ? (
                                <div style={{ flex: '1 1 100%', padding: '3rem 1rem', textAlign: 'center', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--clr-border)' }}>
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                                        <svg style={{ width: '2.25rem', height: '2.25rem', fill: '#eab308', stroke: '#eab308' }} viewBox="0 0 24 24">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    </div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--clr-text-main)' }}>Belum ada ulasan publik</h4>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>Jadilah pelanggan pertama yang memberikan ulasan untuk layanan kami!</p>
                                    <button type="button" onClick={() => setIsAddModalOpen(true)} className="btn btn-primary btn-sm">
                                        Tulis Ulasan Pertama
                                    </button>
                                </div>
                            ) : (
                                displayReviews.map((rev, cardIdx) => {
                                    const isArtis = rev.user_type === 'artis';
                                    const rating = parseInt(rev.rating || 5);
                                    const avatarSrc = rev.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name || 'P')}&background=${isArtis ? 'dc2626' : '64748b'}&color=fff&bold=true`;

                                    return (
                                        <div
                                            key={`${rev.id || cardIdx}-${cardIdx}`}
                                            className={`review-card-item ${isArtis ? 'review-card-artist' : ''}`}
                                            title={`Ulasan ${rev.name}`}
                                        >
                                            <div>
                                                {/* Top Centered Avatar */}
                                                <div className="review-card-top">
                                                    <div className="review-avatar-wrap">
                                                        {isArtis && (
                                                            <span className="review-crown-badge">
                                                                <svg style={{ width: '1.25rem', height: '1.25rem', fill: '#f59e0b' }} viewBox="0 0 24 24">
                                                                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                        <div className={`review-avatar-ring ${isArtis ? 'is-artist' : ''}`}>
                                                            <img
                                                                src={avatarSrc}
                                                                alt={rev.name}
                                                                className="review-avatar-img"
                                                                onError={(e) => {
                                                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name || 'P')}&background=${isArtis ? 'dc2626' : '64748b'}&color=fff`;
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Centered Name */}
                                                    <div className="review-author-name">{rev.name}</div>

                                                    {/* Centered 5 Stars */}
                                                    <div className="review-stars-row">
                                                        {Array.from({ length: 5 }, (_, i) => (
                                                            <svg
                                                                key={i}
                                                                style={{
                                                                    width: '1.35rem',
                                                                    height: '1.35rem',
                                                                    fill: i < rating ? '#dc2626' : '#e2e8f0',
                                                                    stroke: i < rating ? '#dc2626' : '#e2e8f0'
                                                                }}
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Comment Paragraph */}
                                                <p className="review-comment-body">{rev.comment}</p>
                                            </div>

                                            {/* Bottom Footer */}
                                            <div className="review-card-footer-action">
                                                {rev.car_name && (
                                                    <span className="review-car-tag">
                                                        <svg style={{ width: '0.75rem', height: '0.75rem', fill: 'none', stroke: 'currentColor' }} viewBox="0 0 24 24" strokeWidth="2">
                                                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
                                                        </svg>
                                                        <span>{rev.car_name}</span>
                                                    </span>
                                                )}
                                                <span className="review-pill-tag">review</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Tombol Panah Kanan */}
                    <button
                        type="button"
                        id="reviewsNextBtn"
                        className="carousel-edge-btn edge-btn-right"
                        onClick={scrollRight}
                        aria-label="Ulasan Berikutnya"
                        title="Berikutnya"
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>

            </div>

            {/* Modal Tambah Ulasan */}
            {isAddModalOpen && (
                <AddReviewModal
                    cars={cars}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={(newRev) => {
                        setIsAddModalOpen(false);
                        if (onReviewAdded) onReviewAdded(newRev);
                    }}
                />
            )}
        </section>
    );
}

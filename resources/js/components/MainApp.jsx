import React, { useState, useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import IntroPreloader from './IntroPreloader';
import CarCatalog from './CarCatalog';
import CoverageSection from './CoverageSection';
import ServicesSection from './ServicesSection';
import ReviewsSection from './ReviewsSection';
import Footer from './Footer';
import BookingModal from './BookingModal';
import Toast from './Toast';

import { fetchCarsApi, fetchOwnerConfigApi, fetchReviewsApi } from '../utils/api';
import { DEFAULT_CARS, DEFAULT_OWNER_CONFIG } from '../utils/helpers';

export default function MainApp() {
    const [cars, setCars] = useState(DEFAULT_CARS);
    const [config, setConfig] = useState(DEFAULT_OWNER_CONFIG);
    const [reviews, setReviews] = useState([]);
    const [activeCarToBook, setActiveCarToBook] = useState(null);
    const [toast, setToast] = useState(null);

    // Initial API Data Load
    useEffect(() => {
        let isMounted = true;

        Promise.all([
            fetchCarsApi(),
            fetchOwnerConfigApi(),
            fetchReviewsApi()
        ]).then(([fetchedCars, fetchedConfig, fetchedReviews]) => {
            if (isMounted) {
                if (fetchedCars && fetchedCars.length > 0) setCars(fetchedCars);
                if (fetchedConfig) setConfig(fetchedConfig);
                if (fetchedReviews && fetchedReviews.length > 0) setReviews(fetchedReviews);
            }
        }).catch(err => {
            console.warn('API fetch warning:', err);
        });

        return () => { isMounted = false; };
    }, []);

    // Ensure all elements are revealed and no intro-active classes persist
    useEffect(() => {
        document.documentElement.classList.remove('intro-active', 'intro-merging');
        const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale');
        elements.forEach(el => el.classList.add('is-revealed'));
    }, [cars, reviews]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleSelectUnitClick = (e) => {
        e.preventDefault();
        const katalogEl = document.getElementById('katalog');
        if (katalogEl) {
            katalogEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="rpm-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Cinematic Video Loading Intro */}
            <IntroPreloader onFinish={() => {
                document.documentElement.classList.remove('intro-active', 'intro-merging');
                const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale');
                elements.forEach(el => el.classList.add('is-revealed'));
            }} />

            {/* Navigation Header */}
            <Header
                config={config}
                onSelectUnitClick={handleSelectUnitClick}
            />

            {/* Main Content Sections */}
            <main className="flex-1">
                {/* Hero Section */}
                <Hero config={config} />

                {/* Car Catalog Grid & Search */}
                <CarCatalog
                    cars={cars}
                    isHolidayPricingActive={config?.isHolidayPricingActive}
                    onBookNow={(car) => setActiveCarToBook(car)}
                />

                {/* Coverage & Destinations */}
                <CoverageSection config={config} />

                {/* Services List */}
                <ServicesSection />

                {/* Customer Reviews & Testimonials Carousel */}
                <ReviewsSection
                    reviews={reviews}
                    cars={cars}
                    onReviewAdded={(newRev) => {
                        setReviews(prev => [newRev, ...prev]);
                        showToast('Terima kasih! Ulasan Anda berhasil dikirim.');
                    }}
                />
            </main>

            {/* Footer & Kontak Owner (Hitam & Merah) */}
            <Footer config={config} />

            {/* Interactive Booking Modal */}
            {activeCarToBook && (
                <BookingModal
                    car={activeCarToBook}
                    config={config}
                    onClose={() => setActiveCarToBook(null)}
                    onSuccessBooking={(bookingCode) => {
                        showToast(`Pesanan ${bookingCode} berhasil dibuat! Membuka WhatsApp Admin...`);
                    }}
                />
            )}

            {/* Toast Feedback */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

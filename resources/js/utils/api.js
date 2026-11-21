// API Client for RCM Laravel REST Endpoints
import { DEFAULT_CARS, DEFAULT_OWNER_CONFIG } from './helpers';

export const fetchCarsApi = async () => {
    try {
        const res = await fetch('/api/cars', {
            headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
            const json = await res.json();
            if (json.data && Array.isArray(json.data) && json.data.length > 0) {
                return json.data.map(c => ({
                    id: c.id.toString(),
                    carCode: c.car_code,
                    brand: c.brand,
                    model: c.model,
                    year: c.year,
                    category: c.category,
                    seats: c.seats,
                    transmission: c.transmission,
                    fuel: c.fuel,
                    luggage: c.luggage || '3 Koper',
                    priceNormal: parseFloat(c.price_normal),
                    priceHoliday: parseFloat(c.price_holiday),
                    driverFee: parseFloat(c.driver_fee || 50000),
                    rentalOption: c.rental_option || 'both',
                    status: c.status,
                    image: c.image || '/Land Cruser (1).png',
                    description: c.description
                }));
            }
        }
    } catch (err) {
        console.warn('Fallback to local default cars:', err);
    }
    return DEFAULT_CARS;
};

export const fetchOwnerConfigApi = async () => {
    try {
        const res = await fetch('/api/owner-config', {
            headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
            const json = await res.json();
            if (json.data) {
                const d = json.data;
                return {
                    businessName: d.business_name || DEFAULT_OWNER_CONFIG.businessName,
                    tagline: d.tagline || DEFAULT_OWNER_CONFIG.tagline,
                    description: d.description || DEFAULT_OWNER_CONFIG.description,
                    whatsappNumber: d.whatsapp_number || DEFAULT_OWNER_CONFIG.whatsappNumber,
                    phone: d.phone || DEFAULT_OWNER_CONFIG.phone,
                    email: d.email || DEFAULT_OWNER_CONFIG.email,
                    address: d.address || DEFAULT_OWNER_CONFIG.address,
                    mapsUrl: d.maps_url || DEFAULT_OWNER_CONFIG.mapsUrl,
                    operatingHours: d.operating_hours || DEFAULT_OWNER_CONFIG.operatingHours,
                    isHolidayPricingActive: Boolean(d.is_holiday_pricing_active),
                    holidayNotes: d.holiday_notes || DEFAULT_OWNER_CONFIG.holidayNotes,
                    bankName: d.bank_name || DEFAULT_OWNER_CONFIG.bankName,
                    bankAccountNumber: d.bank_account_number || DEFAULT_OWNER_CONFIG.bankAccountNumber,
                    bankAccountHolder: d.bank_account_holder || DEFAULT_OWNER_CONFIG.bankAccountHolder,
                    qrisImage: d.qris_image || '',
                    socialMedia: d.social_media || DEFAULT_OWNER_CONFIG.socialMedia
                };
            }
        }
    } catch (err) {
        console.warn('Fallback to default owner config:', err);
    }
    return DEFAULT_OWNER_CONFIG;
};

export const fetchReviewsApi = async () => {
    try {
        const res = await fetch('/api/reviews', {
            headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
            const json = await res.json();
            if (json.data && Array.isArray(json.data)) {
                return json.data;
            }
        }
    } catch (err) {
        console.warn('Fallback reviews error:', err);
    }
    return [];
};

export const fetchConfirmedBookingsApi = async (carId) => {
    if (!carId) return [];
    try {
        const res = await fetch(`/api/bookings?car_id=${carId}&status=confirmed&active_only=1`, {
            headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
            const json = await res.json();
            if (json.data && Array.isArray(json.data)) {
                return json.data;
            }
        }
    } catch (err) {
        console.warn('Error fetching confirmed bookings:', err);
    }
    return [];
};

export const createBookingApi = async (formData) => {
    const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    });
    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message || 'Gagal menyimpan pesanan booking');
    }
    return result;
};

export const createReviewApi = async (formData) => {
    const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    });
    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message || 'Gagal mengirim ulasan');
    }
    return result;
};

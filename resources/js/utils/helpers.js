// Utility and Helper functions for Rent Car Makassar (RCM) React App

export const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(Number(number) || 0);
};

export const getTodayLocalStr = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export const getTomorrowLocalStr = () => {
    const tm = new Date();
    tm.setDate(tm.getDate() + 1);
    const y = tm.getFullYear();
    const m = String(tm.getMonth() + 1).padStart(2, '0');
    const d = String(tm.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export const calculateDiffDays = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return 1;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
};

export const cleanPhone = (phone) => {
    if (!phone) return '6281234567890';
    let clean = String(phone).replace(/\D/g, '');
    if (clean.startsWith('0')) {
        clean = '62' + clean.slice(1);
    }
    return clean;
};

export const DEFAULT_OWNER_CONFIG = {
    businessName: "RPM Rent Car Makassar",
    tagline: "Sewa Mobil Terpercaya, Nyaman & Harga Transparan",
    description: "Penyedia jasa rental mobil profesional melayani sewa lepas kunci (berkendara sendiri) maupun dengan supir berpengalaman untuk keperluan wisata, dinas bisnis, pernikahan, mudik, dan perjalanan keluarga.",
    whatsappNumber: "6281234567890",
    phone: "0812-3456-7890",
    email: "reservasi@rpmrentcarmakassar.com",
    address: "Jl. Perintis Kemerdekaan No. 10, Makassar, Sulawesi Selatan",
    mapsUrl: "https://maps.google.com/?q=Jl.+Perintis+Kemerdekaan+No.+10,+Makassar,+Sulawesi+Selatan",
    operatingHours: "Buka 24 Jam Setiap Hari",
    socialMedia: {
        instagram: "@rentcarmakassar_id",
        facebook: "Rent Car Makassar Official",
        tiktok: "@rentcarmakassar"
    },
    isHolidayPricingActive: false,
    holidayNotes: "Tarif Musim Libur & Hari Besar Nasional (Peak Season)",
    bankName: "BCA",
    bankAccountNumber: "7890123456",
    bankAccountHolder: "RPM Rent Car Makassar",
    qrisImage: ""
};

export const DEFAULT_CARS = [
    {
        id: "1",
        carCode: "RCM-LC300",
        brand: "Toyota",
        model: "Land Cruiser (LC300)",
        year: "2022",
        category: "VIP Luxury",
        seats: 7,
        transmission: "Matic (AT)",
        fuel: "Diesel",
        luggage: "4 Koper",
        priceNormal: 7000000,
        priceHoliday: 7500000,
        driverFee: 50000,
        rentalOption: "both",
        status: "ready",
        image: "/Land Cruser (1).png",
        description: "Toyota Land Cruiser LC300 Flagship VIP dengan kenyamanan maksimal dan ketangguhan legendaris."
    },
    {
        id: "2",
        carCode: "RCM-AG4",
        brand: "Toyota",
        model: "Alphard Gen 4",
        year: "2023",
        category: "VIP Luxury",
        seats: 7,
        transmission: "Matic (AT)",
        fuel: "Bensin",
        luggage: "4 Koper",
        priceNormal: 2700000,
        priceHoliday: 3000000,
        driverFee: 50000,
        rentalOption: "both",
        status: "ready",
        image: "/Alphard Gen 4 (1).png",
        description: "Toyota Alphard Gen 4 2023 Executive Lounge generasi terbaru dengan interior super mewah."
    },
    {
        id: "3",
        carCode: "RCM-AG3",
        brand: "Toyota",
        model: "Alphard Gen 3",
        year: "2018",
        category: "VIP Luxury",
        seats: 7,
        transmission: "Matic (AT)",
        fuel: "Bensin",
        luggage: "4 Koper",
        priceNormal: 2200000,
        priceHoliday: 2500000,
        driverFee: 50000,
        rentalOption: "both",
        status: "ready",
        image: "/Alphard Gen 3 (1).png",
        description: "Toyota Alphard Gen 3 MPV Luxury pilihan ideal untuk tamu VVIP, instansi, dan pernikahan."
    },
    {
        id: "4",
        carCode: "RCM-FGR",
        brand: "Toyota",
        model: "Fortuner GR",
        year: "2021",
        category: "SUV",
        seats: 7,
        transmission: "Manual",
        fuel: "Diesel",
        luggage: "3 Koper",
        priceNormal: 1300000,
        priceHoliday: 1500000,
        driverFee: 50000,
        rentalOption: "both",
        status: "ready",
        image: "/Fortuner GR (1).png",
        description: "Toyota Fortuner GR Sport SUV gagah, tangguh di segala medan Sulawesi Selatan."
    },
    {
        id: "5",
        carCode: "RCM-ZXQ",
        brand: "Toyota",
        model: "Innova Zenix Q Hybrid",
        year: "2022",
        category: "MPV",
        seats: 7,
        transmission: "Matic (AT)",
        fuel: "Bensin",
        luggage: "3 Koper",
        priceNormal: 1100000,
        priceHoliday: 1300000,
        driverFee: 50000,
        rentalOption: "both",
        status: "ready",
        image: "/Zenix Q (2).png",
        description: "Toyota All New Innova Zenix Q Hybrid Modelista kasta tertinggi dengan captain seat ottoman."
    },
    {
        id: "6",
        carCode: "RCM-ZXV",
        brand: "Toyota",
        model: "Innova Zenix V Hybrid",
        year: "2022",
        category: "MPV",
        seats: 7,
        transmission: "Matic (AT)",
        fuel: "Bensin",
        luggage: "3 Koper",
        priceNormal: 900000,
        priceHoliday: 1050000,
        driverFee: 50000,
        rentalOption: "both",
        status: "ready",
        image: "/Zenix V Hybrid (1).png",
        description: "Toyota Innova Zenix Tipe V Hybrid sangat hemat bahan bakar dan suspensi nyaman."
    },
    {
        id: "7",
        carCode: "RCM-ZXG",
        brand: "Toyota",
        model: "Innova Zenix G Hybrid",
        year: "2022",
        category: "MPV",
        seats: 7,
        transmission: "Matic (AT)",
        fuel: "Bensin",
        luggage: "3 Koper",
        priceNormal: 850000,
        priceHoliday: 950000,
        driverFee: 50000,
        rentalOption: "both",
        status: "ready",
        image: "/Zenix G Hybrid (2).png",
        description: "Toyota Innova Zenix G Modern kabin lega, ac dingin, performa prima untuk perjalanan jauh."
    },
    {
        id: "8",
        carCode: "RCM-INVR",
        brand: "Toyota",
        model: "Innova Reborn",
        year: "2015",
        category: "MPV",
        seats: 7,
        transmission: "Matic (AT)",
        fuel: "Bensin",
        luggage: "3 Koper",
        priceNormal: 750000,
        priceHoliday: 850000,
        driverFee: 50000,
        rentalOption: "both",
        status: "ready",
        image: "/Innova Reborn (1).png",
        description: "Toyota Kijang Innova Reborn mobil keluarga terfavorit dengan kenyamanan legendaris."
    },
    {
        id: "9",
        carCode: "RCM-XPD",
        brand: "Mitsubishi",
        model: "Xpander",
        year: "2017",
        category: "MPV",
        seats: 7,
        transmission: "Manual",
        fuel: "Bensin",
        luggage: "3 Koper",
        priceNormal: 600000,
        priceHoliday: 700000,
        driverFee: 50000,
        rentalOption: "both",
        status: "ready",
        image: "/Xpander (3).png",
        description: "Mitsubishi Xpander MPV bergaya SUV modern, suspensi lembut dan kabin senyap."
    },
    {
        id: "10",
        carCode: "RCM-AVZ",
        brand: "Toyota",
        model: "Avanza",
        year: "2021",
        category: "MPV",
        seats: 7,
        transmission: "Manual",
        fuel: "Bensin",
        luggage: "3 Koper",
        priceNormal: 600000,
        priceHoliday: 700000,
        driverFee: 50000,
        rentalOption: "both",
        status: "ready",
        image: "/Avanza (1).png",
        description: "Toyota All New Avanza mobil sejuta umat yang lincah, irit, dan handal di perkotaan Makassar."
    }
];

export const EVENT_OPTIONS = [
    { value: "Wisata / Liburan", label: "🏖️ Wisata / Liburan Keluarga" },
    { value: "Acara Pernikahan (Wedding)", label: "💍 Acara Pernikahan / Iring-iringan" },
    { value: "Dinas Kantor / Bisnis", label: "💼 Kunjungan Bisnis / Perjalanan Dinas" },
    { value: "Antar Jemput Bandara", label: "✈️ Antar / Jemput Bandara" },
    { value: "Mudik / Pulang Kampung", label: "🏡 Mudik / Pulang Kampung" },
    { value: "Acara Keluarga / Hajatan", label: "👨‍👩‍👧‍👦 Acara Keluarga / Hajatan" },
    { value: "Lainnya", label: "📌 Keperluan Lainnya" }
];

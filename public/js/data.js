// Data awal armada mobil dan konfigurasi default owner
const DEFAULT_OWNER_CONFIG = {
    businessName: "Rent Car Makassar",
    tagline: "Sewa Mobil Terpercaya, Nyaman & Harga Transparan",
    description: "Penyedia jasa rental mobil profesional melayani sewa lepas kunci (berkendara sendiri) maupun dengan supir berpengalaman untuk keperluan wisata, dinas bisnis, pernikahan, mudik, dan perjalanan keluarga.",
    whatsappNumber: "6281234567890", // Ganti dengan nomor WhatsApp owner (awali dengan 62)
    phone: "0812-3456-7890",
    email: "kontak@garudarentcar.com",
    address: "Jl. Perintis Kemerdekaan No. 10, Makassar, Sulawesi Selatan",
    mapsUrl: "https://maps.google.com/?q=Jl.+Perintis+Kemerdekaan+No.+10,+Makassar,+Sulawesi+Selatan",
    operatingHours: "Buka 24 Jam Setiap Hari",
    socialMedia: {
        instagram: "@garudarentcar_id",
        facebook: "Garuda Rent Car Official",
        tiktok: "@garudarentcar"
    },
    isHolidayPricingActive: false,
    holidayNotes: "Tarif Musim Libur & Hari Besar Nasional (Peak Season)"
};

const DEFAULT_CARS = [];

const DEFAULT_REVIEWS = [
    {
        id: 1,
        name: "Alex Pratama",
        rating: 5,
        car_name: "Toyota Innova Zenix",
        comment: "Pelayanan Garuda Rent Car sangat memuaskan! Mobil Innova Zenix-nya sangat bersih, wangi, dan mesin halus. Driver juga ramah dan tepat waktu saat penjemputan di Bandara.",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        status: "approved",
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        name: "Sofia Lestari",
        rating: 5,
        car_name: "Honda HRV SE",
        comment: "Sewa lepas kunci di sini sangat praktis & cepat proses syaratnya. Mobil HRV matic kondisi mulus 100%. Pasti bakal langganan setiap kali kunjungan dinas!",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        status: "approved",
        created_at: new Date().toISOString()
    },
    {
        id: 3,
        name: "Daniel Kuncoro",
        rating: 5,
        car_name: "Toyota Fortuner GR",
        comment: "Pengalaman sewa Fortuner untuk acara pernikahan keluarga luar biasa mantap. Harga transparan tanpa biaya tersembunyi. Admin fast respon dan sangat membantu!",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
        status: "approved",
        created_at: new Date().toISOString()
    }
];

const EVENT_OPTIONS = [
    { value: "Wisata / Liburan", label: "🏖️ Wisata / Liburan Keluarga" },
    { value: "Acara Pernikahan (Wedding)", label: "💍 Acara Pernikahan / Iring-iringan" },
    { value: "Dinas Kantor / Bisnis", label: "💼 Kunjungan Bisnis / Perjalanan Dinas" },
    { value: "Antar Jemput Bandara", label: "✈️ Antar / Jemput Bandara" },
    { value: "Mudik / Pulang Kampung", label: "🏡 Mudik / Pulang Kampung" },
    { value: "Acara Keluarga / Hajatan", label: "👨‍👩‍👧‍👦 Acara Keluarga / Hajatan" },
    { value: "Lainnya", label: "✨ Keperluan Lainnya" }
];

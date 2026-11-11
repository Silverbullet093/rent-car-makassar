import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import os

def create_document(output_path):
    doc = docx.Document()

    # Page setup - 1 inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Color Palette Constants
    COLOR_PRIMARY = RGBColor(185, 28, 28)     # Crimson / Deep Red (#B91C1C)
    COLOR_SECONDARY = RGBColor(30, 41, 59)    # Dark Slate (#1E293B)
    COLOR_MUTED = RGBColor(100, 116, 139)     # Slate Gray (#64748B)
    COLOR_DARK = RGBColor(15, 23, 42)         # Very Dark Charcoal (#0F172A)
    HEX_PRIMARY = "B91C1C"
    HEX_HEADER_BG = "1E293B"
    HEX_LIGHT_BG = "F8FAFC"
    HEX_CALLOUT_BG = "FEF2F2"
    HEX_BORDER = "CBD5E1"

    # Helper: Set Cell Background
    def set_cell_shading(cell, color_hex):
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
        cell._tc.get_or_add_tcPr().append(shading)

    # Helper: Set Cell Margins (padding)
    def set_cell_padding(cell, top=120, bottom=120, left=180, right=180):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
        tcPr.append(tcMar)

    # Helper: Set Cell Borders
    def set_table_borders(table, border_color="CBD5E1"):
        tblPr = table._tbl.tblPr
        tblBorders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'<w:top w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>'
            f'<w:left w:val="none"/>'
            f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="{border_color}"/>'
            f'<w:right w:val="none"/>'
            f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>'
            f'<w:insideV w:val="none"/>'
            f'</w:tblBorders>'
        )
        tblPr.append(tblBorders)

    # Helper: Styled Headings
    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Arial"
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = COLOR_PRIMARY
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Arial"
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = COLOR_SECONDARY
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Arial"
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = COLOR_DARK
        return p

    def add_p(text, bold_prefix="", italic=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = "Arial"
            r_pre.font.size = Pt(10)
            r_pre.font.bold = True
            r_pre.font.color.rgb = COLOR_DARK
        r_text = p.add_run(text)
        r_text.font.name = "Arial"
        r_text.font.size = Pt(10)
        r_text.font.italic = italic
        r_text.font.color.rgb = COLOR_DARK
        return p

    def add_callout(text, title="POINT PENTING:"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_shading(cell, HEX_CALLOUT_BG)
        set_cell_padding(cell, top=140, bottom=140, left=200, right=180)
        
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:left w:val="single" w:sz="24" w:space="0" w:color="{HEX_PRIMARY}"/>'
            f'<w:top w:val="none"/>'
            f'<w:bottom w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(2)
        r1 = p.add_run(f"📌 {title}\n")
        r1.font.name = "Arial"
        r1.font.size = Pt(10)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_PRIMARY
        
        r2 = p.add_run(text)
        r2.font.name = "Arial"
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = COLOR_DARK
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # COVER / HEADER
    # -------------------------------------------------------------
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(36)
    title_p.paragraph_format.space_after = Pt(4)
    t_run = title_p.add_run("DOKUMENTASI SISTEM & ARSITEKTUR DATA")
    t_run.font.name = "Arial"
    t_run.font.size = Pt(22)
    t_run.font.bold = True
    t_run.font.color.rgb = COLOR_PRIMARY

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(16)
    s_run = sub_p.add_run("RPM Rent Car Makassar — Portal Reservasi & Dashboard Backoffice Admin\nPanduan Lengkap Struktur File, Siklus Input Data, Alur Database, dan Panel Admin")
    s_run.font.name = "Arial"
    s_run.font.size = Pt(12)
    s_run.font.color.rgb = COLOR_MUTED

    div = doc.add_paragraph()
    div.paragraph_format.space_after = Pt(24)
    div_run = div.add_run("━" * 55)
    div_run.font.color.rgb = COLOR_PRIMARY

    # Metadata Box
    meta_table = doc.add_table(rows=4, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Nama Proyek", "Rental Car Makassar (RPM Rent Car)"),
        ("Teknologi Utama", "Laravel 11, PHP 8.2+, MySQL / TiDB Cloud Serverless, Tailwind CSS, Vanilla JS"),
        ("Basis Database", "TiDB Cloud Serverless (MySQL Protocol Port 4000) & MySQL Local"),
        ("Tujuan Dokumen", "Penjelasan menyeluruh struktur file, logika alur data input-ke-database, dan asal data dashboard admin.")
    ]
    for i, (k, v) in enumerate(meta_data):
        c0 = meta_table.cell(i, 0)
        c1 = meta_table.cell(i, 1)
        set_cell_padding(c0, 80, 80, 120, 120)
        set_cell_padding(c1, 80, 80, 120, 120)
        set_cell_shading(c0, HEX_LIGHT_BG)
        set_cell_shading(c1, "FFFFFF")
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(k)
        r0.font.name = "Arial"
        r0.font.bold = True
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = COLOR_SECONDARY
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(v)
        r1.font.name = "Arial"
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = COLOR_DARK
        
    set_table_borders(meta_table)
    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 1: DAFTAR LENGKAP FILE YANG TELAH DIBUAT & FUNGSINYA
    # -------------------------------------------------------------
    add_h1("1. DAFTAR FILE PROYEK DAN FUNGSINYA")
    add_p("Aplikasi Rental Car Makassar dibangun menggunakan arsitektur Model-View-Controller (MVC) Laravel dipadukan dengan REST API modern. Di bawah ini adalah rincian lengkap setiap file yang dibuat dalam sistem beserta tugas dan fungsinya:")

    add_h2("A. File Backend & Controller (Logika Proses)")
    add_p("Semua controller berada di direktori ", bold_prefix="Lokasi: ")
    add_p("app/Http/Controllers/Api/", italic=True)

    c_table = doc.add_table(rows=1, cols=3)
    c_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = c_table.rows[0].cells
    hdr[0].text = "Nama File"
    hdr[1].text = "Model Terkait"
    hdr[2].text = "Fungsi & Tugas Utama"
    for i, title in enumerate(["Nama File", "Model Terkait", "Fungsi & Tugas Utama"]):
        set_cell_shading(hdr[i], HEX_HEADER_BG)
        set_cell_padding(hdr[i], 120, 120, 140, 140)
        p = hdr[i].paragraphs[0]
        p.runs[0].font.name = "Arial"
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(9.5)
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    controllers_info = [
        ("BookingController.php", "Booking", 
         "1. Mengelola seluruh transaksi pemesanan (Reservasi).\n"
         "2. Menolak booking bentrok jika armada sudah dikonfirmasi pada tanggal yang sama.\n"
         "3. Menghasilkan kode booking unik otomatis (contoh: RCM-XXXXXX).\n"
         "4. Menangani upload foto KTP dan bukti pembayaran (DP, pelunasan, denda).\n"
         "5. Menjalankan filter aktif, status konfirmasi, hingga penguncian status (hanya 'confirmed' yang boleh lanjut ke 'completed')."),
        
        ("CarController.php", "Car", 
         "1. Menyediakan katalog armada mobil untuk halaman pelanggan dan admin.\n"
         "2. Menangani penambahan armada baru (Create), edit spesifikasi (Update), dan hapus unit (Delete).\n"
         "3. Mengelola upload foto fisik mobil ke storage server.\n"
         "4. Pengaturan tarif sewa ganda (Harga Normal vs Harga Libur/Peak Season).\n"
         "5. Pengubahan status mobil cepat: Ready, In Use (Sedang Disewa), atau Maintenance."),
        
        ("OwnerConfigController.php", "OwnerConfig", 
         "1. Mengelola konfigurasi profil bisnis rental (Nama, Tagline, No WhatsApp, Alamat kantor, Google Maps).\n"
         "2. Mengatur rekening bank transfer resmi (BCA, Mandiri, dll) dan QRIS interaktif.\n"
         "3. Mengontrol saklar mode tarif libur (Peak Season switch) yang secara instan menaikkan tarif rental mobil ke harga libur di seluruh website."),
        
        ("ReviewController.php", "Review", 
         "1. Mengelola sistem testimoni & ulasan pelanggan.\n"
         "2. Filter publik: hanya menampilkan review dengan status 'approved'.\n"
         "3. Memberikan akses admin untuk menyetujui (Approve), menolak (Reject), atau menghapus ulasan spam.\n"
         "4. Menangani ulasan bergaya Instagram Story pada halaman depan.")
    ]

    for f_name, m_name, desc in controllers_info:
        row = c_table.add_row().cells
        set_cell_padding(row[0], 100, 100, 120, 120)
        set_cell_padding(row[1], 100, 100, 120, 120)
        set_cell_padding(row[2], 100, 100, 120, 120)
        set_cell_shading(row[0], HEX_LIGHT_BG)
        
        p0 = row[0].paragraphs[0]
        r0 = p0.add_run(f_name)
        r0.font.name = "Arial"
        r0.font.bold = True
        r0.font.size = Pt(9)
        
        p1 = row[1].paragraphs[0]
        r1 = p1.add_run(m_name)
        r1.font.name = "Arial"
        r1.font.size = Pt(9)
        
        p2 = row[2].paragraphs[0]
        r2 = p2.add_run(desc)
        r2.font.name = "Arial"
        r2.font.size = Pt(8.5)

    set_table_borders(c_table)

    # Models Table
    add_h2("B. File Eloquent Model (Representasi Tabel Database)")
    add_p("Semua model berada di direktori ", bold_prefix="Lokasi: ")
    add_p("app/Models/", italic=True)

    m_table = doc.add_table(rows=1, cols=3)
    m_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    m_hdr = m_table.rows[0].cells
    m_hdr[0].text = "Nama Model"
    m_hdr[1].text = "Tabel Database"
    m_hdr[2].text = "Peran & Relasi Data"
    for i in range(3):
        set_cell_shading(m_hdr[i], HEX_HEADER_BG)
        set_cell_padding(m_hdr[i], 120, 120, 140, 140)
        p = m_hdr[i].paragraphs[0]
        p.runs[0].font.name = "Arial"
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(9.5)
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    models_info = [
        ("Booking.php", "bookings", 
         "Menyimpan entitas reservasi. Memiliki relasi belongsTo(Car::class), sehingga setiap pemesanan otomatis mengenali data detail mobil yang disewa."),
        ("Car.php", "cars", 
         "Menyimpan master data mobil. Memiliki relasi hasMany(Booking::class), dapat melihat seluruh riwayat sewa kendaraan tersebut."),
        ("OwnerConfig.php", "owner_configs", 
         "Menyimpan pengaturan tunggal (single-row) profil rental, kontak WhatsApp, nomor rekening, QRIS, dan flag peak season."),
        ("Review.php", "reviews", 
         "Menyimpan ulasan, nama pelanggan, rating bintang (1-5), komentar, dan status moderasi.")
    ]

    for f_name, t_name, desc in models_info:
        row = m_table.add_row().cells
        set_cell_padding(row[0], 100, 100, 120, 120)
        set_cell_padding(row[1], 100, 100, 120, 120)
        set_cell_padding(row[2], 100, 100, 120, 120)
        set_cell_shading(row[0], HEX_LIGHT_BG)
        
        p0 = row[0].paragraphs[0]
        r0 = p0.add_run(f_name)
        r0.font.name = "Arial"
        r0.font.bold = True
        r0.font.size = Pt(9)
        
        p1 = row[1].paragraphs[0]
        r1 = p1.add_run(t_name)
        r1.font.name = "Arial"
        r1.font.size = Pt(9)
        
        p2 = row[2].paragraphs[0]
        r2 = p2.add_run(desc)
        r2.font.name = "Arial"
        r2.font.size = Pt(8.5)

    set_table_borders(m_table)

    # Frontend Views and Assets
    add_h2("C. File Frontend Views & Skrip Antarmuka")
    add_p("File antarmuka web dan skrip interaktif klien:")

    v_table = doc.add_table(rows=1, cols=3)
    v_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    v_hdr = v_table.rows[0].cells
    v_hdr[0].text = "Path & File"
    v_hdr[1].text = "Tipe"
    v_hdr[2].text = "Fungsi Utama"
    for i in range(3):
        set_cell_shading(v_hdr[i], HEX_HEADER_BG)
        set_cell_padding(v_hdr[i], 120, 120, 140, 140)
        p = v_hdr[i].paragraphs[0]
        p.runs[0].font.name = "Arial"
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(9.5)
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    views_info = [
        ("resources/views/index.blade.php", "Blade View", 
         "Halaman utama pengunjung. Menampilkan hero banner, filter armada mobil, modal formulir booking interaktif (perhitungan tarif dinamis, upload KTP, upload bukti bayar DP/Lunas), review story Instagram-style, serta tombol chat WhatsApp."),
        
        ("resources/views/admin.blade.php", "Blade View", 
         "Halaman dashboard Backoffice Admin. Berisi kartu statistik pendapatan, tabel manajemen booking, verifikasi pembayaran, upload bukti denda, form tambah/edit unit mobil, pengaturan nomor rekening/QRIS, dan moderasi ulasan."),
        
        ("public/js/app.js", "Client JS", 
         "Mesin logika sisi klien untuk halaman index. Mengambil data armada dari API, menghitung durasi sewa, biaya supir, diskon, validasi upload KTP (Base64), mengirim POST ke backend, dan memformat pesan WhatsApp otomatis."),
        
        ("public/js/admin.js", "Client JS", 
         "Mesin logika dashboard admin. Mengambil data dari seluruh endpoint API (/api/bookings, /api/cars, /api/owner-config, /api/reviews), melakukan filter tabel, cetak invoice kwitansi, popup zoom KTP & bukti transfer, dan simpan pembaruan status."),
        
        ("public/js/data.js", "Client JS", 
         "Menyediakan data cadangan (fallback offline data) untuk konfigurasi owner awal, armada default, dan review dummy jika koneksi jaringan atau database sempat terputus."),
        
        ("public/css/style.css & responsive-mobile.css", "CSS", 
         "Desain tata letak responsif bertema modern rental luxury (Merah RPM, Slate Dark), animasi transisi, kartu mobil, modal popup, dan optimasi tampilan smartphone.")
    ]

    for f_name, t_name, desc in views_info:
        row = v_table.add_row().cells
        set_cell_padding(row[0], 100, 100, 120, 120)
        set_cell_padding(row[1], 100, 100, 120, 120)
        set_cell_padding(row[2], 100, 100, 120, 120)
        set_cell_shading(row[0], HEX_LIGHT_BG)
        
        p0 = row[0].paragraphs[0]
        r0 = p0.add_run(f_name)
        r0.font.name = "Arial"
        r0.font.bold = True
        r0.font.size = Pt(8.5)
        
        p1 = row[1].paragraphs[0]
        r1 = p1.add_run(t_name)
        r1.font.name = "Arial"
        r1.font.size = Pt(8.5)
        
        p2 = row[2].paragraphs[0]
        r2 = p2.add_run(desc)
        r2.font.name = "Arial"
        r2.font.size = Pt(8.5)

    set_table_borders(v_table)

    # Routes Table
    add_h2("D. File Routing (Jalur Akses URL)")
    add_p("routes/web.php & routes/api.php", bold_prefix="File: ")
    add_p("routes/web.php mengatur URL halaman web (contoh '/' dan '/admin'), sedangkan routes/api.php mendaftarkan jalur komunikasi data JSON antara JavaScript di browser dengan Controller di server Laravel.")

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 2: JIKA KITA MENGINPUT INI, KODE MANA YANG BEKERJA?
    # -------------------------------------------------------------
    add_h1("2. JIKA KITA MENGINPUT DATA, KODE MANA YANG BEKERJA?")
    add_p("Untuk memahami cara kerja sistem secara mendalam, berikut adalah penelusuran langkah-demi-langkah (trace logic) untuk setiap skenario penginputan data:")

    add_h2("Skenario 1: Pelanggan Mengisi Formulir Pemesanan Mobil (Booking)")
    add_p("Ketika calon penyewa memilih mobil di halaman depan, membuka popup booking, memasukkan nama, nomor telepon, tanggal sewa, opsi supir, mengunggah KTP & bukti DP, lalu menekan tombol 'Pesan Sekarang / Kirim Pesanan':")

    booking_steps = [
        ("Langkah 1 (Browser)", "Pengguna menekan tombol submit pada formulir booking di resources/views/index.blade.php."),
        ("Langkah 2 (Logika JS)", "Fungsi submitBookingForm() di public/js/app.js langsung aktif:\n"
         "• Membaca seluruh isian form (nama, HP, tanggal sewa, jam, tipe sewa supir/lepas kunci).\n"
         "• Mengonversi file foto KTP dan Bukti Transfer menjadi format data aman (Base64 string).\n"
         "• Menghitung rincian total biaya sewa dan sisa tagihan."),
        ("Langkah 3 (Penyimpanan Sementara)", "app.js menyimpan objek booking ke LocalStorage browser agar transaksi langsung tampak instan tanpa jeda."),
        ("Langkah 4 (Pengiriman API)", "app.js mengeksekusi perintah fetch('/api/bookings', { method: 'POST', body: JSON.stringify(...) }). Data dikirimkan lewat protokol HTTP JSON menuju backend Laravel."),
        ("Langkah 5 (Penerimaan Route)", "routes/api.php menerima request POST /api/bookings dan mengarahkannya ke BookingController::class, method store()."),
        ("Langkah 6 (Validasi Controller)", "Method store() di BookingController.php melakukan pemeriksaan ketat:\n"
         "• Validasi ketersediaan mobil: Apakah mobil sedang berstatus 'confirmed' di tanggal tersebut? Jika ya, sistem melempar pesan bentrok (Conflict 422).\n"
         "• Otomatis membuat kode unik: RCM-XXXXXX menggunakan Str::random(6).\n"
         "• Menyusun catatan lokasi jemput & kota pengorder ke kolom notes."),
        ("Langkah 7 (Eksekusi Database)", "Controller memanggil perintah Eloquent: Booking::create($validated). Data secara resmi tersimpan ke tabel 'bookings' di database MySQL/TiDB Cloud!"),
        ("Langkah 8 (WhatsApp Redirect)", "Backend mengembalikan respons JSON { success: true, data: ... }. Skrip app.js kemudian memformat teks WhatsApp rapi dan membuka tab WhatsApp menuju nomor admin rental.")
    ]

    for title, desc in booking_steps:
        add_p(desc, bold_prefix=f"{title}: ")

    add_callout(
        "Sistem dilengkapi validasi anti-bentrok tanggal sewa otomatis di BookingController.php baris 89-106. Jika mobil A sudah dipesan tanggal 10-12, pengguna lain tidak akan bisa memesan mobil A pada rentang tanggal tersebut.",
        title="PROTEKSI ANTI DOUBLE BOOKING"
    )

    add_h2("Skenario 2: Pelanggan Menuliskan Ulasan / Testimoni")
    add_p("Ketika pelanggan mengisi form review di bagian bawah halaman:", bold_prefix="Alur Review: ")
    add_p("1. Form di index.blade.php mengaktifkan submitReviewForm() di public/js/app.js.\n"
          "2. Skrip mengirimkan POST /api/reviews berisi nama, bintang (1-5), mobil, dan komentar.\n"
          "3. Diterima oleh ReviewController.php@store.\n"
          "4. Data disimpan ke tabel 'reviews' dengan status default = 'pending' (belum tampil ke publik).\n"
          "5. Mengapa pending? Agar admin dapat memverifikasi terlebih dahulu di dashboard admin sebelum ditampilkan ke publik!")

    add_h2("Skenario 3: Admin Menambah Armada Mobil Baru")
    add_p("Ketika Admin membuka tab 'Armada Mobil' di /admin lalu mengklik 'Tambah Unit Mobil':", bold_prefix="Alur Mobil Baru: ")
    add_p("1. Modal form di admin.blade.php diisi (Merk, Model, Kapasitas, Transmisi, Harga Normal, Harga Libur, Foto).\n"
          "2. Tombol Simpan memanggil saveCar() di public/js/admin.js.\n"
          "3. Skrip membungkus data dalam objek FormData dan mengirimkan fetch('/api/cars', { method: 'POST', body: formData }).\n"
          "4. Diterima oleh CarController.php@store.\n"
          "5. CarController menyimpan file fisik gambar ke folder storage/app/public/cars dan mencatat URL-nya.\n"
          "6. Dijalankan query Car::create($validated) ke tabel 'cars'.\n"
          "7. Mobil baru langsung otomatis muncul di halaman admin dan katalog pemesanan pelanggan!")

    add_h2("Skenario 4: Admin Memverifikasi Pemesanan & Mengubah Status")
    add_p("Ketika Admin menerima transfer pembayaran dari pelanggan dan mengklik tombol 'Verifikasi' atau 'Selesai':", bold_prefix="Alur Ubah Status: ")
    add_p("1. Admin menekan tombol aksi pada tabel booking di admin.blade.php.\n"
          "2. Fungsi updateBookingStatus(id, newStatus) di public/js/admin.js berjalan.\n"
          "3. Skrip memanggil fetch(`/api/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) }).\n"
          "4. Diterima oleh BookingController.php@updateStatus.\n"
          "5. Controller mengunci integritas data: Booking yang sudah berstatus 'confirmed' (terverifikasi) tidak dapat sembarangan diubah ke pending/batal, melainkan hanya bisa diubah menjadi 'completed' (selesai).\n"
          "6. Perintah $booking->status = $validated['status']; $booking->save(); mengupdate baris di tabel 'bookings'.")

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 3: DATABASE MASUK LEWAT MANA?
    # -------------------------------------------------------------
    add_h1("3. DATABASE: LEWAT MANA DATA MASUK & DISIMPAN?")
    add_p("Sistem ini tidak menggunakan query SQL mentah yang rentan injeksi (seperti raw query mysqli), melainkan menggunakan teknologi modern Laravel Eloquent Object-Relational Mapping (ORM) yang terhubung ke server database cloud.")

    add_h2("A. Pintu Masuk Data ke Database")
    add_p("Data masuk melalui jalur standar REST API yang aman:", bold_prefix="Arsitektur Jalur: ")

    diagram_text = (
        "┌────────────────────────────┐\n"
        "│  1. Formulir Browser (UI)  │ ──> Pengguna menginput teks, angka, & file\n"
        "└─────────────┬──────────────┘\n"
        "              │ HTTP Request (JSON / FormData via fetch)\n"
        "              ▼\n"
        "┌────────────────────────────┐\n"
        "│ 2. Laravel Route (api.php) │ ──> Menyaring URL & Metode (POST/PUT/PATCH)\n"
        "└─────────────┬──────────────┘\n"
        "              │ Memanggil Method Controller\n"
        "              ▼\n"
        "┌────────────────────────────┐\n"
        "│ 3. Controller (Validation) │ ──> Memeriksa kelengkapan, tipe data, & anti-bentrok\n"
        "└─────────────┬──────────────┘\n"
        "              │ Mengirim Model Eloquent\n"
        "              ▼\n"
        "┌────────────────────────────┐\n"
        "│ 4. Eloquent Model          │ ──> Mengonversi objek PHP menjadi query SQL terproteksi\n"
        "└─────────────┬──────────────┘\n"
        "              │ PDO Connection Port 4000 (SSL Enkripsi)\n"
        "              ▼\n"
        "┌────────────────────────────┐\n"
        "│ 5. Database MySQL / TiDB   │ ──> Data tertulis permanen di tabel fisik server\n"
        "└────────────────────────────┘"
    )

    p_diag = doc.add_paragraph()
    p_diag.paragraph_format.space_before = Pt(6)
    p_diag.paragraph_format.space_after = Pt(8)
    r_diag = p_diag.add_run(diagram_text)
    r_diag.font.name = "Consolas"
    r_diag.font.size = Pt(8.5)
    r_diag.font.color.rgb = COLOR_SECONDARY

    add_h2("B. Konfigurasi Koneksi Database (.env)")
    add_p("Koneksi database diatur di dalam file .env pada baris ke-32 sampai 38:", bold_prefix="Pengaturan Koneksi: ")
    add_p("• Driver: MySQL (DB_CONNECTION=mysql)\n"
          "• Server Host: gateway01.ap-southeast-1.prod.aws.tidbcloud.com (TiDB Cloud Serverless Region AWS Singapura)\n"
          "• Port: 4000\n"
          "• Nama Database: db_rcm\n"
          "• Enkripsi: SSL Aktif (DB_SSL=true)\n"
          "Catatan: Konfigurasi ini menjamin database dapat diakses secara online dari mana saja dengan kecepatan tinggi dan keamanan cloud enterprise.")

    add_h2("C. Struktur Tabel-Tabel Utama di Database")
    add_p("Berikut adalah tabel fisik hasil eksekusi migrasi di database 'db_rcm':")

    # Table of DB Tables
    d_table = doc.add_table(rows=1, cols=3)
    d_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    d_hdr = d_table.rows[0].cells
    d_hdr[0].text = "Nama Tabel"
    d_hdr[1].text = "Kolom Kunci & Field Penting"
    d_hdr[2].text = "Deskripsi Data Tersimpan"
    for i in range(3):
        set_cell_shading(d_hdr[i], HEX_HEADER_BG)
        set_cell_padding(d_hdr[i], 120, 120, 140, 140)
        p = d_hdr[i].paragraphs[0]
        p.runs[0].font.name = "Arial"
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(9.5)
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    db_tables_info = [
        ("bookings", 
         "id, booking_code, car_id (Foreign Key), customer_name, customer_phone, start_date, end_date, start_time, end_time, with_driver, total_price, payment_type, payment_method, dp_amount, status, notes, ktp_image, payment_proof, payment_proof_settlement, penalty_amount, penalty_proof",
         "Menyimpan seluruh berkas transaksi sewa mobil, bukti identitas KTP (Base64), riwayat DP, bukti pelunasan sisa tagihan, serta denda keterlambatan jika ada."),
        
        ("cars", 
         "id, car_code, brand, model, year, category, seats, transmission, fuel, luggage, price_normal, price_holiday, driver_fee, status, image, description",
         "Menyimpan master armada kendaraan rental lengkap beserta foto, spesifikasi tempat duduk, jenis bensin, dan daftar harga harian."),
        
        ("owner_configs", 
         "id, business_name, tagline, description, whatsapp_number, phone, email, address, maps_url, operating_hours, instagram, facebook, tiktok, is_holiday_pricing_active, bank_name, bank_account_number, bank_account_holder, qris_image",
         "Menyimpan satu baris data konfigurasi toko, nomor rekening bank pembayaran, gambar barcode QRIS, dan status tarif hari libur nasional."),
        
        ("reviews", 
         "id, name, rating, car_name, comment, avatar, status",
         "Menyimpan ulasan kepuasan pelanggan dengan status moderasi 'pending', 'approved', atau 'rejected'.")
    ]

    for t_name, cols, desc in db_tables_info:
        row = d_table.add_row().cells
        set_cell_padding(row[0], 100, 100, 120, 120)
        set_cell_padding(row[1], 100, 100, 120, 120)
        set_cell_padding(row[2], 100, 100, 120, 120)
        set_cell_shading(row[0], HEX_LIGHT_BG)
        
        p0 = row[0].paragraphs[0]
        r0 = p0.add_run(t_name)
        r0.font.name = "Arial"
        r0.font.bold = True
        r0.font.size = Pt(9)
        
        p1 = row[1].paragraphs[0]
        r1 = p1.add_run(cols)
        r1.font.name = "Consolas"
        r1.font.size = Pt(8)
        
        p2 = row[2].paragraphs[0]
        r2 = p2.add_run(desc)
        r2.font.name = "Arial"
        r2.font.size = Pt(8.5)

    set_table_borders(d_table)

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 4: KENAPA DI ADMIN DATA INI DAPATNYA DARI MANA?
    # -------------------------------------------------------------
    add_h1("4. KENAPA DI ADMIN DATA INI DAPATNYA DARI MANA?")
    add_p("Pertanyaan mendasar: Ketika kita membuka dashboard Admin (/admin atau /adminrcm), bagaimana halaman admin bisa menampilkan daftar pemesanan, nama mobil yang disewa, foto KTP pelanggan, dan total omset? Dari mana datanya ditarik?")

    add_h2("A. Siklus Pengambilan Data Saat Halaman Admin Dibuka")
    add_p("Begitu admin membuka halaman di browser, file ", bold_prefix="Proses Otomatis: ")
    add_p("resources/views/admin.blade.php memuat skrip public/js/admin.js. Skrip ini secara otomatis mengeksekusi fungsi utama initAdmin():")

    add_p("1. Pengambilan Data Profil & Rekening:\n"
          "   Skrip menjalankan fetch('/api/owner-config').\n"
          "   Controller memanggil OwnerConfig::first() di database dan mengirimkan JSON profil bisnis, nomor WhatsApp, serta rekening bank.\n\n"
          "2. Pengambilan Data Master Mobil:\n"
          "   Skrip menjalankan fetch('/api/cars').\n"
          "   Controller memanggil Car::orderBy('id', 'asc')->get() sehingga seluruh armada mobil terbaca.\n\n"
          "3. Pengambilan Data Seluruh Transaksi Booking:\n"
          "   Skrip menjalankan fetch('/api/bookings').\n"
          "   Inilah inti utama data booking admin!")

    add_h2("B. Bagaimana Admin Bisa Mengetahui Mobil Apa yang Disewa?")
    add_p("Di dalam BookingController.php baris ke-18, terdapat kode sakti Laravel:", bold_prefix="Kunci Eager Loading: ")
    add_p("$query = Booking::with('car');", italic=True)
    add_p("Perintah with('car') memerintahkan Laravel untuk secara otomatis menggabungkan (relational join) tabel 'bookings' dengan tabel 'cars' berdasarkan 'car_id'. Akibatnya, data JSON yang diterima oleh admin.js tidak hanya berisi ID mobil, melainkan lengkap dengan merk mobil, model (misal: Toyota Innova Zenix Hybrid), plat kode, kapasitas kursi, hingga foto kendaraannya!")

    add_h2("C. Bagaimana Kartu Statistik (KPI) Dihitung?")
    add_p("Angka-angka pada kartu ringkasan dashboard (Total Pemesanan, Total Pendapatan, Mobil Siap, Mobil Disewa) dihitung secara real-time oleh fungsi renderDashboardStats() di public/js/admin.js:")
    add_p("• Total Booking: Dihitung dari jumlah total baris array bookings (state.bookings.length).\n"
          "• Total Pendapatan / Omset: Menjumlahkan nilai nominal total_price dari seluruh transaksi yang statusnya 'confirmed' (terverifikasi) atau 'completed' (selesai).\n"
          "• Armada Siap: Menghitung mobil di state.cars yang statusnya 'ready'.\n"
          "• Sedang Disewa: Menghitung mobil yang statusnya 'in_use' atau memiliki booking aktif.")

    add_h2("D. Mekanisme Sinkronisasi Cerdas (Database Online + LocalStorage Cache)")
    add_p("Sistem ini dibangun dengan tingkat keandalan tinggi (Fault-Tolerant Hybrid Architecture):")
    add_p("1. Prioritas Utama: Mengambil data real-time langsung dari database server MySQL/TiDB Cloud.\n"
          "2. Cadangan Otomatis: Saat pesanan baru masuk dari halaman pelanggan, data juga disimpan ke LocalStorage browser. Ketika admin membuka panel, admin.js menggabungkan data dari database dan data cache lokal sehingga:")
          
    add_p("• Pesanan pelanggan langsung tampil secara instan tanpa perlu menunggu waktu reload lama.\n"
          "• Jika terjadi kendala jaringan internet sesaat pada server database, admin tetap dapat melihat daftar pesanan tanpa error layar putih (blank screen).")

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 5: RINGKASAN & PANDUAN PENGEMBANGAN LANJUTAN
    # -------------------------------------------------------------
    add_h1("5. RANGKUMAN & PANDUAN PEMELIHARAAN SISTEM")
    add_p("Berikut adalah tabel ringkasan alur data end-to-end sebagai contekan cepat bagi pengembang atau administrator:")

    # Summary table
    s_table = doc.add_table(rows=1, cols=4)
    s_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    s_hdr = s_table.rows[0].cells
    s_hdr[0].text = "Fitur / Aksi"
    s_hdr[1].text = "Form / Trigger UI"
    s_hdr[2].text = "Endpoint API & Controller"
    s_hdr[3].text = "Tabel Database"
    for i in range(4):
        set_cell_shading(s_hdr[i], HEX_HEADER_BG)
        set_cell_padding(s_hdr[i], 120, 120, 140, 140)
        p = s_hdr[i].paragraphs[0]
        p.runs[0].font.name = "Arial"
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(9)
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    summary_rows = [
        ("Katalog Mobil Pengunjung", "index.blade.php (onload)", "GET /api/cars\nCarController@index", "cars"),
        ("Reservasi Booking Baru", "Modal Booking index.blade.php", "POST /api/bookings\nBookingController@store", "bookings"),
        ("Kirim Testimoni Pelanggan", "Form Ulasan index.blade.php", "POST /api/reviews\nReviewController@store", "reviews"),
        ("Tampil Data Booking Admin", "admin.blade.php (onload)", "GET /api/bookings\nBookingController@index", "bookings (join cars)"),
        ("Verifikasi Pembayaran Booking", "Tombol Aksi admin.blade.php", "PATCH /api/bookings/{id}/status\nBookingController@updateStatus", "bookings"),
        ("Input Pelunasan & Denda", "Modal Pembayaran admin.blade.php", "PUT /api/bookings/{id}\nBookingController@update", "bookings"),
        ("Tambah / Edit Armada Mobil", "Modal Mobil admin.blade.php", "POST/PUT /api/cars\nCarController@store/update", "cars"),
        ("Ubah Rekening & QRIS", "Tab Pengaturan admin.blade.php", "PUT /api/owner-config\nOwnerConfigController@update", "owner_configs"),
        ("Moderasi Testimoni (Approve)", "Tab Review admin.blade.php", "PATCH /api/reviews/{id}/status\nReviewController@updateStatus", "reviews")
    ]

    for feat, trig, api_ctrl, tbl in summary_rows:
        row = s_table.add_row().cells
        set_cell_padding(row[0], 100, 100, 120, 120)
        set_cell_padding(row[1], 100, 100, 120, 120)
        set_cell_padding(row[2], 100, 100, 120, 120)
        set_cell_padding(row[3], 100, 100, 120, 120)
        set_cell_shading(row[0], HEX_LIGHT_BG)
        
        p0 = row[0].paragraphs[0]
        r0 = p0.add_run(feat)
        r0.font.name = "Arial"
        r0.font.bold = True
        r0.font.size = Pt(8.5)
        
        p1 = row[1].paragraphs[0]
        r1 = p1.add_run(trig)
        r1.font.name = "Arial"
        r1.font.size = Pt(8)
        
        p2 = row[2].paragraphs[0]
        r2 = p2.add_run(api_ctrl)
        r2.font.name = "Consolas"
        r2.font.size = Pt(8)
        
        p3 = row[3].paragraphs[0]
        r3 = p3.add_run(tbl)
        r3.font.name = "Arial"
        r3.font.bold = True
        r3.font.size = Pt(8.5)

    set_table_borders(s_table)

    add_h2("Tips Pemeliharaan & Tips Troubleshooting:")
    add_p("1. Database Online: Pastikan parameter DB_HOST, DB_USERNAME, dan DB_PASSWORD di file .env tidak terhapus. Jika ingin beralih ke database lokal XAMPP/Laragon, cukup un-comment baris 24-29 di .env.\n"
          "2. Penyimpanan Bukti & KTP: File gambar KTP dan bukti pembayaran disimpan dalam format Base64 terenkripsi di kolom teks panjang (longText) tabel bookings. Hal ini memastikan gambar tidak akan hilang meskipun aplikasi dipindahkan hosting atau dideploy ke platform serverless seperti Vercel.\n"
          "3. Perubahan Status Pemesanan: Sesuai standar operasional rental, status 'confirmed' tidak boleh di-cancel langsung secara sembarangan di sistem tanpa persetujuan admin; sistem hanya mengizinkan perpindahan dari 'confirmed' ke 'completed'.")

    # Final sign-off
    f_p = doc.add_paragraph()
    f_p.paragraph_format.space_before = Pt(20)
    f_p.paragraph_format.space_after = Pt(4)
    r_f = f_p.add_run("Dokumen ini digenerate secara otomatis oleh Antigravity Developer Assistant untuk RPM Rent Car Makassar.")
    r_f.font.name = "Arial"
    r_f.font.italic = True
    r_f.font.size = Pt(8.5)
    r_f.font.color.rgb = COLOR_MUTED

    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == "__main__":
    out_dir = r"D:\Rental-Car-Makassar-main\RCM\rcm"
    out_file = os.path.join(out_dir, "Panduan_Lengkap_Arsitektur_dan_Alur_Data_RCM.docx")
    create_document(out_file)

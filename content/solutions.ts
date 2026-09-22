import { SolutionItem } from "@/types";

export const solutionsData: SolutionItem[] = [
  {
    id: "hospital-laboratory",
    slug: "hospital-laboratory",
    name: "Hospital Laboratory",
    tagline: "Ekosistem LIS Terintegrasi Penuh untuk Rumah Sakit Modern",
    targetAudience: "Rumah Sakit Umum, RSUD, RS Swasta & RS Khusus",
    shortDesc:
      "Solusi komprehensif yang menghubungkan laboratorium pusat, IGD, ICU, dan bangsal rawat inap secara real-time dengan bridging SIMRS/HIS & RME.",
    description:
      "Diagnova Hospital Laboratory mengintegrasikan seluruh titik layanan laboratorium rumah sakit ke dalam satu alur kerja terpadu. Mulai dari order dokter di SIMRS, pengambilan spesimen di bangsal/IGD dengan mobile barcode scanner, proses pemeriksaan instrumen otomatis di lab, hingga rilis hasil kritis secara instan ke layar dokter yang merawat.",
    iconName: "Building2",
    challenges: [
      "Duplikasi order pemeriksaan lab antara SIMRS dan LIS konvensional yang terpisah",
      "Keterlambatan penyampaian hasil lab kritis untuk pasien IGD dan ICU",
      "Tracing spesimen sulit saat sampel berpindah antar bangsal ke laboratorium",
      "Kebutuhan laporan audit yang rumit untuk standar akreditasi KARS / JCI",
    ],
    solutionHighlights: [
      "Bridging Dua Arah (Bidirectional) dengan SIMRS & Rekam Medis Elektronik (RME)",
      "Smart Panic Value Alert via notifikasi instan ke dokter penanggung jawab (DPJP)",
      "Mobile Specimen Collection Tracking dengan verifikasi identitas pasien di samping tempat tidur",
      "Dashboard Pemantauan TAT (Turnaround Time) Real-time per Departemen",
    ],
    includedModules: [
      "routine-hematology",
      "inventory-reagent",
      "blood-bank",
      "pathology",
      "microbiology",
    ],
  },
  {
    id: "clinical-laboratory",
    slug: "clinical-laboratory",
    name: "Clinical Laboratory & Lab Rujukan",
    tagline: "Efisiensi Operasional Skala Besar & Kecepatan Layanan Pasien Mandiri",
    targetAudience: "Laboratorium Klinik Mandiri & Laboratorium Rujukan Swasta",
    shortDesc:
      "Dirancang untuk menangani ribuan pasien rawat jalan harian, medical check-up (MCU), dan rujukan antar-klinik dengan portal hasil online.",
    description:
      "Diagnova Clinical Laboratory mengoptimalkan alur pelayanan mulai dari registrasi cepat pasien mandiri / MCU korporasi, pencetakan barcode otomatis, interfacing instrumen massal, hingga pengiriman hasil otomatis via WhatsApp / Email & Portal Pasien terenkripsi.",
    iconName: "Stethoscope",
    challenges: [
      "Antrean panjang pada jam sibuk pengambilan darah dan registrasi pasien",
      "Pengelolaan paket pemeriksaan Medical Check-Up (MCU) korporat yang rumit",
      "Biaya pencetakan kertas hasil lab dan lamanya proses distribusi laporan",
      "Pelacakan rujukan spesimen dari jejaring klinik mitra yang belum terstandardisasi",
    ],
    solutionHighlights: [
      "Modul MCU Massal dengan kalkulasi status kelayakan kerja otomatis",
      "Portal Hasil Online & Notifikasi WhatsApp / Email PDF Terenkripsi",
      "Interfacing B2B untuk integrasi penerimaan spesimen dari klinik rujukan",
      "Manajemen Billing & Tarif Fleksibel per Asuransi / Korporasi",
    ],
    includedModules: ["routine-hematology", "inventory-reagent"],
  },
  {
    id: "pathology",
    slug: "pathology",
    name: "Anatomical Pathology Center",
    tagline: "Presisi Diagnostik Jaringan & Digitalisasi Slide Mikroskopis",
    targetAudience: "Pusat Diagnostik Patologi Anatomi & Rumah Sakit Kanker",
    shortDesc:
      "Pencatatan pemeriksaan histopatologi, sitologi, dan FNAB dengan pelacakan spesimen ketat dari makroskopi hingga diagnosis akhir dokter Sp.PA.",
    description:
      "Solusi terdedikasi untuk laboratorium Patologi Anatomi yang membutuhkan tingkat ketertelusuran spesimen tertinggi. Mendukung integrasi Whole Slide Imaging (WSI), template pelaporan standar internasional (CAP / WHO), serta arsip digital blok dan slide jaringan.",
    iconName: "Microscope",
    challenges: [
      "Risiko fatal salah identifikasi atau tertukarnya kaset jaringan dan slide kaca",
      "Waktu pembuatan laporan deskriptif makroskopis dan mikroskopis yang panjang",
      "Kesulitan mengelola ribuan arsip fisik blok parafin dan slide kaca bertahun-tahun",
      "Keterbatasan akses foto mikroskopis untuk telaah second opinion",
    ],
    solutionHighlights: [
      "Barcode Tracking 2D pada level kaset jaringan, cetakan blok, dan slide kaca",
      "Structured Reporting Engine dengan integrasi terminologi ICD-O dan SNOMED CT",
      "Digital Pathology Workspace untuk anotasi dan tangkapan mikroskop beresolusi tinggi",
      "Manajemen Lokasi Rak Arsip Fisik Blok Parafin & Slide Berbasis Barcode",
    ],
    includedModules: ["pathology", "inventory-reagent"],
  },
  {
    id: "microbiology",
    slug: "microbiology",
    name: "Microbiology & Antibiotic Stewardship",
    tagline: "Pelacakan Kultur Presisi & Program Pengendalian Resistensi Antimikroba",
    targetAudience: "Laboratorium Mikrobiologi Rumah Sakit & Komite PPRA",
    shortDesc:
      "Pengelolaan kultur bakteri, uji kepekaan antibiotik (AST), peta kuman (antibiogram), dan deteksi dini bakteri resisten (MDRO).",
    description:
      "Diagnova Microbiology mengotomasi pencatatan hasil inkubasi media kultur, pembacaan zona hambat / MIC, serta interpretasi standar CLSI/EUCAST. Terintegrasi langsung dengan mesin otomatis seperti VITEK dan BACTEC untuk menyediakan laporan surveilans infeksi nosokomial secara real-time.",
    iconName: "FlaskConical",
    challenges: [
      "Waktu kultur bertahap yang memerlukan pemantauan inkubasi berhari-hari",
      "Kompleksitas interpretasi pedoman antimikroba (CLSI/EUCAST) yang terus diperbarui",
      "Penyusunan laporan Antibiogram RS yang memakan waktu jika dilakukan manual",
      "Keterlambatan peringatan adanya kuman multiresisten di ruang rawat intensif",
    ],
    solutionHighlights: [
      "Integrasi Mesin Otomasi Identifikasi Kuman & Ast Analyzer",
      "Kalkulasi Antibiogram Kumulatif Otomatis per Periode / Ruangan",
      "Alert MDRO (MRSA, ESBL, Carbapenemase) Instan ke Tim PPI (Pencegahan & Pengendalian Infeksi)",
      "Pohon Keputusan Rekomendasi Antibiotik Definitif untuk Dokter Klinisi",
    ],
    includedModules: ["microbiology", "inventory-reagent"],
  },
  {
    id: "blood-bank",
    slug: "blood-bank",
    name: "Blood Bank & Transfusion Safety",
    tagline: "Keamanan Transfusi Maksimal & Manajemen Rantai Pasok Darah",
    targetAudience: "Bank Darah Rumah Sakit (BDRS) & Unit Transfusi Darah (UTD)",
    shortDesc:
      "Kontrol ketat persediaan kantong darah, validasi uji silang serasi (crossmatch), dan pemantauan rantai dingin untuk keselamatan pasien.",
    description:
      "Solusi Bank Darah Diagnova mengawasi setiap siklus hidup kantong darah, mulai dari penerimaan dari PMI/UTD, penyimpanan pada cold storage terstandar, uji kompatibilitas serologi, hingga serah terima ke perawat ruang rawat.",
    iconName: "HeartPulse",
    challenges: [
      "Risiko inkompatibilitas transfusi akibat kesalahan verifikasi identitas pasien/darah",
      "Tingginya angka darah kedaluwarsa karena manajemen stok First-Expired-First-Out (FEFO) kurang ketat",
      "Kurangnya pencatatan digital rekam jejak suhu penyimpanan darah",
      "Kebutuhan respon cepat saat kondisi darurat kebutuhan darah masif (MTP)",
    ],
    solutionHighlights: [
      "Validasi Ganda (Dual-Verification) Barcode saat Crossmatching & Penyerahan Darah",
      "Manajemen Stok FEFO Otomatis dengan Peringatan Kedaluwarsa Dini",
      "Protokol Transfusi Masif Cepat (Emergency Massive Transfusion Protocol)",
      "Pencatatan Riwayat Reaksi Transfusi & Hemovigilance Terpusat",
    ],
    includedModules: ["blood-bank", "inventory-reagent"],
  },
  {
    id: "nova-ai",
    slug: "nova-ai",
    name: "Nova AI - Laboratory Intelligence",
    tagline: "AI Copilot Cerdas untuk Meringkas, Mendeteksi Anomali, dan Membantu Dokter",
    targetAudience: "Dokter Patologi Klinik, Dokter Spesialis, dan Manajemen Mutu Lab",
    shortDesc:
      "Kecerdasan buatan terkurasi yang menerjemahkan data lab kompleks menjadi insight ringkas yang dapat ditindaklanjuti, dengan kendali keputusan 100% di tangan dokter.",
    description:
      "Nova AI berfungsi sebagai asisten cerdas bagi dokter dan staf laboratorium. Nova AI membaca riwayat hasil lab sebelumnya, mendeteksi pola anomali delta check, merangkum hasil multi-parameter ke dalam bahasa klinis yang jelas, dan memberikan alert dini tanpa menggantikan penilaian medis profesional dokter.",
    iconName: "Sparkles",
    challenges: [
      "Dokter kebanjiran ratusan lembar hasil lab berformat angka tanpa rangkuman tren",
      "Anomali hasil antar-kunjungan (delta check) yang terlewat karena keterbatasan waktu",
      "Pasien kesulitan memahami istilah laboratorium tanpa penjelasan dokter",
    ],
    solutionHighlights: [
      "Automatic Lab Result Summarization dalam bahasa medis ringkas & bahasa awam",
      "Intelligent Delta Check & Trend Anomaly Detection",
      "Natural Language Query untuk pencarian data laboratorium historis",
      "Medical Disclaimer Kepatuhan: Keputusan 100% di tangan Dokter",
    ],
    includedModules: ["routine-hematology", "pathology", "microbiology"],
  },
];

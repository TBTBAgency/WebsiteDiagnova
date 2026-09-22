import { ModuleItem } from "@/types";

export const modulesData: ModuleItem[] = [
  {
    id: "routine-hematology",
    slug: "routine-hematology",
    name: "Routine & Hematology",
    tagline: "Kecepatan Tinggi & Akurasi Tanpa Kompromi untuk Volume Harian",
    shortDesc:
      "Pemeriksaan darah harian, urin, dan kimia klinik bervolume tinggi dengan workflow berkecepatan tinggi dan interfacing direct-analyzer.",
    description:
      "Modul Routine & Hematology Diagnova dirancang khusus untuk menangani ribuan sampel per hari dengan kecepatan dan akurasi maksimal. Terhubung langsung secara bidireksional dengan analyzer hematologi dan kimia klinik terkemuka, modul ini mengeliminasi entri data manual, mempercepat turnaround time (TAT) hingga 70%, dan mengaktifkan validasi delta check otomatis.",
    iconName: "Activity",
    targetDepartment: "Laboratorium Patologi Klinik & Hematologi Rutin",
    keyFeatures: [
      "Bidirectional Analyzer Interfacing (HL7 / ASTM)",
      "Auto-Verification dengan Rule Engine Kustom",
      "Real-time Delta Check & Critical Alert Notification",
      "Barcode Tracking di Setiap Tabung Sampel",
      "Worklist Management Dinamis per Instrumen",
      "Quality Control (Levey-Jennings Chart & Westgard Rules)",
    ],
    clinicalBenefits: [
      "Memangkas Turnaround Time (TAT) hasil pemeriksaan rutin hingga 70%",
      "Menghilangkan 99.8% risiko human error akibat salah ketik nilai lab",
      "Peringatan dini nilai kritis (Panic Values) langsung ke dokter pengirim",
      "Kepatuhan audit standar akreditasi rumah sakit (KARS & JCI)",
    ],
  },
  {
    id: "blood-bank",
    slug: "blood-bank",
    name: "Blood Bank Management",
    tagline: "Transfusi Aman dengan Kontrol Ketat Rantai Dingin & Crossmatch",
    shortDesc:
      "Pengelolaan ketersediaan kantong darah, uji silang serasi (crossmatch), masa kedaluwarsa, dan distribusi kantong darah secara aman & terlacak.",
    description:
      "Modul Bank Darah Diagnova mengintegrasikan seluruh tahapan rantai pasok darah dari donor hingga transfusi ke pasien. Dilengkapi validasi barcode ganda untuk mencegah insiden inkompatibilitas ABO/Rh, pemantauan masa simpan kantong darah secara real-time, dan dokumentasi digital hasil uji saring infeksi menular lewat transfusi darah (IMLTD).",
    iconName: "HeartPulse",
    targetDepartment: "Unit Transfusi Darah (UTD) & Bank Darah Rumah Sakit (BDRS)",
    keyFeatures: [
      "Pelacakan Digital Kantong Darah Berbasis Barcode/ISBT 128",
      "Pencatatan & Verifikasi Uji Silang Serasi (Crossmatching)",
      "Alert Kedaluwarsa Otomatis (Early Warning Expiry)",
      "Manajemen Stok Darah Lengkap (PRC, TC, FFP, Cryoprecipitate)",
      "Integrasi Validasi Golongan Darah Pasien dari SIMRS",
      "Digital Release Form & Rekam Jejak Suhu Rantai Dingin",
    ],
    clinicalBenefits: [
      "Zero-tolerance terhadap kesalahan pemberian kantong darah ke pasien",
      "Mengurangi angka darah terbuang (wastage) akibat kedaluwarsa hingga 45%",
      "Waktu penyiapan darah darurat lebih cepat dan terstruktur",
      "Audit trail 100% transparan untuk setiap tetes darah yang dikeluarkan",
    ],
  },
  {
    id: "inventory-reagent",
    slug: "inventory-reagent",
    name: "Inventory & Reagent",
    tagline: "Stok Reagen Selalu Terpantau, Zero Stock-Out di Tengah Shift",
    shortDesc:
      "Pemantauan stok reagen medis laboratorium secara real-time guna mencegah kehabisan bahan habis pakai dan efisiensi biaya operasional.",
    description:
      "Modul Inventory & Reagent melacak penggunaan reagen, kalibrator, dan kontrol secara otomatis seiring dengan tes yang dijalankan oleh instrumen analyzer. Menghitung estimasi sisa tes (test count estimation), memberikan alarm stok menipis (low-stock alert), dan mengelola nomor lot serta tanggal kedaluwarsa secara presisi.",
    iconName: "PackageCheck",
    targetDepartment: "Logistik Laboratorium & Bagian Pengadaan Medis",
    keyFeatures: [
      "Kalkulasi Penggunaan Reagen Otomatis per Pemeriksaan",
      "Manajemen Nomor Lot, Tanggal Buka (On-board Stability), dan Kedaluwarsa",
      "Notifikasi Otomatis Stok Minimum (Safety Stock Threshold)",
      "Purchase Order Suggestion Berdasarkan Laju Pemakaian Historis",
      "Pelaporan Biaya per Tes (Cost-per-Test Analytics)",
      "Multi-Gudang: Laboratorium Utama, Satelit, dan Lemari Reagen",
    ],
    clinicalBenefits: [
      "Mencegah penundaan pemeriksaan akibat reagen habis tiba-tiba",
      "Menghindari penggunaan reagen yang telah kedaluwarsa atau degraded",
      "Efisiensi belanja reagen dan penghematan anggaran lab hingga 20%",
      "Kesiapan data inventaris real-time saat audit BPOM / ISO 15189",
    ],
  },
  {
    id: "pathology",
    slug: "pathology",
    name: "Anatomical Pathology",
    tagline: "Pelacakan Spesimen Jaringan Ketat dari Makroskopi hingga Hasil Akhir",
    shortDesc:
      "Pencatatan pemeriksaan jaringan tubuh dan sitologi berbasis mikroskopis dengan tracking spesimen ketat dan integrasi digital imaging.",
    description:
      "Modul Patologi Anatomi Diagnova menyederhanakan alur kerja histopatologi, sitologi, dan biopsi yang kompleks. Melacak setiap kaset jaringan, blok parafin, dan slide kaca dengan barcode unik. Memungkinkan dokter spesialis patologi anatomi menyusun laporan terstruktur dengan template diagnosis standar (ICD-O / Bethesda System) dan melampirkan foto mikroskopis beresolusi tinggi.",
    iconName: "Microscope",
    targetDepartment: "Instalasi Patologi Anatomi & Sitologi",
    keyFeatures: [
      "Barcode Tracking pada Level Kaset Jaringan dan Slide Kaca",
      "Template Laporan Terstruktur (Histopatologi, FNAB, Pap Smear, Frozen Section)",
      "Integrasi Kamera Mikroskop & Digital Pathology WSI",
      "Worklist Dokter Spesialis Patologi Anatomi (Sp.PA)",
      "Manajemen Arsip Blok Parafin dan Slide Jangka Panjang",
      "Sinkronisasi Diagnosa Kanker ke Rekam Medis Pasien (RME)",
    ],
    clinicalBenefits: [
      "Mencegah tertukarnya spesimen jaringan antar pasien",
      "Standarisasi pelaporan patologi sesuai pedoman nasional dan internasional",
      "Akses cepat ke riwayat biopsi pasien sebelumnya untuk perbandingan",
      "Kolaborasi second-opinion antar dokter patolog secara digital",
    ],
  },
  {
    id: "microbiology",
    slug: "microbiology",
    name: "Microbiology & Antibiotic Stewardship",
    tagline: "Kultur Bakteri, Uji Resistensi, dan Terapi Antibiotik Rasional",
    shortDesc:
      "Identifikasi kuman, kultur bakteri, dan uji sensitivitas antibiotik untuk membantu dokter memberikan terapi medis yang tepat sasaran.",
    description:
      "Modul Mikrobiologi Diagnova mengelola proses inkubasi kultur bakteri, jamur, serta uji kepekaan antibiotik (Antimicrobial Susceptibility Testing / AST). Menyediakan grafik peta kuman (Antibiogram) berkala untuk mendukung Program Pengendalian Resistensi Antimikroba (PPRA) di rumah sakit dan mempercepat rekomendasi antibiotik rasional.",
    iconName: "FlaskConical",
    targetDepartment: "Laboratorium Mikrobiologi Klinik & Tim PPRA Rumah Sakit",
    keyFeatures: [
      "Pelacakan Masa Inkubasi Kultur dan Status Pertumbuhan Koloni",
      "Integrasi Mesin Otomasi Identifikasi Kuman (VITEK, Phoenix, BD BACTEC)",
      "Pencatatan Zona Hambat & Interpretasi CLSI / EUCAST Otomatis",
      "Pembangkitan Antibiogram Kumulatif Berkala",
      "Alert Bakteri Multiresisten (MRSA, ESBL, CRE, VRE) Real-time",
      "Rekomendasi Terapi Antibiotik Berdasarkan Pola Sensitivitas",
    ],
    clinicalBenefits: [
      "Mendukung keselamatan pasien dengan panduan terapi antibiotik definitif",
      "Memenuhi indikator wajib PPRA dan Akreditasi Rumah Sakit",
      "Deteksi dini wabah nosokomial infeksi resisten di ruang rawat",
      "Mengurangi biaya dan durasi rawat inap (LOS) pasien infeksi",
    ],
  },
];

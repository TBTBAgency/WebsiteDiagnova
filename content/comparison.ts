export interface ComparisonItem {
  id: number;
  number: string;
  conventional: {
    title: string;
    description: string;
  };
  diagnova: {
    title: string;
    description: string;
  };
  impactMetric: string;
}

export interface ComparisonSectionContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  conventionalBadge: string;
  diagnovaBadge: string;
  items: ComparisonItem[];
}

export const comparisonContentID: ComparisonSectionContent = {
  sectionBadge: "Perbandingan",
  sectionTitle: "Mengapa Memilih Diagnova?",
  sectionSubtitle:
    "Perbandingan komprehensif antara keterbatasan Sistem Informasi Laboratorium (LIS) konvensional dengan keunggulan ekosistem cerdas Diagnova.",
  conventionalBadge: "6 Keterbatasan LIS Konvensional",
  diagnovaBadge: "6 Keunggulan Diagnova LIS",
  items: [
    {
      id: 1,
      number: "01",
      conventional: {
        title: "Integrasi Terbatas & Terisolasi",
        description:
          "Terisolasi dari SIMRS dan RME, memicu duplikasi entri data pasien dan meningkatkan risiko kesalahan identifikasi spesimen.",
      },
      diagnova: {
        title: "Integrasi Asli Dua Arah",
        description:
          "Pertukaran data otomatis dua arah dengan SIMRS, RME, dan terhubung langsung secara resmi ke SATUSEHAT Kemenkes RI.",
      },
      impactMetric: "Nol Duplikasi Data",
    },
    {
      id: 2,
      number: "02",
      conventional: {
        title: "Ketergantungan Input Manual",
        description:
          "Proses registrasi dan pengetikan angka hasil laboratorium secara manual memperlambat Turnaround Time (TAT) dan rawan salah ketik.",
      },
      diagnova: {
        title: "Otomatisasi Penuh & Kode Batang",
        description:
          "Koneksi langsung dua arah ke instrumen laboratorium dan validasi otomatis memangkas waktu tunggu hasil (TAT) hingga 70%.",
      },
      impactMetric: "TAT Turun 70%",
    },
    {
      id: 3,
      number: "03",
      conventional: {
        title: "Infrastruktur & Jaringan Rentan",
        description:
          "Koneksi alat analisis ke server sering terputus, menyebabkan gangguan operasional dan risiko hilangnya data hasil pemeriksaan.",
      },
      diagnova: {
        title: "Gerbang Pintar Berketahanan Tinggi",
        description:
          "Mendukung protokol HL7 dan ASTM dengan mode penyimpanan cadangan luring (offline buffer), menjamin keandalan data dan ketersediaan 99.9%.",
      },
      impactMetric: "Ketersediaan 99.9%",
    },
    {
      id: 4,
      number: "04",
      conventional: {
        title: "Dukungan Teknis Lambat & Rumit",
        description:
          "Respons bantuan teknis lambat saat terjadi kendala alat, serta antarmuka usang yang membingungkan bagi staf laboratorium baru.",
      },
      diagnova: {
        title: "Layanan Siaga 24/7 & UI Modern",
        description:
          "Pendampingan teknis responsif setiap saat dengan antarmuka modern yang mudah dipelajari dan dikuasai oleh analis laboratorium.",
      },
      impactMetric: "Dukungan Khusus 24/7",
    },
    {
      id: 5,
      number: "05",
      conventional: {
        title: "Jejak Audit & Pelaporan Minim",
        description:
          "Riwayat perubahan hasil medis tidak tercatat secara terperinci, menyulitkan proses akreditasi dan verifikasi kepatuhan klinis.",
      },
      diagnova: {
        title: "Jejak Audit Digital Menyeluruh",
        description:
          "Rekam jejak digital transparan untuk setiap riwayat sampel, persetujuan dokter penanggung jawab, dan status instrumen.",
      },
      impactMetric: "100% Terlacak Transparan",
    },
    {
      id: 6,
      number: "06",
      conventional: {
        title: "Biaya Investasi Awal Tinggi & Kaku",
        description:
          "Instalasi server awal yang sangat mahal dengan kontrak kaku dan biaya lisensi per modul yang membebani anggaran operasional.",
      },
      diagnova: {
        title: "Skema Fleksibel & Kompatibilitas Luas",
        description:
          "Model berlangganan efisien tanpa keharusan investasi server fisik yang mahal, kompatibel dengan 500+ instrumen medis.",
      },
      impactMetric: "Mendukung 500+ Alat Lab",
    },
  ],
};

export const comparisonContentEN: ComparisonSectionContent = {
  sectionBadge: "Comparison",
  sectionTitle: "Why Choose Diagnova?",
  sectionSubtitle:
    "A comprehensive comparison between conventional Laboratory Information System limitations and Diagnova's intelligent laboratory ecosystem.",
  conventionalBadge: "6 Conventional LIS Drawbacks",
  diagnovaBadge: "6 Diagnova Key Advantages",
  items: [
    {
      id: 1,
      number: "01",
      conventional: {
        title: "Isolated & Limited Integration",
        description:
          "Siloed from Hospital Information Systems (HIS/EMR), causing repetitive patient data retyping and specimen mix-up risks.",
      },
      diagnova: {
        title: "Seamless Native Two-Way Integration",
        description:
          "Automated bidirectional bridging with HIS, EMR, and fully integrated with the Ministry of Health SATUSEHAT ecosystem.",
      },
      impactMetric: "Zero Data Duplication",
    },
    {
      id: 2,
      number: "02",
      conventional: {
        title: "Heavy Reliance on Manual Entry",
        description:
          "Manual registration and manual result typing slow down Turnaround Time (TAT) and elevate the risk of human transcription errors.",
      },
      diagnova: {
        title: "100% Automation & Barcode Intelligence",
        description:
          "Direct bidirectional analyzer interfacing and automated verification algorithms cut Turnaround Time (TAT) by up to 70%.",
      },
      impactMetric: "TAT -70%",
    },
    {
      id: 3,
      number: "03",
      conventional: {
        title: "Fragile Infrastructure & Frequent Drops",
        description:
          "Analyzer-to-server communication drops frequently, causing operational bottlenecks and potential loss of diagnostic records.",
      },
      diagnova: {
        title: "Resilient Smart Edge Gateway",
        description:
          "Native HL7/ASTM protocol support with an Offline-Buffer Edge Mode, ensuring continuous data integrity and 99.9% uptime.",
      },
      impactMetric: "99.9% Uptime",
    },
    {
      id: 4,
      number: "04",
      conventional: {
        title: "Slow Technical Support & Complex UX",
        description:
          "Sluggish vendor resolution times during critical instrument downtime, and outdated interfaces that confuse lab technicians.",
      },
      diagnova: {
        title: "Dedicated 24/7 SLA & Intuitive Interface",
        description:
          "Round-the-clock specialized clinical support paired with an intuitive modern UX that laboratory technicians master in hours.",
      },
      impactMetric: "24/7 Dedicated Support",
    },
    {
      id: 5,
      number: "05",
      conventional: {
        title: "Minimal Audit Trail & Loose Tracking",
        description:
          "Incomplete medical revision histories and weak sample tracking that compromise laboratory accreditation and clinical governance.",
      },
      diagnova: {
        title: "Comprehensive Digital Audit Trail",
        description:
          "Tamper-proof, immutable digital audit trails tracking every specimen touchpoint, doctor validation, and calibration status.",
      },
      impactMetric: "100% Traceable",
    },
    {
      id: 6,
      number: "06",
      conventional: {
        title: "High Upfront CapEx & Rigid Lock-In",
        description:
          "Exorbitant initial server licensing costs, inflexible multi-year contracts, and refusal to support legacy laboratory equipment.",
      },
      diagnova: {
        title: "Flexible SaaS Model & Universal Compatibility",
        description:
          "Predictable, cost-effective cloud model with no heavy server overhead, universally compatible with over 500+ clinical analyzers.",
      },
      impactMetric: "500+ Instruments Ready",
    },
  ],
};

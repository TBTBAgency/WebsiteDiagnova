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
  sectionBadge: "Perbandingan LIS",
  sectionTitle: "Mengapa Memilih Diagnova?",
  sectionSubtitle:
    "Bandingkan hambatan LIS konvensional dengan lonjakan efisiensi dan akurasi klinis bersama ekosistem cerdas Diagnova.",
  conventionalBadge: "6 Keterbatasan LIS Konvensional",
  diagnovaBadge: "6 Keunggulan Ekosistem Diagnova",
  items: [
    {
      id: 1,
      number: "01",
      conventional: {
        title: "Silo & Terisolasi dari SIMRS",
        description:
          "Entri ganda berulang memicu salah identifikasi spesimen dan membuang waktu klinis.",
      },
      diagnova: {
        title: "Bridging Instan Dua Arah",
        description:
          "Sinkronisasi otomatis dengan SIMRS, RME, dan terhubung resmi ke SATUSEHAT Kemenkes tanpa ketik ulang.",
      },
      impactMetric: "0% Duplikasi",
    },
    {
      id: 2,
      number: "02",
      conventional: {
        title: "Ketergantungan Input Manual",
        description:
          "Pengetikan angka hasil secara manual lambat dan memperbesar risiko salah transkripsi.",
      },
      diagnova: {
        title: "Otomasi Interfacing Analyzer",
        description:
          "Koneksi instrumen langsung dan verifikasi otomatis memangkas Turnaround Time (TAT) hingga 70%.",
      },
      impactMetric: "TAT Turun 70%",
    },
    {
      id: 3,
      number: "03",
      conventional: {
        title: "Koneksi Alat Sering Terputus",
        description:
          "Komunikasi alat serial rentan drop, memicu antrean sampel dan risiko data hilang.",
      },
      diagnova: {
        title: "Smart Gateway Berketahanan 99.9%",
        description:
          "Protokol HL7/ASTM dengan buffer luring (offline buffer), data tetap aman saat jaringan rumah sakit terganggu.",
      },
      impactMetric: "Uptime 99.9%",
    },
    {
      id: 4,
      number: "04",
      conventional: {
        title: "Deteksi Nilai Kritis Pasif",
        description:
          "Hasil abnormal lambat disadari dokter karena ketiadaan notifikasi otomatis seketika.",
      },
      diagnova: {
        title: "Alert Real-Time & Asisten Nova AI",
        description:
          "Peringatan dini nilai kritis dan delta check instan, membantu dokter merespons kegawatdaruratan lebih cepat.",
      },
      impactMetric: "Alert < 1 Detik",
    },
    {
      id: 5,
      number: "05",
      conventional: {
        title: "Jejak Audit Lemah & Rawan Celah",
        description:
          "Riwayat koreksi tidak terlacak rapi, menyulitkan akreditasi KARS dan ISO 15189.",
      },
      diagnova: {
        title: "Rekam Jejak Digital Terenkripsi",
        description:
          "Pencatatan riwayat setiap sampel dan validasi dokter 100% transparan, siap audit kepatuhan klinis kapan saja.",
      },
      impactMetric: "100% Siap Audit",
    },
    {
      id: 6,
      number: "06",
      conventional: {
        title: "Investasi Server Mahal & Terkunci",
        description:
          "Biaya server awal tinggi, kontrak tahunan kaku, dan menolak integrasi alat lab lama.",
      },
      diagnova: {
        title: "Model Cloud Fleksibel & 500+ Alat",
        description:
          "Bebas beban investasi server fisik, langsung kompatibel dengan lebih dari 500 instrumen medis rumah sakit.",
      },
      impactMetric: "500+ Alat Didukung",
    },
  ],
};

export const comparisonContentEN: ComparisonSectionContent = {
  sectionBadge: "LIS Comparison",
  sectionTitle: "Why Choose Diagnova?",
  sectionSubtitle:
    "See how Diagnova replaces conventional LIS bottlenecks with unprecedented clinical turnaround speed and precision.",
  conventionalBadge: "6 Conventional LIS Drawbacks",
  diagnovaBadge: "6 Diagnova Key Advantages",
  items: [
    {
      id: 1,
      number: "01",
      conventional: {
        title: "Siloed & Disconnected from EMR",
        description:
          "Repetitive manual retyping causes patient mix-ups and wastes critical staff hours.",
      },
      diagnova: {
        title: "Instant Bidirectional Bridging",
        description:
          "Zero-latency automated synchronization with HIS, EMR, and national health record systems.",
      },
      impactMetric: "Zero Duplication",
    },
    {
      id: 2,
      number: "02",
      conventional: {
        title: "Heavy Reliance on Manual Entry",
        description:
          "Manual result transcription slows turnaround times and heightens diagnostic error risks.",
      },
      diagnova: {
        title: "Full Analyzer Interfacing",
        description:
          "Direct bidirectional analyzer interfacing and automated verification algorithms slash TAT by up to 70%.",
      },
      impactMetric: "TAT -70%",
    },
    {
      id: 3,
      number: "03",
      conventional: {
        title: "Frequent Analyzer Disconnections",
        description:
          "Fragile serial links drop unexpectedly, causing specimen backlogs and diagnostic data loss.",
      },
      diagnova: {
        title: "Resilient 99.9% Smart Gateway",
        description:
          "Native HL7/ASTM protocols with offline buffering safeguard specimen records during network disruptions.",
      },
      impactMetric: "99.9% Uptime",
    },
    {
      id: 4,
      number: "04",
      conventional: {
        title: "Passive Critical Value Detection",
        description:
          "Abnormal values get buried in paper logs without urgent notifications for attending physicians.",
      },
      diagnova: {
        title: "Instant Alerts & Nova AI Insights",
        description:
          "Real-time critical value push alerts and automated delta checks enable rapid clinical intervention.",
      },
      impactMetric: "Sub-Second Alerting",
    },
    {
      id: 5,
      number: "05",
      conventional: {
        title: "Weak Audit Trails & Compliance Gaps",
        description:
          "Incomplete revision histories complicate hospital laboratory accreditation and governance.",
      },
      diagnova: {
        title: "Immutable Digital Audit Logs",
        description:
          "End-to-end specimen traceability and doctor validation logs ready for rigorous ISO 15189 compliance.",
      },
      impactMetric: "100% Audit-Ready",
    },
    {
      id: 6,
      number: "06",
      conventional: {
        title: "High Server CapEx & Vendor Lock-In",
        description:
          "Exorbitant on-premise hardware costs, rigid contracts, and refusal to interface older analyzers.",
      },
      diagnova: {
        title: "Flexible Cloud Model & 500+ Analyzers",
        description:
          "Zero server overhead with immediate plug-and-play support for over 500+ clinical lab instruments.",
      },
      impactMetric: "500+ Analyzers Ready",
    },
  ],
};

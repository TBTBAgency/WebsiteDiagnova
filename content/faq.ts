export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface FAQContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  supportPrompt: string;
  supportCta: string;
  categories: { id: string; label: string }[];
  items: FAQItem[];
}

export const faqContentID: FAQContent = {
  sectionBadge: "FAQ & Tanya Jawab",
  sectionTitle: "Pertanyaan yang Sering Diajukan",
  sectionSubtitle:
    "Temukan jawaban seputar kapabilitas LIS Diagnova, integrasi mesin analyzer, kepatuhan SATUSEHAT, ketahanan offline, dan kecerdasan Nova AI.",
  supportPrompt: "Masih memiliki pertanyaan seputar alur kerja laboratorium Anda?",
  supportCta: "Hubungi Spesialis Kami",
  categories: [
    { id: "all", label: "Semua Pertanyaan" },
    { id: "integration", label: "Integrasi & Analyzer" },
    { id: "compliance", label: "SATUSEHAT & Keamanan" },
    { id: "ai", label: "Nova AI & Etika" },
    { id: "implementation", label: "Implementasi" },
  ],
  items: [
    {
      id: "faq-1",
      category: "all",
      question: "Apa itu Diagnova LIS dan apa bedanya dengan sistem informasi laboratorium konvensional?",
      answer:
        "Diagnova adalah platform Laboratory Information System (LIS) modern yang menghubungkan mesin analyzer laboratorium secara langsung (100% direct interfacing), memangkas Turnaround Time (TAT) hingga 70%, serta dilengkapi Nova AI Copilot untuk mendeteksi anomali biomarker dan lonjakan delta-check secara otomatis. Berbeda dengan LIS konvensional yang kaku dan membutuhkan banyak input manual, Diagnova berbasis arsitektur cloud/hybrid modular, siap akreditasi KARS/ISO 15189, dan menghadirkan rekam jejak audit digital milidetik yang transparan.",
    },
    {
      id: "faq-2",
      category: "integration",
      question: "Apakah Diagnova dapat diintegrasikan dengan SIMRS dan RME rumah sakit kami?",
      answer:
        "Ya, 100% kompatibel. Diagnova mendukung protokol HL7 v2 (ORM/ORU), RESTful API / JSON, dan FHIR R4 dua arah (bidirectional). Pesanan pemeriksaan dari SIMRS otomatis berubah menjadi worklist instrumen lab tanpa ketik ulang, dan hasil terverifikasi beserta grafik riwayat longitudinal langsung terkirim kembali ke lembar rekam medis elektronik (RME) dokter DPJP secara real-time, memenuhi amanat Permenkes No. 24/2022.",
    },
    {
      id: "faq-3",
      category: "integration",
      question: "Model mesin analyzer dan instrumen apa saja yang didukung oleh Diagnova?",
      answer:
        "Diagnova telah teruji dan kompatibel dengan lebih dari 500+ model analyzer medis global (Sysmex, Roche Cobas, Abbott Architect/Alinity, Mindray, Siemens Healthineers, Beckman Coulter, bioMérieux VITEK, BACTEC, dll) melalui koneksi ASTM E1381/E1394, HL7, TCP/IP LAN, maupun Serial RS-232 tanpa memerlukan middleware pihak ketiga berbayar.",
    },
    {
      id: "faq-4",
      category: "compliance",
      question: "Bagaimana Diagnova menjamin kepatuhan terhadap ekosistem SATUSEHAT Kemenkes RI?",
      answer:
        "Diagnova memiliki modul gateway SATUSEHAT terintegrasi yang secara otomatis memetakan parameter laboratorium lokal ke kamus standar nasional (LOINC dan SNOMED CT), memvalidasi nomor IHS pasien via NIK, serta mentransmisikan bundle resource HL7 FHIR R4 (ServiceRequest, Specimen, Observation, DiagnosticReport) terenkripsi TLS 1.3 langsung ke API resmi Kementerian Kesehatan RI.",
    },
    {
      id: "faq-5",
      category: "compliance",
      question: "Bagaimana jika jaringan internet atau LAN faskes terputus saat pemeriksaan berjalan?",
      answer:
        "Diagnova dilengkapi Smart Resilient Gateway dengan teknologi Offline Edge Buffer hingga 72 jam. Jika koneksi cloud atau internet terputus, instrumen lab tetap dapat membaca barcode tabung, menjalankan tes, dan menyimpan data di storage lokal terenkripsi. Saat jaringan pulih, seluruh paket data otomatis disinkronkan kembali tanpa ada data hilang (zero data loss) dengan memprioritaskan antrean sampel Cito IGD dan ICU.",
    },
    {
      id: "faq-6",
      category: "ai",
      question: "Bagaimana peran Nova AI dalam proses diagnosis? Apakah menggantikan dokter patologi?",
      answer:
        "Sama sekali tidak. Diagnova berpegang teguh pada prinsip Human-in-the-Loop mutlak dan etika kedokteran KARS/JCI. Nova AI berfungsi murni sebagai asisten copilot analitis yang memindai jutaan titik data historis, menghitung pergeseran tren delta-check, dan merangkum angka rumit menjadi narasi ringkas. Seluruh keputusan diagnosis klinis, interpretasi hasil, dan rilis lembar laporan tetap 100% berada di bawah wewenang dokter spesialis patologi (Sp.PK/Sp.PA) melalui tanda tangan digital tersertifikasi.",
    },
    {
      id: "faq-7",
      category: "implementation",
      question: "Berapa lama proses implementasi dan pelatihan staf hingga sistem siap go-live?",
      answer:
        "Berkat arsitektur modular dan ratusan driver analyzer yang sudah siap pakai, implementasi Diagnova rata-rata berlangsung 2 hingga 4 minggu untuk laboratorium klinik, dan 4 hingga 8 minggu untuk rumah sakit umum/tipe A-B. Tim spesialis klinis dan teknisi IT kami mendampingi fasilitas Anda secara komprehensif mulai dari bridging SIMRS, migrasi master data, uji validasi analyzer, hingga pelatihan langsung (hands-on) bagi seluruh analis lab dan dokter.",
    },
  ],
};

export const faqContentEN: FAQContent = {
  sectionBadge: "FAQ & Knowledge Base",
  sectionTitle: "Frequently Asked Questions",
  sectionSubtitle:
    "Find clear answers regarding Diagnova LIS capabilities, analyzer connectivity, SATUSEHAT compliance, offline resilience, and Nova AI intelligence.",
  supportPrompt: "Still have specific inquiries regarding your laboratory operations?",
  supportCta: "Contact Our Clinical Specialists",
  categories: [
    { id: "all", label: "All Questions" },
    { id: "integration", label: "Integration & Analyzers" },
    { id: "compliance", label: "SATUSEHAT & Security" },
    { id: "ai", label: "Nova AI & Ethics" },
    { id: "implementation", label: "Implementation" },
  ],
  items: [
    {
      id: "faq-1",
      category: "all",
      question: "What is Diagnova LIS and how does it differ from conventional laboratory software?",
      answer:
        "Diagnova is a next-generation Laboratory Information System (LIS) engineered with 100% direct bidirectional analyzer interfacing, reducing turnaround time (TAT) by up to 70%, and powered by Nova AI Copilot for automated biomarker delta-check anomaly detection. Unlike rigid legacy LIS systems reliant on manual data entry, Diagnova runs on a modern hybrid-cloud architecture, is fully accreditation-ready (KARS & ISO 15189), and provides immutable millisecond-level digital audit logs.",
    },
    {
      id: "faq-2",
      category: "integration",
      question: "Can Diagnova integrate with our hospital's existing HIS and EMR systems?",
      answer:
        "Yes, 100% compatible. Diagnova supports HL7 v2 (ORM/ORU), RESTful JSON APIs, and bidirectional FHIR R4 protocols. Physician orders from your HIS immediately populate analyzer worklists without manual transcription, and verified results with longitudinal trend analytics stream directly into the physician's electronic medical record (EMR), complying with Indonesian Ministry of Health mandates (Permenkes No. 24/2022).",
    },
    {
      id: "faq-3",
      category: "integration",
      question: "Which medical analyzer models and instruments are supported by Diagnova?",
      answer:
        "Diagnova has been tested and proven compatible with over 500+ global medical analyzer models (Sysmex, Roche Cobas, Abbott Architect/Alinity, Mindray, Siemens Healthineers, Beckman Coulter, bioMérieux VITEK, BACTEC, etc.) across ASTM E1381/E1394, HL7, TCP/IP LAN, and RS-232 serial interfaces without requiring expensive third-party middleware.",
    },
    {
      id: "faq-4",
      category: "compliance",
      question: "How does Diagnova ensure compliance with Indonesia's MoH SATUSEHAT platform?",
      answer:
        "Diagnova features a turnkey SATUSEHAT gateway that automatically maps local lab test codes to national standard terminologies (LOINC and SNOMED CT), validates patient IHS numbers against NIK registries, and transmits TLS 1.3 encrypted HL7 FHIR R4 bundles (ServiceRequest, Specimen, Observation, DiagnosticReport) directly to official Ministry of Health servers.",
    },
    {
      id: "faq-5",
      category: "compliance",
      question: "What happens if internet or local area network (LAN) connection drops during live testing?",
      answer:
        "Diagnova is built with a Smart Resilient Gateway featuring up to 72-hour Offline Edge Buffering. If cloud or internet connectivity is disrupted, local analyzers continue scanning tube barcodes, processing specimens, and logging results safely in encrypted local storage. Once connectivity is restored, all data automatically reconciles with zero packet loss, prioritizing critical Emergency (IGD) and ICU orders first.",
    },
    {
      id: "faq-6",
      category: "ai",
      question: "What is the role of Nova AI in diagnostics? Does it replace medical pathologists?",
      answer:
        "Never. Diagnova strictly adheres to the absolute Human-in-the-Loop principle and international clinical governance standards (KARS & JCI). Nova AI operates purely as an analytical copilot that inspects longitudinal historical trends, calculates delta-check deviations, and summarizes dense telemetry into concise physician briefing notes. All diagnostic decisions, interpretations, and result authorizations remain 100% under certified pathologists (Sp.PK/Sp.PA) via official cryptographic e-signatures.",
    },
    {
      id: "faq-7",
      category: "implementation",
      question: "How long does implementation and staff onboarding take until go-live?",
      answer:
        "Thanks to modular architecture and hundreds of pre-configured instrument drivers, Diagnova implementation typically takes 2 to 4 weeks for independent clinical laboratories, and 4 to 8 weeks for general and specialized hospitals. Our clinical application specialists and IT engineers provide end-to-end guidance from HIS bridging, master data migration, analyzer precision verification, to comprehensive hands-on training for all lab technicians and clinicians.",
    },
  ],
};

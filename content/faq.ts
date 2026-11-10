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
  sectionBadge: "FAQS",
  sectionTitle: "Pertanyaan yang sering diajukan",
  sectionSubtitle:
    "Semua informasi penting seputar alur kerja Diagnova LIS, integrasi mesin lab, kepatuhan SATUSEHAT, ketahanan offline, dan kecerdasan Nova AI.",
  supportPrompt: "Masih memiliki pertanyaan seputar alur kerja laboratorium Anda?",
  supportCta: "Hubungi Spesialis Kami",
  categories: [
    { id: "general", label: "Umum" },
    { id: "integration", label: "Integrasi & Mesin" },
    { id: "compliance", label: "SATUSEHAT & Regulasi" },
    { id: "ai", label: "Fitur & Nova AI" },
    { id: "implementation", label: "Implementasi & Support" },
  ],
  items: [
    // ─── UMUM (GENERAL) ───
    {
      id: "faq-gen-1",
      category: "general",
      question: "Untuk apa platform Diagnova LIS ini digunakan?",
      answer:
        "Diagnova adalah platform Laboratory Information System (LIS) modern generasi terbaru yang dirancang untuk mengotomatisasi seluruh alur kerja laboratorium medis. Mulai dari registrasi sampel dan barcode otomatis, koneksi langsung instrumen analyzer laboratorium (100% direct interfacing), validasi analitis dibantu Nova AI Copilot, hingga penerbitan hasil digital terverifikasi dan pelaporan real-time ke dokter maupun pasien.",
    },
    {
      id: "faq-gen-2",
      category: "general",
      question: "Apakah data pasien dan rekam medis kami aman di platform ini?",
      answer:
        "Keamanan dan kerahasiaan data klinis adalah prioritas mutlak kami. Diagnova menerapkan enkripsi end-to-end tingkat perbankan (AES-256 untuk data at-rest serta TLS 1.3 untuk data in-transit), kontrol akses berbasis peran (RBAC) ketat, jejak audit digital milidetik yang transparan, dan kepatuhan penuh terhadap UU Perlindungan Data Pribadi (UU PDP No. 27/2022).",
    },
    {
      id: "faq-gen-3",
      category: "general",
      question: "Bagaimana skema pengadaan dan lisensi Diagnova?",
      answer:
        "Diagnova menyediakan model fleksibel berbasis langganan (SaaS Cloud) maupun lisensi Enterprise On-Premise/Hybrid untuk faskes berskala besar. Skema ini sudah mencakup pembaruan berkala, pemeliharaan server, dan perlindungan keamanan tanpa biaya lisensi tersembunyi.",
    },
    {
      id: "faq-gen-4",
      category: "general",
      question: "Apakah faskes kami memerlukan perangkat keras (hardware) khusus?",
      answer:
        "Tidak. Diagnova dirancang berbasis web yang ringan dan responsif, dapat diakses melalui browser modern di PC, laptop, maupun tablet yang sudah ada di faskes Anda. Untuk komunikasi fisik dengan mesin analyzer serial RS-232, kami menyediakan Diagnova Bridge Box plug-and-play tanpa perlu server lokal yang mahal.",
    },
    {
      id: "faq-gen-5",
      category: "general",
      question: "Bagaimana cara mengajukan demo dan uji coba sistem di faskes kami?",
      answer:
        "Anda dapat menekan tombol 'Jadwalkan Demo' di halaman ini atau menghubungi tim konsultan kami. Tim spesialis klinis Diagnova akan mengatur sesi demonstrasi interaktif yang disesuaikan dengan volume tes, jenis analyzer, dan alur SIMRS laboratorium Anda.",
    },
    {
      id: "faq-gen-6",
      category: "general",
      question: "Bagaimana saya dapat menghubungi tim customer support dan bantuan teknis?",
      answer:
        "Tim dukungan teknis dan spesialis aplikasi klinis Diagnova siap mendampingi faskes Anda 24/7 melalui hotline darurat, tiket helpdesk prioritas, WhatsApp resmi, dan remote assistance dengan SLA respons cepat di bawah 15 menit untuk kendala operasional lab.",
    },

    // ─── INTEGRASI & MESIN ───
    {
      id: "faq-int-1",
      category: "integration",
      question: "Apakah Diagnova dapat diintegrasikan dengan SIMRS dan RME rumah sakit kami?",
      answer:
        "Ya, 100% kompatibel. Diagnova mendukung protokol HL7 v2 (ORM/ORU), RESTful API / JSON, dan FHIR R4 dua arah (bidirectional). Pesanan pemeriksaan dari SIMRS otomatis berubah menjadi worklist instrumen lab tanpa ketik ulang, dan hasil terverifikasi beserta grafik riwayat longitudinal langsung terkirim kembali ke lembar rekam medis elektronik (RME) dokter DPJP secara real-time, memenuhi amanat Permenkes No. 24/2022.",
    },
    {
      id: "faq-int-2",
      category: "integration",
      question: "Model mesin analyzer dan instrumen apa saja yang didukung oleh Diagnova?",
      answer:
        "Diagnova telah teruji dan kompatibel dengan lebih dari 500+ model analyzer medis global (Sysmex, Roche Cobas, Abbott Architect/Alinity, Mindray, Siemens Healthineers, Beckman Coulter, bioMérieux VITEK, BACTEC, dll) melalui koneksi ASTM E1381/E1394, HL7, TCP/IP LAN, maupun Serial RS-232 tanpa memerlukan middleware pihak ketiga berbayar.",
    },
    {
      id: "faq-int-3",
      category: "integration",
      question: "Apakah Diagnova membutuhkan middleware pihak ketiga berbayar?",
      answer:
        "Sama sekali tidak. Diagnova dilengkapi driver komunikasi bawaan (native direct interfacing). Anda tidak perlu membeli lisensi middleware pihak ketiga yang mahal, memotong biaya investasi perangkat lunak laboratorium hingga puluhan juta rupiah.",
    },

    // ─── SATUSEHAT & REGULASI ───
    {
      id: "faq-comp-1",
      category: "compliance",
      question: "Bagaimana Diagnova menjamin kepatuhan terhadap ekosistem SATUSEHAT Kemenkes RI?",
      answer:
        "Diagnova memiliki modul gateway SATUSEHAT terintegrasi yang secara otomatis memetakan parameter laboratorium lokal ke kamus standar nasional (LOINC dan SNOMED CT), memvalidasi nomor IHS pasien via NIK, serta mentransmisikan bundle resource HL7 FHIR R4 (ServiceRequest, Specimen, Observation, DiagnosticReport) terenkripsi TLS 1.3 langsung ke API resmi Kementerian Kesehatan RI.",
    },
    {
      id: "faq-comp-2",
      category: "compliance",
      question: "Bagaimana jika jaringan internet atau LAN faskes terputus saat pemeriksaan berjalan?",
      answer:
        "Diagnova dilengkapi Smart Resilient Gateway dengan teknologi Offline Edge Buffer hingga 72 jam. Jika koneksi cloud atau internet terputus, instrumen lab tetap dapat membaca barcode tabung, menjalankan tes, dan menyimpan data di storage lokal terenkripsi. Saat jaringan pulih, seluruh paket data otomatis disinkronkan kembali tanpa ada data hilang (zero data loss) dengan memprioritaskan antrean sampel Cito IGD dan ICU.",
    },
    {
      id: "faq-comp-3",
      category: "compliance",
      question: "Apakah Diagnova memenuhi standar akreditasi KARS, JCI, dan ISO 15189?",
      answer:
        "Ya. Diagnova dirancang selaras dengan instrumen penilaian akreditasi laboratorium klinik KARS, JCI, dan ISO 15189. Mulai dari manajemen kontrol kualitas (QC Levey-Jennings & Westgard Rules), rekam jejak suhu spesimen, pencatatan reagen kedaluwarsa, hingga audit trail setiap intervensi analitis.",
    },

    // ─── NOVA AI & ETIKA ───
    {
      id: "faq-ai-1",
      category: "ai",
      question: "Bagaimana peran Nova AI dalam proses diagnosis? Apakah menggantikan dokter patologi?",
      answer:
        "Sama sekali tidak. Diagnova berpegang teguh pada prinsip Human-in-the-Loop mutlak dan etika kedokteran KARS/JCI. Nova AI berfungsi murni sebagai asisten copilot analitis yang memindai titik data historis, menghitung pergeseran tren delta-check, dan merangkum narasi ringkas. Seluruh keputusan diagnosis klinis, interpretasi hasil, dan otorisasi laporan tetap 100% berada di bawah wewenang dokter spesialis patologi (Sp.PK/Sp.PA).",
    },
    {
      id: "faq-ai-2",
      category: "ai",
      question: "Bagaimana Nova AI memproses data rekam medis tanpa melanggar privasi?",
      answer:
        "Nova AI memproses data dengan prinsip de-identifikasi lokal dan privasi berbasis zero-retention. Model AI beroperasi di dalam perimeter aman faskes atau private cloud terenkripsi khusus tanpa membagikan data pasien ke publik atau melatih model eksternal pihak ketiga.",
    },
    {
      id: "faq-ai-3",
      category: "ai",
      question: "Parameter dan anomali apa saja yang mampu dideteksi oleh Nova AI Copilot?",
      answer:
        "Nova AI Copilot mendeteksi lonjakan delta-check ekstrem pada biomarker kritis (seperti troponin, kreatinin, glukosa darah, atau elektrolit), korelasi diskordansi antar parameter hematologi dan kimia darah, indikasi interferensi sampel (hemolisis, ikterik, lipemik/HIL), serta peringatan nilai kritis (panic values).",
    },

    // ─── IMPLEMENTASI & DUKUNGAN ───
    {
      id: "faq-impl-1",
      category: "implementation",
      question: "Berapa lama proses implementasi dan pelatihan staf hingga sistem siap go-live?",
      answer:
        "Berkat arsitektur modular dan ratusan driver analyzer yang sudah siap pakai, implementasi Diagnova rata-rata berlangsung 2 hingga 4 minggu untuk laboratorium klinik mandiri, dan 4 hingga 8 minggu untuk rumah sakit umum tipe A-B. Seluruh proses didampingi oleh tim konsultan teknis berpengalaman.",
    },
    {
      id: "faq-impl-2",
      category: "implementation",
      question: "Bagaimana proses migrasi master data dari LIS lama ke Diagnova?",
      answer:
        "Tim engineering Diagnova menyediakan pipeline migrasi otomatis untuk mentransfer master data tes, nilai rujukan normal, data dokter perujuk, serta riwayat pemeriksaan pasien dari database sistem lama Anda tanpa downtime operasional laboratorium.",
    },
    {
      id: "faq-impl-3",
      category: "implementation",
      question: "Apakah ada pendampingan langsung on-site saat hari pertama go-live?",
      answer:
        "Ya, tim spesialis aplikasi klinis dan teknisi hardware kami akan hadir langsung mendampingi laboratorium Anda secara on-site selama periode cutover dan go-live untuk memastikan seluruh alur kerja berjalan lancar tanpa kendala.",
    },
  ],
};

export const faqContentEN: FAQContent = {
  sectionBadge: "FAQS",
  sectionTitle: "Frequently asked question",
  sectionSubtitle:
    "Here's everything you need to know to get started, manage your account, and troubleshoot the most frequent issues.",
  supportPrompt: "Still have specific inquiries regarding your laboratory operations?",
  supportCta: "Contact Our Clinical Specialists",
  categories: [
    { id: "general", label: "General" },
    { id: "integration", label: "Integration & Analyzers" },
    { id: "compliance", label: "SATUSEHAT & Security" },
    { id: "ai", label: "Features & Nova AI" },
    { id: "implementation", label: "Implementation" },
  ],
  items: [
    // ─── GENERAL ───
    {
      id: "faq-gen-1",
      category: "general",
      question: "What is this platform used for?",
      answer:
        "Diagnova is a next-generation Laboratory Information System (LIS) designed to automate entire clinical and diagnostic laboratory workflows. It provides a structured environment where users can manage tube barcodes, connect laboratory analyzers directly (100% direct interfacing), leverage Nova AI Copilot for analytical delta-check validation, track test progress, and seamlessly deliver verified diagnostic reports to clinicians and patients.",
    },
    {
      id: "faq-gen-2",
      category: "general",
      question: "Is our data safe on this platform?",
      answer:
        "Patient data safety and confidentiality are our highest priorities. Diagnova employs enterprise-grade AES-256 encryption for data at rest and TLS 1.3 for data in transit, strict granular role-based access controls (RBAC), immutable millisecond audit logging, and full compliance with international standards and Indonesia's Personal Data Protection Act (UU PDP No. 27/2022).",
    },
    {
      id: "faq-gen-3",
      category: "general",
      question: "How is Diagnova licensed and priced?",
      answer:
        "Diagnova offers transparent, predictable pricing models including flexible Cloud SaaS subscriptions as well as Enterprise On-Premise/Hybrid deployments. Packages include regular system updates, automated backups, and 24/7 technical monitoring with zero hidden licensing fees.",
    },
    {
      id: "faq-gen-4",
      category: "general",
      question: "Does our facility require dedicated high-spec hardware?",
      answer:
        "No. Diagnova is built as a lightweight, modern web application accessible via standard web browsers on your existing PCs, workstations, and tablets. For physical serial RS-232 connections to legacy laboratory analyzers, we supply plug-and-play Diagnova Bridge hardware without requiring heavy local server infrastructure.",
    },
    {
      id: "faq-gen-5",
      category: "general",
      question: "How can we schedule a live demo or trial for our facility?",
      answer:
        "You can click the 'Request a Demo' button or reach out to our clinical specialists directly. Our team will coordinate an interactive demonstration tailored specifically to your test menu, daily specimen volumes, and analyzer models.",
    },
    {
      id: "faq-gen-6",
      category: "general",
      question: "How do I contact customer support and technical assistance?",
      answer:
        "Our dedicated clinical application support team and IT engineers are available 24/7 through emergency telephone hotlines, priority helpdesk tickets, official WhatsApp channels, and remote screen assistance with a guaranteed sub-15-minute response SLA for critical laboratory incidents.",
    },

    // ─── INTEGRATION & ANALYZERS ───
    {
      id: "faq-int-1",
      category: "integration",
      question: "Can Diagnova integrate with our hospital's existing HIS and EMR systems?",
      answer:
        "Yes, 100% compatible. Diagnova supports HL7 v2 (ORM/ORU), RESTful JSON APIs, and bidirectional FHIR R4 protocols. Physician orders from your HIS immediately populate analyzer worklists without manual transcription, and verified results with longitudinal trend analytics stream directly into the physician's electronic medical record (EMR), complying with Indonesian Ministry of Health mandates (Permenkes No. 24/2022).",
    },
    {
      id: "faq-int-2",
      category: "integration",
      question: "Which medical analyzer models and instruments are supported by Diagnova?",
      answer:
        "Diagnova has been tested and proven compatible with over 500+ global medical analyzer models (Sysmex, Roche Cobas, Abbott Architect/Alinity, Mindray, Siemens Healthineers, Beckman Coulter, bioMérieux VITEK, BACTEC, etc.) across ASTM E1381/E1394, HL7, TCP/IP LAN, and RS-232 serial interfaces without requiring expensive third-party middleware.",
    },
    {
      id: "faq-int-3",
      category: "integration",
      question: "Does Diagnova require expensive third-party middleware licenses?",
      answer:
        "Not at all. Diagnova includes direct native instrument drivers. You do not need to purchase or maintain costly intermediary third-party middleware solutions, saving substantial recurring expenses.",
    },

    // ─── SATUSEHAT & COMPLIANCE ───
    {
      id: "faq-comp-1",
      category: "compliance",
      question: "How does Diagnova ensure compliance with Indonesia's MoH SATUSEHAT platform?",
      answer:
        "Diagnova features a turnkey SATUSEHAT gateway that automatically maps local lab test codes to national standard terminologies (LOINC and SNOMED CT), validates patient IHS numbers against NIK registries, and transmits TLS 1.3 encrypted HL7 FHIR R4 bundles (ServiceRequest, Specimen, Observation, DiagnosticReport) directly to official Ministry of Health servers.",
    },
    {
      id: "faq-comp-2",
      category: "compliance",
      question: "What happens if internet or local area network (LAN) connection drops during live testing?",
      answer:
        "Diagnova is built with a Smart Resilient Gateway featuring up to 72-hour Offline Edge Buffering. If cloud or internet connectivity is disrupted, local analyzers continue scanning tube barcodes, processing specimens, and logging results safely in encrypted local storage. Once connectivity is restored, all data automatically reconciles with zero packet loss, prioritizing critical Emergency (IGD) and ICU orders first.",
    },
    {
      id: "faq-comp-3",
      category: "compliance",
      question: "Does Diagnova meet KARS, JCI, and ISO 15189 accreditation requirements?",
      answer:
        "Yes. Diagnova is meticulously designed around clinical laboratory accreditation guidelines including ISO 15189, KARS, and JCI standards, providing integrated Levey-Jennings QC charts with Westgard multirules, reagent expiration tracking, and immutable audit logs.",
    },

    // ─── NOVA AI & ETHICS ───
    {
      id: "faq-ai-1",
      category: "ai",
      question: "What is the role of Nova AI in diagnostics? Does it replace medical pathologists?",
      answer:
        "Never. Diagnova strictly adheres to the absolute Human-in-the-Loop principle and international clinical governance standards (KARS & JCI). Nova AI operates purely as an analytical copilot that inspects longitudinal historical trends, calculates delta-check deviations, and summarizes dense telemetry into concise physician briefing notes. All diagnostic decisions, interpretations, and result authorizations remain 100% under certified pathologists (Sp.PK/Sp.PA) via official cryptographic e-signatures.",
    },
    {
      id: "faq-ai-2",
      category: "ai",
      question: "How does Nova AI process diagnostic data without compromising privacy?",
      answer:
        "Nova AI processes laboratory parameters using de-identification and zero-retention privacy protocols. Models execute entirely within the secure boundary of your clinical environment or private cloud instance, without transmitting patient information to public models or third-party datasets.",
    },
    {
      id: "faq-ai-3",
      category: "ai",
      question: "What parameters and anomalies are flagged by Nova AI Copilot?",
      answer:
        "Nova AI Copilot monitors critical biomarker delta-check shifts (such as troponin, creatinine, blood glucose, or electrolytes), discordance across hematology and clinical chemistry panels, pre-analytical sample interference (hemolysis, icterus, lipemia/HIL), and critical panic value notifications.",
    },

    // ─── IMPLEMENTATION ───
    {
      id: "faq-impl-1",
      category: "implementation",
      question: "How long does implementation and staff onboarding take until go-live?",
      answer:
        "Thanks to modular architecture and hundreds of pre-configured instrument drivers, Diagnova implementation typically takes 2 to 4 weeks for independent clinical laboratories, and 4 to 8 weeks for general and specialized hospitals. Our clinical application specialists and IT engineers provide end-to-end guidance from HIS bridging, master data migration, analyzer precision verification, to comprehensive hands-on training for all lab technicians and clinicians.",
    },
    {
      id: "faq-impl-2",
      category: "implementation",
      question: "How is historical master data migrated from our legacy LIS to Diagnova?",
      answer:
        "Our engineering team handles automated schema mapping and migration scripts to safely transfer existing test master catalogues, reference ranges, doctor databases, and historical patient records with zero operational disruption.",
    },
    {
      id: "faq-impl-3",
      category: "implementation",
      question: "Is there on-site support provided during the cutover and go-live date?",
      answer:
        "Yes, our clinical implementation specialists and hardware engineers are physically on-site with your laboratory staff throughout go-live day to ensure seamless cutover, real-time analyzer verification, and immediate operator assistance.",
    },
  ],
};

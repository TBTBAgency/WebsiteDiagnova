import { IntegrationItem } from "@/types";

export const integrationsData: IntegrationItem[] = [
  {
    id: "simrs-his",
    slug: "simrs-his",
    name: "SIMRS / HIS Integration",
    tagline: "Bridging Mulus Dua Arah dengan Sistem Informasi Rumah Sakit",
    shortDesc:
      "Pertukaran data otomatis untuk pendaftaran pasien, order lab dari dokter, billing terintegrasi, dan pengiriman hasil ke SIMRS tanpa entri ganda.",
    description:
      "Diagnova menyediakan konektor native yang kompatibel dengan berbagai vendor SIMRS lokal maupun internasional di Indonesia. Begitu dokter memasukkan order lab di SIMRS, Diagnova langsung menerima data pasien dan tes yang diminta, mencetak label barcode, dan mengembalikan hasil yang telah diverifikasi ke rekam medis pasien di SIMRS secara instan.",
    iconName: "Network",
    protocols: ["RESTful API / JSON", "HL7 v2.x / v3", "Webservices / SOAP", "Direct DB Linking"],
    highlights: [
      "Zero double entry untuk pendaftaran pasien dan permintaan tes lab",
      "Sinkronisasi status billing otomatis untuk mencegah pemeriksaan belum terbayar",
      "Dukungan multi-ruangan (Rawat Inap, Rawat Jalan, IGD, ICU, Kamar Operasi)",
      "SLA bridging tinggi dengan mekanisme antrean transaksi berbasis buffer",
    ],
    capabilities: [
      "Patient Demographic Ingestion (ADT messages)",
      "Lab Order Receipt (ORM messages)",
      "Real-time Result Return (ORU messages)",
      "Billing & Charge Posting Synchronization",
    ],
  },
  {
    id: "rme",
    slug: "rme",
    name: "Rekam Medis Elektronik (RME)",
    tagline: "Kepatuhan Mandatori RME dengan Integrasi Data Klinis Lengkap",
    shortDesc:
      "Mengintegrasikan data hasil laboratorium terstruktur dan laporan patologi langsung ke modul RME dokter dan perawat.",
    description:
      "Mendukung amanat Permenkes No. 24 Tahun 2022 mengenai kewajiban Rekam Medis Elektronik. Diagnova menyajikan data hasil tes dalam format terstruktur yang memudahkan dokter melihat riwayat grafik perkembangan laboratorium pasien secara longitudinal di layar RME mereka.",
    iconName: "FileText",
    protocols: ["FHIR R4 DiagnosticReport", "JSON REST API", "HL7 CDA", "PDF Embed"],
    highlights: [
      "Format data terstandarisasi LOINC untuk setiap parameter pemeriksaan",
      "Grafik tren biomarker historis pasien langsung dapat diakses di RME",
      "Penanda visual nilai kritis (panic value) langsung menyala di dashboard RME DPJP",
      "Tanda tangan elektronik tersertifikasi (Digital Signature) pada lembar hasil",
    ],
    capabilities: [
      "Diagnostic Report Resource Integration",
      "Observation Resource Mapping",
      "Historical Laboratory Trends Visualization",
      "Doctor E-Sign & Stamp Validation",
    ],
  },
  {
    id: "analyzer",
    slug: "analyzer",
    name: "Direct Analyzer Interfacing",
    tagline: "Kompatibel dengan 500+ Mesin Laboratorium Medis Terkemuka",
    shortDesc:
      "Interfacing bidireksional langsung ke instrumen hematologi, kimia klinik, imunologi, urinalisis, koagulasi, dan mikrobiologi.",
    description:
      "Diagnova terhubung langsung dengan lebih dari 500 model mesin lab dari pabrikan global ternama (seperti Roche, Abbott, Sysmex, Siemens, Beckman Coulter, Mindray, bioMérieux, Horiba, dan Dirui). Spesimen dengan barcode ditarik otomatis oleh mesin (Query Mode), dianalisis, dan hasilnya dikirim balik ke Diagnova tanpa intervensi tangan manusia.",
    iconName: "Cpu",
    protocols: ["ASTM E1381 / E1394", "HL7 v2.3.1 / v2.5", "Serial RS-232", "TCP/IP LAN", "USB"],
    highlights: [
      "Mendukung Mode Query Bidireksional (Host Query) & Unidireksional",
      "Pengenalan kode tes otomatis dan konversi satuan terstandardisasi",
      "Validasi Quality Control (QC) otomatis sebelum hasil pasien diproses",
      "Deteksi status instrumen (Online, Idle, Running, Error Flagging)",
    ],
    capabilities: [
      "500+ Driver Instrumen Laboratorium Teruji",
      "Automatic Specimen Worklist Dispatch",
      "Real-time Raw Data Parsing & Error Flag Capture",
      "Instrument Maintenance & Calibration Logging",
    ],
  },
  {
    id: "satusehat",
    slug: "satusehat",
    name: "SATUSEHAT (Kemenkes RI)",
    tagline: "Integrasi Siap Pakai dengan Platform Data Kesehatan Nasional",
    shortDesc:
      "Konektivitas standar HL7 FHIR untuk pengiriman data pemeriksaan laboratorium ke ekosistem SATUSEHAT Kementerian Kesehatan RI.",
    description:
      "Diagnova telah dirancang dengan arsitektur data berbasis terminologi standar kesehatan nasional. Memungkinkan fasilitas kesehatan Anda memenuhi kewajiban interoperabilitas SATUSEHAT Kemenkes secara cepat, aman, dan tanpa perlu merombak infrastruktur laboratorium yang ada.",
    iconName: "ShieldCheck",
    protocols: ["HL7 FHIR R4", "OAuth 2.0 Kemenkes", "HTTPS TLS 1.3"],
    highlights: [
      "Pemetaan otomatis kode pemeriksaan laboratorium ke kode LOINC & SNOMED CT",
      "Integrasi autentikasi resmi via API Gateway SATUSEHAT Kemenkes",
      "Dashboard pemantauan status pengiriman data (Payload Sent, Verified, Failed)",
      "Audit log kepatuhan privasi data pasien sesuai regulasi PDP",
    ],
    capabilities: [
      "FHIR ServiceRequest & Specimen Mapping",
      "FHIR DiagnosticReport & Observation Generator",
      "National Health ID (IHS Number) Validation",
      "Automated SATUSEHAT Submission & Retry Mechanism",
    ],
  },
  {
    id: "connectivity",
    slug: "connectivity",
    name: "Smart Resilient Gateway",
    tagline: "Konektivitas Tangguh dengan Offline Buffer Mode & Uptime 99.9%",
    shortDesc:
      "Arsitektur gateway cerdas yang memastikan operasional lab tetap berjalan normal tanpa kehilangan data bahkan saat jaringan lokal/internet terputus.",
    description:
      "Gangguan jaringan internet atau fluktuasi LAN tidak boleh menghentikan proses diagnosis kritis. Smart Resilient Gateway Diagnova beroperasi dengan teknologi edge buffer lokal. Seluruh pembacaan analyzer tetap tersimpan aman di gateway lokal dan akan otomatis tersinkronisasi ke server pusat saat koneksi pulih kembali.",
    iconName: "Wifi",
    protocols: ["Edge Local Caching", "Auto-Reconnection Protocol", "Encrypted Tunnel (TLS/AES-256)"],
    highlights: [
      "Zero Data Loss: Data hasil tes tersimpan aman di buffer lokal saat offline",
      "Sinkronisasi cerdas otomatis dengan prioritas sampel cito begitu online",
      "Pemantauan status heartbeat seluruh perangkat laboratorium 24/7",
      "Uptime operasional teruji 99.9% di lingkungan rumah sakit dengan beban tinggi",
    ],
    capabilities: [
      "Fault-Tolerant Local Storage Architecture",
      "Conflict Resolution & Queue Reconciliation",
      "Automated Network Health Monitoring & Alerting",
      "Remote Firmware & Driver Update Deployment",
    ],
  },
];

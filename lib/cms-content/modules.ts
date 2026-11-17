import type { PageContentSpec } from "@/lib/cms-page-content";

/**
 * Konten section bawaan halaman Modul yang dikelola CMS (Halaman & Section › Edit Konten).
 * defaults = teks persis seperti sebelum dipindah ke CMS (tampilan tidak berubah sampai admin menyimpan).
 *
 * Tetap di kode (desain): mockup "AI Patient Report" (contoh kasus pasien & laporan klinis),
 * serta ilustrasi kartu katalog (alur analyzer, dashboard reagen, grafik stok BDRS) beserta angka contohnya.
 */

/** Nama ikon lucide yang tersedia (dipetakan ke komponen di ModulesPageClient). */
const ICON_NAMES = [
  "Activity",
  "HeartPulse",
  "PackageCheck",
  "Microscope",
  "FlaskConical",
  "Cpu",
  "Database",
  "FileCheck2",
  "FileText",
  "UserCheck",
  "Shuffle",
  "Sparkles",
  "Info",
  "QrCode",
  "Zap",
  "CheckCircle2",
  "ShieldCheck",
  "Layers",
  "Clock",
  "Network",
  "Thermometer",
  "AlertTriangle",
  "SlidersHorizontal",
  "BadgeCheck",
  "BarChart2",
  "FolderGit2",
];
const ICON_OPTIONS = ICON_NAMES.map((n) => ({ value: n, label: n }));

export const MODULES_CONTENT: PageContentSpec = {
  defs: {
    "modules-explorer": {
      help: "Daftar keunggulan di kolom kiri. Kartu \"AI Patient Report\" di kolom kanan adalah ilustrasi contoh dan tetap di kode.",
      lists: [
        {
          key: "features",
          label: "Keunggulan Pelaporan Pasien",
          itemLabel: "Keunggulan",
          maxItems: 8,
          minItems: 1,
          summaryField: "title",
          fields: [
            { key: "icon", label: "Ikon", type: "select", options: ICON_OPTIONS },
            { key: "title", label: "Judul", type: "text", required: true },
            {
              key: "bullets",
              label: "Poin-poin",
              type: "textarea",
              help: "Satu poin per baris.",
            },
          ],
        },
      ],
    },
    catalog: {
      help: "Kartu katalog modul (bento). ID item dipakai sebagai anchor tautan navigasi (mis. /modules#blood-bank), jadi jangan diubah untuk kartu bawaan.",
      fields: [
        {
          key: "registryTitle",
          label: "Judul Daftar Modul Terhubung (ilustrasi Spesialisasi)",
          type: "text",
          help: "Judul kecil kartu daftar modul pada ilustrasi \"Spesialisasi\".",
        },
      ],
      lists: [
        {
          key: "cards",
          label: "Kartu Katalog Modul",
          itemLabel: "Kartu",
          maxItems: 8,
          minItems: 1,
          summaryField: "title",
          fields: [
            { key: "title", label: "Judul", type: "text", required: true },
            { key: "description", label: "Deskripsi", type: "textarea" },
            {
              key: "size",
              label: "Lebar Kartu (desktop)",
              type: "select",
              options: [
                { value: "wide", label: "Lebar (7 dari 12 kolom)" },
                { value: "narrow", label: "Sempit (5 dari 12 kolom)" },
              ],
              help: "Pasangkan kartu Lebar dengan kartu Sempit agar satu baris terisi penuh.",
            },
            {
              key: "visual",
              label: "Ilustrasi",
              type: "select",
              options: [
                { value: "workflow", label: "Alur Analyzer (Hematologi & Kimia)" },
                { value: "reagent", label: "Dashboard Reagen" },
                { value: "bloodbank", label: "Grafik Stok Bank Darah" },
                { value: "specialty", label: "Spesialisasi (Patologi, Mikrobiologi & Gateway)" },
                { value: "none", label: "Tanpa ilustrasi (tampilkan ikon)" },
              ],
            },
            {
              key: "icon",
              label: "Ikon",
              type: "select",
              options: ICON_OPTIONS,
              help: "Dipakai bila Ilustrasi = \"Tanpa ilustrasi\".",
            },
          ],
        },
        {
          key: "specialtyTiles",
          label: "Ilustrasi Spesialisasi › Kartu Modul Kiri",
          itemLabel: "Kartu Modul",
          maxItems: 2,
          fixedCount: true,
          summaryField: "title",
          help: "Dua kartu kecil di kiri ilustrasi \"Spesialisasi\" (jumlah tetap karena terhubung garis ke kartu daftar).",
          fields: [
            { key: "icon", label: "Ikon", type: "select", options: ICON_OPTIONS },
            {
              key: "tone",
              label: "Warna Ikon",
              type: "select",
              options: [
                { value: "blue", label: "Biru" },
                { value: "teal", label: "Hijau Toska" },
              ],
            },
            { key: "title", label: "Judul", type: "text", required: true },
            { key: "subtitle", label: "Keterangan", type: "text" },
          ],
        },
        {
          key: "registry",
          label: "Ilustrasi Spesialisasi › Daftar Modul Terhubung",
          itemLabel: "Modul",
          maxItems: 6,
          minItems: 1,
          summaryField: "title",
          fields: [
            { key: "icon", label: "Ikon", type: "select", options: ICON_OPTIONS },
            { key: "title", label: "Nama Modul", type: "text", required: true },
            { key: "tag", label: "Label", type: "text", max: 40 },
          ],
        },
      ],
    },
    architecture: {
      fields: [
        { key: "linkLabel", label: "Teks Tautan", type: "text", required: true },
        { key: "linkUrl", label: "URL Tautan", type: "url" },
      ],
      lists: [
        {
          key: "pillars",
          label: "Kartu Pilar Arsitektur",
          itemLabel: "Kartu",
          maxItems: 6,
          minItems: 1,
          summaryField: "title",
          fields: [
            { key: "icon", label: "Ikon", type: "select", options: ICON_OPTIONS },
            { key: "title", label: "Judul", type: "text", required: true },
            { key: "desc", label: "Deskripsi", type: "textarea" },
          ],
        },
      ],
    },
    scalability: {
      fields: [
        { key: "primaryLabel", label: "Tombol Utama › Teks", type: "text", required: true },
        { key: "primaryUrl", label: "Tombol Utama › URL", type: "url" },
        { key: "secondaryLabel", label: "Tombol Kedua › Teks", type: "text", required: true },
        { key: "secondaryUrl", label: "Tombol Kedua › URL", type: "url" },
      ],
      lists: [
        {
          key: "steps",
          label: "Batang Skalabilitas",
          itemLabel: "Tahap",
          maxItems: 3,
          fixedCount: true,
          summaryField: "segment",
          help: "Tiga batang bertingkat (tinggi & warna terikat desain). Tahap ke-3 (batang biru) menampilkan tekstur grafik, bukan volume.",
          fields: [
            { key: "value", label: "Angka", type: "text", max: 20, required: true },
            { key: "segment", label: "Segmen Fasilitas", type: "text", required: true },
            { key: "desc", label: "Deskripsi", type: "textarea", max: 300 },
            { key: "volume", label: "Volume Sampel", type: "text", help: "Tidak ditampilkan pada tahap ke-3." },
          ],
        },
      ],
    },
  },
  defaults: {
    "modules-explorer": {
      fields: {},
      lists: {
        features: [
          {
            id: "clear-translation",
            isActive: true,
            icon: "FileCheck2",
            titleId: "Penjelasan Hasil Lab yang Mudah Dipahami",
            titleEn: "Clear Translation of Complex Findings",
            bulletsId:
              "Mengubah terminologi medis & nilai rujukan teknis menjadi narasi ramah pasien\nMenyoroti temuan utama dan indikator kritis secara terstruktur tanpa memicu kecemasan",
            bulletsEn:
              "Transforms technical medical terminology into clear, everyday patient language\nHighlights key findings and critical markers clearly without causing unnecessary anxiety",
          },
          {
            id: "lifestyle-guidance",
            isActive: true,
            icon: "HeartPulse",
            titleId: "Panduan Pola Hidup Berbasis Bukti",
            titleEn: "Evidence-Based Lifestyle Guidance",
            bulletsId:
              "Memberikan rekomendasi nutrisi, hidrasi, dan kebiasaan harian selaras hasil tes\nMembantu pasien mengambil langkah preventif terarah sebelum jadwal kontrol berikutnya",
            bulletsEn:
              "Delivers tailored nutrition, hydration, and daily wellness guidance aligned with results\nEmpowers proactive, preventive health management ahead of follow-up visits",
          },
          {
            id: "next-steps",
            isActive: true,
            icon: "Shuffle",
            titleId: "Roadmap Tindak Lanjut Terarah",
            titleEn: "Guided \"Next Steps\" Care Roadmap",
            bulletsId:
              "Menentukan waktu ideal untuk konsultasi ulang maupun pemeriksaan berkala bersama dokter\nMenyediakan daftar pertanyaan kunci agar diskusi pasien dengan dokter lebih efektif",
            bulletsEn:
              "Outlines ideal timelines for physician follow-ups and routine monitoring\nSuggests focused questions patients can bring to their next consultation",
          },
          {
            id: "physician-approved",
            isActive: true,
            icon: "UserCheck",
            titleId: "Otorisasi & Kendali Mutlak Dokter (DPJP)",
            titleEn: "Physician-Approved & Clinically Verified",
            bulletsId:
              "Setiap narasi pasien wajib melalui peninjauan dan persetujuan digital dokter Sp.PK / Sp.PA\nMenjamin akurasi diagnostik, etika medis, dan kepatuhan standar akreditasi rumah sakit",
            bulletsEn:
              "Every patient narrative requires mandatory clinical review and digital sign-off\nEnsures medical accuracy, safety guardrails, and alignment with hospital accreditation standards",
          },
        ],
      },
    },
    catalog: {
      fields: {
        registryTitleId: "Ekosistem Terhubung",
        registryTitleEn: "Connected Modules",
      },
      lists: {
        cards: [
          {
            id: "routine-hematology",
            isActive: true,
            titleId: "Otomasi Hematologi & Kimia Klinik",
            titleEn: "Routine Hematology & Clinical Chemistry",
            descriptionId: "Menghubungkan analyzer secara langsung tanpa entri data manual.",
            descriptionEn: "Direct bidirectional ASTM/HL7 interfacing with zero manual transcription.",
            size: "wide",
            visual: "workflow",
            icon: "Activity",
          },
          {
            id: "inventory-reagent",
            isActive: true,
            titleId: "Inventori & Reagen Pintar",
            titleEn: "Smart Reagent Intelligence",
            descriptionId: "Pantau sisa stok lot & tanggal kedaluwarsa secara real-time.",
            descriptionEn: "Real-time reagent depletion, lot tracking, and FEFO expiry alerts.",
            size: "narrow",
            visual: "reagent",
            icon: "PackageCheck",
          },
          {
            id: "blood-bank",
            isActive: true,
            titleId: "Manajemen Bank Darah (BDRS)",
            titleEn: "Blood Bank & Transfusion (BDRS)",
            descriptionId: "Pantau stok golongan darah, suhu 2°–6°C, & crossmatch elektronik.",
            descriptionEn: "Track ISBT-128 blood bags, cold-chain sensors, and electronic crossmatching.",
            size: "narrow",
            visual: "bloodbank",
            icon: "HeartPulse",
          },
          {
            id: "pathology",
            isActive: true,
            titleId: "Patologi Anatomi, Mikrobiologi & Gateway",
            titleEn: "Pathology, Microbiology & Specialty Gateway",
            descriptionId: "Pelacakan kaset 2D, antibiogram CLSI/PPRA, hingga parser instrumen khusus.",
            descriptionEn: "2D cassette tracking, CLSI antibiograms, and custom HL7/ASTM/molecular parsers.",
            size: "wide",
            visual: "specialty",
            icon: "Microscope",
          },
        ],
        specialtyTiles: [
          {
            id: "anatomical-pathology",
            isActive: true,
            icon: "Microscope",
            tone: "blue",
            titleId: "Patologi Anatomi",
            titleEn: "Anatomical Pathology",
            subtitleId: "Kaset 2D • Sinoptik ICD-O-3",
            subtitleEn: "2D Cassettes • ICD-O-3 Synoptic",
          },
          {
            id: "microbiology",
            isActive: true,
            icon: "FlaskConical",
            tone: "teal",
            titleId: "Mikrobiologi PPRA",
            titleEn: "Microbiology & AST",
            subtitleId: "Antibiogram CLSI • Alert MDRO",
            subtitleEn: "CLSI Antibiogram • MDRO Alert",
          },
        ],
        registry: [
          {
            id: "histopathology",
            isActive: true,
            icon: "Microscope",
            titleId: "Histopatologi & Sitologi",
            titleEn: "Histopathology & Cytology",
            tagId: "ICD-O-3",
            tagEn: "ICD-O-3",
          },
          {
            id: "culture",
            isActive: true,
            icon: "FlaskConical",
            titleId: "Kultur & Antibiogram",
            titleEn: "Culture & Antibiogram",
            tagId: "CLSI",
            tagEn: "CLSI",
          },
          {
            id: "custom-gateway",
            isActive: true,
            icon: "Cpu",
            titleId: "Gateway Instrumen Khusus",
            titleEn: "Custom Specialty Gateway",
            tagId: "500+ Alat",
            tagEn: "500+ Alat",
          },
        ],
      },
    },
    architecture: {
      fields: {
        linkLabelId: "Pelajari Arsitektur Platform Diagnova",
        linkLabelEn: "Explore Diagnova Platform Architecture",
        linkUrl: "/platform",
      },
      lists: {
        pillars: [
          {
            id: "single-record",
            isActive: true,
            icon: "Database",
            titleId: "Single Medical Record",
            titleEn: "Single Patient Record",
            descId: "Eliminasi duplikasi data pasien antar instalasi lab sentral, IGD, poliklinik, dan BDRS.",
            descEn: "Zero duplicate records across central lab, ER, outpatient wards, and transfusion units.",
          },
          {
            id: "gateway-buffer",
            isActive: true,
            icon: "Cpu",
            titleId: "Smart Gateway Buffer",
            titleEn: "Smart Gateway Buffer",
            descId: "Satu pintu komunikasi untuk seluruh instrumen analyzer dengan buffer offline aman saat jaringan down.",
            descEn: "Universal gateway for all analyzers equipped with resilient offline buffering during network blips.",
          },
          {
            id: "compliance",
            isActive: true,
            icon: "FileCheck2",
            titleId: "Kepatuhan KARS & ISO",
            titleEn: "Regulatory Compliance",
            descId: "Jejak audit digital otomatis siap diuji oleh asesor akreditasi KARS, JCI, dan ISO 15189 setiap saat.",
            descEn: "Immutable digital audit trail ready for KARS, JCI, and ISO 15189 surveys anytime.",
          },
        ],
      },
    },
    scalability: {
      fields: {
        primaryLabelId: "Jadwalkan Demo",
        primaryLabelEn: "Book a Demo",
        primaryUrl: "/request-demo",
        secondaryLabelId: "Lihat Paket Solusi",
        secondaryLabelEn: "Explore Solutions",
        secondaryUrl: "/solutions",
      },
      lists: {
        steps: [
          {
            id: "primary-clinics",
            isActive: true,
            valueId: "2.4x",
            valueEn: "2.4x",
            segmentId: "Klinik & Lab Pratama",
            segmentEn: "Primary Clinics",
            descId: "Otomatisasi registrasi & rilis hasil hematologi dasar.",
            descEn: "Automated intake & routine hematology sign-off.",
            volumeId: "< 300 sampel/hari",
            volumeEn: "< 300 samples/day",
          },
          {
            id: "regional-hospitals",
            isActive: true,
            valueId: "5.1x",
            valueEn: "5.1x",
            segmentId: "RS Tipe B & Tipe C",
            segmentEn: "Regional Hospitals",
            descId: "Bridging SIMRS, Westgard QC, dan modul BDRS terintegrasi.",
            descEn: "HIS bridging, Westgard QC & integrated blood bank.",
            volumeId: "300–2.000 sampel/hari",
            volumeEn: "300–2,000 samples/day",
          },
          {
            id: "reference-labs",
            isActive: true,
            valueId: "10x",
            valueEn: "10x",
            segmentId: "RS Rujukan & Lab Chain",
            segmentEn: "Reference Lab Chains",
            descId: "Auto-verifikasi Nova AI, PA/Mikro & sinkronisasi multi-cabang.",
            descEn: "Nova AI auto-verification, PA/Micro & multi-site sync.",
            volumeId: "",
            volumeEn: "",
          },
        ],
      },
    },
  },
};

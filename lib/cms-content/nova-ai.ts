import type { ContentFieldDef, PageContentSpec } from "@/lib/cms-page-content";

/**
 * Konten section bawaan halaman Nova AI yang dikelola CMS (Halaman & Section › Edit Konten).
 * defaults = teks persis seperti sebelum dipindah ke CMS (tampilan tidak berubah sampai admin menyimpan).
 */

/** Nama ikon lucide yang tersedia di halaman Nova AI (dipetakan ke komponen di NovaAIPageClient). */
const ICON_NAMES = [
  "ScanText",
  "GitBranch",
  "FileText",
  "ShieldCheck",
  "TrendingUp",
  "TrendingDown",
  "BarChart3",
  "Sparkles",
  "Mic",
  "Stethoscope",
  "Lock",
  "Server",
  "FileCheck2",
  "Cpu",
  "Zap",
  "Activity",
  "BadgeCheck",
  "BellRing",
  "CheckCircle2",
  "CheckCheck",
  "Clock",
  "AlertTriangle",
];

const iconField = (help?: string): ContentFieldDef => ({
  key: "icon",
  label: "Ikon",
  type: "select",
  options: ICON_NAMES.map((n) => ({ value: n, label: n })),
  help,
});

export const NOVA_AI_CONTENT: PageContentSpec = {
  defs: {
    "system-of-action": {
      help: "Perbandingan dua kartu: LIS konvensional (kiri) vs Diagnova Nova AI (kanan).",
      fields: [
        { key: "legacyTitle", label: "Kartu kiri — Judul", type: "text", required: true },
        { key: "legacyBadge", label: "Kartu kiri — Label badge", type: "text", required: true },
        { key: "modernTitle", label: "Kartu kanan — Judul", type: "text", required: true },
        { key: "modernBadge", label: "Kartu kanan — Label badge", type: "text", required: true },
      ],
      lists: [
        {
          key: "legacyPoints",
          label: "Kartu kiri — Poin (ikon silang)",
          itemLabel: "Poin",
          maxItems: 8,
          minItems: 1,
          fields: [{ key: "text", label: "Teks poin", type: "text", required: true }],
        },
        {
          key: "modernPoints",
          label: "Kartu kanan — Poin (ikon centang)",
          itemLabel: "Poin",
          maxItems: 8,
          minItems: 1,
          fields: [{ key: "text", label: "Teks poin", type: "text", required: true }],
        },
      ],
    },
    "workstation-demo": {
      help: "Kartu kapabilitas AI di meja kerja dokter (grid 3 kolom di desktop, geser horizontal di ponsel).",
      lists: [
        {
          key: "capabilities",
          label: "Kapabilitas",
          itemLabel: "Kapabilitas",
          maxItems: 12,
          minItems: 1,
          summaryField: "title",
          fields: [
            iconField(),
            { key: "title", label: "Judul", type: "text", required: true },
            { key: "status", label: "Status", type: "text", help: "Mis. \"Live in Production\", \"In Beta\", \"Q2 2026\"." },
            {
              key: "statusTone",
              label: "Warna status",
              type: "select",
              options: [
                { value: "primary", label: "Biru (tersedia / produksi)" },
                { value: "muted", label: "Abu-abu (beta / segera hadir)" },
              ],
            },
            { key: "desc", label: "Deskripsi", type: "textarea", required: true },
          ],
        },
      ],
    },
    "how-it-works": {
      help: "Kartu fitur AI (grid 2 kolom). Setiap kartu bawaan memiliki ilustrasi sendiri; kartu baru dapat memakai ilustrasi \"Tanpa ilustrasi\" (menampilkan ikon kartu).",
      lists: [
        {
          key: "cards",
          label: "Kartu fitur",
          itemLabel: "Kartu",
          maxItems: 8,
          minItems: 1,
          summaryField: "title",
          fields: [
            iconField(),
            { key: "title", label: "Judul", type: "text", required: true },
            {
              key: "points",
              label: "Poin-poin",
              type: "textarea",
              help: "Satu poin per baris.",
            },
            {
              key: "visual",
              label: "Ilustrasi",
              type: "select",
              options: [
                { value: "virtual-staining", label: "Monitor pewarnaan virtual (H&E / Virtual Staining)" },
                { value: "case-routing", label: "Monitor distribusi kasus (Smart Routing)" },
                { value: "voice-entry", label: "Dikte suara & isian otomatis" },
                { value: "presignout-review", label: "Saran koreksi pra-otorisasi" },
                { value: "none", label: "Tanpa ilustrasi (tampilkan ikon)" },
              ],
            },
          ],
        },
      ],
    },
    "ai-doctor": {
      help: "Banner tata kelola medis, badge kepatuhan, dan kartu lapisan pengaman.",
      fields: [
        { key: "governanceBadge", label: "Banner — Label badge", type: "text", required: true },
        { key: "governanceTitle", label: "Banner — Judul", type: "text", required: true },
        { key: "governanceDesc", label: "Banner — Deskripsi", type: "textarea", required: true },
        { key: "safeguardsTitle", label: "Judul kartu pengaman", type: "text", required: true },
        { key: "footnote", label: "Catatan penutup", type: "textarea" },
      ],
      lists: [
        {
          key: "complianceBadges",
          label: "Badge kepatuhan",
          itemLabel: "Badge",
          maxItems: 9,
          minItems: 1,
          summaryField: "code",
          help: "Ditampilkan dalam grid 3 kolom (2 kolom di ponsel).",
          fields: [
            { key: "code", label: "Kode / standar", type: "text", bilingual: false, required: true, max: 60 },
            { key: "label", label: "Keterangan", type: "text", required: true },
          ],
        },
        {
          key: "safeguards",
          label: "Kartu pengaman",
          itemLabel: "Kartu",
          maxItems: 8,
          minItems: 1,
          summaryField: "title",
          fields: [
            iconField(),
            { key: "title", label: "Judul", type: "text", required: true },
            { key: "desc", label: "Deskripsi", type: "textarea", required: true },
          ],
        },
      ],
    },
  },
  defaults: {
    "system-of-action": {
      fields: {
        legacyTitleId: "LIS Konvensional",
        legacyTitleEn: "Traditional LIS",
        legacyBadgeId: "System of Record (Pasif)",
        legacyBadgeEn: "System of Record",
        modernTitleId: "Diagnova Nova AI",
        modernTitleEn: "Diagnova Modern LIS",
        modernBadgeId: "System of Action (Aktif)",
        modernBadgeEn: "System of Action",
      },
      lists: {
        legacyPoints: [
          {
            id: "passive-storage",
            isActive: true,
            textId: "Hanya menyimpan & mengambil data hasil lab",
            textEn: "Passive data storage & retrieval",
          },
          {
            id: "manual-workflow",
            isActive: true,
            textId: "Manajemen alur kerja & verifikasi manual",
            textEn: "Manual workflow & validation management",
          },
          {
            id: "reactive-errors",
            isActive: true,
            textId: "Penanganan error bersifat reaktif setelah rilis",
            textEn: "Reactive error handling after sign-out",
          },
          {
            id: "static-reporting",
            isActive: true,
            textId: "Pelaporan statis tanpa analisis tren serial",
            textEn: "Static reporting without longitudinal context",
          },
        ],
        modernPoints: [
          {
            id: "realtime-delta",
            isActive: true,
            textId: "Interpretasi & delta-check longitudinal secara real-time",
            textEn: "Real-time interpretation & longitudinal delta-check",
          },
          {
            id: "auto-routing",
            isActive: true,
            textId: "Orkestrasi auto-verifikasi & routing kasus otomatis",
            textEn: "Automated workflow orchestration & smart case routing",
          },
          {
            id: "panic-triage",
            isActive: true,
            textId: "Deteksi dini nilai kritis & inkonsistensi pra-otorisasi",
            textEn: "Proactive panic triage & pre-signout inconsistency alerts",
          },
          {
            id: "structured-drafts",
            isActive: true,
            textId: "Draf narasi medis terstruktur siap otorisasi dokter Sp.PK",
            textEn: "Structured clinical drafts ready for pathologist sign-off",
          },
        ],
      },
    },
    "workstation-demo": {
      fields: {},
      lists: {
        capabilities: [
          {
            id: "analysis-imaging",
            isActive: true,
            icon: "ScanText",
            titleId: "Analisis & Pencitraan Sel",
            titleEn: "Analysis & Imaging",
            statusId: "Tersedia di Ekosistem",
            statusEn: "Available in the Marketplace",
            statusTone: "primary",
            descId:
              "Pewarnaan virtual berbasis AI, kuantifikasi gambar otomatis, dan pra-skrining cerdas untuk mempercepat tinjauan serta akurasi diagnostik.",
            descEn:
              "AI-powered virtual staining, automated image quantification, and intelligent pre-screening to accelerate review and enhance diagnostic efficiency.",
          },
          {
            id: "workflow-optimization",
            isActive: true,
            icon: "GitBranch",
            titleId: "Optimasi Alur Kerja",
            titleEn: "Workflow Optimization",
            statusId: "Live in Production",
            statusEn: "Live in Production",
            statusTone: "primary",
            descId:
              "Distribusi kasus cerdas yang menyeimbangkan beban kerja dokter patologi serta entri hasil bebas genggam.",
            descEn: "Intelligent case distribution optimizing pathologist workload with hands-free result entry.",
          },
          {
            id: "specimen-order",
            isActive: true,
            icon: "FileText",
            titleId: "Pemrosesan Order & Spesimen",
            titleEn: "Specimen & Order Processing",
            statusId: "Live in Production",
            statusEn: "Live in Production",
            statusTone: "primary",
            descId:
              "Konversi formulir permintaan kertas menjadi order digital berbasis OCR serta anotasi dan validasi spesimen otomatis.",
            descEn: "OCR conversion of paper requests to digital orders and AI-powered measurement/annotation of specimens.",
          },
          {
            id: "quality-consistency",
            isActive: true,
            icon: "ShieldCheck",
            titleId: "Kualitas & Konsistensi",
            titleEn: "Quality & Consistency",
            statusId: "In Beta",
            statusEn: "In Beta",
            statusTone: "muted",
            descId:
              "Asisten AI menandai inkonsistensi terminologi dan kode ICD-10 untuk menjamin kejelasan laporan sebelum otorisasi.",
            descEn: "AI assistant flags inconsistencies to ensure clarity and consistency before signing out.",
          },
          {
            id: "delta-check-triage",
            isActive: true,
            icon: "TrendingUp",
            titleId: "Delta-Check & Triage Kritis",
            titleEn: "Delta-Check & Critical Triage",
            statusId: "Live in Production",
            statusEn: "Live in Production",
            statusTone: "primary",
            descId:
              "Kalkulasi tren serial otomatis antar-kunjungan pasien dan penyiaran nilai kritis KARS dalam hitungan menit.",
            descEn: "Automated serial trend calculations across visits with instant KARS-compliant critical panic alerts.",
          },
          {
            id: "intelligence-analytics",
            isActive: true,
            icon: "BarChart3",
            titleId: "Inteligensi & Analitik",
            titleEn: "Intelligence & Analytics",
            statusId: "Q2 2026",
            statusEn: "Q2 2026",
            statusTone: "muted",
            descId:
              "Analitik bahasa natural memungkinkan tim menanyakan data operasional dan bottleneck TAT secara percakapan real-time.",
            descEn:
              "Natural language analytics allow teams to query data conversationally, unlocking real-time operational and financial insights.",
          },
        ],
      },
    },
    "how-it-works": {
      fields: {},
      lists: {
        cards: [
          {
            id: "virtual-staining",
            isActive: true,
            icon: "Sparkles",
            titleId: "Pewarnaan Virtual Berbasis AI",
            titleEn: "AI-Powered Virtual Staining",
            pointsId: [
              "Menjaga integritas jaringan biopsi berharga",
              "Mempercepat waktu rilis hasil (TAT)",
              "Memungkinkan triage kasus darurat lebih cepat",
              "Mengurangi variabilitas preparasi slide",
              "Menurunkan beban kerja teknis lab basah",
            ].join("\n"),
            pointsEn: [
              "Preserves precious tissue",
              "Improves turnaround time (TAT)",
              "Enables rapid case triage",
              "Reduces slide preparation variability",
              "Lowers manual labor demands",
            ].join("\n"),
            visual: "virtual-staining",
          },
          {
            id: "case-optimization",
            isActive: true,
            icon: "GitBranch",
            titleId: "Optimasi Kasus & Beban Kerja Dinamis",
            titleEn: "Dynamic Case & Resource Optimization",
            pointsId: [
              "Prioritas kasus berdasarkan TAT, urgensi, & kompleksitas",
              "Menyeimbangkan beban kerja antar dokter Sp.PK",
              "Memprediksi bottleneck harian dan mingguan",
              "Peringatan proaktif saat mendekati ambang batas SLA/TAT",
              "Rekomendasi penyesuaian staf secara proaktif",
            ].join("\n"),
            pointsEn: [
              "Prioritizes cases based on TAT, payer type, and complexity",
              "Balances workload across pathologists",
              "Predicts daily and weekly bottlenecks",
              "Alerts teams as cases approach SLA/TAT thresholds",
              "Suggests staffing adjustments proactively",
            ].join("\n"),
            visual: "case-routing",
          },
          {
            id: "hands-free-entry",
            isActive: true,
            icon: "Mic",
            titleId: "Entri Hasil Bebas Genggam",
            titleEn: "Hands-Free Result Entry",
            pointsId: [
              "Dikte klinis speech-to-text bertenaga AI",
              "Navigasi sistem berbasis perintah suara (speech-to-operate)",
              "Pengisian template laporan otomatis sesuai konteks",
            ].join("\n"),
            pointsEn: [
              "AI-powered speech-to-text",
              "Voice-driven system navigation (speech-to-operate)",
              "Context-aware template autofill",
            ].join("\n"),
            visual: "voice-entry",
          },
          {
            id: "presignout-review",
            isActive: true,
            icon: "Stethoscope",
            titleId: "Review Pra-Otorisasi & Pelaporan",
            titleEn: "Pre-Signout Review & Reporting Support",
            pointsId: [
              "Meningkatkan kejelasan dan keringkasan laporan medis",
              "Menjaga konsistensi terminologi klinis terstandar",
              "Menyarankan pemeriksaan lanjutan & diagnosis banding",
              "Terintegrasi dengan basis pengetahuan klinis terverifikasi",
            ].join("\n"),
            pointsEn: [
              "Enhances clarity and conciseness of reports",
              "Promotes consistency in terminology",
              "Suggests IHCs and differential diagnoses",
              "Integrates clinical knowledge support tools",
            ].join("\n"),
            visual: "presignout-review",
          },
        ],
      },
    },
    "ai-doctor": {
      fields: {
        governanceBadgeId: "Standar Tata Kelola Medis",
        governanceBadgeEn: "Medical Governance Standard",
        governanceTitleId: "100% Otoritas Diagnosis Tetap di Tangan Dokter Sp.PK",
        governanceTitleEn: "100% Diagnostic Authority Remains with Certified Physicians",
        governanceDescId:
          "Sistem komputasi hanya menyajikan kalkulasi delta-check, draf interpretasi, dan peringatan nilai kritis. Penetapan diagnosis definitif, peresepan terapi, serta tanda tangan digital resmi (BSrE) mutlak dilakukan oleh dokter yang memiliki STR dan SIP aktif.",
        governanceDescEn:
          "Computational agents only provide delta-check calculations, draft narratives, and critical panic alerts. Definitive diagnosis, treatment orders, and BSrE digital sign-off remain exclusively under licensed physicians.",
        safeguardsTitleId: "Lapisan Pengaman Klinis dari Order hingga Rilis Laporan",
        safeguardsTitleEn: "Protect Sensitive Clinical Data From Order to Report",
        footnoteId:
          "Bersama-sama, seluruh lapisan pengaman ini memastikan data laboratorium tetap aman, terverifikasi dokter, dan siap diaudit setiap saat.",
        footnoteEn:
          "Together, these safeguards keep laboratory data secure, physician-verified, and audit-ready throughout the testing process.",
      },
      lists: {
        complianceBadges: [
          { id: "uu-17-2023", isActive: true, code: "UU 17/2023", labelId: "Akuntabilitas Medis", labelEn: "Medical Law" },
          { id: "pmk-24-2022", isActive: true, code: "PMK 24/2022", labelId: "RME & SATUSEHAT", labelEn: "RME & SATUSEHAT" },
          { id: "kars-skp-2-2", isActive: true, code: "KARS SKP 2.2", labelId: "Nilai Kritis < 15m", labelEn: "Panic SLA < 15m" },
          { id: "iso-15189", isActive: true, code: "ISO 15189", labelId: "Mutu Lab Medik", labelEn: "Lab Quality" },
          { id: "bsre-esign", isActive: true, code: "BSrE E-Sign", labelId: "Tanda Tangan Sah", labelEn: "Digital Sign-Off" },
          { id: "tls-1-3", isActive: true, code: "TLS 1.3", labelId: "Enkripsi End-to-End", labelEn: "Encrypted" },
        ],
        safeguards: [
          {
            id: "physician-sovereignty",
            isActive: true,
            icon: "Stethoscope",
            titleId: "Otoritas Mutlak Dokter",
            titleEn: "Physician Sovereignty",
            descId:
              "AI hanya menyusun draf pendukung; dokter Sp.PK berwenang penuh menilai, menyunting, atau menolak rekomendasi.",
            descEn:
              "AI drafts only assist; certified pathologists retain full authority to review, edit, or override recommendations.",
          },
          {
            id: "rbac",
            isActive: true,
            icon: "Lock",
            titleId: "Kontrol Akses & RBAC",
            titleEn: "Role-Based Access Control",
            descId:
              "Pembatasan hak akses berbasis peran serta pengesahan tanda tangan elektronik tersertifikasi BSrE.",
            descEn:
              "Granular role-based permissions combined with accredited cryptographic digital signatures for every release.",
          },
          {
            id: "encryption",
            isActive: true,
            icon: "Server",
            titleId: "Enkripsi End-to-End",
            titleEn: "End-to-End Encryption",
            descId:
              "Mengamankan data klinis pasien saat transmisi (TLS 1.3) maupun penyimpanan basis data rumah sakit.",
            descEn: "Encrypts sensitive laboratory telemetry and patient demographics both in transit and at rest.",
          },
          {
            id: "audit-trails",
            isActive: true,
            icon: "FileCheck2",
            titleId: "Jejak Audit Digital",
            titleEn: "Immutable Audit Trails",
            descId:
              "Merekam setiap perubahan draf, riwayat delta, dan waktu pelaporan nilai kritis untuk inspeksi akreditasi.",
            descEn:
              "Maintains detailed audit trails across every draft edit and critical alert to support regulatory inspections.",
          },
        ],
      },
    },
  },
};

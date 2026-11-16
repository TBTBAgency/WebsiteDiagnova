import type { CmsPageDefinition } from "@/lib/cms/types";

/**
 * Definisi CMS halaman Nova AI (/nova-ai) + konten default (= teks yang sebelumnya ada di kode).
 * Urutan key `sections` = urutan tampil.
 */
export const novaAiPage = {
  pageKey: "nova-ai",
  sections: {
    hero: {
      label: "Hero",
      content: {
        badge: {
          id: "Clinical Decision Support System (CDSS)",
          en: "Clinical Decision Support System (CDSS)",
        },
        title: {
          id: "Otomasi Delta-Check & \nValidasi Cerdas Hasil Laboratorium",
          en: "Automated Delta-Check & \nIntelligent Laboratory Validation",
        },
        subtitle: {
          id: "Mempercepat waktu rilis hasil uji (TAT), mendeteksi deviasi biomarker longitudinal antar-kunjungan pasien, dan menyiapkan draf interpretasi klinis—dengan 100% kendali verifikasi di tangan dokter spesialis patologi.",
          en: "Slashing turnaround time (TAT), flagging longitudinal biomarker deviations across patient visits, and preparing structured clinical drafts—with 100% verification authority retained by certified pathologists.",
        },
        primaryCtaText: { id: "Jadwalkan Demo Nova AI", en: "Schedule Nova AI Demo" },
        primaryCtaHref: "/request-demo",
        secondaryCtaText: { id: "Lihat Meja Kerja Patologi", en: "Explore Pathologist Desk" },
        secondaryCtaHref: "#workstation-demo",
        metrics: [
          {
            id: "tat",
            value: { id: "-70%", en: "-70%" },
            label: { id: "Pangkas Waktu Validasi", en: "Turnaround Time (TAT)" },
            sub: { id: "Auto-verifikasi sampel normal", en: "Auto-release normal routine" },
          },
          {
            id: "delta-speed",
            value: { id: "< 3 Detik", en: "< 3 Sec" },
            label: { id: "Kalkulasi Delta-Check", en: "Delta-Check Speed" },
            sub: { id: "Komparasi riwayat serial", en: "Serial trend comparison" },
          },
          {
            id: "physician-control",
            value: { id: "100%", en: "100%" },
            label: { id: "Kendali Dokter Sp.PK", en: "Physician Sovereignty" },
            sub: { id: "Human-in-the-loop mutlak", en: "Absolute clinical control" },
          },
          {
            id: "compliance",
            value: { id: "KARS & ISO", en: "KARS & ISO" },
            label: { id: "Kepatuhan Akreditasi", en: "Audit Compliance" },
            sub: { id: "Standar pelaporan nilai kritis", en: "Accredited critical protocol" },
          },
        ],
      },
    },

    paradigm: {
      label: "System of Record vs System of Action",
      content: {
        badge: { id: "Paradigma Baru LIS", en: "The LIS System of Action" },
        title: {
          id: "Dari System of Record Menuju System of Action",
          en: "From System of Record to System of Action",
        },
        description: {
          id: "LIS konvensional berhenti pada pencatatan pasif. Nova AI membaca konteks klinis secara aktif—mengekstrak order, menghitung tren delta, dan menyiapkan draf laporan siap sah.",
          en: "Traditional LIS stops at passive record-keeping. Nova AI reads clinical context actively—extracting orders, computing delta trends, and preparing sign-off-ready drafts.",
        },
        traditionalTitle: { id: "LIS Konvensional", en: "Traditional LIS" },
        traditionalPill: { id: "System of Record (Pasif)", en: "System of Record" },
        traditionalItems: [
          {
            id: "passive-storage",
            text: { id: "Hanya menyimpan & mengambil data hasil lab", en: "Passive data storage & retrieval" },
          },
          {
            id: "manual-workflow",
            text: { id: "Manajemen alur kerja & verifikasi manual", en: "Manual workflow & validation management" },
          },
          {
            id: "reactive-errors",
            text: { id: "Penanganan error bersifat reaktif setelah rilis", en: "Reactive error handling after sign-out" },
          },
          {
            id: "static-reporting",
            text: {
              id: "Pelaporan statis tanpa analisis tren serial",
              en: "Static reporting without longitudinal context",
            },
          },
        ],
        novaTitle: { id: "Diagnova Nova AI", en: "Diagnova Modern LIS" },
        novaPill: { id: "System of Action (Aktif)", en: "System of Action" },
        novaItems: [
          {
            id: "realtime-interpretation",
            text: {
              id: "Interpretasi & delta-check longitudinal secara real-time",
              en: "Real-time interpretation & longitudinal delta-check",
            },
          },
          {
            id: "auto-verification",
            text: {
              id: "Orkestrasi auto-verifikasi & routing kasus otomatis",
              en: "Automated workflow orchestration & smart case routing",
            },
          },
          {
            id: "panic-triage",
            text: {
              id: "Deteksi dini nilai kritis & inkonsistensi pra-otorisasi",
              en: "Proactive panic triage & pre-signout inconsistency alerts",
            },
          },
          {
            id: "structured-drafts",
            text: {
              id: "Draf narasi medis terstruktur siap otorisasi dokter Sp.PK",
              en: "Structured clinical drafts ready for pathologist sign-off",
            },
          },
        ],
      },
    },

    workstation: {
      label: "Meja Kerja Patologi & Kapabilitas AI (#workstation-demo)",
      content: {
        badge: { id: "Meja Kerja Patologi Klinik", en: "Pathologist Workstation" },
        title: {
          id: "Bagaimana Nova AI Mendukung Otorisasi Dokter",
          en: "How Nova AI Powers Pathologist Sign-Off Workflows",
        },
        description: {
          id: "Enam kapabilitas agen cerdas yang tertanam langsung di meja kerja dokter Sp.PK—mempercepat validasi tanpa mengurangi otoritas medis.",
          en: "Six embedded AI capabilities inside the pathologist desk—accelerating sign-off without altering physician authority.",
        },
        // statusTone: "active" (biru) | "muted" (abu-abu)
        items: [
          {
            id: "analysis-imaging",
            iconName: "ScanText",
            title: { id: "Analisis & Pencitraan Sel", en: "Analysis & Imaging" },
            status: { id: "Tersedia di Ekosistem", en: "Available in the Marketplace" },
            statusTone: "active",
            desc: {
              id: "Pewarnaan virtual berbasis AI, kuantifikasi gambar otomatis, dan pra-skrining cerdas untuk mempercepat tinjauan serta akurasi diagnostik.",
              en: "AI-powered virtual staining, automated image quantification, and intelligent pre-screening to accelerate review and enhance diagnostic efficiency.",
            },
          },
          {
            id: "workflow-optimization",
            iconName: "GitBranch",
            title: { id: "Optimasi Alur Kerja", en: "Workflow Optimization" },
            status: { id: "Live in Production", en: "Live in Production" },
            statusTone: "active",
            desc: {
              id: "Distribusi kasus cerdas yang menyeimbangkan beban kerja dokter patologi serta entri hasil bebas genggam.",
              en: "Intelligent case distribution optimizing pathologist workload with hands-free result entry.",
            },
          },
          {
            id: "order-processing",
            iconName: "FileText",
            title: { id: "Pemrosesan Order & Spesimen", en: "Specimen & Order Processing" },
            status: { id: "Live in Production", en: "Live in Production" },
            statusTone: "active",
            desc: {
              id: "Konversi formulir permintaan kertas menjadi order digital berbasis OCR serta anotasi dan validasi spesimen otomatis.",
              en: "OCR conversion of paper requests to digital orders and AI-powered measurement/annotation of specimens.",
            },
          },
          {
            id: "quality-consistency",
            iconName: "ShieldCheck",
            title: { id: "Kualitas & Konsistensi", en: "Quality & Consistency" },
            status: { id: "In Beta", en: "In Beta" },
            statusTone: "muted",
            desc: {
              id: "Asisten AI menandai inkonsistensi terminologi dan kode ICD-10 untuk menjamin kejelasan laporan sebelum otorisasi.",
              en: "AI assistant flags inconsistencies to ensure clarity and consistency before signing out.",
            },
          },
          {
            id: "delta-check-triage",
            iconName: "TrendingUp",
            title: { id: "Delta-Check & Triage Kritis", en: "Delta-Check & Critical Triage" },
            status: { id: "Live in Production", en: "Live in Production" },
            statusTone: "active",
            desc: {
              id: "Kalkulasi tren serial otomatis antar-kunjungan pasien dan penyiaran nilai kritis KARS dalam hitungan menit.",
              en: "Automated serial trend calculations across visits with instant KARS-compliant critical panic alerts.",
            },
          },
          {
            id: "intelligence-analytics",
            iconName: "BarChart3",
            title: { id: "Inteligensi & Analitik", en: "Intelligence & Analytics" },
            status: { id: "Q2 2026", en: "Q2 2026" },
            statusTone: "muted",
            desc: {
              id: "Analitik bahasa natural memungkinkan tim menanyakan data operasional dan bottleneck TAT secara percakapan real-time.",
              en: "Natural language analytics allow teams to query data conversationally, unlocking real-time operational and financial insights.",
            },
          },
        ],
      },
    },

    pipeline: {
      label: "Alur Kerja 4 Tahap — Header (#how-it-works)",
      content: {
        badge: { id: "Alur Kerja 4 Tahap", en: "4-Stage Clinical Pipeline" },
        title: {
          id: "Alur Kerja Terstruktur yang Menjamin Presisi & Keselamatan Pasien",
          en: "Structured Pipeline Safeguarding Clinical Integrity & Accuracy",
        },
        description: {
          id: "Dari pembacaan instrumen analitik hingga otorisasi digital dokter spesialis, setiap tahap didesain dengan ketertelusuran penuh dan kepatuhan akreditasi rumah sakit.",
          en: "From direct analyzer telemetry to certified pathologist authorization, every phase is engineered with full audit traceability and hospital accreditation standards.",
        },
      },
    },

    virtualStaining: {
      label: "Alur Kerja — Kartu Pewarnaan Virtual",
      content: {
        title: { id: "Pewarnaan Virtual Berbasis AI", en: "AI-Powered Virtual Staining" },
        items: [
          {
            id: "preserve-tissue",
            text: { id: "Menjaga integritas jaringan biopsi berharga", en: "Preserves precious tissue" },
          },
          {
            id: "improve-tat",
            text: { id: "Mempercepat waktu rilis hasil (TAT)", en: "Improves turnaround time (TAT)" },
          },
          {
            id: "rapid-triage",
            text: { id: "Memungkinkan triage kasus darurat lebih cepat", en: "Enables rapid case triage" },
          },
          {
            id: "reduce-variability",
            text: { id: "Mengurangi variabilitas preparasi slide", en: "Reduces slide preparation variability" },
          },
          {
            id: "lower-labor",
            text: { id: "Menurunkan beban kerja teknis lab basah", en: "Lowers manual labor demands" },
          },
        ],
        toggleOffLabel: { id: "H&E", en: "H&E" },
        toggleOnLabel: { id: "Virtual Staining", en: "Virtual Staining" },
        toggleAriaLabel: { id: "Toggle Virtual Staining", en: "Toggle Virtual Staining" },
        stainBadge: "Ki-67: 18.4%",
        magnificationBadge: "40x WSI",
        pillText: { id: "Tanpa proses lab basah", en: "Without wet lab work" },
      },
    },

    caseRouting: {
      label: "Alur Kerja — Kartu Optimasi Kasus & Beban Kerja",
      content: {
        title: { id: "Optimasi Kasus & Beban Kerja Dinamis", en: "Dynamic Case & Resource Optimization" },
        items: [
          {
            id: "prioritize-cases",
            text: {
              id: "Prioritas kasus berdasarkan TAT, urgensi, & kompleksitas",
              en: "Prioritizes cases based on TAT, payer type, and complexity",
            },
          },
          {
            id: "balance-workload",
            text: { id: "Menyeimbangkan beban kerja antar dokter Sp.PK", en: "Balances workload across pathologists" },
          },
          {
            id: "predict-bottlenecks",
            text: { id: "Memprediksi bottleneck harian dan mingguan", en: "Predicts daily and weekly bottlenecks" },
          },
          {
            id: "sla-alerts",
            text: {
              id: "Peringatan proaktif saat mendekati ambang batas SLA/TAT",
              en: "Alerts teams as cases approach SLA/TAT thresholds",
            },
          },
          {
            id: "staffing-suggestions",
            text: {
              id: "Rekomendasi penyesuaian staf secara proaktif",
              en: "Suggests staffing adjustments proactively",
            },
          },
        ],
        // Ilustrasi: 3 kasus (kiri) & 3 dokter (kanan); garis penghubung SVG dirancang untuk 3 baris.
        cases: [
          { id: "case-9435", label: "CASE #9435", sub: { id: "CITO • IGD", en: "CITO • IGD" } },
          { id: "case-7889", label: "CASE #7889", sub: { id: "", en: "" } },
          { id: "case-9102", label: "CASE #9102", sub: { id: "", en: "" } },
        ],
        hubLabel: { id: "Smart Routing", en: "Smart Routing" },
        doctors: [
          { id: "dr-hendra", name: "dr. Hendra", load: "32%" },
          { id: "dr-ratna", name: "dr. Ratna", load: "28%" },
          { id: "dr-budi", name: "dr. Budi", load: "45%" },
        ],
      },
    },

    voiceEntry: {
      label: "Alur Kerja — Kartu Entri Hasil Bebas Genggam",
      content: {
        title: { id: "Entri Hasil Bebas Genggam", en: "Hands-Free Result Entry" },
        items: [
          {
            id: "speech-to-text",
            text: { id: "Dikte klinis speech-to-text bertenaga AI", en: "AI-powered speech-to-text" },
          },
          {
            id: "speech-to-operate",
            text: {
              id: "Navigasi sistem berbasis perintah suara (speech-to-operate)",
              en: "Voice-driven system navigation (speech-to-operate)",
            },
          },
          {
            id: "template-autofill",
            text: {
              id: "Pengisian template laporan otomatis sesuai konteks",
              en: "Context-aware template autofill",
            },
          },
        ],
        diagnosisLabel: { id: "DIAGNOSIS:", en: "DIAGNOSIS:" },
        diagnosisValue: { id: "Anemia Normositik (D64.9)", en: "Malignant Melanoma (T4b)" },
        specimenLabel: { id: "SPESIMEN:", en: "SPECIMEN:" },
        specimenValue: { id: "Darah EDTA • Lab Sentral", en: "Skin, Left Forearm" },
      },
    },

    presignoutReview: {
      label: "Alur Kerja — Kartu Review Pra-Otorisasi",
      content: {
        title: { id: "Review Pra-Otorisasi & Pelaporan", en: "Pre-Signout Review & Reporting Support" },
        items: [
          {
            id: "clarity",
            text: {
              id: "Meningkatkan kejelasan dan keringkasan laporan medis",
              en: "Enhances clarity and conciseness of reports",
            },
          },
          {
            id: "terminology",
            text: {
              id: "Menjaga konsistensi terminologi klinis terstandar",
              en: "Promotes consistency in terminology",
            },
          },
          {
            id: "differential",
            text: {
              id: "Menyarankan pemeriksaan lanjutan & diagnosis banding",
              en: "Suggests IHCs and differential diagnoses",
            },
          },
          {
            id: "knowledge-base",
            text: {
              id: "Terintegrasi dengan basis pengetahuan klinis terverifikasi",
              en: "Integrates clinical knowledge support tools",
            },
          },
        ],
        inputText: { id: "Carcino", en: "Carcino" },
        suggestionText: {
          id: "Maksud Anda 'Carcinoma'? Kode ICD-10 diperbarui.",
          en: "Did you mean 'Carcinoma'? ICD-10 Code updated.",
        },
      },
    },

    governance: {
      label: "Tata Kelola Klinis & Keamanan Data (#ai-doctor)",
      content: {
        badge: { id: "Tata Kelola Klinis & Keamanan Data", en: "Clinical Governance & Security" },
        title: {
          id: "Kepatuhan & Keamanan untuk Data Klinis Sensitif",
          en: "Compliance & Security Built for Clinical Data",
        },
        description: {
          id: "Nova AI beroperasi dengan prinsip Human-in-the-Loop mutlak—mempercepat analisis data laboratorium sekaligus menjaga otoritas hukum dokter dan keamanan rekam medis.",
          en: "Nova AI operates under strict Human-in-the-Loop governance—accelerating lab intelligence while safeguarding physician sovereignty and patient record security.",
        },
        bannerBadge: { id: "Standar Tata Kelola Medis", en: "Medical Governance Standard" },
        bannerTitle: {
          id: "100% Otoritas Diagnosis Tetap di Tangan Dokter Sp.PK",
          en: "100% Diagnostic Authority Remains with Certified Physicians",
        },
        bannerDescription: {
          id: "Sistem komputasi hanya menyajikan kalkulasi delta-check, draf interpretasi, dan peringatan nilai kritis. Penetapan diagnosis definitif, peresepan terapi, serta tanda tangan digital resmi (BSrE) mutlak dilakukan oleh dokter yang memiliki STR dan SIP aktif.",
          en: "Computational agents only provide delta-check calculations, draft narratives, and critical panic alerts. Definitive diagnosis, treatment orders, and BSrE digital sign-off remain exclusively under licensed physicians.",
        },
        complianceBadges: [
          { id: "uu-17-2023", code: "UU 17/2023", label: { id: "Akuntabilitas Medis", en: "Medical Law" } },
          { id: "pmk-24-2022", code: "PMK 24/2022", label: { id: "RME & SATUSEHAT", en: "RME & SATUSEHAT" } },
          { id: "kars-skp-2-2", code: "KARS SKP 2.2", label: { id: "Nilai Kritis < 15m", en: "Panic SLA < 15m" } },
          { id: "iso-15189", code: "ISO 15189", label: { id: "Mutu Lab Medik", en: "Lab Quality" } },
          { id: "bsre-esign", code: "BSrE E-Sign", label: { id: "Tanda Tangan Sah", en: "Digital Sign-Off" } },
          { id: "tls-1-3", code: "TLS 1.3", label: { id: "Enkripsi End-to-End", en: "Encrypted" } },
        ],
        safeguardsTitle: {
          id: "Lapisan Pengaman Klinis dari Order hingga Rilis Laporan",
          en: "Protect Sensitive Clinical Data From Order to Report",
        },
        safeguards: [
          {
            id: "physician-sovereignty",
            iconName: "Stethoscope",
            title: { id: "Otoritas Mutlak Dokter", en: "Physician Sovereignty" },
            desc: {
              id: "AI hanya menyusun draf pendukung; dokter Sp.PK berwenang penuh menilai, menyunting, atau menolak rekomendasi.",
              en: "AI drafts only assist; certified pathologists retain full authority to review, edit, or override recommendations.",
            },
          },
          {
            id: "rbac",
            iconName: "Lock",
            title: { id: "Kontrol Akses & RBAC", en: "Role-Based Access Control" },
            desc: {
              id: "Pembatasan hak akses berbasis peran serta pengesahan tanda tangan elektronik tersertifikasi BSrE.",
              en: "Granular role-based permissions combined with accredited cryptographic digital signatures for every release.",
            },
          },
          {
            id: "encryption",
            iconName: "Server",
            title: { id: "Enkripsi End-to-End", en: "End-to-End Encryption" },
            desc: {
              id: "Mengamankan data klinis pasien saat transmisi (TLS 1.3) maupun penyimpanan basis data rumah sakit.",
              en: "Encrypts sensitive laboratory telemetry and patient demographics both in transit and at rest.",
            },
          },
          {
            id: "audit-trail",
            iconName: "FileCheck2",
            title: { id: "Jejak Audit Digital", en: "Immutable Audit Trails" },
            desc: {
              id: "Merekam setiap perubahan draf, riwayat delta, dan waktu pelaporan nilai kritis untuk inspeksi akreditasi.",
              en: "Maintains detailed audit trails across every draft edit and critical alert to support regulatory inspections.",
            },
          },
        ],
        safeguardsFootnote: {
          id: "Bersama-sama, seluruh lapisan pengaman ini memastikan data laboratorium tetap aman, terverifikasi dokter, dan siap diaudit setiap saat.",
          en: "Together, these safeguards keep laboratory data secure, physician-verified, and audit-ready throughout the testing process.",
        },
      },
    },

    cta: {
      label: "CTA Banner",
      content: {
        title: {
          id: "Transformasi Laboratorium Anda Bersama Diagnova",
          en: "Transform Your Laboratory with Diagnova",
        },
        subtitle: {
          id: "Hadirkan keandalan tinggi, kecepatan analisis, dan presisi klinis bagi institusi kesehatan Anda hari ini.",
          en: "Bring high reliability, speed, and precision to your healthcare institution today.",
        },
        buttonText: { id: "Minta Demo", en: "Request Demo" },
        placeholder: { id: "Masukkan alamat email Anda", en: "Enter your email address" },
      },
    },
  },
} satisfies CmsPageDefinition;

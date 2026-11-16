import type { CmsPageDefinition } from "@/lib/cms/types";

/**
 * Definisi CMS halaman /modules dan /modules/[slug] (page_key "modules").
 * Nilai default = copy yang sebelumnya tertulis langsung di app/(marketing)/modules/page.tsx,
 * app/(marketing)/modules/[slug]/page.tsx dan content/modules.ts (section `modules`),
 * serta default bawaan CTABanner untuk section `cta`.
 *
 * Catatan section `modules`: copy lama halaman detail hanya berbahasa Indonesia, sehingga
 * nilai `en` default disamakan dengan `id` (tampilan identik di kedua bahasa) dan dapat diterjemahkan di CMS.
 * Placeholder `{name}` pada `ctaTitle` / `ctaDesc` diganti dengan nama modul.
 */
export const modulesPage = {
  pageKey: "modules",
  sections: {
    hero: {
      label: "Hero",
      content: {
        badge: { id: "Modul Terintegrasi Diagnova", en: "Diagnova Modular Suite" },
        title: {
          id: "Modul Spesialisasi yang \nSaling Terhubung Tanpa Hambatan",
          en: "Connected Modules for \nSpecialized Laboratory Care",
        },
        subtitle: {
          id: "Aktifkan modul sesuai kebutuhan faskes Anda atau jalankan sebagai satu kesatuan. Seluruh data pasien, sampel, dan hasil mengalir dalam satu sistem yang aman dan siap akreditasi.",
          en: "Deploy individual modules or run the complete unified suite. All patient data, specimens, and analyzer results converge in a secure, accreditation-ready environment.",
        },
        primaryCta: {
          text: { id: "Jadwalkan Demo Modul", en: "Schedule Module Demo" },
          href: "/request-demo",
        },
        secondaryCta: {
          text: { id: "Eksplorasi 5 Modul", en: "Explore 5 Modules" },
          href: "#modules-explorer",
        },
        metrics: [
          {
            id: "m-1",
            value: { id: "5 Modul", en: "5 Modules" },
            label: { id: "Spesialisasi Lengkap", en: "Dedicated Modules" },
            sub: { id: "Rutin, BDRS, Stok, PA, Mikro", en: "Hematology, Blood, Reagents, PA" },
          },
          {
            id: "m-2",
            value: { id: "100%", en: "100%" },
            label: { id: "Interfacing Analyzer", en: "Analyzer Interfacing" },
            sub: { id: "ASTM & HL7 bidireksional", en: "Direct bidirectional protocol" },
          },
          {
            id: "m-3",
            value: { id: "0 Error", en: "0 Error" },
            label: { id: "Salah Identifikasi", en: "Zero Sample Mix-ups" },
            sub: { id: "Barcode 2D & delta-check", en: "2D micro-barcode tracking" },
          },
          {
            id: "m-4",
            value: { id: "Plug & Play", en: "Plug & Play" },
            label: { id: "Aktivasi Modular", en: "Modular Activation" },
            sub: { id: "Bebas tambah modul bertahap", en: "Deploy on-demand per dept" },
          },
        ],
      },
    },

    reporting: {
      label: "Nova AI • Pelaporan Pasien (Interaktif)",
      content: {
        badge: { id: "Nova AI • Pelaporan Pasien", en: "Nova AI • Patient Reporting" },
        title: {
          id: "Laporan Pasien Cerdas dengan Validasi Klinis Penuh",
          en: "Intelligent Patient Reporting with Full Clinical Oversight",
        },
        subtitle: {
          id: "Nova AI menerjemahkan hasil patologi dan laboratorium yang kompleks menjadi ringkasan yang jelas, empatik, dan mudah dipahami pasien—tanpa mengurangi otoritas diagnostik dokter.",
          en: "Nova AI translates complex laboratory and pathology findings into clear, empathetic patient summaries—while keeping diagnostic authority firmly with the attending physician.",
        },
        features: [
          {
            id: "rf-1",
            iconName: "FileCheck2",
            title: { id: "Penjelasan Hasil Lab yang Mudah Dipahami", en: "Clear Translation of Complex Findings" },
            points: [
              {
                id: "p-1",
                text: {
                  id: "Mengubah terminologi medis & nilai rujukan teknis menjadi narasi ramah pasien",
                  en: "Transforms technical medical terminology into clear, everyday patient language",
                },
              },
              {
                id: "p-2",
                text: {
                  id: "Menyoroti temuan utama dan indikator kritis secara terstruktur tanpa memicu kecemasan",
                  en: "Highlights key findings and critical markers clearly without causing unnecessary anxiety",
                },
              },
            ],
          },
          {
            id: "rf-2",
            iconName: "HeartPulse",
            title: { id: "Panduan Pola Hidup Berbasis Bukti", en: "Evidence-Based Lifestyle Guidance" },
            points: [
              {
                id: "p-1",
                text: {
                  id: "Memberikan rekomendasi nutrisi, hidrasi, dan kebiasaan harian selaras hasil tes",
                  en: "Delivers tailored nutrition, hydration, and daily wellness guidance aligned with results",
                },
              },
              {
                id: "p-2",
                text: {
                  id: "Membantu pasien mengambil langkah preventif terarah sebelum jadwal kontrol berikutnya",
                  en: "Empowers proactive, preventive health management ahead of follow-up visits",
                },
              },
            ],
          },
          {
            id: "rf-3",
            iconName: "Shuffle",
            title: { id: "Roadmap Tindak Lanjut Terarah", en: "Guided \"Next Steps\" Care Roadmap" },
            points: [
              {
                id: "p-1",
                text: {
                  id: "Menentukan waktu ideal untuk konsultasi ulang maupun pemeriksaan berkala bersama dokter",
                  en: "Outlines ideal timelines for physician follow-ups and routine monitoring",
                },
              },
              {
                id: "p-2",
                text: {
                  id: "Menyediakan daftar pertanyaan kunci agar diskusi pasien dengan dokter lebih efektif",
                  en: "Suggests focused questions patients can bring to their next consultation",
                },
              },
            ],
          },
          {
            id: "rf-4",
            iconName: "UserCheck",
            title: { id: "Otorisasi & Kendali Mutlak Dokter (DPJP)", en: "Physician-Approved & Clinically Verified" },
            points: [
              {
                id: "p-1",
                text: {
                  id: "Setiap narasi pasien wajib melalui peninjauan dan persetujuan digital dokter Sp.PK / Sp.PA",
                  en: "Every patient narrative requires mandatory clinical review and digital sign-off",
                },
              },
              {
                id: "p-2",
                text: {
                  id: "Menjamin akurasi diagnostik, etika medis, dan kepatuhan standar akreditasi rumah sakit",
                  en: "Ensures medical accuracy, safety guardrails, and alignment with hospital accreditation standards",
                },
              },
            ],
          },
        ],
        cardTitle: { id: "AI Patient Report", en: "AI Patient Report" },
        patientViewLabel: { id: "TAMPILAN PASIEN", en: "PATIENT VIEW" },
        clinicalViewLabel: { id: "TAMPILAN KLINIS", en: "CLINICAL VIEW" },
        summaryHeading: { id: "Ringkasan Hasil Pemeriksaan", en: "Your Results Summary" },
        meaningHeading: { id: "Makna Klinis bagi Anda", en: "What This Means for You" },
        stepsHeading: { id: "Langkah Selanjutnya", en: "Next Steps" },
        cases: [
          {
            id: "pathology",
            label: { id: "Patologi", en: "Pathology" },
            patientSummary: {
              id: "Hasil pemeriksaan jaringan menunjukkan kondisi jinak (non-kanker). Tidak ditemukan sel ganas, atipia, maupun tanda pertumbuhan abnormal pada sampel yang diperiksa.",
              en: "Your tissue sample showed benign (non-cancerous) cells. No malignant cells, atypia, or signs of abnormal spread were detected.",
            },
            patientMeaning: {
              id: "Jaringan kecil yang diangkat bersifat tidak berbahaya. Kondisi jaringan di area pemeriksaan dinyatakan sehat, stabil, dan Anda dapat beraktivitas seperti biasa.",
              en: "The small tissue growth removed is harmless. Your body is healthy and stable in this area, with no immediate intervention required.",
            },
            patientSteps: [
              {
                id: "s-1",
                text: {
                  id: "Jadwalkan kontrol rutin bersama dokter Anda dalam 6 bulan ke depan",
                  en: "Follow up with your physician in 6 months for routine review",
                },
              },
              {
                id: "s-2",
                text: {
                  id: "Tanyakan jadwal skrining berkala yang sesuai dengan riwayat kesehatan Anda",
                  en: "Ask about a routine screening schedule tailored to your health profile",
                },
              },
            ],
            clinicalHeading: { id: "LAPORAN PATOLOGI", en: "PATHOLOGY REPORT" },
            clinicalFields: [
              {
                id: "f-1",
                label: { id: "Spesimen:", en: "Specimen:" },
                value: { id: "Kulit, lengan bawah kiri, eksisi", en: "Skin, left forearm, excision" },
              },
              {
                id: "f-2",
                label: { id: "Diagnosis:", en: "Diagnosis:" },
                value: {
                  id: "Histiositoma fibrosa jinak (dermatofibroma)",
                  en: "Benign fibrous histiocytoma (dermatofibroma)",
                },
              },
              {
                id: "f-3",
                label: { id: "Batas Sayatan:", en: "Margins:" },
                value: { id: "Bebas jaringan lesi", en: "Free of lesional tissue" },
              },
              {
                id: "f-4",
                label: { id: "Mikroskopis:", en: "Microscopic:" },
                value: {
                  id: "Proliferasi fibroblas berbentuk gelendong dan histiosit dengan pola storiform pada lapisan dermis.",
                  en: "Proliferation of spindle-shaped fibroblasts and histiocytes in a storiform pattern within the dermis.",
                },
              },
              { id: "f-5", label: { id: "ICD-10:", en: "ICD-10:" }, value: { id: "D23.62", en: "D23.62" } },
              { id: "f-6", label: { id: "CPT:", en: "CPT:" }, value: { id: "88305", en: "88305" } },
            ],
          },
          {
            id: "hematology",
            label: { id: "Hematologi", en: "Hematology" },
            patientSummary: {
              id: "Seluruh parameter darah lengkap dan kadar gula darah rata-rata (HbA1c 5.4%) berada dalam rentang normal dan sehat.",
              en: "All complete blood count markers and 3-month average glucose (HbA1c 5.4%) are within healthy reference ranges.",
            },
            patientMeaning: {
              id: "Tidak ditemukan tanda anemia, infeksi aktif, maupun risiko diabetes. Metabolisme dan daya tahan tubuh Anda berada pada kondisi optimal.",
              en: "No signs of anemia, acute inflammation, or diabetes were found. Your blood health and metabolic baseline are stable.",
            },
            patientSteps: [
              {
                id: "s-1",
                text: {
                  id: "Pertahankan pola makan seimbang, rendah gula tambahan, dan hidrasi 2L per hari",
                  en: "Maintain a balanced diet, limit added sugars, and stay well hydrated daily",
                },
              },
              {
                id: "s-2",
                text: {
                  id: "Lakukan pemeriksaan darah rutin tahunan sebagai pemantauan preventif",
                  en: "Schedule your routine annual wellness blood panel for ongoing prevention",
                },
              },
            ],
            clinicalHeading: { id: "LAPORAN HEMATOLOGI & KIMIA", en: "HEMATOLOGY & CHEMISTRY REPORT" },
            clinicalFields: [
              {
                id: "f-1",
                label: { id: "Panel Uji:", en: "Test Panel:" },
                value: { id: "Darah Lengkap (CBC) + HbA1c", en: "Complete Blood Count (CBC) + HbA1c" },
              },
              {
                id: "f-2",
                label: { id: "Hasil Kunci:", en: "Key Findings:" },
                value: {
                  id: "Hb 13.8 g/dL, WBC 6.9×10³/µL, PLT 265×10³/µL, HbA1c 5.4%",
                  en: "Hb 13.8 g/dL, WBC 6.9×10³/µL, PLT 265×10³/µL, HbA1c 5.4%",
                },
              },
              {
                id: "f-3",
                label: { id: "Delta Check:", en: "Delta Check:" },
                value: {
                  id: "Stabil dalam rentang baseline 12 bulan terakhir (-0.1%)",
                  en: "Stable within 12-month longitudinal baseline (-0.1%)",
                },
              },
              {
                id: "f-4",
                label: { id: "Interpretasi:", en: "Interpretation:" },
                value: {
                  id: "Profil hematologi dan kontrol glikemik dalam batas normal tanpa tanda anemia atau inflamasi akut.",
                  en: "Hematologic profile and glycemic control within normal limits without anemia or acute inflammation.",
                },
              },
              { id: "f-5", label: { id: "ICD-10:", en: "ICD-10:" }, value: { id: "Z00.00", en: "Z00.00" } },
              { id: "f-6", label: { id: "LOINC:", en: "LOINC:" }, value: { id: "58410-2", en: "58410-2" } },
            ],
          },
          {
            id: "microbiology",
            label: { id: "Mikrobiologi", en: "Microbiology" },
            patientSummary: {
              id: "Hasil kultur laboratorium tidak menunjukkan adanya pertumbuhan bakteri penyebab infeksi saluran kemih.",
              en: "Laboratory culture showed no significant growth of bacteria responsible for urinary tract infection.",
            },
            patientMeaning: {
              id: "Keluhan ringan yang Anda rasakan bukan disebabkan oleh infeksi bakteri, sehingga Anda tidak perlu mengonsumsi antibiotik.",
              en: "Mild symptoms are not caused by a bacterial infection, meaning antibiotic treatment is not required.",
            },
            patientSteps: [
              {
                id: "s-1",
                text: {
                  id: "Perbanyak konsumsi air putih minimal 2 liter per hari untuk menjaga kesehatan saluran kemih",
                  en: "Increase daily water intake to at least 2 liters to support urinary tract health",
                },
              },
              {
                id: "s-2",
                text: {
                  id: "Konsultasikan kembali ke dokter apabila keluhan menetap lebih dari 3 hari",
                  en: "Consult your doctor again if mild symptoms persist beyond 3 days",
                },
              },
            ],
            clinicalHeading: { id: "LAPORAN KULTUR & KEPEKAAN", en: "MICROBIOLOGY & AST REPORT" },
            clinicalFields: [
              {
                id: "f-1",
                label: { id: "Spesimen:", en: "Specimen:" },
                value: { id: "Urin porsi tengah (Midstream), kultur aerob", en: "Midstream urine, aerobic culture" },
              },
              {
                id: "f-2",
                label: { id: "Identifikasi:", en: "Organism:" },
                value: {
                  id: "Tidak ada pertumbuhan patogen bermakna (< 10³ CFU/mL)",
                  en: "No significant pathogen growth (< 10³ CFU/mL)",
                },
              },
              {
                id: "f-3",
                label: { id: "Pewarnaan Gram:", en: "Gram Stain:" },
                value: {
                  id: "Sel epitel minimal, leukosit < 2/LPB, bakteri (-)",
                  en: "Minimal epithelial cells, WBC < 2/HPF, bacteria (-)",
                },
              },
              {
                id: "f-4",
                label: { id: "Rekomendasi PPRA:", en: "Stewardship:" },
                value: {
                  id: "Tidak direkomendasikan terapi antibiotik empiris lanjutan.",
                  en: "No further empiric antibiotic therapy recommended.",
                },
              },
              { id: "f-5", label: { id: "ICD-10:", en: "ICD-10:" }, value: { id: "Z03.89", en: "Z03.89" } },
              { id: "f-6", label: { id: "CPT:", en: "CPT:" }, value: { id: "87086", en: "87086" } },
            ],
          },
        ],
      },
    },

    directory: {
      label: "Katalog Modul Lengkap (Bento)",
      content: {
        badge: { id: "Katalog Modul Lengkap", en: "Complete Module Catalog" },
        title: {
          id: "Arsitektur 5 Modul Inti & \nGateway Laboratorium",
          en: "Your Connected Suite of \nClinical Modules.",
        },
        description: {
          id: "Diagnova mengotomatiskan setiap alur kerja laboratorium—mulai dari interfacing analyzer, kontrol reagen, pelacakan Bank Darah, hingga pelaporan patologi & mikrobiologi terpadu.",
          en: "Diagnova automates every mission-critical workflow across your laboratory — analyzer interfacing, reagent telemetry, blood bank safety, and specialized pathology & microbiology reporting.",
        },
        hematology: {
          title: { id: "Otomasi Hematologi & Kimia Klinik", en: "Routine Hematology & Clinical Chemistry" },
          desc: {
            id: "Menghubungkan analyzer secara langsung tanpa entri data manual.",
            en: "Direct bidirectional ASTM/HL7 interfacing with zero manual transcription.",
          },
          worklistTitle: { id: "Worklist Otomatis Sysmex XN-1000", en: "Auto-Worklist Sysmex XN-1000" },
          worklistSub: { id: "Order #LAB-8841 • ASTM Bidireksional", en: "Order #LAB-8841 • Direct ASTM" },
          qcLabel: { id: "Validasi QC Westgard", en: "Westgard QC Verification" },
          qcStatus: { id: "In-Control ✓", en: "In-Control ✓" },
          deltaLabel: { id: "Delta Check Longitudinal", en: "Longitudinal Delta Check" },
          deltaTime: { id: "08:14 WIB", en: "08:14 WIB" },
          releaseLabel: { id: "Rilis Hasil EMR & SATUSEHAT", en: "Release to EMR & FHIR Sync" },
          releaseStatus: { id: "Auto-Sync", en: "Auto-Sync" },
          barcodeLabel: { id: "Barcode Sampel 2D Bedside", en: "2D Bedside Specimen Tracking" },
        },
        inventory: {
          title: { id: "Inventori & Reagen Pintar", en: "Smart Reagent Intelligence" },
          desc: {
            id: "Pantau sisa stok lot & tanggal kedaluwarsa secara real-time.",
            en: "Real-time reagent depletion, lot tracking, and FEFO expiry alerts.",
          },
          appName: { id: "Diagnova Telemetry", en: "Diagnova Telemetry" },
          appMeta: { id: "500+ Lot", en: "500+ Lot" },
          kpiLabel: { id: "Efisiensi Biaya Reagen", en: "Reagent Cost Efficiency" },
          kpiValue: { id: "-24%", en: "-24%" },
          kpiBadge: { id: "FEFO Terkendali", en: "Zero Stockout" },
        },
        bloodBank: {
          title: { id: "Manajemen Bank Darah (BDRS)", en: "Blood Bank & Transfusion (BDRS)" },
          desc: {
            id: "Pantau stok golongan darah, suhu 2°–6°C, & crossmatch elektronik.",
            en: "Track ISBT-128 blood bags, cold-chain sensors, and electronic crossmatching.",
          },
          panelTitle: { id: "Stok BDRS Aktif", en: "BDRS Live Inventory" },
          tempBadge: { id: "Suhu: 4.1°C Aman", en: "Temp: 4.1°C Safe" },
          bars: [
            { id: "o-pos", label: "O+", pct: "84%" },
            { id: "a-pos", label: "A+", pct: "68%" },
            { id: "b-pos", label: "B+", pct: "76%" },
            { id: "ab-pos", label: "AB+", pct: "48%" },
            { id: "prc", label: "PRC", pct: "90%" },
          ],
        },
        specialty: {
          title: {
            id: "Patologi Anatomi, Mikrobiologi & Gateway",
            en: "Pathology, Microbiology & Specialty Gateway",
          },
          desc: {
            id: "Pelacakan kaset 2D, antibiogram CLSI/PPRA, hingga parser instrumen khusus.",
            en: "2D cassette tracking, CLSI antibiograms, and custom HL7/ASTM/molecular parsers.",
          },
          cards: [
            {
              id: "pathology",
              iconName: "Microscope",
              accent: "blue",
              title: { id: "Patologi Anatomi", en: "Anatomical Pathology" },
              sub: { id: "Kaset 2D • Sinoptik ICD-O-3", en: "2D Cassettes • ICD-O-3 Synoptic" },
            },
            {
              id: "microbiology",
              iconName: "FlaskConical",
              accent: "teal",
              title: { id: "Mikrobiologi PPRA", en: "Microbiology & AST" },
              sub: { id: "Antibiogram CLSI • Alert MDRO", en: "CLSI Antibiogram • MDRO Alert" },
            },
          ],
          registryTitle: { id: "Ekosistem Terhubung", en: "Connected Modules" },
          registry: [
            {
              id: "histopathology",
              iconName: "Microscope",
              title: { id: "Histopatologi & Sitologi", en: "Histopathology & Cytology" },
              tag: { id: "ICD-O-3", en: "ICD-O-3" },
            },
            {
              id: "culture",
              iconName: "FlaskConical",
              title: { id: "Kultur & Antibiogram", en: "Culture & Antibiogram" },
              tag: { id: "CLSI", en: "CLSI" },
            },
            {
              id: "gateway",
              iconName: "Cpu",
              title: { id: "Gateway Instrumen Khusus", en: "Custom Specialty Gateway" },
              tag: { id: "500+ Alat", en: "500+ Alat" },
            },
          ],
        },
      },
    },

    architecture: {
      label: "Arsitektur Tanpa Silo",
      content: {
        badge: { id: "Arsitektur Tanpa Silo", en: "Zero Data Silos" },
        title: {
          id: "Satu Pasien, Satu Basis Data Laboratorium Terpadu",
          en: "Single Patient ID, One Unified Laboratory Database",
        },
        description: {
          id: "Walaupun setiap modul menangani alur kerja spesifik, seluruh data bermuara pada satu pusat data Diagnova. Dokter dapat melihat hasil darah rutin, riwayat transfusi, dan laporan patologi dalam satu rekam medis terpadu tanpa fragmentasi sistem.",
          en: "Even with department-specific workflows, all clinical data converges into Diagnova's unified clinical registry. Physicians review routine hematology, blood bank logs, and pathology reports in one seamless patient timeline.",
        },
        link: {
          text: { id: "Pelajari Arsitektur Platform Diagnova", en: "Explore Diagnova Platform Architecture" },
          href: "/platform",
        },
        cards: [
          {
            id: "single-record",
            iconName: "Database",
            title: { id: "Single Medical Record", en: "Single Patient Record" },
            desc: {
              id: "Eliminasi duplikasi data pasien antar instalasi lab sentral, IGD, poliklinik, dan BDRS.",
              en: "Zero duplicate records across central lab, ER, outpatient wards, and transfusion units.",
            },
          },
          {
            id: "gateway-buffer",
            iconName: "Cpu",
            title: { id: "Smart Gateway Buffer", en: "Smart Gateway Buffer" },
            desc: {
              id: "Satu pintu komunikasi untuk seluruh instrumen analyzer dengan buffer offline aman saat jaringan down.",
              en: "Universal gateway for all analyzers equipped with resilient offline buffering during network blips.",
            },
          },
          {
            id: "compliance",
            iconName: "FileCheck2",
            title: { id: "Kepatuhan KARS & ISO", en: "Regulatory Compliance" },
            desc: {
              id: "Jejak audit digital otomatis siap diuji oleh asesor akreditasi KARS, JCI, dan ISO 15189 setiap saat.",
              en: "Immutable digital audit trail ready for KARS, JCI, and ISO 15189 surveys anytime.",
            },
          },
        ],
      },
    },

    scalability: {
      label: "Skalabilitas Terbukti",
      content: {
        badge: { id: "Skalabilitas Terbukti", en: "Proven Scalability" },
        title: { id: "Butuh akselerasi waktu rilis hasil?", en: "Looking for faster diagnostic turnaround?" },
        description: {
          id: "Setiap modul Diagnova diskalakan sesuai kompleksitas fasilitas—mulai dari klinik pratama hingga jejaring rumah sakit rujukan nasional.",
          en: "Every Diagnova module scales to your facility's diagnostic volume—from primary clinics to national reference hospital chains.",
        },
        primaryCta: {
          text: { id: "Jadwalkan Demo", en: "Book a Demo" },
          href: "/request-demo",
        },
        secondaryCta: {
          text: { id: "Lihat Paket Solusi", en: "Explore Solutions" },
          href: "/solutions",
        },
        /** `variant`: "base" | "mid" | "highlight" (gaya batang; nilai tak dikenal -> "base"). */
        tiers: [
          {
            id: "primary-clinics",
            variant: "base",
            value: { id: "2.4x", en: "2.4x" },
            label: { id: "Klinik & Lab Pratama", en: "Primary Clinics" },
            desc: {
              id: "Otomatisasi registrasi & rilis hasil hematologi dasar.",
              en: "Automated intake & routine hematology sign-off.",
            },
            volume: { id: "< 300 sampel/hari", en: "< 300 samples/day" },
          },
          {
            id: "regional-hospitals",
            variant: "mid",
            value: { id: "5.1x", en: "5.1x" },
            label: { id: "RS Tipe B & Tipe C", en: "Regional Hospitals" },
            desc: {
              id: "Bridging SIMRS, Westgard QC, dan modul BDRS terintegrasi.",
              en: "HIS bridging, Westgard QC & integrated blood bank.",
            },
            volume: { id: "300–2.000 sampel/hari", en: "300–2,000 samples/day" },
          },
          {
            id: "reference-labs",
            variant: "highlight",
            value: { id: "10x", en: "10x" },
            label: { id: "RS Rujukan & Lab Chain", en: "Reference Lab Chains" },
            desc: {
              id: "Auto-verifikasi Nova AI, PA/Mikro & sinkronisasi multi-cabang.",
              en: "Nova AI auto-verification, PA/Micro & multi-site sync.",
            },
            volume: { id: "", en: "" },
          },
        ],
      },
    },

    modules: {
      label: "Daftar Modul (halaman detail /modules/[slug])",
      content: {
        backLabel: { id: "Semua Modul", en: "Semua Modul" },
        descriptionHeading: { id: "Deskripsi Modul & Alur Operasional", en: "Deskripsi Modul & Alur Operasional" },
        featuresHeading: { id: "Fitur & Kemampuan Teknis Utama", en: "Fitur & Kemampuan Teknis Utama" },
        featuresSub: {
          id: "Standar integrasi ASTM / HL7 & otomasi validasi",
          en: "Standar integrasi ASTM / HL7 & otomasi validasi",
        },
        benefitsHeading: { id: "Manfaat Klinis & Efisiensi Operasional", en: "Manfaat Klinis & Efisiensi Operasional" },
        benefitsSub: {
          id: "Dampak terukur pada keselamatan pasien dan akreditasi",
          en: "Dampak terukur pada keselamatan pasien dan akreditasi",
        },
        ctaBadge: { id: "Konsultasi Spesialis", en: "Konsultasi Spesialis" },
        ctaTitle: { id: "Uji Coba Modul {name}", en: "Uji Coba Modul {name}" },
        ctaDesc: {
          id: "Diskusikan integrasi LIS, protokol interfacing instrumen, dan jadwal simulasi live untuk {name} bersama tim spesialis Diagnova.",
          en: "Diskusikan integrasi LIS, protokol interfacing instrumen, dan jadwal simulasi live untuk {name} bersama tim spesialis Diagnova.",
        },
        ctaButton: {
          text: { id: "Minta Demo Interaktif", en: "Minta Demo Interaktif" },
          href: "/request-demo",
        },
        items: [
        {
          id: "routine-hematology",
          slug: "routine-hematology",
          iconName: "Activity",
          name: { id: "Routine & Hematology", en: "Routine & Hematology" },
          tagline: { id: "Kecepatan Tinggi & Akurasi Tanpa Kompromi untuk Volume Harian", en: "Kecepatan Tinggi & Akurasi Tanpa Kompromi untuk Volume Harian" },
          shortDesc: { id: "Pemeriksaan darah harian, urin, dan kimia klinik bervolume tinggi dengan workflow berkecepatan tinggi dan interfacing direct-analyzer.", en: "Pemeriksaan darah harian, urin, dan kimia klinik bervolume tinggi dengan workflow berkecepatan tinggi dan interfacing direct-analyzer." },
          description: { id: "Modul Routine & Hematology Diagnova dirancang khusus untuk menangani ribuan sampel per hari dengan kecepatan dan akurasi maksimal. Terhubung langsung secara bidireksional dengan analyzer hematologi dan kimia klinik terkemuka, modul ini mengeliminasi entri data manual, mempercepat turnaround time (TAT) hingga 70%, dan mengaktifkan validasi delta check otomatis.", en: "Modul Routine & Hematology Diagnova dirancang khusus untuk menangani ribuan sampel per hari dengan kecepatan dan akurasi maksimal. Terhubung langsung secara bidireksional dengan analyzer hematologi dan kimia klinik terkemuka, modul ini mengeliminasi entri data manual, mempercepat turnaround time (TAT) hingga 70%, dan mengaktifkan validasi delta check otomatis." },
          targetDepartment: { id: "Laboratorium Patologi Klinik & Hematologi Rutin", en: "Laboratorium Patologi Klinik & Hematologi Rutin" },
          keyFeatures: [
            { id: "kf-1", text: { id: "Bidirectional Analyzer Interfacing (HL7 / ASTM)", en: "Bidirectional Analyzer Interfacing (HL7 / ASTM)" } },
            { id: "kf-2", text: { id: "Auto-Verification dengan Rule Engine Kustom", en: "Auto-Verification dengan Rule Engine Kustom" } },
            { id: "kf-3", text: { id: "Real-time Delta Check & Critical Alert Notification", en: "Real-time Delta Check & Critical Alert Notification" } },
            { id: "kf-4", text: { id: "Barcode Tracking di Setiap Tabung Sampel", en: "Barcode Tracking di Setiap Tabung Sampel" } },
            { id: "kf-5", text: { id: "Worklist Management Dinamis per Instrumen", en: "Worklist Management Dinamis per Instrumen" } },
            { id: "kf-6", text: { id: "Quality Control (Levey-Jennings Chart & Westgard Rules)", en: "Quality Control (Levey-Jennings Chart & Westgard Rules)" } },
          ],
          clinicalBenefits: [
            { id: "cb-1", text: { id: "Memangkas Turnaround Time (TAT) hasil pemeriksaan rutin hingga 70%", en: "Memangkas Turnaround Time (TAT) hasil pemeriksaan rutin hingga 70%" } },
            { id: "cb-2", text: { id: "Menghilangkan 99.8% risiko human error akibat salah ketik nilai lab", en: "Menghilangkan 99.8% risiko human error akibat salah ketik nilai lab" } },
            { id: "cb-3", text: { id: "Peringatan dini nilai kritis (Panic Values) langsung ke dokter pengirim", en: "Peringatan dini nilai kritis (Panic Values) langsung ke dokter pengirim" } },
            { id: "cb-4", text: { id: "Kepatuhan audit standar akreditasi rumah sakit (KARS & JCI)", en: "Kepatuhan audit standar akreditasi rumah sakit (KARS & JCI)" } },
          ],
        },
        {
          id: "blood-bank",
          slug: "blood-bank",
          iconName: "HeartPulse",
          name: { id: "Blood Bank Management", en: "Blood Bank Management" },
          tagline: { id: "Transfusi Aman dengan Kontrol Ketat Rantai Dingin & Crossmatch", en: "Transfusi Aman dengan Kontrol Ketat Rantai Dingin & Crossmatch" },
          shortDesc: { id: "Pengelolaan ketersediaan kantong darah, uji silang serasi (crossmatch), masa kedaluwarsa, dan distribusi kantong darah secara aman & terlacak.", en: "Pengelolaan ketersediaan kantong darah, uji silang serasi (crossmatch), masa kedaluwarsa, dan distribusi kantong darah secara aman & terlacak." },
          description: { id: "Modul Bank Darah Diagnova mengintegrasikan seluruh tahapan rantai pasok darah dari donor hingga transfusi ke pasien. Dilengkapi validasi barcode ganda untuk mencegah insiden inkompatibilitas ABO/Rh, pemantauan masa simpan kantong darah secara real-time, dan dokumentasi digital hasil uji saring infeksi menular lewat transfusi darah (IMLTD).", en: "Modul Bank Darah Diagnova mengintegrasikan seluruh tahapan rantai pasok darah dari donor hingga transfusi ke pasien. Dilengkapi validasi barcode ganda untuk mencegah insiden inkompatibilitas ABO/Rh, pemantauan masa simpan kantong darah secara real-time, dan dokumentasi digital hasil uji saring infeksi menular lewat transfusi darah (IMLTD)." },
          targetDepartment: { id: "Unit Transfusi Darah (UTD) & Bank Darah Rumah Sakit (BDRS)", en: "Unit Transfusi Darah (UTD) & Bank Darah Rumah Sakit (BDRS)" },
          keyFeatures: [
            { id: "kf-1", text: { id: "Pelacakan Digital Kantong Darah Berbasis Barcode/ISBT 128", en: "Pelacakan Digital Kantong Darah Berbasis Barcode/ISBT 128" } },
            { id: "kf-2", text: { id: "Pencatatan & Verifikasi Uji Silang Serasi (Crossmatching)", en: "Pencatatan & Verifikasi Uji Silang Serasi (Crossmatching)" } },
            { id: "kf-3", text: { id: "Alert Kedaluwarsa Otomatis (Early Warning Expiry)", en: "Alert Kedaluwarsa Otomatis (Early Warning Expiry)" } },
            { id: "kf-4", text: { id: "Manajemen Stok Darah Lengkap (PRC, TC, FFP, Cryoprecipitate)", en: "Manajemen Stok Darah Lengkap (PRC, TC, FFP, Cryoprecipitate)" } },
            { id: "kf-5", text: { id: "Integrasi Validasi Golongan Darah Pasien dari SIMRS", en: "Integrasi Validasi Golongan Darah Pasien dari SIMRS" } },
            { id: "kf-6", text: { id: "Digital Release Form & Rekam Jejak Suhu Rantai Dingin", en: "Digital Release Form & Rekam Jejak Suhu Rantai Dingin" } },
          ],
          clinicalBenefits: [
            { id: "cb-1", text: { id: "Zero-tolerance terhadap kesalahan pemberian kantong darah ke pasien", en: "Zero-tolerance terhadap kesalahan pemberian kantong darah ke pasien" } },
            { id: "cb-2", text: { id: "Mengurangi angka darah terbuang (wastage) akibat kedaluwarsa hingga 45%", en: "Mengurangi angka darah terbuang (wastage) akibat kedaluwarsa hingga 45%" } },
            { id: "cb-3", text: { id: "Waktu penyiapan darah darurat lebih cepat dan terstruktur", en: "Waktu penyiapan darah darurat lebih cepat dan terstruktur" } },
            { id: "cb-4", text: { id: "Audit trail 100% transparan untuk setiap tetes darah yang dikeluarkan", en: "Audit trail 100% transparan untuk setiap tetes darah yang dikeluarkan" } },
          ],
        },
        {
          id: "inventory-reagent",
          slug: "inventory-reagent",
          iconName: "PackageCheck",
          name: { id: "Inventory & Reagent", en: "Inventory & Reagent" },
          tagline: { id: "Stok Reagen Selalu Terpantau, Zero Stock-Out di Tengah Shift", en: "Stok Reagen Selalu Terpantau, Zero Stock-Out di Tengah Shift" },
          shortDesc: { id: "Pemantauan stok reagen medis laboratorium secara real-time guna mencegah kehabisan bahan habis pakai dan efisiensi biaya operasional.", en: "Pemantauan stok reagen medis laboratorium secara real-time guna mencegah kehabisan bahan habis pakai dan efisiensi biaya operasional." },
          description: { id: "Modul Inventory & Reagent melacak penggunaan reagen, kalibrator, dan kontrol secara otomatis seiring dengan tes yang dijalankan oleh instrumen analyzer. Menghitung estimasi sisa tes (test count estimation), memberikan alarm stok menipis (low-stock alert), dan mengelola nomor lot serta tanggal kedaluwarsa secara presisi.", en: "Modul Inventory & Reagent melacak penggunaan reagen, kalibrator, dan kontrol secara otomatis seiring dengan tes yang dijalankan oleh instrumen analyzer. Menghitung estimasi sisa tes (test count estimation), memberikan alarm stok menipis (low-stock alert), dan mengelola nomor lot serta tanggal kedaluwarsa secara presisi." },
          targetDepartment: { id: "Logistik Laboratorium & Bagian Pengadaan Medis", en: "Logistik Laboratorium & Bagian Pengadaan Medis" },
          keyFeatures: [
            { id: "kf-1", text: { id: "Kalkulasi Penggunaan Reagen Otomatis per Pemeriksaan", en: "Kalkulasi Penggunaan Reagen Otomatis per Pemeriksaan" } },
            { id: "kf-2", text: { id: "Manajemen Nomor Lot, Tanggal Buka (On-board Stability), dan Kedaluwarsa", en: "Manajemen Nomor Lot, Tanggal Buka (On-board Stability), dan Kedaluwarsa" } },
            { id: "kf-3", text: { id: "Notifikasi Otomatis Stok Minimum (Safety Stock Threshold)", en: "Notifikasi Otomatis Stok Minimum (Safety Stock Threshold)" } },
            { id: "kf-4", text: { id: "Purchase Order Suggestion Berdasarkan Laju Pemakaian Historis", en: "Purchase Order Suggestion Berdasarkan Laju Pemakaian Historis" } },
            { id: "kf-5", text: { id: "Pelaporan Biaya per Tes (Cost-per-Test Analytics)", en: "Pelaporan Biaya per Tes (Cost-per-Test Analytics)" } },
            { id: "kf-6", text: { id: "Multi-Gudang: Laboratorium Utama, Satelit, dan Lemari Reagen", en: "Multi-Gudang: Laboratorium Utama, Satelit, dan Lemari Reagen" } },
          ],
          clinicalBenefits: [
            { id: "cb-1", text: { id: "Mencegah penundaan pemeriksaan akibat reagen habis tiba-tiba", en: "Mencegah penundaan pemeriksaan akibat reagen habis tiba-tiba" } },
            { id: "cb-2", text: { id: "Menghindari penggunaan reagen yang telah kedaluwarsa atau degraded", en: "Menghindari penggunaan reagen yang telah kedaluwarsa atau degraded" } },
            { id: "cb-3", text: { id: "Efisiensi belanja reagen dan penghematan anggaran lab hingga 20%", en: "Efisiensi belanja reagen dan penghematan anggaran lab hingga 20%" } },
            { id: "cb-4", text: { id: "Kesiapan data inventaris real-time saat audit BPOM / ISO 15189", en: "Kesiapan data inventaris real-time saat audit BPOM / ISO 15189" } },
          ],
        },
        {
          id: "pathology",
          slug: "pathology",
          iconName: "Microscope",
          name: { id: "Anatomical Pathology", en: "Anatomical Pathology" },
          tagline: { id: "Pelacakan Spesimen Jaringan Ketat dari Makroskopi hingga Hasil Akhir", en: "Pelacakan Spesimen Jaringan Ketat dari Makroskopi hingga Hasil Akhir" },
          shortDesc: { id: "Pencatatan pemeriksaan jaringan tubuh dan sitologi berbasis mikroskopis dengan tracking spesimen ketat dan integrasi digital imaging.", en: "Pencatatan pemeriksaan jaringan tubuh dan sitologi berbasis mikroskopis dengan tracking spesimen ketat dan integrasi digital imaging." },
          description: { id: "Modul Patologi Anatomi Diagnova menyederhanakan alur kerja histopatologi, sitologi, dan biopsi yang kompleks. Melacak setiap kaset jaringan, blok parafin, dan slide kaca dengan barcode unik. Memungkinkan dokter spesialis patologi anatomi menyusun laporan terstruktur dengan template diagnosis standar (ICD-O / Bethesda System) dan melampirkan foto mikroskopis beresolusi tinggi.", en: "Modul Patologi Anatomi Diagnova menyederhanakan alur kerja histopatologi, sitologi, dan biopsi yang kompleks. Melacak setiap kaset jaringan, blok parafin, dan slide kaca dengan barcode unik. Memungkinkan dokter spesialis patologi anatomi menyusun laporan terstruktur dengan template diagnosis standar (ICD-O / Bethesda System) dan melampirkan foto mikroskopis beresolusi tinggi." },
          targetDepartment: { id: "Instalasi Patologi Anatomi & Sitologi", en: "Instalasi Patologi Anatomi & Sitologi" },
          keyFeatures: [
            { id: "kf-1", text: { id: "Barcode Tracking pada Level Kaset Jaringan dan Slide Kaca", en: "Barcode Tracking pada Level Kaset Jaringan dan Slide Kaca" } },
            { id: "kf-2", text: { id: "Template Laporan Terstruktur (Histopatologi, FNAB, Pap Smear, Frozen Section)", en: "Template Laporan Terstruktur (Histopatologi, FNAB, Pap Smear, Frozen Section)" } },
            { id: "kf-3", text: { id: "Integrasi Kamera Mikroskop & Digital Pathology WSI", en: "Integrasi Kamera Mikroskop & Digital Pathology WSI" } },
            { id: "kf-4", text: { id: "Worklist Dokter Spesialis Patologi Anatomi (Sp.PA)", en: "Worklist Dokter Spesialis Patologi Anatomi (Sp.PA)" } },
            { id: "kf-5", text: { id: "Manajemen Arsip Blok Parafin dan Slide Jangka Panjang", en: "Manajemen Arsip Blok Parafin dan Slide Jangka Panjang" } },
            { id: "kf-6", text: { id: "Sinkronisasi Diagnosa Kanker ke Rekam Medis Pasien (RME)", en: "Sinkronisasi Diagnosa Kanker ke Rekam Medis Pasien (RME)" } },
          ],
          clinicalBenefits: [
            { id: "cb-1", text: { id: "Mencegah tertukarnya spesimen jaringan antar pasien", en: "Mencegah tertukarnya spesimen jaringan antar pasien" } },
            { id: "cb-2", text: { id: "Standarisasi pelaporan patologi sesuai pedoman nasional dan internasional", en: "Standarisasi pelaporan patologi sesuai pedoman nasional dan internasional" } },
            { id: "cb-3", text: { id: "Akses cepat ke riwayat biopsi pasien sebelumnya untuk perbandingan", en: "Akses cepat ke riwayat biopsi pasien sebelumnya untuk perbandingan" } },
            { id: "cb-4", text: { id: "Kolaborasi second-opinion antar dokter patolog secara digital", en: "Kolaborasi second-opinion antar dokter patolog secara digital" } },
          ],
        },
        {
          id: "microbiology",
          slug: "microbiology",
          iconName: "FlaskConical",
          name: { id: "Microbiology & Antibiotic Stewardship", en: "Microbiology & Antibiotic Stewardship" },
          tagline: { id: "Kultur Bakteri, Uji Resistensi, dan Terapi Antibiotik Rasional", en: "Kultur Bakteri, Uji Resistensi, dan Terapi Antibiotik Rasional" },
          shortDesc: { id: "Identifikasi kuman, kultur bakteri, dan uji sensitivitas antibiotik untuk membantu dokter memberikan terapi medis yang tepat sasaran.", en: "Identifikasi kuman, kultur bakteri, dan uji sensitivitas antibiotik untuk membantu dokter memberikan terapi medis yang tepat sasaran." },
          description: { id: "Modul Mikrobiologi Diagnova mengelola proses inkubasi kultur bakteri, jamur, serta uji kepekaan antibiotik (Antimicrobial Susceptibility Testing / AST). Menyediakan grafik peta kuman (Antibiogram) berkala untuk mendukung Program Pengendalian Resistensi Antimikroba (PPRA) di rumah sakit dan mempercepat rekomendasi antibiotik rasional.", en: "Modul Mikrobiologi Diagnova mengelola proses inkubasi kultur bakteri, jamur, serta uji kepekaan antibiotik (Antimicrobial Susceptibility Testing / AST). Menyediakan grafik peta kuman (Antibiogram) berkala untuk mendukung Program Pengendalian Resistensi Antimikroba (PPRA) di rumah sakit dan mempercepat rekomendasi antibiotik rasional." },
          targetDepartment: { id: "Laboratorium Mikrobiologi Klinik & Tim PPRA Rumah Sakit", en: "Laboratorium Mikrobiologi Klinik & Tim PPRA Rumah Sakit" },
          keyFeatures: [
            { id: "kf-1", text: { id: "Pelacakan Masa Inkubasi Kultur dan Status Pertumbuhan Koloni", en: "Pelacakan Masa Inkubasi Kultur dan Status Pertumbuhan Koloni" } },
            { id: "kf-2", text: { id: "Integrasi Mesin Otomasi Identifikasi Kuman (VITEK, Phoenix, BD BACTEC)", en: "Integrasi Mesin Otomasi Identifikasi Kuman (VITEK, Phoenix, BD BACTEC)" } },
            { id: "kf-3", text: { id: "Pencatatan Zona Hambat & Interpretasi CLSI / EUCAST Otomatis", en: "Pencatatan Zona Hambat & Interpretasi CLSI / EUCAST Otomatis" } },
            { id: "kf-4", text: { id: "Pembangkitan Antibiogram Kumulatif Berkala", en: "Pembangkitan Antibiogram Kumulatif Berkala" } },
            { id: "kf-5", text: { id: "Alert Bakteri Multiresisten (MRSA, ESBL, CRE, VRE) Real-time", en: "Alert Bakteri Multiresisten (MRSA, ESBL, CRE, VRE) Real-time" } },
            { id: "kf-6", text: { id: "Rekomendasi Terapi Antibiotik Berdasarkan Pola Sensitivitas", en: "Rekomendasi Terapi Antibiotik Berdasarkan Pola Sensitivitas" } },
          ],
          clinicalBenefits: [
            { id: "cb-1", text: { id: "Mendukung keselamatan pasien dengan panduan terapi antibiotik definitif", en: "Mendukung keselamatan pasien dengan panduan terapi antibiotik definitif" } },
            { id: "cb-2", text: { id: "Memenuhi indikator wajib PPRA dan Akreditasi Rumah Sakit", en: "Memenuhi indikator wajib PPRA dan Akreditasi Rumah Sakit" } },
            { id: "cb-3", text: { id: "Deteksi dini wabah nosokomial infeksi resisten di ruang rawat", en: "Deteksi dini wabah nosokomial infeksi resisten di ruang rawat" } },
            { id: "cb-4", text: { id: "Mengurangi biaya dan durasi rawat inap (LOS) pasien infeksi", en: "Mengurangi biaya dan durasi rawat inap (LOS) pasien infeksi" } },
          ],
        },
        ],
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

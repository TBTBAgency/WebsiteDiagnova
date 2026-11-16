import type { CmsPageDefinition, PageContentOf } from "@/lib/cms/types";

/** Teks yang (saat ini) sama untuk ID & EN — mis. halaman detail solusi yang sebelumnya hanya berbahasa Indonesia. */
const same = (text: string) => ({ id: text, en: text });

/**
 * Definisi CMS halaman /solutions (page_key "solutions") + template halaman /solutions/[slug].
 * Nilai default = copy yang sebelumnya tertulis langsung di app/(marketing)/solutions/page.tsx,
 * app/(marketing)/solutions/[slug]/page.tsx, content/solutions.ts (section `catalog`) dan default CTABanner (`cta`).
 *
 * Catatan: halaman detail sebelumnya hanya berbahasa Indonesia, sehingga default EN untuk `catalog` dan `detail`
 * disamakan dengan teks ID (belum ada terjemahan).
 */
export const solutionsPage = {
  pageKey: "solutions",
  sections: {
    hero: {
      label: "Hero",
      content: {
        badge: { id: "Solusi Diagnova", en: "Diagnova Solutions" },
        title: {
          id: "Solusi Terkonfigurasi untuk \nSetiap Skala Fasilitas Kesehatan",
          en: "Configured Architectures for \nEvery Healthcare Institution Tier",
        },
        subtitle: {
          id: "Dari rumah sakit sentral dengan IGD bertekanan tinggi hingga jejaring lab klinik mandiri. Diagnova menghadirkan solusi yang dirancang sesuai regulasi dan alur kerja spesifik Anda.",
          en: "From high-acuity hospital networks to high-throughput clinical check-up laboratories. Diagnova delivers tailored architectures engineered for your specific clinical workflows.",
        },
        primaryCta: {
          text: { id: "Jadwalkan Konsultasi Solusi", en: "Schedule Solutions Consultation" },
          href: "/request-demo",
        },
        secondaryCta: {
          text: { id: "Eksplorasi Solusi Fasilitas", en: "Explore Facility Solutions" },
          href: "#facility-solutions",
        },
        metrics: [
          {
            id: "queue-time",
            value: same("-60%"),
            label: { id: "Pangkas Waktu Antre", en: "Cut Queue Time" },
            sub: { id: "Registrasi cepat MCU & RS", en: "Fast MCU & Hospital check-in" },
          },
          {
            id: "bridging",
            value: same("100%"),
            label: { id: "Bridging SIMRS & RME", en: "HIS & EMR Bridging" },
            sub: { id: "Dua arah & real-time", en: "Bidirectional & real-time" },
          },
          {
            id: "accreditation",
            value: same("ISO 15189"),
            label: { id: "Kesiapan Akreditasi", en: "Accreditation Ready" },
            sub: { id: "KARS, JCI & Kemenkes", en: "KARS & JCI compliant" },
          },
          {
            id: "verticals",
            value: { id: "5 Sektor", en: "5 Verticals" },
            label: { id: "Solusi Terdedikasi", en: "Dedicated Modules" },
            sub: { id: "RS, MCU, PA, Mikro, BDRS", en: "Hospital, MCU, PA, Micro, BDRS" },
          },
        ],
      },
    },

    facilities: {
      label: "Solusi per Fasilitas (5 Kartu)",
      content: {
        badge: { id: "Mengapa Diagnova?", en: "Why Diagnova?" },
        title: {
          id: "Dirancang untuk Membuat Kerja Laboratorium Lebih Mudah",
          en: "Designed to Make Laboratory Work Effortless",
        },
        subtitle: {
          id: "Pengalaman diagnostik yang lebih lancar dan cerdas, mulai dari bridging SIMRS dua arah hingga rangkuman klinis Nova AI.",
          en: "Experience a smoother, smarter way to run clinical workflows from HIS bridging to Nova AI summaries.",
        },

        // Kartu 1 — Laboratorium RS Sentral
        hospitalCard: {
          pills: [
            {
              id: "pill-bridging",
              iconName: "Building2",
              text: { id: "Bridging SIMRS & RME Otomatis", en: "Automated HIS & EMR Bridging" },
            },
            {
              id: "pill-panic",
              iconName: "AlertTriangle",
              text: { id: "Notifikasi Kritis IGD & ICU < 25m", en: "ER & ICU Panic Alerts < 25m" },
            },
            {
              id: "pill-barcode",
              iconName: "Zap",
              text: { id: "Barcode Flebotomi Bedside", en: "Bedside Phlebotomy Barcode" },
            },
          ],
          title: { id: "Laboratorium Rumah Sakit Sentral", en: "Central Hospital Laboratory" },
          desc: {
            id: "Menghubungkan operasional laboratorium sentral dengan IGD dan ICU, meniadakan kesalahan entri data manual.",
            en: "Unifies central lab operations with ER and ICU, eliminating manual transcription errors.",
          },
        },

        // Kartu 2 — Lab Klinik & Rujukan
        clinicalCard: {
          statusLabel: { id: "Batch Diterima", en: "Batch Ingested" },
          batchName: same("PT Telkom (450 Pax)"),
          rosterTitle: { id: "Roster MCU Korporat", en: "Corporate MCU Roster" },
          rosterMeta: { id: "450 Barcode Terbit • 0.4s / Peserta", en: "450 Barcodes Issued • 0.4s / Patient" },
          avatars: [
            { id: "avatar-a", initial: "A" },
            { id: "avatar-b", initial: "B" },
            { id: "avatar-c", initial: "C" },
          ],
          othersLabel: { id: "+447 Lainnya", en: "+447 Others" },
          deliveryLabel: same("WhatsApp PDF"),
          title: { id: "Lab Klinik & Rujukan", en: "Clinical & Reference Labs" },
          desc: {
            id: "Penanganan spesimen bervolume harian tinggi dengan check-in cepat dan pengiriman PDF WhatsApp otomatis.",
            en: "High daily volume handling with rapid check-in and automated encrypted WhatsApp delivery.",
          },
        },

        // Kartu 3 — Patologi Anatomi
        pathologyCard: {
          flowLabel: { id: "Alur Kaset & Slide", en: "Cassette & Slide Flow" },
          badge: same("Zero Mix-Up"),
          steps: [
            { id: "step-g", label: "G" },
            { id: "step-e", label: "E" },
            { id: "step-m", label: "M" },
            { id: "step-s", label: "S" },
          ],
          sampleId: { id: "#PA-24-0982 (Biopsi)", en: "#PA-24-0982 (Biopsy)" },
          standardCode: same("ICD-O 8500/3"),
          archiveButton: { id: "Arsip Blok", en: "Block Archive" },
          signOffButton: { id: "Validasi Sp.PA", en: "Pathologist Sign-Off" },
          title: { id: "Patologi Anatomi & Sitologi", en: "Anatomical Pathology" },
          desc: {
            id: "Pelacakan barcode mikro 2D pada kaset dan slide kaca untuk eliminasi mutlak spesimen tertukar.",
            en: "2D micro-barcode tracking across cassettes and glass slides for zero specimen mix-ups.",
          },
        },

        // Kartu 4 — Mikrobiologi PPRA & Bank Darah (tab interaktif)
        microBloodCard: {
          microTab: { id: "Kultur Mikrobiologi PPRA", en: "ASP Microbiology Culture" },
          bloodTab: { id: "Bank Darah (BDRS)", en: "Blood Bank" },
          statusBadge: same("Real-Time Telemetry"),
          microColumns: [
            {
              id: "micro-isolate",
              label: { id: "Isolat Kuman", en: "Pathogen Isolate" },
              value: same("S. aureus (18h)"),
              sub: same("VITEK-2 Ingested"),
            },
            {
              id: "micro-susceptibility",
              label: { id: "Sensitivitas Utama", en: "Primary Susceptibility" },
              value: same("Vancomycin (S)"),
              sub: same("MIC ≤ 0.5 µg/mL"),
            },
            {
              id: "micro-resistance",
              label: { id: "Resistensi Terdeteksi", en: "Resistance Detected" },
              value: same("Cefoxitin / MRSA (R)"),
              sub: same("PPRA Alert Sent"),
            },
          ],
          bloodColumns: [
            {
              id: "blood-crossmatch",
              label: { id: "Uji Silang Serasi", en: "Cross-Match Test" },
              value: { id: "Mayor & Minor (OK)", en: "Major & Minor (OK)" },
              sub: { id: "#ID-0892 × Ny. Mariam", en: "#ID-0892 × Mrs. Mariam" },
            },
            {
              id: "blood-fridge",
              label: { id: "Suhu Kulkas BDRS", en: "Blood Fridge Temp" },
              value: { id: "3.8°C (Aman)", en: "3.8°C (Safe)" },
              sub: { id: "Rentang 2°C - 6°C", en: "Range 2°C - 6°C" },
            },
            {
              id: "blood-fefo",
              label: { id: "Rotasi FEFO Stok", en: "FEFO Stock Rotation" },
              value: { id: "Sisa 24 Hari", en: "24 Days Left" },
              sub: same("ISBT-128 Verified"),
            },
          ],
          searchPlaceholder: {
            id: "Cari riwayat kultur kuman atau pola resistensi antibiogram...",
            en: "Search pathogen culture history or antibiogram resistance patterns...",
          },
          searchButton: same("Enter"),
          title: { id: "Mikrobiologi PPRA & Bank Darah", en: "Microbiology Stewardship & Blood Bank" },
          desc: {
            id: "Kendali penuh pelaporan antibiogram PPRA sesuai standar CLSI dan jaminan nol inkompatibilitas transfusi darah.",
            en: "Complete command for CLSI-compliant stewardship antibiograms and 100% zero-mismatch blood transfusions.",
          },
        },

        // Kartu 5 — Rangkuman Klinis Nova AI
        novaCard: {
          headerLabel: { id: "Ringkasan Nova AI", en: "Nova AI Summary" },
          badge: same("Delta Check"),
          narratives: [
            {
              id: "narrative-creatinine",
              highlight: false,
              text: {
                id: "Terdeteksi lonjakan biomarker serum Kreatinin (+115% vs baseline 3 bulan lalu).",
                en: "Detected serum Creatinine biomarker surge (+115% vs 3-month baseline).",
              },
            },
            {
              id: "narrative-recommendation",
              highlight: false,
              text: {
                id: "Rekomendasi DPJP: Lakukan evaluasi Acute Kidney Injury (AKI) sebelum memulai peresepan nefrotoksik.",
                en: "Attending Recommendation: Evaluate for Acute Kidney Injury (AKI) before initiating nephrotoxic prescriptions.",
              },
            },
            {
              id: "narrative-authorization",
              highlight: true,
              text: {
                id: "Otorisasi Klinis: Keputusan diagnostik dan tindakan medis 100% di tangan dokter spesialis.",
                en: "Clinical Authorization: Diagnostic decisions and medical actions remain 100% with the specialist.",
              },
            },
          ],
          title: { id: "Rangkuman Klinis Nova AI", en: "Nova AI Clinical Summaries" },
          desc: {
            id: "Otomatis menangkap pergeseran data biomarker kritis dan menyajikan narasi medis instan untuk DPJP.",
            en: "Automatically flags longitudinal shifts and delivers instant clinical narratives for attending doctors.",
          },
        },
      },
    },

    plans: {
      label: "Matriks Kesesuaian Fasilitas (Tier)",
      content: {
        title: {
          id: "Solusi Tepat untuk Setiap Skala Faskes",
          en: "Tailored Architectures for Every Facility Scale",
        },
        subtitle: {
          id: "Pilih konfigurasi yang dirancang khusus untuk kebutuhan dan kapasitas instansi Anda. Tanpa biaya tersembunyi, fokus pada efisiensi kerja klinis.",
          en: "Choose an architecture engineered for your institution's specific tier. No bloatware, focused purely on clinical speed and compliance.",
        },
        cloudLabel: same("Cloud Enterprise"),
        onpremLabel: same("On-Premise Server"),
        tiers: [
          {
            id: "tier-1",
            iconName: "Zap",
            iconFilled: true,
            topTag: { id: "Ideal untuk RS Sentral Tipe A, B & C", en: "Ideal for general hospital networks" },
            title: { id: "RS Sentral", en: "Hospital Central" },
            subtitle: {
              id: "Solusi lengkap SIMRS dua arah, panel CITO IGD, dan bridging SatuSehat.",
              en: "Full bidirectional HIS bridging, rapid ER CITO alerts, and EMR sync.",
            },
            tierLabel: same("Tier 1"),
            tierSuffix: { id: "RS Sentral", en: "Hospital Central" },
            infoAriaLabel: "Informasi lisensi Tier 1",
            cloudTooltip: "Cloud Enterprise",
            onpremTooltip: "On-Premise Server",
            ctaText: { id: "Konsultasi Solusi RS", en: "Talk to an expert" },
            ctaHref: "/request-demo",
            featuresTitle: { id: "Tier 1 mencakup:", en: "Core includes:" },
            features: [
              { id: "t1-f1", iconName: "ArrowLeftRight", text: { id: "Bridging SIMRS & SatuSehat", en: "Bidirectional HIS & SatuSehat" } },
              { id: "t1-f2", iconName: "Monitor", text: { id: "Validasi barcode flebotomi", en: "Bedside phlebotomy barcodes" } },
              { id: "t1-f3", iconName: "MapPin", text: { id: "Panel CITO IGD & rawat inap", en: "Centralized ER & inpatient CITO" } },
              { id: "t1-f4", iconName: "Mic", text: { id: "Panic value alert IGD < 25m", en: "Panic value alert to ER < 25m" } },
              { id: "t1-f5", iconName: "Phone", text: { id: "Interfacing 500+ analyzer", en: "Automated 500+ analyzers" } },
            ],
          },
          {
            id: "tier-2",
            iconName: "Flame",
            iconFilled: true,
            topTag: { id: "Ideal untuk Lab Mandiri & MCU", en: "Ideal for enterprise companies" },
            title: { id: "Lab Klinik & MCU", en: "Clinical & MCU Labs" },
            subtitle: {
              id: "Throughput spesimen massal, cetak barcode cepat, dan kirim hasil WhatsApp.",
              en: "High-volume check-in, rapid barcode printing, and WhatsApp delivery.",
            },
            tierLabel: same("Tier 2"),
            tierSuffix: { id: "Lab Mandiri & MCU", en: "Independent & MCU" },
            infoAriaLabel: "Informasi lisensi Tier 2",
            cloudTooltip: "High-Throughput Cloud Engine",
            onpremTooltip: "Outpatient Dedicated Server",
            ctaText: { id: "Pilih Solusi Lab Klinik", en: "Talk to an expert" },
            ctaHref: "/request-demo",
            featuresTitle: { id: "Semua fitur Tier 1, ditambah:", en: "Everything in Core, plus:" },
            features: [
              { id: "t2-f1", iconName: "BarChart3", text: { id: "Batch MCU korporat 1-klik", en: "1-Click corporate MCU batch" } },
              { id: "t2-f2", iconName: "MessageSquare", text: { id: "Kirim hasil WhatsApp otomatis", en: "Automated WhatsApp delivery" } },
              { id: "t2-f3", iconName: "Video", text: { id: "Portal hasil pasien paperless", en: "Paperless patient portal" } },
              { id: "t2-f4", iconName: "Share2", text: { id: "Gateway billing B2B rujukan", en: "B2B referral billing gateway" } },
              { id: "t2-f5", iconName: "RefreshCw", text: { id: "Cetak barcode tabung 0.4s", en: "0.4s / tube barcode printing" } },
            ],
          },
          {
            id: "tier-3",
            iconName: "Microscope",
            iconFilled: false,
            topTag: { id: "Ideal untuk Spesialis PA, Mikro & BDRS", en: "Ideal for specialist diagnostics" },
            title: { id: "Diagnostik Spesialis", en: "Specialist Diagnostics" },
            subtitle: {
              id: "Dirancang mendalam untuk instalasi patologi anatomi, mikrobiologi & BDRS.",
              en: "Specialized suite for pathology, microbiology cultures, and blood banks.",
            },
            tierLabel: same("Tier 3"),
            tierSuffix: { id: "Spesialis PA & Mikro", en: "Pathology & Micro" },
            infoAriaLabel: "Informasi lisensi Tier 3",
            cloudTooltip: "Accredited Subspecialty Suite",
            onpremTooltip: "Standalone Workstation",
            ctaText: { id: "Konsultasi Solusi Spesialis", en: "Talk to an expert" },
            ctaHref: "/request-demo",
            featuresTitle: { id: "Solusi Spesialis mencakup:", en: "Specialist suite includes:" },
            features: [
              { id: "t3-f1", iconName: "QrCode", text: { id: "Pelacakan 2D kaset & slide PA", en: "2D tracking for tissue cassettes" } },
              { id: "t3-f2", iconName: "FileText", text: { id: "Template ICD-O-3 & Bethesda", en: "ICD-O-3 & Bethesda templates" } },
              { id: "t3-f3", iconName: "Activity", text: { id: "Antibiogram mikrobiologi CLSI", en: "Automated CLSI antibiogram" } },
              { id: "t3-f4", iconName: "HeartPulse", text: { id: "Uji silang serasi digital BDRS", en: "Digital ISBT-128 cross-match" } },
              { id: "t3-f5", iconName: "Thermometer", text: { id: "Telemetri cold chain 2°C-6°C", en: "24/7 cold chain telemetry" } },
            ],
          },
        ],
      },
    },

    efficiency: {
      label: "Dampak Terukur (Kurva Efisiensi & Perbandingan)",
      content: {
        badge: { id: "Dampak Terukur", en: "Measurable Impact" },
        title: {
          id: "Transformasi Efisiensi Operasional Laboratorium",
          en: "Transforming Laboratory Operational Efficiency",
        },
        subtitle: {
          id: "Bandingkan alur kerja manual berbasis entri ulang dengan otomatisasi end-to-end Diagnova di setiap tahapan pemeriksaan.",
          en: "Compare manual re-entry bottlenecks against end-to-end Diagnova automation across every diagnostic stage.",
        },
        trajectoryLabel: { id: "Kurva Efisiensi Alur Kerja", en: "Workflow Efficiency Trajectory" },
        tatLabel: "TAT:",
        beforeLabel: { id: "Sebelum Diagnova", en: "Before Diagnova" },
        afterLabel: { id: "Dengan Diagnova", en: "With Diagnova" },
        /** `id` fase yang aktif saat halaman dibuka. */
        defaultPhaseId: "analytic",
        phases: [
          {
            id: "pre",
            label: { id: "Pre-Analitik", en: "Pre-Analytic" },
            before: "35%",
            after: "92%",
            beforeSub: {
              id: "Entri order & pelabelan manual saat audit awal",
              en: "Manual order entry & labeling at initial audit",
            },
            afterSub: {
              id: "Efisiensi setelah barcode & bridging order otomatis",
              en: "Efficiency with automated barcode & order bridging",
            },
            tat: { id: "22 mnt -> 3 mnt", en: "22 min -> 3 min" },
          },
          {
            id: "analytic",
            label: { id: "Analitik & QC", en: "Analytic & QC" },
            before: "39%",
            after: "94%",
            beforeSub: {
              id: "Rata-rata efisiensi staf pada alur manual & entri ulang",
              en: "Baseline staff efficiency with manual transcription",
            },
            afterSub: {
              id: "Efisiensi rata-rata dengan auto-bridging & Westgard QC",
              en: "Average efficiency with auto-bridging & Westgard QC",
            },
            tat: { id: "118 mnt -> 24 mnt", en: "118 min -> 24 min" },
          },
          {
            id: "post",
            label: { id: "Pasca-Analitik", en: "Post-Analytic" },
            before: "42%",
            after: "96%",
            beforeSub: {
              id: "Verifikasi manual & pengiriman hasil ke unit klinis",
              en: "Manual sign-off & ward result distribution",
            },
            afterSub: {
              id: "Auto-verifikasi delta-check & alert nilai kritis instan",
              en: "Auto-verification delta-checks & instant critical alerts",
            },
            tat: { id: "45 mnt -> 4 mnt", en: "45 min -> 4 min" },
          },
        ],
        comparisonLabel: { id: "Perbandingan Operasional", en: "Operational Comparison" },
        comparisonTitle: { id: "Alur Manual vs Diagnova", en: "Manual Workflow vs Diagnova" },
        comparisonBadge: "Zero Re-entry",
        manualLabel: "Manual",
        diagnovaLabel: "Diagnova",
        rows: [
          {
            id: "order-entry",
            title: { id: "Entri Order & Barcode", en: "Order Entry & Barcoding" },
            manual: { id: "Ketik ulang manual, rawan salah label", en: "Manual re-typing, mislabeling risk" },
            diagnova: { id: "Sinkron HL7/FHIR & cetak barcode 1D/2D", en: "HL7/FHIR sync & auto 1D/2D barcoding" },
          },
          {
            id: "westgard-qc",
            title: { id: "Validasi Westgard QC", en: "Westgard QC Validation" },
            manual: { id: "Rekap spreadsheet harian terpisah", en: "Separate daily spreadsheet logs" },
            diagnova: { id: "Levey-Jennings real-time & kunci rilis otomatis", en: "Real-time Levey-Jennings & auto-lock" },
          },
          {
            id: "his-bridging",
            title: { id: "Bridging SIMRS & SATUSEHAT", en: "HIS & SATUSEHAT Bridging" },
            manual: { id: "Unggah PDF terpisah, tanpa LOINC", en: "Manual PDF upload, unmapped LOINC" },
            diagnova: { id: "Bi-direksional terstandar LOINC & SNOMED", en: "Bi-directional LOINC & SNOMED mapping" },
          },
          {
            id: "critical-value",
            title: { id: "Pelaporan Nilai Kritis", en: "Critical Value Reporting" },
            manual: { id: "Telepon manual tanpa jejak waktu", en: "Untracked manual phone calls" },
            diagnova: { id: "Eskalasi instan dengan audit trail waktu", en: "Instant escalation with SLA timestamp" },
          },
        ],
      },
    },

    rollout: {
      label: "Timeline Go-Live 4 Minggu",
      content: {
        badge: { id: "Implementasi Terstruktur", en: "Structured Rollout" },
        title: {
          id: "Dari Audit Awal Hingga Go-Live dalam 4 Minggu",
          en: "From Initial Audit to 24/7 Go-Live in 4 Weeks",
        },
        subtitle: {
          id: "Metodologi deployment tanpa mengganggu layanan pasien aktif, lengkap dengan tim engineer khusus.",
          en: "Zero-downtime deployment methodology led by dedicated clinical integration engineers.",
        },
        ownerLabel: { id: "Penanggung Jawab", en: "Phase Owner" },
        phases: [
          {
            id: "week-1",
            week: { id: "Minggu 1", en: "Week 1" },
            title: { id: "Audit Alur & Katalog Parameter", en: "Workflow Audit & Test Catalog" },
            tag: "HL7 / LOINC Mapping",
            deliverables: {
              id: "Pemetaan kode LOINC, struktur unit layanan, hak akses DPJP & ATLM, serta kesiapan jaringan instrumen.",
              en: "LOINC catalog mapping, department routing, RBAC matrix for pathologists & techs, and analyzer readiness.",
            },
            owner: "Diagnova Solution Architect & Kepala Instalasi Lab",
          },
          {
            id: "week-2",
            week: { id: "Minggu 2", en: "Week 2" },
            title: { id: "Bridging SIMRS & Driver Instrumen", en: "HIS Bridging & Analyzer Drivers" },
            tag: "ASTM / HL7 TCP-IP",
            deliverables: {
              id: "Integrasi bi-direksional SIMRS/EMR, SATUSEHAT FHIR, serta konektivitas serial/LAN ke seluruh analyzer.",
              en: "Bi-directional HIS/EMR integration, SATUSEHAT FHIR endpoints, and serial/LAN analyzer connectivity.",
            },
            owner: "Integration Engineer & Tim IT Rumah Sakit",
          },
          {
            id: "week-3",
            week: { id: "Minggu 3", en: "Week 3" },
            title: { id: "Kalibrasi Westgard QC & UAT Klinis", en: "Westgard QC & Clinical UAT" },
            tag: "Zero-Error Verification",
            deliverables: {
              id: "Simulasi parallel-run, verifikasi aturan Westgard multi-level, pelatihan ATLM & validasi laporan PDF/digital.",
              en: "Parallel-run simulation, Westgard rule calibration, staff training, and clinical report sign-off verification.",
            },
            owner: "Clinical QA Specialist & Tim ATLM",
          },
          {
            id: "week-4",
            week: { id: "Minggu 4", en: "Week 4" },
            title: { id: "Go-Live 24/7 & Pendampingan On-Site", en: "24/7 Go-Live & On-Site Hypercare" },
            tag: "SLA 99.9% Active",
            deliverables: {
              id: "Cutover penuh tanpa downtime, pemantauan transaksi real-time 24/7, dan serah terima ke dukungan SLA prioritas.",
              en: "Zero-downtime production cutover, 24/7 live transaction monitoring, and transition to priority SLA support.",
            },
            owner: "24/7 Command Center & On-Site Lead",
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

    catalog: {
      label: "Daftar Solusi (Halaman Detail /solutions/[slug])",
      content: {
        items: [
          {
            id: "hospital-laboratory",
            slug: "hospital-laboratory",
            iconName: "Building2",
            name: same("Hospital Laboratory"),
            tagline: same("Ekosistem LIS Terintegrasi Penuh untuk Rumah Sakit Modern"),
            targetAudience: same("Rumah Sakit Umum, RSUD, RS Swasta & RS Khusus"),
            shortDesc: same(
              "Solusi komprehensif yang menghubungkan laboratorium pusat, IGD, ICU, dan bangsal rawat inap secara real-time dengan bridging SIMRS/HIS & RME."
            ),
            description: same(
              "Diagnova Hospital Laboratory mengintegrasikan seluruh titik layanan laboratorium rumah sakit ke dalam satu alur kerja terpadu. Mulai dari order dokter di SIMRS, pengambilan spesimen di bangsal/IGD dengan mobile barcode scanner, proses pemeriksaan instrumen otomatis di lab, hingga rilis hasil kritis secara instan ke layar dokter yang merawat."
            ),
            challenges: [
              { id: "c-1", text: same("Duplikasi order pemeriksaan lab antara SIMRS dan LIS konvensional yang terpisah") },
              { id: "c-2", text: same("Keterlambatan penyampaian hasil lab kritis untuk pasien IGD dan ICU") },
              { id: "c-3", text: same("Tracing spesimen sulit saat sampel berpindah antar bangsal ke laboratorium") },
              { id: "c-4", text: same("Kebutuhan laporan audit yang rumit untuk standar akreditasi KARS / JCI") },
            ],
            highlights: [
              { id: "h-1", text: same("Bridging Dua Arah (Bidirectional) dengan SIMRS & Rekam Medis Elektronik (RME)") },
              { id: "h-2", text: same("Smart Panic Value Alert via notifikasi instan ke dokter penanggung jawab (DPJP)") },
              { id: "h-3", text: same("Mobile Specimen Collection Tracking dengan verifikasi identitas pasien di samping tempat tidur") },
              { id: "h-4", text: same("Dashboard Pemantauan TAT (Turnaround Time) Real-time per Departemen") },
            ],
            includedModules: [
              { id: "routine-hematology", slug: "routine-hematology" },
              { id: "inventory-reagent", slug: "inventory-reagent" },
              { id: "blood-bank", slug: "blood-bank" },
              { id: "pathology", slug: "pathology" },
              { id: "microbiology", slug: "microbiology" },
            ],
          },
          {
            id: "clinical-laboratory",
            slug: "clinical-laboratory",
            iconName: "Stethoscope",
            name: same("Clinical Laboratory & Lab Rujukan"),
            tagline: same("Efisiensi Operasional Skala Besar & Kecepatan Layanan Pasien Mandiri"),
            targetAudience: same("Laboratorium Klinik Mandiri & Laboratorium Rujukan Swasta"),
            shortDesc: same(
              "Dirancang untuk menangani ribuan pasien rawat jalan harian, medical check-up (MCU), dan rujukan antar-klinik dengan portal hasil online."
            ),
            description: same(
              "Diagnova Clinical Laboratory mengoptimalkan alur pelayanan mulai dari registrasi cepat pasien mandiri / MCU korporasi, pencetakan barcode otomatis, interfacing instrumen massal, hingga pengiriman hasil otomatis via WhatsApp / Email & Portal Pasien terenkripsi."
            ),
            challenges: [
              { id: "c-1", text: same("Antrean panjang pada jam sibuk pengambilan darah dan registrasi pasien") },
              { id: "c-2", text: same("Pengelolaan paket pemeriksaan Medical Check-Up (MCU) korporat yang rumit") },
              { id: "c-3", text: same("Biaya pencetakan kertas hasil lab dan lamanya proses distribusi laporan") },
              { id: "c-4", text: same("Pelacakan rujukan spesimen dari jejaring klinik mitra yang belum terstandardisasi") },
            ],
            highlights: [
              { id: "h-1", text: same("Modul MCU Massal dengan kalkulasi status kelayakan kerja otomatis") },
              { id: "h-2", text: same("Portal Hasil Online & Notifikasi WhatsApp / Email PDF Terenkripsi") },
              { id: "h-3", text: same("Interfacing B2B untuk integrasi penerimaan spesimen dari klinik rujukan") },
              { id: "h-4", text: same("Manajemen Billing & Tarif Fleksibel per Asuransi / Korporasi") },
            ],
            includedModules: [
              { id: "routine-hematology", slug: "routine-hematology" },
              { id: "inventory-reagent", slug: "inventory-reagent" },
            ],
          },
          {
            id: "pathology",
            slug: "pathology",
            iconName: "Microscope",
            name: same("Anatomical Pathology Center"),
            tagline: same("Presisi Diagnostik Jaringan & Digitalisasi Slide Mikroskopis"),
            targetAudience: same("Pusat Diagnostik Patologi Anatomi & Rumah Sakit Kanker"),
            shortDesc: same(
              "Pencatatan pemeriksaan histopatologi, sitologi, dan FNAB dengan pelacakan spesimen ketat dari makroskopi hingga diagnosis akhir dokter Sp.PA."
            ),
            description: same(
              "Solusi terdedikasi untuk laboratorium Patologi Anatomi yang membutuhkan tingkat ketertelusuran spesimen tertinggi. Mendukung integrasi Whole Slide Imaging (WSI), template pelaporan standar internasional (CAP / WHO), serta arsip digital blok dan slide jaringan."
            ),
            challenges: [
              { id: "c-1", text: same("Risiko fatal salah identifikasi atau tertukarnya kaset jaringan dan slide kaca") },
              { id: "c-2", text: same("Waktu pembuatan laporan deskriptif makroskopis dan mikroskopis yang panjang") },
              { id: "c-3", text: same("Kesulitan mengelola ribuan arsip fisik blok parafin dan slide kaca bertahun-tahun") },
              { id: "c-4", text: same("Keterbatasan akses foto mikroskopis untuk telaah second opinion") },
            ],
            highlights: [
              { id: "h-1", text: same("Barcode Tracking 2D pada level kaset jaringan, cetakan blok, dan slide kaca") },
              { id: "h-2", text: same("Structured Reporting Engine dengan integrasi terminologi ICD-O dan SNOMED CT") },
              { id: "h-3", text: same("Digital Pathology Workspace untuk anotasi dan tangkapan mikroskop beresolusi tinggi") },
              { id: "h-4", text: same("Manajemen Lokasi Rak Arsip Fisik Blok Parafin & Slide Berbasis Barcode") },
            ],
            includedModules: [
              { id: "pathology", slug: "pathology" },
              { id: "inventory-reagent", slug: "inventory-reagent" },
            ],
          },
          {
            id: "microbiology",
            slug: "microbiology",
            iconName: "FlaskConical",
            name: same("Microbiology & Antibiotic Stewardship"),
            tagline: same("Pelacakan Kultur Presisi & Program Pengendalian Resistensi Antimikroba"),
            targetAudience: same("Laboratorium Mikrobiologi Rumah Sakit & Komite PPRA"),
            shortDesc: same(
              "Pengelolaan kultur bakteri, uji kepekaan antibiotik (AST), peta kuman (antibiogram), dan deteksi dini bakteri resisten (MDRO)."
            ),
            description: same(
              "Diagnova Microbiology mengotomasi pencatatan hasil inkubasi media kultur, pembacaan zona hambat / MIC, serta interpretasi standar CLSI/EUCAST. Terintegrasi langsung dengan mesin otomatis seperti VITEK dan BACTEC untuk menyediakan laporan surveilans infeksi nosokomial secara real-time."
            ),
            challenges: [
              { id: "c-1", text: same("Waktu kultur bertahap yang memerlukan pemantauan inkubasi berhari-hari") },
              { id: "c-2", text: same("Kompleksitas interpretasi pedoman antimikroba (CLSI/EUCAST) yang terus diperbarui") },
              { id: "c-3", text: same("Penyusunan laporan Antibiogram RS yang memakan waktu jika dilakukan manual") },
              { id: "c-4", text: same("Keterlambatan peringatan adanya kuman multiresisten di ruang rawat intensif") },
            ],
            highlights: [
              { id: "h-1", text: same("Integrasi Mesin Otomasi Identifikasi Kuman & Ast Analyzer") },
              { id: "h-2", text: same("Kalkulasi Antibiogram Kumulatif Otomatis per Periode / Ruangan") },
              { id: "h-3", text: same("Alert MDRO (MRSA, ESBL, Carbapenemase) Instan ke Tim PPI (Pencegahan & Pengendalian Infeksi)") },
              { id: "h-4", text: same("Pohon Keputusan Rekomendasi Antibiotik Definitif untuk Dokter Klinisi") },
            ],
            includedModules: [
              { id: "microbiology", slug: "microbiology" },
              { id: "inventory-reagent", slug: "inventory-reagent" },
            ],
          },
          {
            id: "blood-bank",
            slug: "blood-bank",
            iconName: "HeartPulse",
            name: same("Blood Bank & Transfusion Safety"),
            tagline: same("Keamanan Transfusi Maksimal & Manajemen Rantai Pasok Darah"),
            targetAudience: same("Bank Darah Rumah Sakit (BDRS) & Unit Transfusi Darah (UTD)"),
            shortDesc: same(
              "Kontrol ketat persediaan kantong darah, validasi uji silang serasi (crossmatch), dan pemantauan rantai dingin untuk keselamatan pasien."
            ),
            description: same(
              "Solusi Bank Darah Diagnova mengawasi setiap siklus hidup kantong darah, mulai dari penerimaan dari PMI/UTD, penyimpanan pada cold storage terstandar, uji kompatibilitas serologi, hingga serah terima ke perawat ruang rawat."
            ),
            challenges: [
              { id: "c-1", text: same("Risiko inkompatibilitas transfusi akibat kesalahan verifikasi identitas pasien/darah") },
              { id: "c-2", text: same("Tingginya angka darah kedaluwarsa karena manajemen stok First-Expired-First-Out (FEFO) kurang ketat") },
              { id: "c-3", text: same("Kurangnya pencatatan digital rekam jejak suhu penyimpanan darah") },
              { id: "c-4", text: same("Kebutuhan respon cepat saat kondisi darurat kebutuhan darah masif (MTP)") },
            ],
            highlights: [
              { id: "h-1", text: same("Validasi Ganda (Dual-Verification) Barcode saat Crossmatching & Penyerahan Darah") },
              { id: "h-2", text: same("Manajemen Stok FEFO Otomatis dengan Peringatan Kedaluwarsa Dini") },
              { id: "h-3", text: same("Protokol Transfusi Masif Cepat (Emergency Massive Transfusion Protocol)") },
              { id: "h-4", text: same("Pencatatan Riwayat Reaksi Transfusi & Hemovigilance Terpusat") },
            ],
            includedModules: [
              { id: "blood-bank", slug: "blood-bank" },
              { id: "inventory-reagent", slug: "inventory-reagent" },
            ],
          },
          {
            id: "nova-ai",
            slug: "nova-ai",
            iconName: "Sparkles",
            name: same("Nova AI - Laboratory Intelligence"),
            tagline: same("AI Copilot Cerdas untuk Meringkas, Mendeteksi Anomali, dan Membantu Dokter"),
            targetAudience: same("Dokter Patologi Klinik, Dokter Spesialis, dan Manajemen Mutu Lab"),
            shortDesc: same(
              "Kecerdasan buatan terkurasi yang menerjemahkan data lab kompleks menjadi insight ringkas yang dapat ditindaklanjuti, dengan kendali keputusan 100% di tangan dokter."
            ),
            description: same(
              "Nova AI berfungsi sebagai asisten cerdas bagi dokter dan staf laboratorium. Nova AI membaca riwayat hasil lab sebelumnya, mendeteksi pola anomali delta check, merangkum hasil multi-parameter ke dalam bahasa klinis yang jelas, dan memberikan alert dini tanpa menggantikan penilaian medis profesional dokter."
            ),
            challenges: [
              { id: "c-1", text: same("Dokter kebanjiran ratusan lembar hasil lab berformat angka tanpa rangkuman tren") },
              { id: "c-2", text: same("Anomali hasil antar-kunjungan (delta check) yang terlewat karena keterbatasan waktu") },
              { id: "c-3", text: same("Pasien kesulitan memahami istilah laboratorium tanpa penjelasan dokter") },
            ],
            highlights: [
              { id: "h-1", text: same("Automatic Lab Result Summarization dalam bahasa medis ringkas & bahasa awam") },
              { id: "h-2", text: same("Intelligent Delta Check & Trend Anomaly Detection") },
              { id: "h-3", text: same("Natural Language Query untuk pencarian data laboratorium historis") },
              { id: "h-4", text: same("Medical Disclaimer Kepatuhan: Keputusan 100% di tangan Dokter") },
            ],
            includedModules: [
              { id: "routine-hematology", slug: "routine-hematology" },
              { id: "pathology", slug: "pathology" },
              { id: "microbiology", slug: "microbiology" },
            ],
          },
        ],
      },
    },

    detail: {
      label: "Template Halaman Detail Solusi",
      content: {
        backLabel: same("Semua Solusi"),
        backHref: "/solutions",
        overviewTitle: same("Gambaran Solusi & Alur Operasional"),
        challengesTitle: same("Tantangan Laboratorium yang Diatasi"),
        /** `{name}` diganti nama solusi. */
        highlightsTitle: same("Fitur Unggulan untuk {name}"),
        modulesTitle: same("Modul Diagnova yang Mendukung Solusi Ini"),
        sidebarBadge: same("Konsultasi Spesialis"),
        sidebarTitle: same("Siap Transformasi Laboratorium Anda?"),
        /** `{name}` diganti nama solusi. */
        sidebarDesc: same(
          "Diskusikan simulasi alur kerja, interfacing instrumen, dan estimasi waktu penerapan untuk {name} bersama tim kami."
        ),
        sidebarCtaText: same("Minta Demo Interaktif"),
        sidebarCtaHref: "/request-demo",
        /** Metadata halaman (SEO). `{name}` diganti nama solusi (teks ID). */
        metaTitle: "{name} — Solusi Diagnova",
        notFoundTitle: "Solusi Tidak Ditemukan",
      },
    },
  },
} satisfies CmsPageDefinition;

export type SolutionsPageContent = PageContentOf<typeof solutionsPage>;
export type SolutionCatalogItem = (typeof solutionsPage)["sections"]["catalog"]["content"]["items"][number];
export type SolutionsCtaContent = (typeof solutionsPage)["sections"]["cta"]["content"];
export type SolutionDetailLabels = (typeof solutionsPage)["sections"]["detail"]["content"];

/** Mengubah konten section `cta` ke bentuk prop `initialData` milik <CTABanner> (komponen bersama, tidak diubah). */
export function toCtaBannerData(cta: SolutionsCtaContent) {
  return {
    section: {
      titleId: cta.title?.id,
      titleEn: cta.title?.en,
      subtitleId: cta.subtitle?.id,
      subtitleEn: cta.subtitle?.en,
      extraContent: {
        buttonTextId: cta.buttonText?.id,
        buttonTextEn: cta.buttonText?.en,
        placeholderId: cta.placeholder?.id,
        placeholderEn: cta.placeholder?.en,
      },
    },
  };
}

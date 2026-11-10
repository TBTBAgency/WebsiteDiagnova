import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedCms() {
  console.log("Seeding CMS Homepage initial content...");

  // 1. HERO SECTION
  const heroSection = await prisma.cmsSection.upsert({
    where: { sectionKey: "hero" },
    update: {
      badgeId: "Platform Intelijen Laboratorium Berbasis AI",
      badgeEn: "AI-Powered Laboratory Intelligence Platform",
      titleId: "Platform Intelijen Laboratorium Terdepan",
      titleEn: "Next-Generation Laboratory Intelligence Platform",
      subtitleId:
        "Sistem Informasi Laboratorium generasi baru yang menghubungkan instrumen medis secara otomatis dengan para klinisi. Mengubah data diagnostik kompleks menjadi keputusan medis yang cepat, akurat, dan transparan.",
      subtitleEn:
        "A next-generation Laboratory Information System autonomously connecting medical instruments with clinicians. Transforming complex diagnostic data into fast, accurate, and actionable medical decisions.",
      isPublished: true,
    },
    create: {
      sectionKey: "hero",
      badgeId: "Platform Intelijen Laboratorium Berbasis AI",
      badgeEn: "AI-Powered Laboratory Intelligence Platform",
      titleId: "Platform Intelijen Laboratorium Terdepan",
      titleEn: "Next-Generation Laboratory Intelligence Platform",
      subtitleId:
        "Sistem Informasi Laboratorium generasi baru yang menghubungkan instrumen medis secara otomatis dengan para klinisi. Mengubah data diagnostik kompleks menjadi keputusan medis yang cepat, akurat, dan transparan.",
      subtitleEn:
        "A next-generation Laboratory Information System autonomously connecting medical instruments with clinicians. Transforming complex diagnostic data into fast, accurate, and actionable medical decisions.",
      isPublished: true,
    },
  });

  // Seed Hero Slides
  const heroSlidesData = [
    {
      titleId: "Dari Hasil Uji Mentah Menjadi Keputusan Klinis",
      titleEn: "From Raw Lab Results To Clinical Intelligence",
      badgeId: "Platform Intelijen Laboratorium Berbasis AI",
      badgeEn: "AI-Powered Laboratory Intelligence Platform",
      subtitleId:
        "Sistem Informasi Laboratorium generasi baru yang menghubungkan instrumen medis secara otomatis dengan para klinisi.",
      subtitleEn:
        "A next-generation Laboratory Information System autonomously connecting medical instruments with clinicians.",
      ctaPrimaryTextId: "Jadwalkan Demo",
      ctaPrimaryTextEn: "Schedule Demo",
      ctaPrimaryUrl: "/request-demo",
      ctaSecondaryTextId: "Jelajahi Modul",
      ctaSecondaryTextEn: "Explore Modules",
      ctaSecondaryUrl: "/modules",
      imageUrl: "/images/hero-bg-1.webp",
      imageAlt: "Diagnova Laboratory Intelligence Specialist",
      sortOrder: 1,
    },
    {
      titleId: "Laboratorium Terkoneksi, Tanpa Hambatan Data",
      titleEn: "Connected Laboratory, Zero Data Silos",
      badgeId: "Interoperabilitas Nasional",
      badgeEn: "Seamless Interoperability",
      subtitleId:
        "Bridging instan dua arah dengan SATUSEHAT Kemenkes dan ratusan jenis analyzer rumah sakit.",
      subtitleEn:
        "Instant bi-directional bridging with SATUSEHAT and hundreds of hospital laboratory instruments.",
      ctaPrimaryTextId: "Jadwalkan Demo",
      ctaPrimaryTextEn: "Schedule Demo",
      ctaPrimaryUrl: "/request-demo",
      ctaSecondaryTextId: "Jelajahi Modul",
      ctaSecondaryTextEn: "Explore Modules",
      ctaSecondaryUrl: "/modules",
      imageUrl: "/images/hero-bg-2.webp",
      imageAlt: "Diagnova Seamless Interoperability & Automation",
      sortOrder: 2,
    },
    {
      titleId: "Diagnostik AI Presisi, Memperkuat Tenaga Medis",
      titleEn: "Precision AI Diagnostics, Empowered Clinicians",
      badgeId: "Kecerdasan Buatan Terdepan",
      badgeEn: "Precision AI Diagnostics",
      subtitleId:
        "Nova AI mendeteksi deviasi kritis seketika dan mendukung dokter mengambil keputusan klinis lebih cepat.",
      subtitleEn:
        "Nova AI flags critical deviations instantly, assisting clinicians in faster decision making.",
      ctaPrimaryTextId: "Jadwalkan Demo",
      ctaPrimaryTextEn: "Schedule Demo",
      ctaPrimaryUrl: "/request-demo",
      ctaSecondaryTextId: "Jelajahi Modul",
      ctaSecondaryTextEn: "Explore Modules",
      ctaSecondaryUrl: "/modules",
      imageUrl: "/images/hero-bg-3.webp",
      imageAlt: "Nova AI Clinical Decision Support",
      sortOrder: 3,
    },
  ];

  await prisma.cmsHeroSlide.deleteMany({ where: { sectionId: heroSection.id } });
  for (const slide of heroSlidesData) {
    await prisma.cmsHeroSlide.create({
      data: {
        ...slide,
        sectionId: heroSection.id,
      },
    });
  }
  console.log("Hero section & slides seeded.");

  // 2. TRUSTED BY SECTION
  const trustedSection = await prisma.cmsSection.upsert({
    where: { sectionKey: "trusted_by" },
    update: {
      badgeId: "Kemitraan",
      badgeEn: "Partnership",
      titleId: "DIPERCAYA OLEH",
      titleEn: "TRUSTED BY",
      subtitleId: "Dipercaya oleh 50+ Laboratorium Klinis & Rumah Sakit di Seluruh Indonesia",
      subtitleEn: "Trusted by 50+ Clinical Laboratories & Hospitals Across Indonesia",
      isPublished: true,
    },
    create: {
      sectionKey: "trusted_by",
      badgeId: "Kemitraan",
      badgeEn: "Partnership",
      titleId: "DIPERCAYA OLEH",
      titleEn: "TRUSTED BY",
      subtitleId: "Dipercaya oleh 50+ Laboratorium Klinis & Rumah Sakit di Seluruh Indonesia",
      subtitleEn: "Trusted by 50+ Clinical Laboratories & Hospitals Across Indonesia",
      isPublished: true,
    },
  });

  const partnersData = [
    { name: "RS Hermina Group", logoUrl: "/images/trust-logo.svg", sortOrder: 1 },
    { name: "Siloam Hospitals", logoUrl: "/images/trust-logo.svg", sortOrder: 2 },
    { name: "Mayapada Hospital", logoUrl: "/images/trust-logo.svg", sortOrder: 3 },
    { name: "Prodia Diagnostika", logoUrl: "/images/trust-logo.svg", sortOrder: 4 },
    { name: "Kimia Farma Lab", logoUrl: "/images/trust-logo.svg", sortOrder: 5 },
    { name: "RSUD Tarakan", logoUrl: "/images/trust-logo.svg", sortOrder: 6 },
  ];

  await prisma.cmsPartner.deleteMany({ where: { sectionId: trustedSection.id } });
  for (const partner of partnersData) {
    await prisma.cmsPartner.create({
      data: {
        ...partner,
        sectionId: trustedSection.id,
      },
    });
  }
  console.log("Trusted by section & partners seeded.");

  // 3. ABOUT SECTION
  await prisma.cmsSection.upsert({
    where: { sectionKey: "about" },
    update: {
      badgeId: "Tentang Diagnova",
      badgeEn: "About Diagnova",
      titleId:
        "Di Diagnova, Kami Mengubah Data Diagnostik Menjadi Intelijen Klinis, Memperkuat Laboratorium Menghasilkan Keputusan Medis yang Presisi.",
      titleEn:
        "At Diagnova, We Transform Diagnostic Data Into Clinical Intelligence, Empowering Laboratories To Make Precise Medical Decisions.",
      subtitleId:
        "Lebih dari sekadar LIS konvensional, Diagnova adalah ekosistem cerdas yang menghubungkan tenaga medis, instrumen laboratorium, dan alur kerja klinis. Kami membantu laboratorium modern melangkah dari sekadar mengelola data menuju penyajian wawasan klinis yang akurat dan dapat ditindaklanjuti.",
      subtitleEn:
        "More than a traditional LIS, Diagnova is an intelligent ecosystem connecting clinicians, instruments, and laboratory workflows. We empower modern laboratories to move beyond managing data to delivering clear, actionable clinical insights.",
      extraContent: {
        imageUrl: "/images/dna-about.webp",
        imageAlt: "Diagnova DNA Intelligence Structure",
      },
      isPublished: true,
    },
    create: {
      sectionKey: "about",
      badgeId: "Tentang Diagnova",
      badgeEn: "About Diagnova",
      titleId:
        "Di Diagnova, Kami Mengubah Data Diagnostik Menjadi Intelijen Klinis, Memperkuat Laboratorium Menghasilkan Keputusan Medis yang Presisi.",
      titleEn:
        "At Diagnova, We Transform Diagnostic Data Into Clinical Intelligence, Empowering Laboratories To Make Precise Medical Decisions.",
      subtitleId:
        "Lebih dari sekadar LIS konvensional, Diagnova adalah ekosistem cerdas yang menghubungkan tenaga medis, instrumen laboratorium, dan alur kerja klinis. Kami membantu laboratorium modern melangkah dari sekadar mengelola data menuju penyajian wawasan klinis yang akurat dan dapat ditindaklanjuti.",
      subtitleEn:
        "More than a traditional LIS, Diagnova is an intelligent ecosystem connecting clinicians, instruments, and laboratory workflows. We empower modern laboratories to move beyond managing data to delivering clear, actionable clinical insights.",
      extraContent: {
        imageUrl: "/images/dna-about.webp",
        imageAlt: "Diagnova DNA Intelligence Structure",
      },
      isPublished: true,
    },
  });
  console.log("About section seeded.");

  // 4. COMPARISON SECTION
  const comparisonSection = await prisma.cmsSection.upsert({
    where: { sectionKey: "comparison" },
    update: {
      badgeId: "Perbandingan LIS",
      badgeEn: "LIS Comparison",
      titleId: "Mengapa Memilih Diagnova?",
      titleEn: "Why Choose Diagnova?",
      subtitleId:
        "Bandingkan hambatan LIS konvensional dengan lonjakan efisiensi dan akurasi klinis bersama ekosistem cerdas Diagnova.",
      subtitleEn:
        "Compare the constraints of legacy LIS against the surge in clinical efficiency and diagnostic accuracy powered by Diagnova.",
      extraContent: {
        conventionalBadgeId: "6 Keterbatasan LIS Konvensional",
        conventionalBadgeEn: "6 Legacy LIS Constraints",
        diagnovaBadgeId: "6 Keunggulan Ekosistem Diagnova",
        diagnovaBadgeEn: "6 Diagnova Ecosystem Advantages",
      },
      isPublished: true,
    },
    create: {
      sectionKey: "comparison",
      badgeId: "Perbandingan LIS",
      badgeEn: "LIS Comparison",
      titleId: "Mengapa Memilih Diagnova?",
      titleEn: "Why Choose Diagnova?",
      subtitleId:
        "Bandingkan hambatan LIS konvensional dengan lonjakan efisiensi dan akurasi klinis bersama ekosistem cerdas Diagnova.",
      subtitleEn:
        "Compare the constraints of legacy LIS against the surge in clinical efficiency and diagnostic accuracy powered by Diagnova.",
      extraContent: {
        conventionalBadgeId: "6 Keterbatasan LIS Konvensional",
        conventionalBadgeEn: "6 Legacy LIS Constraints",
        diagnovaBadgeId: "6 Keunggulan Ekosistem Diagnova",
        diagnovaBadgeEn: "6 Diagnova Ecosystem Advantages",
      },
      isPublished: true,
    },
  });

  const comparisonItemsData = [
    {
      number: "01",
      conventionalTitleId: "Silo & Terisolasi dari SIMRS",
      conventionalTitleEn: "Isolated & Disconnected from EHR",
      conventionalDescId: "Entri ganda berulang memicu salah identifikasi spesimen dan membuang waktu klinis.",
      conventionalDescEn: "Duplicate data entry causes specimen misidentification and slows patient onboarding.",
      diagnovaTitleId: "Bridging Instan Dua Arah",
      diagnovaTitleEn: "Instant Bi-directional Bridging",
      diagnovaDescId: "Sinkronisasi otomatis dengan SIMRS, RME, dan terhubung resmi ke SATUSEHAT Kemenkes tanpa ketik ulang.",
      diagnovaDescEn: "Automated synchronization with EHR, HIS, and SATUSEHAT without repetitive re-typing.",
      impactMetric: "0% Duplikasi",
      sortOrder: 1,
    },
    {
      number: "02",
      conventionalTitleId: "Ketergantungan Input Manual",
      conventionalTitleEn: "Heavy Manual Transcription",
      conventionalDescId: "Pengetikan angka hasil secara manual lambat dan memperbesar risiko salah transkripsi.",
      conventionalDescEn: "Typing test values manually is slow and raises risk of transcript error.",
      diagnovaTitleId: "Otomasi Interfacing Analyzer",
      diagnovaTitleEn: "Direct Analyzer Interfacing",
      diagnovaDescId: "Koneksi instrumen langsung dan verifikasi otomatis memangkas Turnaround Time (TAT) hingga 70%.",
      diagnovaDescEn: "Direct device interfacing and automatic verification cuts Turnaround Time (TAT) by up to 70%.",
      impactMetric: "TAT Turun 70%",
      sortOrder: 2,
    },
    {
      number: "03",
      conventionalTitleId: "Koneksi Alat Sering Terputus",
      conventionalTitleEn: "Fragile Serial Connections",
      conventionalDescId: "Komunikasi alat serial rentan drop, memicu antrean sampel dan risiko data hilang.",
      conventionalDescEn: "Serial connections frequently disconnect, creating sample bottlenecks and data loss.",
      diagnovaTitleId: "Smart Gateway Berketahanan 99.9%",
      diagnovaTitleEn: "Fault-Tolerant Smart Gateway",
      diagnovaDescId: "Protokol HL7/ASTM dengan buffer luring (offline buffer), data tetap aman saat jaringan rumah sakit terganggu.",
      diagnovaDescEn: "HL7/ASTM protocol with offline buffer keeps records safe even during network outages.",
      impactMetric: "Uptime 99.9%",
      sortOrder: 3,
    },
    {
      number: "04",
      conventionalTitleId: "Deteksi Nilai Kritis Pasif",
      conventionalTitleEn: "Passive Critical Value Detection",
      conventionalDescId: "Hasil abnormal lambat disadari dokter karena ketiadaan notifikasi otomatis seketika.",
      conventionalDescEn: "Abnormal values go unnoticed until manual review, delaying urgent treatment.",
      diagnovaTitleId: "Alert Real-Time & Asisten Nova AI",
      diagnovaTitleEn: "Real-Time Alerts & Nova AI Engine",
      diagnovaDescId: "Peringatan dini nilai kritis dan delta check instan, membantu dokter merespons kegawatdaruratan lebih cepat.",
      diagnovaDescEn: "Instant critical alerts and delta checks empower physicians to respond rapidly to emergencies.",
      impactMetric: "Alert < 1 Detik",
      sortOrder: 4,
    },
    {
      number: "05",
      conventionalTitleId: "Jejak Audit Lemah & Rawan Celah",
      conventionalTitleEn: "Weak Audit Trail & Compliance",
      conventionalDescId: "Riwayat koreksi tidak terlacak rapi, menyulitkan akreditasi KARS dan ISO 15189.",
      conventionalDescEn: "Change history lacks cryptographic certainty, complicating accreditation audits.",
      diagnovaTitleId: "Audit Trail Kriptografis Lengkap",
      diagnovaTitleEn: "Tamper-Proof Audit Trail",
      diagnovaDescId: "Setiap modifikasi hasil terekam dengan timestamp, identitas operator, dan nilai sebelumnya siap akreditasi.",
      diagnovaDescEn: "Every edit logs operator identity, timestamp, and previous values, ready for ISO 15189.",
      impactMetric: "ISO 15189 Ready",
      sortOrder: 5,
    },
    {
      number: "06",
      conventionalTitleId: "Skalabilitas Terbatas & Server Lokal",
      conventionalTitleEn: "Limited Scaling & Fragile On-Prem",
      conventionalDescId: "Server lokal rentan rusak fisik, backup manual jarang dilakukan, dan sulit diekspansi.",
      conventionalDescEn: "Local servers are prone to hardware failure, manual backups, and rigid limits.",
      diagnovaTitleId: "Arsitektur Cloud Hybrid Skalabel",
      diagnovaTitleEn: "Scalable Hybrid-Cloud Architecture",
      diagnovaDescId: "Mendukung multi-cabang tanpa batas dengan backup otomatis dan enkripsi data end-to-end.",
      diagnovaDescEn: "Multi-branch scalability with automated geo-redundant backups and end-to-end encryption.",
      impactMetric: "Multi-Branch Ready",
      sortOrder: 6,
    },
  ];

  await prisma.cmsComparisonItem.deleteMany({ where: { sectionId: comparisonSection.id } });
  for (const item of comparisonItemsData) {
    await prisma.cmsComparisonItem.create({
      data: {
        ...item,
        sectionId: comparisonSection.id,
      },
    });
  }
  console.log("Comparison section & items seeded.");

  // 5. WORKFLOW SECTION
  await prisma.cmsSection.upsert({
    where: { sectionKey: "workflow" },
    update: {
      badgeId: "Alur Kerja Presisi",
      badgeEn: "Precision Workflow",
      titleId: "Otomatisasi Laboratorium End-to-End",
      titleEn: "End-to-End Laboratory Automation",
      subtitleId:
        "Setiap tabung spesimen bergerak melalui ekosistem digital terintegrasi dari meja registrasi hingga laporan dokter.",
      subtitleEn:
        "Every specimen moves through a secure digital lifecycle from registration counter to clinical report.",
      extraContent: {
        steps: [
          {
            id: "step-1",
            number: "01",
            titleId: "Penerimaan & Pelabelan Cerdas",
            titleEn: "Smart Specimen Intake & Barcoding",
            shortTitleId: "Penerimaan Barcode",
            shortTitleEn: "Specimen Intake",
            descriptionId:
              "Setiap tabung spesimen menerima barcode unik, memastikan tidak ada sampel tertukar di laboratorium.",
            descriptionEn:
              "Each sample tube receives a unique barcode, eliminating misidentification and lost specimens.",
            iconName: "qrcode",
          },
          {
            id: "step-2",
            number: "02",
            titleId: "Verifikasi Otomatis",
            titleEn: "Automated Instrument Interfacing",
            shortTitleId: "Otomasi Analyzer",
            shortTitleEn: "Analyzer Automation",
            descriptionId:
              "Setelah diproses analyzer, Diagnova menyimpan seluruh angka hasil uji secara langsung tanpa ketik ulang manual.",
            descriptionEn:
              "Raw test values flow directly from analyzers into the digital patient record without manual transcription.",
            iconName: "cpu",
          },
          {
            id: "step-3",
            number: "03",
            titleId: "Deteksi Dini & Pengecekan Delta",
            titleEn: "Early Warning & Delta Checks",
            shortTitleId: "Delta Check",
            shortTitleEn: "Delta Check",
            descriptionId:
              "Jika terdeteksi nilai kritis atau deviasi drastis, sistem otomatis memicu peringatan seketika bagi dokter dan analis.",
            descriptionEn:
              "Sudden parameter shifts trigger immediate real-time alerts for pathologists and attending doctors.",
            iconName: "activity",
          },
          {
            id: "step-4",
            number: "04",
            titleId: "Hasil Akurat Siap Rilis",
            titleEn: "Validated Clinical Authorization",
            shortTitleId: "Validasi & Rilis",
            shortTitleEn: "Validation & Release",
            descriptionId:
              "Hasil laboratorium yang telah tervalidasi langsung terkirim ke dokter dan tersinkronisasi mulus ke RME rumah sakit.",
            descriptionEn:
              "Signed reports synchronize instantly to the hospital EHR and outpatient patient portal.",
            iconName: "check",
          },
        ],
      },
      isPublished: true,
    },
    create: {
      sectionKey: "workflow",
      badgeId: "Alur Kerja Presisi",
      badgeEn: "Precision Workflow",
      titleId: "Otomatisasi Laboratorium End-to-End",
      titleEn: "End-to-End Laboratory Automation",
      subtitleId:
        "Setiap tabung spesimen bergerak melalui ekosistem digital terintegrasi dari meja registrasi hingga laporan dokter.",
      subtitleEn:
        "Every specimen moves through a secure digital lifecycle from registration counter to clinical report.",
      extraContent: {
        steps: [
          {
            id: "step-1",
            number: "01",
            titleId: "Penerimaan & Pelabelan Cerdas",
            titleEn: "Smart Specimen Intake & Barcoding",
            shortTitleId: "Penerimaan Barcode",
            shortTitleEn: "Specimen Intake",
            descriptionId:
              "Setiap tabung spesimen menerima barcode unik, memastikan tidak ada sampel tertukar di laboratorium.",
            descriptionEn:
              "Each sample tube receives a unique barcode, eliminating misidentification and lost specimens.",
            iconName: "qrcode",
          },
          {
            id: "step-2",
            number: "02",
            titleId: "Verifikasi Otomatis",
            titleEn: "Automated Instrument Interfacing",
            shortTitleId: "Otomasi Analyzer",
            shortTitleEn: "Analyzer Automation",
            descriptionId:
              "Setelah diproses analyzer, Diagnova menyimpan seluruh angka hasil uji secara langsung tanpa ketik ulang manual.",
            descriptionEn:
              "Raw test values flow directly from analyzers into the digital patient record without manual transcription.",
            iconName: "cpu",
          },
          {
            id: "step-3",
            number: "03",
            titleId: "Deteksi Dini & Pengecekan Delta",
            titleEn: "Early Warning & Delta Checks",
            shortTitleId: "Delta Check",
            shortTitleEn: "Delta Check",
            descriptionId:
              "Jika terdeteksi nilai kritis atau deviasi drastis, sistem otomatis memicu peringatan seketika bagi dokter dan analis.",
            descriptionEn:
              "Sudden parameter shifts trigger immediate real-time alerts for pathologists and attending doctors.",
            iconName: "activity",
          },
          {
            id: "step-4",
            number: "04",
            titleId: "Hasil Akurat Siap Rilis",
            titleEn: "Validated Clinical Authorization",
            shortTitleId: "Validasi & Rilis",
            shortTitleEn: "Validation & Release",
            descriptionId:
              "Hasil laboratorium yang telah tervalidasi langsung terkirim ke dokter dan tersinkronisasi mulus ke RME rumah sakit.",
            descriptionEn:
              "Signed reports synchronize instantly to the hospital EHR and outpatient patient portal.",
            iconName: "check",
          },
        ],
      },
      isPublished: true,
    },
  });
  console.log("Workflow section seeded.");

  // 6. INFRASTRUCTURE SECTION
  await prisma.cmsSection.upsert({
    where: { sectionKey: "infrastructure" },
    update: {
      badgeId: "Infrastruktur & Arsitektur",
      badgeEn: "Infrastructure & Architecture",
      titleId: "Dibangun untuk Keandalan Kelas Rumah Sakit",
      titleEn: "Engineered for Hospital-Grade Reliability",
      subtitleId:
        "Arsitektur cloud native Diagnova dirancang dengan standar keamanan data medis tertinggi, integrasi instrumen tak terbatas, dan asisten AI terdepan.",
      subtitleEn:
        "Diagnova cloud-native architecture is built with the highest medical data standards, limitless analyzer integrations, and cutting-edge clinical AI.",
      extraContent: {
        cards: [
          {
            id: "automation",
            titleId: "Otomatisasi 100%",
            titleEn: "100% Automation",
            descriptionId:
              "Identifikasi kode batang yang ketat dan koneksi alat dua arah memangkas Turnaround Time (TAT) hingga 70% dengan mengeliminasi entri data manual.",
            descriptionEn:
              "Strict barcode identification and direct analyzer interfacing cut Turnaround Time (TAT) by up to 70% by eliminating manual data entry.",
            iconName: "automation",
          },
          {
            id: "integration",
            titleId: "Integrasi Tanpa Hambatan",
            titleEn: "Seamless Integration",
            descriptionId:
              "Terhubung secara asli dengan SIMRS, RME, dan siap SATUSEHAT. Kompatibel secara universal dengan lebih dari 500 instrumen medis.",
            descriptionEn:
              "Natively bridges with HIS, EMR, and is SATUSEHAT ready. Universally compatible with over 500 medical instruments.",
            iconName: "integration",
          },
          {
            id: "nova-ai",
            titleId: "Asisten Nova AI",
            titleEn: "Nova AI Assistant",
            descriptionId:
              "Nova AI mendeteksi pola, memberikan peringatan dini, dan menyederhanakan angka diagnostik kompleks. Keputusan medis tetap 100% di tangan dokter.",
            descriptionEn:
              "Nova AI detects patterns, provides early warnings, and simplifies complex numbers. Treatment decisions remain 100% with the doctor.",
            iconName: "ai",
          },
        ],
      },
      isPublished: true,
    },
    create: {
      sectionKey: "infrastructure",
      badgeId: "Infrastruktur & Arsitektur",
      badgeEn: "Infrastructure & Architecture",
      titleId: "Dibangun untuk Keandalan Kelas Rumah Sakit",
      titleEn: "Engineered for Hospital-Grade Reliability",
      subtitleId:
        "Arsitektur cloud native Diagnova dirancang dengan standar keamanan data medis tertinggi, integrasi instrumen tak terbatas, dan asisten AI terdepan.",
      subtitleEn:
        "Diagnova cloud-native architecture is built with the highest medical data standards, limitless analyzer integrations, and cutting-edge clinical AI.",
      extraContent: {
        cards: [
          {
            id: "automation",
            titleId: "Otomatisasi 100%",
            titleEn: "100% Automation",
            descriptionId:
              "Identifikasi kode batang yang ketat dan koneksi alat dua arah memangkas Turnaround Time (TAT) hingga 70% dengan mengeliminasi entri data manual.",
            descriptionEn:
              "Strict barcode identification and direct analyzer interfacing cut Turnaround Time (TAT) by up to 70% by eliminating manual data entry.",
            iconName: "automation",
          },
          {
            id: "integration",
            titleId: "Integrasi Tanpa Hambatan",
            titleEn: "Seamless Integration",
            descriptionId:
              "Terhubung secara asli dengan SIMRS, RME, dan siap SATUSEHAT. Kompatibel secara universal dengan lebih dari 500 instrumen medis.",
            descriptionEn:
              "Natively bridges with HIS, EMR, and is SATUSEHAT ready. Universally compatible with over 500 medical instruments.",
            iconName: "integration",
          },
          {
            id: "nova-ai",
            titleId: "Asisten Nova AI",
            titleEn: "Nova AI Assistant",
            descriptionId:
              "Nova AI mendeteksi pola, memberikan peringatan dini, dan menyederhanakan angka diagnostik kompleks. Keputusan medis tetap 100% di tangan dokter.",
            descriptionEn:
              "Nova AI detects patterns, provides early warnings, and simplifies complex numbers. Treatment decisions remain 100% with the doctor.",
            iconName: "ai",
          },
        ],
      },
      isPublished: true,
    },
  });
  console.log("Infrastructure section seeded.");

  // 7. TESTIMONIALS SECTION
  const testimonialsSection = await prisma.cmsSection.upsert({
    where: { sectionKey: "testimonials" },
    update: {
      badgeId: "Testimoni Mitra",
      badgeEn: "Partner Testimonials",
      titleId: "Kisah Nyata dari Mitra Laboratorium Kami",
      titleEn: "Real Stories Shared by Our Customers",
      subtitleId:
        "Dengarkan langsung dari kepala laboratorium, dokter patologi klinik, dan direktur rumah sakit yang mengandalkan Diagnova setiap hari untuk mempercepat TAT dan memastikan akurasi diagnostik.",
      subtitleEn:
        "Hear directly from laboratory directors, clinical pathologists, and hospital executives who rely on Diagnova daily to streamline turnaround times and ensure diagnostic precision.",
      extraContent: {
        readMoreLabelId: "Baca selengkapnya",
        readMoreLabelEn: "Read more",
      },
      isPublished: true,
    },
    create: {
      sectionKey: "testimonials",
      badgeId: "Testimoni Mitra",
      badgeEn: "Partner Testimonials",
      titleId: "Kisah Nyata dari Mitra Laboratorium Kami",
      titleEn: "Real Stories Shared by Our Customers",
      subtitleId:
        "Dengarkan langsung dari kepala laboratorium, dokter patologi klinik, dan direktur rumah sakit yang mengandalkan Diagnova setiap hari untuk mempercepat TAT dan memastikan akurasi diagnostik.",
      subtitleEn:
        "Hear directly from laboratory directors, clinical pathologists, and hospital executives who rely on Diagnova daily to streamline turnaround times and ensure diagnostic precision.",
      extraContent: {
        readMoreLabelId: "Baca selengkapnya",
        readMoreLabelEn: "Read more",
      },
      isPublished: true,
    },
  });

  const testimonialsData = [
    {
      name: "dr. Rina Puspitasari, Sp.PK",
      roleId: "Kepala Laboratorium Sentral",
      roleEn: "Head of Central Laboratory",
      institution: "RS Hermina Group",
      quoteId:
        "Integrasi dua arah Diagnova dengan analyzer otomatis memangkas waktu entri manual hingga 75%. Risiko tertukar sampel kini nol dengan verifikasi barcode cerdas dan alert delta check instan.",
      quoteEn:
        "Diagnova's bi-directional analyzer interfacing eliminated 75% of manual entry time. Sample mix-ups dropped to zero thanks to intelligent barcode verification and immediate delta alerts.",
      avatarUrl: "/images/testimonial-silhouette-female.jpg",
      rating: 5,
      sortOrder: 1,
    },
    {
      name: "dr. Arif Kurniawan, MARS",
      roleId: "Direktur Pelayanan Medis",
      roleEn: "Medical Services Director",
      institution: "Siloam Hospitals Network",
      quoteId:
        "Platform Diagnova sangat mudah diimplementasikan dan langsung memberikan dampak operasional. Dalam hitungan minggu, koordinasi antara dokter spesialis dan analis lab menjadi jauh lebih sinkron dan presisi.",
      quoteEn:
        "Diagnova was exceptionally fast to deploy and delivered immediate operational impact. Within weeks, synchronization between attending specialists and laboratory analysts reached peak precision.",
      avatarUrl: "/images/testimonial-silhouette-male.jpg",
      rating: 5,
      sortOrder: 2,
    },
    {
      name: "Maya Indrawati, S.Tr.AK",
      roleId: "Koordinator Analis Medis Shift",
      roleEn: "Lead Shift Medical Analyst",
      institution: "Laboratorium Diagnostika Utama",
      quoteId:
        "Bagi tim teknisi analis, antarmukanya luar biasa intuitif. Fitur auto-verification dan bridging SATUSEHAT bekerja di latar belakang tanpa lag, menghemat berjam-jam kerja setiap shift malam.",
      quoteEn:
        "For medical analysts, the UI is remarkably intuitive. Auto-verification and SATUSEHAT bridging work seamlessly in the background without lag, saving countless hours on night shifts.",
      avatarUrl: "/images/testimonial-silhouette-female.jpg",
      rating: 5,
      sortOrder: 3,
    },
    {
      name: "dr. Budi Santoso, Sp.A",
      roleId: "Dokter Spesialis Anak & Konsultan PICU",
      roleEn: "Pediatric Specialist & PICU Consultant",
      institution: "Mayapada Hospital",
      quoteId:
        "Hasil laboratorium CITO dan peringatan nilai kritis kini terkirim otomatis ke perangkat tablet saat visit pasien. Kecepatan ini sangat berharga dalam menyelamatkan pasien kegawatdaruratan anak.",
      quoteEn:
        "STAT lab results and critical alerts now appear automatically on our mobile tablets during rounds. This speed is invaluable when treating urgent pediatric intensive care cases.",
      avatarUrl: "/images/testimonial-silhouette-male.jpg",
      rating: 5,
      sortOrder: 4,
    },
  ];

  await prisma.cmsTestimonial.deleteMany({ where: { sectionId: testimonialsSection.id } });
  for (const t of testimonialsData) {
    await prisma.cmsTestimonial.create({
      data: {
        ...t,
        sectionId: testimonialsSection.id,
      },
    });
  }
  console.log("Testimonials section & items seeded.");

  // 8. CTA BANNER SECTION
  await prisma.cmsSection.upsert({
    where: { sectionKey: "cta" },
    update: {
      badgeId: "Mulai Sekarang",
      badgeEn: "Get Started",
      titleId: "Transformasi Laboratorium Anda Bersama Diagnova",
      titleEn: "Transform Your Laboratory with Diagnova",
      subtitleId:
        "Hadirkan keandalan tinggi, kecepatan analisis, dan presisi klinis bagi institusi kesehatan Anda hari ini.",
      subtitleEn:
        "Bring high reliability, speed, and precision to your healthcare institution today.",
      extraContent: {
        buttonTextId: "Minta Demo",
        buttonTextEn: "Request Demo",
        placeholderId: "Masukkan alamat email Anda",
        placeholderEn: "Enter your email address",
      },
      isPublished: true,
    },
    create: {
      sectionKey: "cta",
      badgeId: "Mulai Sekarang",
      badgeEn: "Get Started",
      titleId: "Transformasi Laboratorium Anda Bersama Diagnova",
      titleEn: "Transform Your Laboratory with Diagnova",
      subtitleId:
        "Hadirkan keandalan tinggi, kecepatan analisis, dan presisi klinis bagi institusi kesehatan Anda hari ini.",
      subtitleEn:
        "Bring high reliability, speed, and precision to your healthcare institution today.",
      extraContent: {
        buttonTextId: "Minta Demo",
        buttonTextEn: "Request Demo",
        placeholderId: "Masukkan alamat email Anda",
        placeholderEn: "Enter your email address",
      },
      isPublished: true,
    },
  });
  console.log("CTA Banner section seeded.");

  console.log("ALL CMS HOMEPAGE CONTENT SEEDED SUCCESSFULLY!");
}

seedCms()
  .catch((e) => {
    console.error("Error seeding CMS:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


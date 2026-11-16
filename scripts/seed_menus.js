const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedMenus() {
  console.log("=== SEEDING INITIAL MENUS INTO DATABASE ===");

  // Cek apakah menu sudah ada
  const existingCount = await prisma.menu.count();
  if (existingCount > 0) {
    console.log(`Sudah terdapat ${existingCount} menu di database. Melewati proses seeding.`);
    return;
  }

  // Ambil section CMS untuk linking foreign key
  const sections = await prisma.cmsSection.findMany();
  const sectionMap = new Map();
  sections.forEach((s) => sectionMap.set(s.sectionKey, s.id));

  // 1. Top Level Menu: Platform
  const platform = await prisma.menu.create({
    data: {
      labelId: "Platform",
      labelEn: "Platform",
      url: "/platform",
      sortOrder: 1,
      isActive: true,
      children: {
        create: [
          {
            labelId: "Gambaran Platform",
            labelEn: "Platform Overview",
            descriptionId: "Buku catatan super pintar yang menghubungkan instrumen lab dengan dokter",
            descriptionEn: "A smart system connecting medical instruments autonomously with clinicians",
            url: "/platform",
            iconName: "layers",
            sortOrder: 1,
            isActive: true,
          },
          {
            labelId: "Alur Kerja",
            labelEn: "Workflow",
            descriptionId: "Alur kerja 4 tahap dari penerimaan sampel hingga rilis hasil ke dokter",
            descriptionEn: "4-stage workflow from specimen intake to validated doctor release",
            url: "/platform/workflow",
            sectionId: sectionMap.get("workflow") || null,
            iconName: "activity",
            sortOrder: 2,
            isActive: true,
          },
          {
            labelId: "100% Otomasi",
            labelEn: "100% Automation",
            descriptionId: "Antarmuka analyzer langsung & verifikasi otomatis memangkas TAT 70%",
            descriptionEn: "Direct analyzer interfacing & auto-verification cuts TAT by 70%",
            url: "/platform/automation",
            sectionId: sectionMap.get("infrastructure") || null,
            iconName: "cpu",
            sortOrder: 3,
            isActive: true,
          },
          {
            labelId: "Pelaporan & Jejak Audit",
            labelEn: "Reporting & Audit Trail",
            descriptionId: "Rekam jejak digital transparan untuk setiap perubahan hasil sampel",
            descriptionEn: "Transparent digital audit trail for all lab specimen results",
            url: "/platform/reporting",
            iconName: "shield-check",
            sortOrder: 4,
            isActive: true,
          },
          {
            labelId: "Analitik & Inteligensi",
            labelEn: "Analytics & Intelligence",
            descriptionId: "Pemanfaatan insight data lab untuk mendukung efisiensi & Nova AI",
            descriptionEn: "Actionable lab data insights powering clinical efficiency and Nova AI",
            url: "/platform/analytics",
            iconName: "sparkles",
            sortOrder: 5,
            isActive: true,
          },
        ],
      },
    },
  });
  console.log(`[SEED] Parent Platform dibuat dengan ID: ${platform.id}`);

  // 2. Top Level Menu: Solusi
  const solutions = await prisma.menu.create({
    data: {
      labelId: "Solusi",
      labelEn: "Solutions",
      url: "/solutions",
      sortOrder: 2,
      isActive: true,
      children: {
        create: [
          {
            labelId: "Laboratorium Rumah Sakit",
            labelEn: "Hospital Laboratory",
            descriptionId: "Solusi terpadu lab pusat, IGD, dan ICU dengan bridging SIMRS/RME",
            descriptionEn: "Unified solution for hospital core lab, ER, ICU with EHR bridging",
            url: "/solutions/hospital-laboratory",
            iconName: "building-2",
            sortOrder: 1,
            isActive: true,
          },
          {
            labelId: "Laboratorium Klinik",
            labelEn: "Clinical Laboratory",
            descriptionId: "Kecepatan registrasi, MCU massal, dan portal hasil pasien online",
            descriptionEn: "Fast registration, bulk MCU checkups, online patient portal",
            url: "/solutions/clinical-laboratory",
            iconName: "stethoscope",
            sortOrder: 2,
            isActive: true,
          },
          {
            labelId: "Patologi Anatomi",
            labelEn: "Anatomic Pathology",
            descriptionId: "Pelacakan spesimen jaringan ketat & integrasi patologi digital",
            descriptionEn: "Tissue specimen tracking and digital pathology integration",
            url: "/solutions/pathology",
            iconName: "microscope",
            sortOrder: 3,
            isActive: true,
          },
          {
            labelId: "Mikrobiologi & PPRA",
            labelEn: "Microbiology & AMR",
            descriptionId: "Kultur bakteri, uji kepekaan antibiotik, dan kalkulasi antibiogram",
            descriptionEn: "Bacterial cultures, AST susceptibility tests, automated antibiogram",
            url: "/solutions/microbiology",
            iconName: "flask-conical",
            sortOrder: 4,
            isActive: true,
          },
          {
            labelId: "Bank Darah & Transfusi",
            labelEn: "Blood Bank & Transfusion",
            descriptionId: "Kontrol rantai dingin, validasi crossmatch, dan zero wastage",
            descriptionEn: "Cold chain control, crossmatching safety validation, zero wastage",
            url: "/solutions/blood-bank",
            iconName: "heart-pulse",
            sortOrder: 5,
            isActive: true,
          },
          {
            labelId: "Nova AI Inteligensi",
            labelEn: "Nova AI Intelligence",
            descriptionId: "Asisten AI cerdas: mendeteksi anomali & merangkum angka klinis",
            descriptionEn: "Clinical AI assistant: pattern anomalies and diagnostic summaries",
            url: "/solutions/nova-ai",
            iconName: "sparkles",
            sortOrder: 6,
            isActive: true,
          },
        ],
      },
    },
  });
  console.log(`[SEED] Parent Solusi dibuat dengan ID: ${solutions.id}`);

  // 3. Top Level Menu: Modul
  const modules = await prisma.menu.create({
    data: {
      labelId: "Modul",
      labelEn: "Modules",
      url: "/modules",
      sortOrder: 3,
      isActive: true,
      children: {
        create: [
          {
            labelId: "Rutin & Hematologi",
            labelEn: "Routine & Hematology",
            descriptionId: "Pemeriksaan darah harian & kimia klinik bervolume tinggi",
            descriptionEn: "High-throughput routine blood tests & clinical chemistry",
            url: "/modules/routine-hematology",
            iconName: "activity",
            sortOrder: 1,
            isActive: true,
          },
          {
            labelId: "Bank Darah",
            labelEn: "Blood Bank",
            descriptionId: "Ketersediaan, masa kedaluwarsa, crossmatching, dan distribusi darah",
            descriptionEn: "Blood bag inventory, expiry alerts, crossmatching, and release",
            url: "/modules/blood-bank",
            iconName: "heart-pulse",
            sortOrder: 2,
            isActive: true,
          },
          {
            labelId: "Inventaris & Reagen",
            labelEn: "Inventory & Reagent",
            descriptionId: "Pantau stok reagen real-time & cegah kehabisan saat shift berjalan",
            descriptionEn: "Real-time reagent inventory and automated lot consumption alerts",
            url: "/modules/inventory-reagent",
            iconName: "cpu",
            sortOrder: 3,
            isActive: true,
          },
          {
            labelId: "Patologi",
            labelEn: "Pathology",
            descriptionId: "Pencatatan histopatologi & sitologi dengan pelacakan kaset/slide",
            descriptionEn: "Histopathology and cytology with tissue cassette/slide tracking",
            url: "/modules/pathology",
            iconName: "microscope",
            sortOrder: 4,
            isActive: true,
          },
          {
            labelId: "Mikrobiologi",
            labelEn: "Microbiology",
            descriptionId: "Identifikasi kuman, kultur bakteri, dan uji resistensi antibiotik",
            descriptionEn: "Germ identification, bacterial culture, and antibiotic resistance",
            url: "/modules/microbiology",
            iconName: "flask-conical",
            sortOrder: 5,
            isActive: true,
          },
        ],
      },
    },
  });
  console.log(`[SEED] Parent Modul dibuat dengan ID: ${modules.id}`);

  // 4. Top Level Menu: Nova AI
  const novaAi = await prisma.menu.create({
    data: {
      labelId: "Nova AI",
      labelEn: "Nova AI",
      url: "/nova-ai",
      sortOrder: 4,
      isActive: true,
      children: {
        create: [
          {
            labelId: "Gambaran Nova AI",
            labelEn: "Nova AI Overview",
            descriptionId: "Mengubah angka medis rumit menjadi kalimat ringkas & dapat ditindaklanjuti",
            descriptionEn: "Translating complex lab data into actionable, concise clinical insights",
            url: "/nova-ai",
            iconName: "sparkles",
            sortOrder: 1,
            isActive: true,
          },
          {
            labelId: "Cara Kerja (4 Tahap)",
            labelEn: "How It Works (4 Stages)",
            descriptionId: "Membaca Pola → Menerjemahkan Angka → Notifikasi Cepat → Validasi Dokter",
            descriptionEn: "Pattern Recognition → Data Translation → Fast Alerts → Doctor Validation",
            url: "/nova-ai/how-it-works",
            iconName: "activity",
            sortOrder: 2,
            isActive: true,
          },
          {
            labelId: "AI + Dokter (Etika & Kolaborasi)",
            labelEn: "AI + Clinicians (Ethics & Collaboration)",
            descriptionId: "AI membantu. Dokter memutuskan. Penegasan peran manusia dalam keputusan klinis",
            descriptionEn: "AI empowers. Doctors decide. Human-in-the-loop clinical decision support",
            url: "/nova-ai/ai-doctor",
            iconName: "shield-check",
            sortOrder: 3,
            isActive: true,
          },
        ],
      },
    },
  });
  console.log(`[SEED] Parent Nova AI dibuat dengan ID: ${novaAi.id}`);

  // 5. Top Level Menu: Integrasi
  const integration = await prisma.menu.create({
    data: {
      labelId: "Integrasi",
      labelEn: "Integration",
      url: "/integration",
      sortOrder: 5,
      isActive: true,
      children: {
        create: [
          {
            labelId: "Gambaran Integrasi",
            labelEn: "Integration Overview",
            descriptionId: "Konektivitas siap pakai dengan sistem & instrumen laboratorium Anda",
            descriptionEn: "Ready-to-use connectivity with hospital systems and lab analyzers",
            url: "/integration",
            iconName: "network",
            sortOrder: 1,
            isActive: true,
          },
          {
            labelId: "SIMRS / HIS",
            labelEn: "HIS / EHR",
            descriptionId: "Bridging native dua arah untuk penerimaan order & rilis hasil",
            descriptionEn: "Native bi-directional bridging for clinical orders and report dispatch",
            url: "/integration/simrs-his",
            iconName: "building-2",
            sortOrder: 2,
            isActive: true,
          },
          {
            labelId: "RME (Rekam Medis Elektronik)",
            labelEn: "Electronic Medical Records",
            descriptionId: "Kepatuhan Permenkes 24/2022 dengan riwayat lab longitudinal",
            descriptionEn: "MoH Regulation 24/2022 compliance with longitudinal patient lab records",
            url: "/integration/rme",
            iconName: "activity",
            sortOrder: 3,
            isActive: true,
          },
          {
            labelId: "500+ Analyzer",
            labelEn: "500+ Analyzers",
            descriptionId: "Antarmuka langsung dengan instrumen Roche, Abbott, Sysmex, Mindray, dll",
            descriptionEn: "Direct instrument interfacing with Roche, Abbott, Sysmex, Mindray, etc.",
            url: "/integration/analyzer",
            iconName: "cpu",
            sortOrder: 4,
            isActive: true,
          },
          {
            labelId: "SATUSEHAT Kemenkes",
            labelEn: "SATUSEHAT National Platform",
            descriptionId: "Interoperabilitas HL7 FHIR standar data kesehatan nasional",
            descriptionEn: "HL7 FHIR interoperability with Ministry of Health national standard",
            url: "/integration/satusehat",
            iconName: "shield-check",
            sortOrder: 5,
            isActive: true,
          },
          {
            labelId: "Smart Resilient Gateway",
            labelEn: "Smart Resilient Gateway",
            descriptionId: "Koneksi tangguh HL7/ASTM dengan Offline Edge Buffer & Uptime 99,9%",
            descriptionEn: "Fault-tolerant HL7/ASTM interfacing with offline buffer & 99.9% uptime",
            url: "/integration/connectivity",
            iconName: "network",
            sortOrder: 6,
            isActive: true,
          },
        ],
      },
    },
  });
  console.log(`[SEED] Parent Integrasi dibuat dengan ID: ${integration.id}`);

  console.log("=== SEEDING BERHASIL! Seluruh 5 parent menu dan 25 sub-menu terdaftar. ===");
}

seedMenus()
  .catch((e) => {
    console.error("Gagal melakukan seed menus:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());


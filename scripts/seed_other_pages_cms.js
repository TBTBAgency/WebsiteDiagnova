import { PrismaClient } from "@prisma/client";
import { solutionsData } from "../content/solutions";
import { modulesData } from "../content/modules";
import { integrationsData } from "../content/integrations";
import { novaAIWorkflowSteps, novaAISampleTranslations, novaAIDisclaimer } from "../content/nova-ai";

const prisma = new PrismaClient();

async function seedOtherPages() {
  console.log("Seeding CMS sections for other public pages...");

  // 1. Platform Page Section
  await prisma.cmsSection.upsert({
    where: { sectionKey: "page_platform" },
    update: {},
    create: {
      sectionKey: "page_platform",
      badgeId: "Ekosistem Terhubung",
      badgeEn: "Connected Ecosystem",
      titleId: "One Connected Platform untuk Seluruh Kebutuhan Laboratorium",
      titleEn: "One Connected Platform for All Laboratory Needs",
      subtitleId: "Diagnova menghubungkan mesin analyzer, petugas lab, dokter penanggung jawab, dan manajemen rumah sakit dalam satu alur kerja digital tanpa hambatan.",
      subtitleEn: "Diagnova connects analyzers, technicians, pathologists, and hospital management into a seamless digital workflow.",
      extraContent: {
        bannerUrl: "/images/hero-bg-1.webp",
        submodules: [
          {
            titleId: "100% Otomasi & Interfacing",
            titleEn: "100% Automation & Interfacing",
            descId: "Direct analyzer interfacing bidireksional memangkas TAT 70%",
            descEn: "Direct bidirectional interfacing cuts TAT by 70%",
            url: "/platform/automation",
            icon: "Cpu"
          },
          {
            titleId: "Alur Kerja Terpadu (Workflow)",
            titleEn: "Integrated Workflow",
            descId: "4 tahap dari penerimaan sampel hingga rilis hasil tervalidasi",
            descEn: "4-stage workflow from intake to validated release",
            url: "/platform/workflow",
            icon: "Activity"
          },
          {
            titleId: "Analytics & Intelligence",
            titleEn: "Analytics & Intelligence",
            descId: "Dashboard analitik real-time untuk memantau performa dan beban kerja lab",
            descEn: "Real-time analytics dashboard for laboratory TAT and throughput",
            url: "/platform/analytics",
            icon: "Sparkles"
          },
          {
            titleId: "Pelaporan & Audit Trail Digital",
            titleEn: "Digital Audit Trail & Reporting",
            descId: "Rekam jejak digital aman untuk setiap perubahan dan verifikasi hasil",
            descEn: "Immutable digital audit trail for result modifications and verification",
            url: "/platform/reporting",
            icon: "ShieldCheck"
          }
        ]
      },
      isPublished: true,
    },
  });
  console.log("[PASS] Seeded section: page_platform");

  // 2. Solutions Page Section
  await prisma.cmsSection.upsert({
    where: { sectionKey: "page_solutions" },
    update: {},
    create: {
      sectionKey: "page_solutions",
      badgeId: "Solusi Terdedikasi",
      badgeEn: "Dedicated Solutions",
      titleId: "Solusi Diagnova untuk Berbagai Jenis Fasilitas Kesehatan",
      titleEn: "Diagnova Solutions for Healthcare Facilities",
      subtitleId: "Dirancang fleksibel untuk laboratorium rumah sakit, laboratorium rujukan komersial, patologi klinik, hingga mikrobiologi.",
      subtitleEn: "Engineered with flexibility for hospital laboratories, commercial reference labs, clinical pathology, and microbiology.",
      extraContent: {
        items: solutionsData.map(s => ({
          slug: s.slug,
          name: s.name,
          category: s.category,
          tagline: s.tagline,
          description: s.description,
          icon: s.icon,
          keyBenefits: s.keyBenefits,
          metrics: s.metrics,
        }))
      },
      isPublished: true,
    },
  });
  console.log("[PASS] Seeded section: page_solutions");

  // 3. Modules Page Section
  await prisma.cmsSection.upsert({
    where: { sectionKey: "page_modules" },
    update: {},
    create: {
      sectionKey: "page_modules",
      badgeId: "Arsitektur Modular",
      badgeEn: "Modular Architecture",
      titleId: "Modul Diagnova yang Fleksibel & Dapat Diperluas",
      titleEn: "Flexible & Scalable Diagnova Modules",
      subtitleId: "Aktifkan modul spesifik yang dibutuhkan laboratorium Anda, dari hematologi rutin hingga bank darah dan inventaris reagen.",
      subtitleEn: "Activate specific modules needed by your laboratory, from routine hematology to blood bank and reagent inventory.",
      extraContent: {
        items: modulesData.map(m => ({
          slug: m.slug,
          name: m.name,
          badge: m.badge,
          shortDescription: m.shortDescription,
          fullDescription: m.fullDescription,
          icon: m.icon,
          features: m.features,
          colorScheme: m.colorScheme,
        }))
      },
      isPublished: true,
    },
  });
  console.log("[PASS] Seeded section: page_modules");

  // 4. Nova AI Page Section
  await prisma.cmsSection.upsert({
    where: { sectionKey: "page_nova_ai" },
    update: {},
    create: {
      sectionKey: "page_nova_ai",
      badgeId: "AI Laboratory Copilot",
      badgeEn: "AI Laboratory Copilot",
      titleId: "Nova AI: AI Assists. Doctors Decide.",
      titleEn: "Nova AI: AI Assists. Doctors Decide.",
      subtitleId: "Nova AI menerjemahkan angka analitikal kompleks menjadi narasi klinis komprehensif untuk membantu dokter mengambil keputusan dengan lebih presisi.",
      subtitleEn: "Nova AI translates complex analytical data into actionable clinical narratives, empowering physicians to make precise decisions.",
      extraContent: {
        bannerUrl: "/images/nova-ai-banner.webp",
        disclaimer: novaAIDisclaimer,
        workflowSteps: novaAIWorkflowSteps,
        sampleTranslations: novaAISampleTranslations,
      },
      isPublished: true,
    },
  });
  console.log("[PASS] Seeded section: page_nova_ai");

  // 5. Integrations Page Section
  await prisma.cmsSection.upsert({
    where: { sectionKey: "page_integrations" },
    update: {},
    create: {
      sectionKey: "page_integrations",
      badgeId: "Interoperabilitas Medis",
      badgeEn: "Medical Interoperability",
      titleId: "Integrasi Ekosistem Fasilitas Kesehatan Tanpa Sekat",
      titleEn: "Seamless Healthcare Ecosystem Integration",
      subtitleId: "Koneksi standar industri HL7, FHIR, ASTM, dan SATUSEHAT Kemenkes RI untuk menghubungkan HIS/SIMRS dan instrumen laboratorium.",
      subtitleEn: "Industry-standard HL7, FHIR, ASTM, and SATUSEHAT MoH connections linking HIS/EMR with laboratory instruments.",
      extraContent: {
        items: integrationsData.map(i => ({
          slug: i.slug,
          name: i.name,
          protocol: i.protocol,
          shortDescription: i.shortDescription,
          fullDescription: i.fullDescription,
          icon: i.icon,
          compatibleSystems: i.compatibleSystems,
          complianceBadges: i.complianceBadges,
        }))
      },
      isPublished: true,
    },
  });
  console.log("[PASS] Seeded section: page_integrations");

  console.log("All other page CMS sections seeded successfully!");
}

seedOtherPages()
  .catch(err => {
    console.error("Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


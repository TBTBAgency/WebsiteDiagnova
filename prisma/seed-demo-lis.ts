// Seed DATA LIS SINTETIS (katalog tes, pasien, dokter, order contoh) — HANYA untuk lingkungan demo/test.
// Phase 8.1 / M-03: tidak lagi bagian dari seed default.
// Wajib: SEED_DEMO_LIS=1. Ditolak bila NODE_ENV/APP_ENV/DIAGNOVA_ENV = production.
// Hanya mengisi tabel yang masih KOSONG (tidak menimpa data yang ada). Tidak mencetak credential.
import { PrismaClient, gender, SpecimenType, TubeColor, OrderPriority, OrderStatus, SpecimenStatus } from "@prisma/client";

const prisma = new PrismaClient();

function assertDemoEnvironment() {
  if (process.env.SEED_DEMO_LIS !== "1") {
    console.error("Ditolak: seed data LIS sintetis membutuhkan SEED_DEMO_LIS=1 (hanya untuk lingkungan demo/test).");
    process.exit(1);
  }
  const envs = [process.env.NODE_ENV, process.env.APP_ENV, process.env.DIAGNOVA_ENV].map((v) => (v || "").toLowerCase());
  if (envs.includes("production")) {
    console.error("Ditolak: seed data LIS sintetis tidak boleh dijalankan pada environment production.");
    process.exit(1);
  }
}

async function main() {
  assertDemoEnvironment();
  console.log("Seeding data LIS sintetis (demo/test)...");

  // 4. Seed Test Catalogs
  const catalogCount = await prisma.testCatalog.count();
  if (catalogCount === 0) {
    console.log("Seeding Hospital Test Catalogs...");
    await prisma.testCatalog.createMany({
      data: [
        {
          code: "HEMA_CBC",
          name: "Darah Lengkap / CBC (Complete Blood Count)",
          category: "Hematologi",
          specimenType: SpecimenType.WHOLE_BLOOD,
          tubeColor: TubeColor.LAVENDER_EDTA,
          unit: "parameter",
          tatMinutes: 45,
        },
        {
          code: "HEMA_LED",
          name: "Laju Endap Darah (LED / ESR)",
          category: "Hematologi",
          specimenType: SpecimenType.WHOLE_BLOOD,
          tubeColor: TubeColor.LIGHT_BLUE_CITRATE,
          unit: "mm/jam",
          tatMinutes: 60,
        },
        {
          code: "GLU_FASTING",
          name: "Glukosa Darah Puasa (GDP)",
          category: "Kimia Darah",
          specimenType: SpecimenType.SERUM,
          tubeColor: TubeColor.YELLOW_SST,
          unit: "mg/dL",
          tatMinutes: 60,
        },
        {
          code: "LIPID_CHOL",
          name: "Kolesterol Total",
          category: "Profil Lipid",
          specimenType: SpecimenType.SERUM,
          tubeColor: TubeColor.YELLOW_SST,
          unit: "mg/dL",
          tatMinutes: 60,
        },
        {
          code: "KIDNEY_UREUM",
          name: "Ureum Darah",
          category: "Fungsi Ginjal",
          specimenType: SpecimenType.SERUM,
          tubeColor: TubeColor.YELLOW_SST,
          unit: "mg/dL",
          tatMinutes: 60,
        },
        {
          code: "KIDNEY_CREAT",
          name: "Kreatinin Darah",
          category: "Fungsi Ginjal",
          specimenType: SpecimenType.SERUM,
          tubeColor: TubeColor.YELLOW_SST,
          unit: "mg/dL",
          tatMinutes: 60,
        },
        {
          code: "LIVER_SGOT",
          name: "SGOT / AST",
          category: "Fungsi Hati",
          specimenType: SpecimenType.SERUM,
          tubeColor: TubeColor.YELLOW_SST,
          unit: "U/L",
          tatMinutes: 60,
        },
        {
          code: "LIVER_SGPT",
          name: "SGPT / ALT",
          category: "Fungsi Hati",
          specimenType: SpecimenType.SERUM,
          tubeColor: TubeColor.YELLOW_SST,
          unit: "U/L",
          tatMinutes: 60,
        },
        {
          code: "ELEC_POTASSIUM",
          name: "Kalium Darah (K+)",
          category: "Elektrolit",
          specimenType: SpecimenType.SERUM,
          tubeColor: TubeColor.YELLOW_SST,
          unit: "mmol/L",
          tatMinutes: 30,
        },
        {
          code: "URINE_ROUTINE",
          name: "Urinalisis Lengkap (Carik Celup & Sedimen)",
          category: "Urinalisis",
          specimenType: SpecimenType.URINE,
          tubeColor: TubeColor.URINE_CONTAINER,
          unit: "analisis",
          tatMinutes: 45,
        },
      ],
    });
    console.log("Created 10 hospital test catalog items.");
  }

  // 4. Seed Patients
  const patientCount = await prisma.patient.count();
  let patientBudi;
  if (patientCount === 0) {
    console.log("Seeding Sample Patients...");
    patientBudi = await prisma.patient.create({
      data: {
        mrn: "RM-2026-00101",
        nationalId: "3171012304950001",
        name: "Budi Santoso",
        birthDate: new Date("1995-04-23"),
        sex: gender.male,
        phone: "081288990011",
        address: "Jl. Tebet Barat Dalam No. 14, Jakarta Selatan",
      },
    });

    await prisma.patient.create({
      data: {
        mrn: "RM-2026-00102",
        nationalId: "3275025508880002",
        name: "Siti Rahmawati",
        birthDate: new Date("1988-08-15"),
        sex: gender.female,
        phone: "085711223344",
        address: "Jl. Margonda Raya No. 200, Depok",
      },
    });
    console.log("Created 2 sample patients.");
  } else {
    patientBudi = await prisma.patient.findFirst();
  }

  // 5. Seed Physician
  const physicianCount = await prisma.physician.count();
  let physicianHendra;
  if (physicianCount === 0) {
    console.log("Seeding Sample Physicians...");
    physicianHendra = await prisma.physician.create({
      data: {
        externalCode: "DOC-SPPK-01",
        name: "dr. Hendra Wijaya, Sp.PK",
        specialization: "Patologi Klinik",
        department: "Laboratorium Sentral",
      },
    });

    await prisma.physician.create({
      data: {
        externalCode: "DOC-IGD-02",
        name: "dr. Maria Stephanie, Sp.EM",
        specialization: "Kedokteran Emergensi",
        department: "Instalasi Gawat Darurat (IGD)",
      },
    });
    console.log("Created 2 sample physicians.");
  } else {
    physicianHendra = await prisma.physician.findFirst();
  }

  // 6. Seed Sample CITO Order with Specimens & Barcodes
  const orderCount = await prisma.labOrder.count();
  if (orderCount === 0 && patientBudi) {
    console.log("Seeding Sample CITO Order...");
    const cbcTest = await prisma.testCatalog.findUnique({ where: { code: "HEMA_CBC" } });
    const gluTest = await prisma.testCatalog.findUnique({ where: { code: "GLU_FASTING" } });

    const order = await prisma.labOrder.create({
      data: {
        orderNumber: "ORD-20261016-0001",
        patientId: patientBudi.id,
        physicianId: physicianHendra?.id || null,
        sourceLocation: "Instalasi Gawat Darurat (IGD)",
        priority: OrderPriority.CITO,
        clinicalNotes: "Pasien demam tinggi 4 hari, susp. DHF + cek gula darah",
        status: OrderStatus.ORDERED,
        items: {
          create: [
            ...(cbcTest ? [{ testCatalogId: cbcTest.id }] : []),
            ...(gluTest ? [{ testCatalogId: gluTest.id }] : []),
          ],
        },
        specimens: {
          create: [
            {
              barcodeNumber: "SP-261016-0001",
              specimenType: SpecimenType.WHOLE_BLOOD,
              tubeColor: TubeColor.LAVENDER_EDTA,
              volume: "3.0 mL",
              collectedAt: new Date(),
              status: SpecimenStatus.COLLECTED,
            },
            {
              barcodeNumber: "SP-261016-0002",
              specimenType: SpecimenType.SERUM,
              tubeColor: TubeColor.YELLOW_SST,
              volume: "3.5 mL",
              collectedAt: new Date(),
              status: SpecimenStatus.COLLECTED,
            },
          ],
        },
      },
    });

    console.log(`Created sample CITO Lab Order: ${order.orderNumber} with 2 barcodes (SP-261016-0001, SP-261016-0002).`);
  }

  console.log("Seed data LIS sintetis selesai.");
}

main()
  .catch((e) => {
    console.error("Error seeding demo LIS data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

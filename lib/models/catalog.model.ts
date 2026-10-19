import { db } from "@/lib/db";
import { SpecimenType, TestCatalogRecord, TubeColor } from "@/types";
import {
  SpecimenType as PrismaSpecimenType,
  TubeColor as PrismaTubeColor,
} from "@prisma/client";

export const prismaSpecimenToType: Record<PrismaSpecimenType, SpecimenType> = {
  [PrismaSpecimenType.WHOLE_BLOOD]: "whole_blood",
  [PrismaSpecimenType.SERUM]: "serum",
  [PrismaSpecimenType.PLASMA]: "plasma",
  [PrismaSpecimenType.URINE]: "urine",
  [PrismaSpecimenType.CSF]: "csf",
  [PrismaSpecimenType.STOOL]: "stool",
  [PrismaSpecimenType.SWAB]: "swab",
  [PrismaSpecimenType.OTHER]: "other",
};

export const specimenTypeToPrisma: Record<SpecimenType, PrismaSpecimenType> = {
  whole_blood: PrismaSpecimenType.WHOLE_BLOOD,
  serum: PrismaSpecimenType.SERUM,
  plasma: PrismaSpecimenType.PLASMA,
  urine: PrismaSpecimenType.URINE,
  csf: PrismaSpecimenType.CSF,
  stool: PrismaSpecimenType.STOOL,
  swab: PrismaSpecimenType.SWAB,
  other: PrismaSpecimenType.OTHER,
};

export const prismaTubeToColor: Record<PrismaTubeColor, TubeColor> = {
  [PrismaTubeColor.LAVENDER_EDTA]: "lavender_edta",
  [PrismaTubeColor.RED_PLAIN]: "red_plain",
  [PrismaTubeColor.YELLOW_SST]: "yellow_sst",
  [PrismaTubeColor.LIGHT_BLUE_CITRATE]: "light_blue_citrate",
  [PrismaTubeColor.GRAY_FLUORIDE]: "gray_fluoride",
  [PrismaTubeColor.GREEN_HEPARIN]: "green_heparin",
  [PrismaTubeColor.URINE_CONTAINER]: "urine_container",
  [PrismaTubeColor.other]: "other",
};

export const tubeColorToPrisma: Record<TubeColor, PrismaTubeColor> = {
  lavender_edta: PrismaTubeColor.LAVENDER_EDTA,
  red_plain: PrismaTubeColor.RED_PLAIN,
  yellow_sst: PrismaTubeColor.YELLOW_SST,
  light_blue_citrate: PrismaTubeColor.LIGHT_BLUE_CITRATE,
  gray_fluoride: PrismaTubeColor.GRAY_FLUORIDE,
  green_heparin: PrismaTubeColor.GREEN_HEPARIN,
  urine_container: PrismaTubeColor.URINE_CONTAINER,
  other: PrismaTubeColor.other,
};

/**
 * Mengambil seluruh daftar katalog pemeriksaan lab yang aktif
 */
export async function getTestCatalog(): Promise<TestCatalogRecord[]> {
  const items = await db.testCatalog.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return items.map((item) => ({
    id: item.id,
    code: item.code,
    name: item.name,
    category: item.category,
    specimenType: prismaSpecimenToType[item.specimenType],
    tubeColor: prismaTubeToColor[item.tubeColor],
    unit: item.unit,
    tatMinutes: item.tatMinutes,
    isActive: item.isActive,
  }));
}

/**
 * Mencari item pemeriksaan berdasarkan kode (mis. HEMA_CBC, GLU_FASTING)
 */
export async function findTestByCode(code: string): Promise<TestCatalogRecord | null> {
  const item = await db.testCatalog.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!item) return null;

  return {
    id: item.id,
    code: item.code,
    name: item.name,
    category: item.category,
    specimenType: prismaSpecimenToType[item.specimenType],
    tubeColor: prismaTubeToColor[item.tubeColor],
    unit: item.unit,
    tatMinutes: item.tatMinutes,
    isActive: item.isActive,
  };
}

/**
 * Inisialisasi daftar katalog pemeriksaan default rumah sakit (jika belum ada)
 */
export async function ensureDefaultCatalog(): Promise<void> {
  const count = await db.testCatalog.count();
  if (count > 0) return;

  const defaultCatalog = [
    {
      code: "HEMA_CBC",
      name: "Darah Lengkap / CBC (Complete Blood Count)",
      category: "Hematologi",
      specimenType: PrismaSpecimenType.WHOLE_BLOOD,
      tubeColor: PrismaTubeColor.LAVENDER_EDTA,
      unit: "parameter",
      tatMinutes: 45,
    },
    {
      code: "HEMA_LED",
      name: "Laju Endap Darah (LED / ESR)",
      category: "Hematologi",
      specimenType: PrismaSpecimenType.WHOLE_BLOOD,
      tubeColor: PrismaTubeColor.LIGHT_BLUE_CITRATE,
      unit: "mm/jam",
      tatMinutes: 60,
    },
    {
      code: "GLU_FASTING",
      name: "Glukosa Darah Puasa (GDP)",
      category: "Kimia Darah",
      specimenType: PrismaSpecimenType.SERUM,
      tubeColor: PrismaTubeColor.YELLOW_SST,
      unit: "mg/dL",
      tatMinutes: 60,
    },
    {
      code: "GLU_PP",
      name: "Glukosa Darah 2 Jam PP",
      category: "Kimia Darah",
      specimenType: PrismaSpecimenType.SERUM,
      tubeColor: PrismaTubeColor.YELLOW_SST,
      unit: "mg/dL",
      tatMinutes: 60,
    },
    {
      code: "LIPID_CHOL",
      name: "Kolesterol Total",
      category: "Profil Lipid",
      specimenType: PrismaSpecimenType.SERUM,
      tubeColor: PrismaTubeColor.YELLOW_SST,
      unit: "mg/dL",
      tatMinutes: 60,
    },
    {
      code: "LIPID_TG",
      name: "Trigliserida",
      category: "Profil Lipid",
      specimenType: PrismaSpecimenType.SERUM,
      tubeColor: PrismaTubeColor.YELLOW_SST,
      unit: "mg/dL",
      tatMinutes: 60,
    },
    {
      code: "KIDNEY_UREUM",
      name: "Ureum Darah",
      category: "Fungsi Ginjal",
      specimenType: PrismaSpecimenType.SERUM,
      tubeColor: PrismaTubeColor.YELLOW_SST,
      unit: "mg/dL",
      tatMinutes: 60,
    },
    {
      code: "KIDNEY_CREAT",
      name: "Kreatinin Darah",
      category: "Fungsi Ginjal",
      specimenType: PrismaSpecimenType.SERUM,
      tubeColor: PrismaTubeColor.YELLOW_SST,
      unit: "mg/dL",
      tatMinutes: 60,
    },
    {
      code: "LIVER_SGOT",
      name: "SGOT / AST",
      category: "Fungsi Hati",
      specimenType: PrismaSpecimenType.SERUM,
      tubeColor: PrismaTubeColor.YELLOW_SST,
      unit: "U/L",
      tatMinutes: 60,
    },
    {
      code: "LIVER_SGPT",
      name: "SGPT / ALT",
      category: "Fungsi Hati",
      specimenType: PrismaSpecimenType.SERUM,
      tubeColor: PrismaTubeColor.YELLOW_SST,
      unit: "U/L",
      tatMinutes: 60,
    },
    {
      code: "ELEC_POTASSIUM",
      name: "Kalium Darah (K+)",
      category: "Elektrolit",
      specimenType: PrismaSpecimenType.SERUM,
      tubeColor: PrismaTubeColor.YELLOW_SST,
      unit: "mmol/L",
      tatMinutes: 30,
    },
    {
      code: "ELEC_SODIUM",
      name: "Natrium Darah (Na+)",
      category: "Elektrolit",
      specimenType: PrismaSpecimenType.SERUM,
      tubeColor: PrismaTubeColor.YELLOW_SST,
      unit: "mmol/L",
      tatMinutes: 30,
    },
    {
      code: "URINE_ROUTINE",
      name: "Urinalisis Lengkap (Carik Celup & Sedimen)",
      category: "Urinalisis",
      specimenType: PrismaSpecimenType.URINE,
      tubeColor: PrismaTubeColor.URINE_CONTAINER,
      unit: "analisis",
      tatMinutes: 45,
    },
  ];

  await db.testCatalog.createMany({
    data: defaultCatalog,
  });
}

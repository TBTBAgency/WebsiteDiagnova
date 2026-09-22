import { z } from "zod";

export const institutionTypeEnum = z.enum(
  [
    "hospital",
    "clinical-lab",
    "pathology-center",
    "microbiology-center",
    "blood-bank",
    "other",
  ],
  {
    errorMap: () => ({ message: "Pilih jenis institusi yang valid" }),
  }
);

export const demoRequestSchema = z.object({
  name: z
    .string()
    .min(2, "Nama lengkap harus minimal 2 karakter")
    .max(100, "Nama terlalu panjang"),
  institution: z
    .string()
    .min(2, "Nama institusi/rumah sakit harus diisi")
    .max(150, "Nama institusi terlalu panjang"),
  jobTitle: z
    .string()
    .min(2, "Jabatan harus diisi (mis. Kepala Lab, Direktur RS, Tim IT)")
    .max(100, "Jabatan terlalu panjang"),
  email: z
    .string()
    .email("Format alamat email tidak valid (contoh: dokter@rumahsakit.id)"),
  phone: z
    .string()
    .min(8, "Nomor telepon/WhatsApp minimal 8 digit")
    .max(20, "Nomor telepon terlalu panjang")
    .regex(
      /^[0-9+\-\s()]+$/,
      "Format nomor telepon hanya boleh berisi angka dan tanda (+, -, space)"
    ),
  institutionType: institutionTypeEnum,
  notes: z
    .string()
    .max(1000, "Catatan maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
});

export type DemoRequestSchemaType = z.infer<typeof demoRequestSchema>;

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

/** String tanggal opsional yang wajib dapat di-parse (mencegah Invalid Date -> error 500). */
const optionalDateString = z
  .string()
  .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), "Format tanggal tidak valid")
  .optional()
  .nullable();

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
  requestedDemoDate: optionalDateString,
  demoDate: optionalDateString,
  notes: z
    .string()
    .max(1000, "Catatan maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
});

export type DemoRequestSchemaType = z.infer<typeof demoRequestSchema>;

export const approveLeadSchema = z.object({
  confirmedDemoDate: optionalDateString,
  durationDays: z.coerce.number().min(1).max(90).default(7),
  notes: z.string().optional(),
});

export type ApproveLeadSchemaType = z.infer<typeof approveLeadSchema>;

export const rejectLeadSchema = z.object({
  rejectionReason: z.string().trim().min(2, "Alasan penolakan harus diisi").max(500, "Alasan maksimal 500 karakter"),
});

export type RejectLeadSchemaType = z.infer<typeof rejectLeadSchema>;

export const loginSchema = z.object({
  email: z.string().email("Format alamat email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const updateLeadStatusSchema = z.object({
  status: z.coerce.number().int().min(1).max(4).optional().nullable(),
  demoDate: optionalDateString,
});

export const extendDemoAccessSchema = z.object({
  days: z.coerce.number().int().min(1, "Minimal 1 hari").max(90, "Maksimal 90 hari"),
  reason: z.string().max(500).optional(),
});

export type ExtendDemoAccessSchemaType = z.infer<typeof extendDemoAccessSchema>;

export type UpdateLeadStatusSchemaType = z.infer<typeof updateLeadStatusSchema>;

export const createUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
  institution: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  roleId: z.string().optional().nullable(),
  status: z.coerce.number().default(1),
  demoDurationDays: z.coerce.number().min(1).max(365).optional().default(7),
});

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").optional(),
  institution: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  status: z.coerce.number().min(0).max(1).optional(),
  demoDurationDays: z.coerce.number().min(1).max(365).optional().nullable(),
});

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;

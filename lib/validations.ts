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
  requestedDemoDate: z.string().optional().nullable(),
  demoDate: z.string().optional().nullable(),
  notes: z
    .string()
    .max(1000, "Catatan maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
});

export type DemoRequestSchemaType = z.infer<typeof demoRequestSchema>;

export const approveLeadSchema = z.object({
  confirmedDemoDate: z.string().optional().nullable(),
  durationDays: z.coerce.number().min(1).max(90).default(7),
  notes: z.string().optional(),
});

export type ApproveLeadSchemaType = z.infer<typeof approveLeadSchema>;

export const rejectLeadSchema = z.object({
  rejectionReason: z.string().min(2, "Alasan penolakan harus diisi"),
});

export type RejectLeadSchemaType = z.infer<typeof rejectLeadSchema>;

export const loginSchema = z.object({
  email: z.string().email("Format alamat email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const updateLeadStatusSchema = z.object({
  status: z.coerce.number().min(1).max(4),
  voucherDays: z.coerce.number().min(3).optional().default(3),
  demoDate: z.string().optional().nullable(),
});

export type UpdateLeadStatusSchemaType = z.infer<typeof updateLeadStatusSchema>;

export const createUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  institution: z.string().optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
  roleId: z.string().min(1, "Role wajib dipilih"),
  status: z.coerce.number().default(1),
});

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;

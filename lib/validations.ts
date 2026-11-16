import { z } from "zod";
import { DEMO_DURATION_OPTIONS, isValidDemoDuration } from "@/lib/demo-constants";

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
  /** Honeypot anti-bot: wajib kosong (field tersembunyi di form) */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type DemoRequestSchemaType = z.infer<typeof demoRequestSchema>;

const demoDurationSchema = z.coerce
  .number()
  .refine((v) => isValidDemoDuration(v), {
    message: `Durasi demo harus salah satu dari: ${DEMO_DURATION_OPTIONS.join(", ")} hari`,
  });

export const grantAccessSchema = z.object({
  durationDays: demoDurationSchema.default(7),
  confirmedDemoDate: z.string().optional().nullable(),
}).strict();

export const extendAccessSchema = z.object({
  durationDays: demoDurationSchema,
}).strict();

export const rejectLeadSchema = z.object({
  rejectionReason: z.string().trim().min(2, "Alasan penolakan harus diisi").max(1000),
}).strict();

export const completeLeadSchema = z.object({
  note: z.string().max(1000, "Catatan maksimal 1000 karakter").optional().nullable(),
}).strict();

/** PATCH lead: hanya jadwal presentasi. Status TIDAK dapat diubah lewat PATCH (OD-06). */
export const updateLeadScheduleSchema = z.object({
  confirmedDemoDate: z.string().nullable(),
}).strict();

export const loginSchema = z.object({
  email: z.string().email("Format alamat email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

/** User Management hanya mengelola USER (akun demo, login via magic link -> tanpa password). */
export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().trim().email("Format email tidak valid").max(255),
  institution: z.string().trim().max(150).optional().or(z.literal("")),
  jobTitle: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
}).strict();

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  institution: z.string().trim().max(150).optional().nullable(),
  jobTitle: z.string().trim().max(100).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
}).strict();

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;

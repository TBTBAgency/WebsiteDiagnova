import crypto from "crypto";
import { db } from "@/lib/db";
import { AuthSessionPayload } from "@/types";
import { setSessionCookie } from "@/lib/auth-session";

export interface MagicLinkCreationResult {
  rawToken: string;
  magicLinkUrl: string;
  expiresAt: Date;
}

export interface VerifyMagicLinkResult {
  success: boolean;
  message: string;
  sessionPayload?: AuthSessionPayload;
  redirectUrl?: string;
  isExpired?: boolean;
}

/**
 * Membuat token Magic Link berkeamanan tinggi (SHA-256) untuk pemohon demo
 */
export async function createDemoMagicLink(
  leadId: string,
  email: string,
  userId?: string | null,
  expiresInHours: number = 24
): Promise<MagicLinkCreationResult> {
  // Buat random token berkekuatan 32 byte (64 hex characters)
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Hash token menggunakan SHA-256 sebelum disimpan ke database
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  // Simpan ke database
  await db.demoMagicLink.create({
    data: {
      tokenHash,
      email: email.toLowerCase().trim(),
      leadId,
      userId: userId || null,
      expiresAt,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const magicLinkUrl = `${baseUrl}/auth/verify-magic-link?token=${rawToken}`;

  return {
    rawToken,
    magicLinkUrl,
    expiresAt,
  };
}

/**
 * Mengambil magic link aktif terakhir untuk suatu lead
 */
export async function getLatestMagicLinkForLead(leadId: string) {
  return db.demoMagicLink.findFirst({
    where: { leadId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Memverifikasi dan mengonsumsi Magic Link (single-use, cek kedaluwarsa, aktivasi demo)
 */
export async function verifyAndConsumeMagicLink(
  rawToken: string,
  clientIp?: string,
  userAgent?: string
): Promise<VerifyMagicLinkResult> {
  if (!rawToken || rawToken.trim() === "") {
    return {
      success: false,
      message: "Token magic link tidak disertakan.",
    };
  }

  // Hash token mentah untuk dicocokkan dengan database
  const tokenHash = crypto.createHash("sha256").update(rawToken.trim()).digest("hex");

  const magicRecord = await db.demoMagicLink.findUnique({
    where: { tokenHash },
    include: {
      lead: true,
      user: {
        include: { role: true },
      },
    },
  });

  if (!magicRecord) {
    return {
      success: false,
      message: "Tautan magic link tidak valid atau tidak ditemukan.",
    };
  }

  // 1. Validasi Single-Use
  if (magicRecord.usedAt !== null) {
    return {
      success: false,
      message:
        "Tautan ini sudah pernah digunakan sebelumnya. Demi keamanan akses laboratorium, setiap tautan hanya dapat digunakan satu kali.",
    };
  }

  // 2. Validasi Token Link Expiration (Token TTL)
  const now = new Date();
  if (now > magicRecord.expiresAt) {
    return {
      success: false,
      message:
        "Tautan magic link telah kedaluwarsa (masa berlaku 24 jam telah berakhir). Silakan hubungi admin Diagnova untuk mendapatkan tautan baru.",
    };
  }

  // 3. Pastikan Akun User Tersedia dan Terhubung
  let user = magicRecord.user;
  if (!user) {
    // Cari user berdasarkan email
    user = await db.user.findUnique({
      where: { email: magicRecord.email },
      include: { role: true },
    });
  }

  // Jika belum ada user, buat akun user dengan role Demo User
  if (!user) {
    let demoRole = await db.role.findFirst({
      where: { name: "Demo User" },
    });
    if (!demoRole) {
      demoRole = await db.role.create({
        data: {
          name: "Demo User",
          description: "Akses terbatas untuk akun uji coba / demo LIS",
        },
      });
    }

    user = await db.user.create({
      data: {
        name: magicRecord.lead.name,
        email: magicRecord.email,
        institution: magicRecord.lead.institution,
        jobTitle: magicRecord.lead.jobTitle,
        phone: magicRecord.lead.phone,
        roleId: demoRole.id,
        status: 1,
      },
      include: { role: true },
    });

    // Hubungkan userId ke Lead dan MagicLink
    await db.lead.update({
      where: { id: magicRecord.leadId },
      data: { userId: user.id },
    });
  }

  // 4. Hitung & Tetapkan Batas Masa Aktif Akun Demo (Demo Account TTL)
  // Dihitung sejak akun demo pertama kali diaktifkan!
  const durationDays = magicRecord.lead.demoDurationDays || user.demoDurationDays || 7;
  let demoExpiresAt = user.demoExpiresAt;

  if (!user.demoActivatedAt) {
    const activatedAt = new Date();
    const expiry = new Date(activatedAt.getTime() + durationDays * 24 * 60 * 60 * 1000);
    demoExpiresAt = expiry;

    await db.user.update({
      where: { id: user.id },
      data: {
        demoDurationDays: durationDays,
        demoActivatedAt: activatedAt,
        demoExpiresAt: expiry,
        status: 1,
      },
    });
  } else if (demoExpiresAt && now > demoExpiresAt) {
    // Akun sudah kedaluwarsa
    return {
      success: false,
      isExpired: true,
      message:
        "Masa aktif akun demo Anda telah berakhir. Terima kasih telah mencoba platform Diagnova LIS. Silakan hubungi tim kami untuk aktivasi lisensi penuh.",
      redirectUrl: "/demo-expired",
    };
  }

  // 5. Konsumsi Magic Link (Tandai usedAt)
  await db.demoMagicLink.update({
    where: { id: magicRecord.id },
    data: {
      usedAt: now,
      userId: user.id,
      ipAddress: clientIp || null,
      userAgent: userAgent || null,
    },
  });

  // 6. Buat Sesi Login Diagnova Resmi (JWT Cookie)
  const sessionPayload: AuthSessionPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role?.name || "Demo User",
    demoExpiresAt: demoExpiresAt ? demoExpiresAt.toISOString() : undefined,
  };

  await setSessionCookie(sessionPayload);

  return {
    success: true,
    message: "Autentikasi berhasil! Mengalihkan ke platform demo Diagnova...",
    sessionPayload,
    redirectUrl: "/admin/dashboard",
  };
}


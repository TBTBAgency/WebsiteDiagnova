import { DemoRequestRecord } from "@/types";

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/** Email disamarkan untuk log: ab***@domain.tld */
function maskEmail(email: string): string {
  return email.replace(/^(.{2})[^@]*(@.*)$/, "$1***$2");
}

/**
 * Mengirim email notifikasi ke tim sales/admin saat ada permintaan demo baru.
 *
 * CATATAN: pengiriman email BELUM terhubung ke penyedia email (mock). Untuk mencegah kebocoran,
 * log server hanya memuat ID lead — bukan nama, email, telepon, atau catatan pemohon.
 */
export async function sendNotificationEmail(
  lead: DemoRequestRecord
): Promise<SendEmailResult> {
  const recipient = process.env.SALES_NOTIFICATION_EMAIL || "hello@tibatibagency.com";
  console.log(`📧 [Mock Email] Notifikasi permohonan demo baru #${lead.id} → ${maskEmail(recipient)} (isi tidak dicatat).`);
  return {
    success: true,
    messageId: `mock_msg_${Date.now()}`,
  };
}

/**
 * Mengirim email persetujuan demo beserta Magic Link kepada pemohon.
 *
 * CATATAN: masih mock. URL Magic Link berisi token rahasia sekali pakai, sehingga TIDAK PERNAH
 * ditulis ke log. Admin mendapatkan tautan langsung dari respons API approval (sekali tampil).
 */
export async function sendApprovalNotificationEmail(
  lead: DemoRequestRecord,
  magicLinkUrl: string
): Promise<SendEmailResult> {
  const linkHost = (() => {
    try {
      return new URL(magicLinkUrl).host;
    } catch {
      return "invalid-url";
    }
  })();
  console.log(
    `📧 [Mock Email] Persetujuan demo lead #${lead.id} → ${maskEmail(lead.email)} (host tautan: ${linkHost}; token tidak dicatat).`
  );
  return {
    success: true,
    messageId: `mock_approval_${Date.now()}`,
  };
}

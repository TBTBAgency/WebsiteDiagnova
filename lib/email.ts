import { DemoRequestRecord } from "@/types";

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Mengirim email notifikasi ke tim sales/admin saat ada permintaan demo baru
 */
export async function sendNotificationEmail(
  lead: DemoRequestRecord
): Promise<SendEmailResult> {
  const recipient = process.env.SALES_NOTIFICATION_EMAIL || "hello@tibatibagency.com";

  console.log(`📧 [Mock Email Dispatch] Sending lead notification for #${lead.id} to: ${recipient}`);
  console.log(`
--- EMAIL SALES NOTIFICATION ---
Kepada Tim Diagnova,
Terdapat permohonan demo baru dari website Diagnova:

- Nama Lengkap: ${lead.name}
- Institusi: ${lead.institution} (${lead.institutionType})
- Jabatan: ${lead.jobTitle}
- Email: ${lead.email}
- Telepon / WA: ${lead.phone}
- Pilihan Waktu Demo: ${lead.requestedDemoDate || lead.demoDate || "Belum ditentukan"}
- Catatan Kebutuhan: ${lead.notes || "-"}
- Waktu Pengajuan: ${new Date(lead.createdAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB
--------------------------------
  `);

  return {
    success: true,
    messageId: `mock_msg_${Date.now()}`,
  };
}

/**
 * Mengirim email konfirmasi persetujuan demo beserta tautan Magic Link kepada pemohon
 */
export async function sendApprovalNotificationEmail(
  lead: DemoRequestRecord,
  magicLinkUrl: string
): Promise<SendEmailResult> {
  const recipient = lead.email;
  const demoSchedule = lead.confirmedDemoDate
    ? new Date(lead.confirmedDemoDate).toLocaleString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    : "Sesuai kesepakatan dengan tim spesialis";

  console.log(`📧 [Email Dispatch] Permohonan Demo Disetujui dikirim ke: ${recipient}`);
  console.log(`
--- EMAIL APPROVAL & MAGIC LINK KE PEMOHON ---
Kepada Yth. ${lead.name},
${lead.jobTitle} - ${lead.institution}

Selamat! Permohonan akses demo Diagnova Laboratory Information System (LIS) Platform untuk ${lead.institution} telah DISETUJUI oleh tim kami.

Rincian Akses Demo Anda:
• Institusi: ${lead.institution}
• Jadwal Sesi Presentasi Teknis: ${demoSchedule}
• Masa Aktif Demo: ${lead.demoDurationDays || 7} Hari (terhitung sejak tautan pertama kali dibuka)
• Masa Berlaku Tautan: 24 Jam

Silakan klik tautan di bawah ini untuk langsung mengakses sistem demo tanpa perlu memasukkan password:
🔗 TAUTAN MASUK LANGSUNG (MAGIC LINK):
${magicLinkUrl}

Catatan Keamanan:
Demi menjaga integritas sistem laboratorium, tautan ini bersifat sekali pakai (single-use) dan hanya ditujukan untuk pihak yang berwenang pada ${lead.institution}.

Salam hangat,
Tim Spesialis Diagnova LIS Platform
https://diagnova.id
------------------------------------------------
  `);

  return {
    success: true,
    messageId: `mock_approval_${Date.now()}`,
  };
}

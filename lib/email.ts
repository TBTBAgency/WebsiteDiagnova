import { DemoRequestRecord } from "@/types";

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Mengirim email notifikasi ke tim sales/admin saat ada permintaan demo baru
 * @param lead Data record permohonan demo
 */
export async function sendNotificationEmail(
  lead: DemoRequestRecord
): Promise<SendEmailResult> {
  const recipient = process.env.SALES_NOTIFICATION_EMAIL || "hello@tibatibagency.com";

  console.log(`📧 [Mock Email Dispatch] Sending lead notification for #${lead.id} to: ${recipient}`);
  console.log(`
--- EMAIL CONTENT ---
Kepada Tim Diagnova,
Terdapat permohonan demo baru dari website Diagnova:

- Nama Lengkap: ${lead.name}
- Institusi: ${lead.institution} (${lead.institutionType})
- Jabatan: ${lead.jobTitle}
- Email: ${lead.email}
- Telepon / WA: ${lead.phone}
- Catatan Kebutuhan: ${lead.notes || "-"}
- Waktu: ${new Date(lead.createdAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB
---------------------
  `);

  /*
   * TODO [Email Service Integration]:
   * Contoh menggunakan Resend:
   * 
   * import { Resend } from 'resend';
   * const resend = new Resend(process.env.RESEND_API_KEY);
   * await resend.emails.send({
   *   from: process.env.EMAIL_FROM || 'Diagnova <notifications@diagnova.id>',
   *   to: recipient,
   *   subject: `Permohonan Demo Baru: ${lead.institution} - ${lead.name}`,
   *   html: `<p>Detail lead...</p>`,
   * });
   * 
   * Atau contoh Nodemailer:
   * const transporter = nodemailer.createTransport({ ... });
   * await transporter.sendMail({ ... });
   */

  return {
    success: true,
    messageId: `mock_msg_${Date.now()}`,
  };
}
